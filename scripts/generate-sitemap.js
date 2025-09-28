const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apex-performance.com';
const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const OUTPUT_PATH = path.join(process.cwd(), 'public/sitemap.xml');

// Static routes with priorities and change frequencies
const staticRoutes = [
  {
    url: '/',
    priority: '1.0',
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    url: '/press',
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0],
  },
];

// Function to get all MDX files from content directory
function getMDXFiles(dir) {
  const files = [];
  
  if (fs.existsSync(dir)) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        files.push(...getMDXFiles(fullPath));
      } else if (item.name.endsWith('.md') || item.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// Function to extract metadata from MDX file
function extractMDXMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    const frontmatter = match[1];
    const metadata = {};
    
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim();
        // Remove quotes if present
        value = value.replace(/^["']|["']$/g, '');
        metadata[key.trim()] = value;
      }
    });
    
    return metadata;
  }
  
  return {};
}

// Function to generate dynamic routes from content
function generateDynamicRoutes() {
  const routes = [];
  
  // Get press articles
  const pressDir = path.join(CONTENT_DIR, 'press');
  const pressFiles = getMDXFiles(pressDir);
  
  pressFiles.forEach(filePath => {
    const metadata = extractMDXMetadata(filePath);
    const slug = metadata.slug || path.basename(filePath, path.extname(filePath));
    
    routes.push({
      url: `/press/${slug}`,
      priority: metadata.featured === 'true' ? '0.9' : '0.7',
      changefreq: 'monthly',
      lastmod: metadata.date 
        ? new Date(metadata.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    });
  });
  
  return routes;
}

// Function to generate XML sitemap
function generateSitemap() {
  console.log('🔄 Generating sitemap...');
  
  const dynamicRoutes = generateDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  allRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${route.url}</loc>\n`;
    xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  // Write sitemap to public directory
  fs.writeFileSync(OUTPUT_PATH, xml);
  
  console.log(`✅ Sitemap generated with ${allRoutes.length} URLs`);
  console.log(`📄 Saved to: ${OUTPUT_PATH}`);
  
  // Log routes for verification
  console.log('\n📋 Generated routes:');
  allRoutes.forEach(route => {
    console.log(`   ${route.url} (${route.priority})`);
  });
  
  return allRoutes;
}

// Function to generate robots.txt
function generateRobotsTxt() {
  console.log('🤖 Generating robots.txt...');
  
  const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl delay for performance
Crawl-delay: 1

# Disallow development and API routes
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow specific important pages
Allow: /press/
Allow: /assets/`;

  const robotsPath = path.join(process.cwd(), 'public/robots.txt');
  fs.writeFileSync(robotsPath, robotsContent);
  
  console.log(`✅ robots.txt generated`);
  console.log(`📄 Saved to: ${robotsPath}`);
}

// Main execution
if (require.main === module) {
  try {
    const routes = generateSitemap();
    generateRobotsTxt();
    
    console.log('\n🎉 Sitemap generation completed successfully!');
    console.log(`🌐 Site URL: ${SITE_URL}`);
    console.log(`📊 Total routes: ${routes.length}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

module.exports = {
  generateSitemap,
  generateRobotsTxt,
  getMDXFiles,
  extractMDXMetadata,
};
