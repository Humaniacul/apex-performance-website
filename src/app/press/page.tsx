'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowRight, Search, Filter } from 'lucide-react';

// Mock press data - in production, this would come from CMS or MDX files
const pressArticles = [
  {
    id: '1',
    title: 'Apex Performance Unveils Revolutionary Hypercar',
    slug: 'apex-hypercar-unveiled',
    excerpt: 'The automotive world witnessed history as Apex Performance revealed their groundbreaking hypercar, setting new benchmarks for power, precision, and design.',
    author: 'Apex Performance Team',
    date: '2025-09-20',
    category: 'Company News',
    featured: true,
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=1200',
    tags: ['hypercar', 'launch', 'innovation', 'engineering'],
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Apex Performance Commits to Carbon Neutrality by 2030',
    slug: 'sustainability-commitment',
    excerpt: 'Comprehensive sustainability program addresses manufacturing, materials, and lifecycle environmental impact while maintaining performance excellence.',
    author: 'Dr. Elena Vasquez',
    date: '2025-09-05',
    category: 'Sustainability',
    featured: true,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200',
    tags: ['sustainability', 'environment', 'carbon-neutral', 'innovation'],
    readTime: '7 min read',
  },
  {
    id: '3',
    title: 'Apex Performance Pioneers New Carbon Fiber Manufacturing Process',
    slug: 'carbon-fiber-innovation',
    excerpt: 'Revolutionary manufacturing technique reduces weight by 15% while increasing structural integrity, setting new standards for hypercar construction.',
    author: 'Dr. Sarah Williams',
    date: '2025-09-15',
    category: 'Technology',
    featured: false,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200',
    tags: ['carbon-fiber', 'manufacturing', 'innovation', 'materials'],
    readTime: '6 min read',
  },
  {
    id: '4',
    title: 'Apex Performance Announces Strategic Motorsport Partnership',
    slug: 'motorsport-partnership',
    excerpt: 'Partnership with championship-winning racing team brings track-proven technology directly to the hypercar program.',
    author: 'Marcus Rodriguez',
    date: '2025-09-10',
    category: 'Motorsport',
    featured: false,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200',
    tags: ['motorsport', 'partnership', 'racing', 'technology'],
    readTime: '4 min read',
  },
  {
    id: '5',
    title: 'Apex Performance Redefines Hypercar Ownership Experience',
    slug: 'customer-experience',
    excerpt: 'Revolutionary concierge program and digital platform transform hypercar ownership into a personalized journey of automotive excellence.',
    author: 'Jessica Chen',
    date: '2025-08-30',
    category: 'Customer Experience',
    featured: false,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200',
    tags: ['customer-experience', 'luxury', 'service', 'technology'],
    readTime: '8 min read',
  },
];

const categories = ['All', 'Company News', 'Technology', 'Motorsport', 'Sustainability', 'Customer Experience'];

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  date: string;
  category?: string;
  featured?: boolean;
  image?: string;
  tags?: string[];
  readTime?: string;
};

/**
 * Press Page Component
 * Features: Article filtering, search, featured content, responsive grid
 */
export default function PressPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchedArticles, setFetchedArticles] = useState<Article[]>([]);

  // Fetch published articles from Supabase (public, RLS must allow select on status='published')
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return; // envs not set on local maybe

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `${url}/rest/v1/articles?select=id,title,slug,excerpt,cover_image,author,tags,published_at,category,featured,status&status=eq.published&order=published_at.desc`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${anon}`,
              'apikey': anon,
            },
            signal: controller.signal,
          }
        );
        if (!res.ok) return;
        const rows = await res.json();
        const mapped: Article[] = rows.map((r: any) => ({
          id: String(r.id),
          title: r.title,
          slug: r.slug,
          excerpt: r.excerpt ?? '',
          author: r.author ?? 'Apex Performance',
          date: r.published_at ?? new Date().toISOString(),
          category: r.category ?? 'News',
          featured: Boolean(r.featured),
          image: r.cover_image ?? '/assets/car-hero.jpg',
          tags: Array.isArray(r.tags) ? r.tags : [],
          readTime: '5 min read',
        }));
        setFetchedArticles(mapped);
      } catch (_) {
        // ignore; fallback to mock
      }
    })();
    return () => controller.abort();
  }, []);

  const sourceArticles = fetchedArticles.length > 0 ? fetchedArticles : pressArticles;

  // Filter articles based on category and search
  const filteredArticles = useMemo(() => {
    return sourceArticles.filter(article => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, sourceArticles]);

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-apex-black">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 texture-subtle opacity-5" />
        <div className="max-w-7xl mx-auto container-padding relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
              Press & <span className="gradient-text">News</span>
            </h1>
            <p className="text-xl md:text-2xl text-apex-muted leading-relaxed mb-8">
              Stay informed about the latest developments, innovations, and milestones 
              in the journey of automotive excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="relative">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            className="bg-apex-grey/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-apex-muted" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-apex-grey border border-gray-700 rounded-lg text-white placeholder-apex-muted focus:border-apex-red focus:ring-1 focus:ring-apex-red transition-colors"
                />
              </div>

              {/* Category Filters */}
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-apex-muted" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-apex-red text-white shadow-apex-red'
                          : 'bg-apex-grey text-apex-muted hover:bg-apex-red/20 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="relative mb-16">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.h2
              className="text-2xl md:text-3xl font-heading font-bold text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Featured Stories
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  className="group bg-apex-grey/20 rounded-2xl overflow-hidden border border-gray-800 hover:border-apex-red/30 transition-all duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={article.image as string}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-apex-red text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {article.category}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-xs text-apex-muted mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{formatDate(article.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User size={12} />
                        <span>{article.author}</span>
                      </div>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-apex-red transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-apex-muted leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-apex-grey/50 text-apex-muted px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/press/${article.slug}`}
                      className="inline-flex items-center space-x-2 text-apex-red hover:text-white transition-colors font-medium"
                    >
                      <span>Read More</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles Grid */}
      {regularArticles.length > 0 && (
        <section className="relative">
          <div className="max-w-7xl mx-auto container-padding">
            <motion.h2
              className="text-2xl md:text-3xl font-heading font-bold text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Latest News
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  className="group bg-apex-grey/20 rounded-xl overflow-hidden border border-gray-800 hover:border-apex-red/30 transition-all duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={article.image as string}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="bg-apex-red text-white px-2 py-1 rounded text-xs font-semibold">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center space-x-3 text-xs text-apex-muted mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{formatDate(article.date)}</span>
                      </div>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-apex-red transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-apex-muted text-sm leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-apex-muted">
                        By {article.author}
                      </div>
                      
                      <Link
                        href={`/press/${article.slug}`}
                        className="text-apex-red hover:text-white transition-colors text-sm font-medium"
                      >
                        Read →
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Results State */}
      {filteredArticles.length === 0 && (
        <section className="relative py-16">
          <div className="max-w-7xl mx-auto container-padding text-center">
            <motion.div
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-apex-grey rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={24} className="text-apex-muted" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">No Articles Found</h3>
              <p className="text-apex-muted">
                Try adjusting your search terms or category filter to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="btn-outline mt-6 px-6 py-2 text-sm"
              >
                Clear Filters
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Newsletter Subscription */}
      <section className="relative py-16 mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            className="text-center max-w-2xl mx-auto bg-gradient-to-r from-apex-grey/20 to-apex-grey/10 rounded-2xl p-8 border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-heading font-bold text-white mb-4">
              Stay Informed
            </h3>
            <p className="text-apex-muted mb-6">
              Subscribe to receive the latest news and updates from Apex Performance directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-apex-grey border border-gray-700 rounded-lg text-white placeholder-apex-muted focus:border-apex-red focus:ring-1 focus:ring-apex-red"
              />
              <button className="btn-primary px-6 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
