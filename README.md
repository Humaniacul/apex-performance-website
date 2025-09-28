# Apex Performance — Hypercar Marketing Website

A premium, luxury automotive marketing website built with Next.js, TypeScript, and modern web technologies. Features a dark, minimal design with red accents, 3D model integration, and smooth animations throughout.

![Apex Performance](https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=1200)

## 🏆 Features

### Core Functionality
- **Responsive Design** — Fully responsive across all devices and screen sizes
- **3D Model Viewer** — Interactive hypercar model using `@google/model-viewer`
- **Animated Tachometer** — Custom SVG tachometer with smooth needle animations
- **Image Gallery** — Lightbox gallery with filtering and download capabilities
- **Car Configurator** — Interactive customization with real-time price calculation
- **Contact Forms** — Integrated with Netlify Forms and Supabase
- **Newsletter Signup** — Email subscription with validation and API integration
- **Press/Blog Section** — MDX-powered content management

### Design & UX
- **Dark Theme** — Sophisticated black/grey background with red accents
- **Custom Typography** — Google Fonts integration (Sora, Inter, Poppins)
- **Smooth Animations** — Framer Motion powered micro-interactions
- **Carbon Fiber Textures** — Subtle background textures and visual details
- **Performance Focused** — Optimized for Core Web Vitals and Lighthouse scores
- **Accessibility First** — WCAG compliant with keyboard navigation and screen readers

### Technical Excellence
- **Next.js 14** — App Router with SSG and server components
- **TypeScript** — Full type safety throughout the application
- **Tailwind CSS** — Utility-first styling with custom design tokens
- **Form Validation** — Zod schema validation with React Hook Form
- **API Integration** — RESTful APIs for contact forms and newsletter
- **SEO Optimized** — Complete meta tags, JSON-LD, and sitemap
- **Testing Suite** — Jest and React Testing Library setup
- **Performance Monitoring** — Built-in performance tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/apex-performance.git
cd apex-performance

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Environment Variables

Copy `.env.example` to `.env.local` and configure your environment variables:

```bash
# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=apex-performance.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Supabase (for contact forms and newsletter)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Service (optional)
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@apex-performance.com
EMAIL_TO=contact@apex-performance.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://apex-performance.com
```

## 🎨 Design System

### Color Palette
```css
/* Brand Colors */
--apex-black: #0B0B0C      /* Primary background */
--apex-grey: #111214       /* Secondary background */
--apex-red: #E10600        /* Accent color */
--apex-white: #FFFFFF      /* Primary text */
--apex-muted: #A6A6A6      /* Secondary text */
```

### Typography
- **Headings**: Sora (Google Font) with Poppins fallback
- **Body Text**: Inter (Google Font)
- **Monospace**: Default system monospace for performance data

### Components
All components are built with:
- Consistent spacing using Tailwind's spacing scale
- Dark theme optimized color schemes  
- Proper focus states for accessibility
- Responsive design patterns
- Framer Motion animations where appropriate

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── contact/       # Contact form endpoint
│   │   └── newsletter/    # Newsletter signup endpoint
│   ├── press/             # Press/blog pages
│   ├── globals.css        # Global styles and utilities
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── Hero.tsx           # Hero section with 3D model
│   ├── TachometerSVG.tsx  # Animated tachometer
│   ├── ModelViewer.tsx    # 3D model viewer wrapper
│   ├── SpecStrip.tsx      # Performance specifications
│   ├── Gallery.tsx        # Image gallery with lightbox
│   ├── Configurator.tsx   # Car customization interface
│   ├── ContactForm.tsx    # Contact form with validation
│   └── Footer.tsx         # Site footer
├── content/               # MDX content
│   └── press/             # Press articles
├── lib/                   # Utility functions
│   ├── design-tokens.ts   # Design system tokens
│   └── utils.ts           # Helper functions
└── __tests__/             # Test files
    └── components/        # Component tests
```

## 🎯 Key Components

### Hero Section
The main hero features:
- Full-viewport design with carbon fiber background
- Interactive 3D car model with auto-rotation
- Animated SVG tachometer with redline effects
- Staggered animation entrance effects
- Performance specification display
- Dual CTA buttons with hover animations

### 3D Model Viewer
Built with `@google/model-viewer`:
- Supports `.glb` and `.gltf` model formats
- Camera controls for rotation and zoom
- Auto-rotation when idle
- Loading states and error handling
- Fallback to static images
- Performance overlay with quick specs

### Interactive Configurator
Features include:
- Paint color selection with live preview
- Wheel and aerodynamics options
- Real-time price calculation
- Shareable configuration URLs
- Export functionality (JSON download)
- Mobile-optimized interface

### Contact Form
Professional contact system:
- Multi-step validation with Zod schemas
- Honeypot spam protection
- Rate limiting
- Multiple backend integrations (Netlify + Supabase)
- Success/error state management
- Accessibility compliant

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
npx vercel

# Or connect your GitHub repository to Vercel dashboard
```

### Netlify
```bash
# Build the application
npm run build

# Deploy to Netlify
# Upload the .next folder or connect your Git repository
```

### Environment Variables for Production
Set these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `SENDGRID_API_KEY` (optional)
- `NEXT_PUBLIC_SITE_URL`

## 🧪 Testing

### Unit Tests
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### E2E Tests (Cypress)
```bash
# Open Cypress dashboard
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run
```

### Test Coverage
The test suite covers:
- Component rendering and behavior
- Form validation and submission
- User interactions and animations
- Accessibility compliance
- Error handling and edge cases

## 📊 Performance

### Lighthouse Targets
- **Performance**: >90
- **Accessibility**: >95  
- **Best Practices**: >95
- **SEO**: >95

### Optimization Features
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Font optimization with preloading
- Critical CSS inlining
- Efficient bundle sizes
- Service worker for caching (optional)

## 🔧 Customization

### Updating Brand Colors
Edit `src/lib/design-tokens.ts` and `tailwind.config.js`:

```typescript
export const colors = {
  brand: {
    black: '#YOUR_BLACK',
    grey: '#YOUR_GREY', 
    red: '#YOUR_RED',
    white: '#YOUR_WHITE',
    muted: '#YOUR_MUTED',
  },
};
```

### Adding Content
1. **Press Articles**: Add MDX files to `src/content/press/`
2. **Gallery Images**: Update image arrays in `Gallery.tsx`
3. **Specifications**: Modify data in `SpecStrip.tsx`
4. **Configuration Options**: Edit options in `Configurator.tsx`

### Integrating Real 3D Models
1. Replace `public/assets/apex-hypercar.glb` with your model
2. Ensure model is optimized for web (<10MB recommended)
3. Test loading performance and add fallback images
4. Update model specifications in components

## 🔌 CMS Integration

### Sanity Integration Example
```typescript
// Example Sanity schema for press articles
export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    },
    // ... additional fields
  ],
}
```

### Contentful Integration Example
```typescript
// Example Contentful content model
const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getPressArticles() {
  const entries = await contentfulClient.getEntries({
    content_type: 'pressArticle',
  });
  
  return entries.items;
}
```

## 📈 Analytics & Tracking

### Plausible Analytics (Default)
Privacy-friendly analytics enabled by default. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` environment variable.

### Google Analytics 4
Uncomment the GA4 code in `src/app/layout.tsx` and set `NEXT_PUBLIC_GA_ID`.

### Custom Event Tracking
```typescript
// Track custom events
function trackEvent(eventName: string, properties?: object) {
  // Plausible
  if (window.plausible) {
    window.plausible(eventName, { props: properties });
  }
  
  // GA4
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
}
```

## 🛠️ Development

### Available Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run type-check` — Run TypeScript compiler
- `npm run test` — Run test suite
- `npm run generate-sitemap` — Generate sitemap.xml

### Code Quality
- **ESLint** — Configured for Next.js and TypeScript
- **Prettier** — Code formatting (configured in IDE)
- **TypeScript** — Strict mode enabled
- **Husky** — Pre-commit hooks (optional)

### Browser Support
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new components
- Update documentation for new features
- Ensure accessibility compliance
- Test across multiple devices and browsers
- Maintain consistent code formatting

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

### Design Inspiration
- Automotive luxury brands
- Premium product marketing sites
- Dark-themed modern interfaces
- Minimalist design principles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Tailwind CSS for the utility-first approach
- Framer Motion for beautiful animations
- Unsplash for placeholder images
- Google Fonts for typography
- Open source community for inspiration and tools

---

**Built with precision for automotive excellence.**

For questions or support, please contact: [your-email@domain.com](mailto:your-email@domain.com)
