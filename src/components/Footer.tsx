'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';

interface FooterProps {
  className?: string;
}

/**
 * Footer Component
 * Features: Newsletter signup, social links, sitemap, legal links
 */
export default function Footer({ className = '' }: FooterProps) {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setNewsletterStatus('submitting');

    try {
      // Newsletter signup implementation
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setNewsletterStatus('success');
        setEmail('');
        setTimeout(() => setNewsletterStatus('idle'), 3000);
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  const footerLinks = {
    company: [
      { label: 'About Apex', href: '/about' },
      { label: 'Our Story', href: '/story' },
      { label: 'Leadership', href: '/leadership' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
    products: [
      { label: 'Hypercar', href: '/hypercar' },
      { label: 'Configurator', href: '/configurator' },
      { label: 'Specifications', href: '/specs' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Technology', href: '/technology' },
    ],
    support: [
      { label: 'Contact', href: '/contact' },
      { label: 'Service Centers', href: '/service' },
      { label: 'Owner Resources', href: '/owners' },
      { label: 'Warranty', href: '/warranty' },
      { label: 'Documentation', href: '/docs' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Legal Notice', href: '/legal' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/apexperformance' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/apexperformance' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/apexperformance' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/apex-performance' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/apexperformance' },
  ];

  return (
    <footer className={`bg-apex-black border-t border-gray-800 ${className}`}>
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto container-padding py-16">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Stay Connected
              </h2>
              <p className="text-xl text-apex-muted mb-8">
                Be the first to know about new developments, exclusive events, 
                and the latest from Apex Performance.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-apex-grey border border-gray-700 rounded-lg text-white placeholder-apex-muted focus:border-apex-red focus:ring-1 focus:ring-apex-red transition-colors"
                    required
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={newsletterStatus === 'submitting'}
                  className="btn-primary px-6 py-3 flex items-center justify-center space-x-2 whitespace-nowrap"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {newsletterStatus === 'submitting' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Newsletter Status Messages */}
              {newsletterStatus === 'success' && (
                <motion.p 
                  className="text-green-400 text-sm mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ✓ Successfully subscribed! Welcome to Apex Performance.
                </motion.p>
              )}
              
              {newsletterStatus === 'error' && (
                <motion.p 
                  className="text-red-400 text-sm mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Something went wrong. Please try again.
                </motion.p>
              )}

              <p className="text-xs text-apex-muted mt-4">
                No spam, ever. You can unsubscribe at any time.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto container-padding py-16">
        <div className="grid lg:grid-cols-6 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16">
                <Image
                  src="/assets/logo-apex.png"
                  alt="Apex Performance"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="h-6">
                <Image
                  src="/assets/text.logo-apex.png"
                  alt="Apex Performance"
                  width={150}
                  height={24}
                  className="h-full w-auto"
                />
              </div>
            </div>

            <p className="text-apex-muted leading-relaxed">
              Redefining the boundaries of automotive excellence through 
              uncompromising engineering, innovative design, and surgical precision.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-apex-muted">
                <Phone size={16} className="text-apex-red flex-shrink-0" />
                <span>+1 (555) APEX-001</span>
              </div>
              <div className="flex items-center space-x-3 text-apex-muted">
                <Mail size={16} className="text-apex-red flex-shrink-0" />
                <span>contact@apex-performance.com</span>
              </div>
              <div className="flex items-center space-x-3 text-apex-muted">
                <MapPin size={16} className="text-apex-red flex-shrink-0" />
                <span>1 Performance Drive, Los Angeles, CA 90210</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-apex-grey hover:bg-apex-red rounded-lg flex items-center justify-center text-apex-muted hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-apex-muted hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-apex-muted hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-apex-muted hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-apex-muted hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto container-padding py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-apex-muted space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p>
                © {new Date().getFullYear()} Apex Performance. All rights reserved.
              </p>
              <p className="mt-1">
                Designed and engineered for automotive excellence.
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <span className="text-xs">Made with precision in Los Angeles</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-apex-red rounded-full animate-pulse"></div>
                <span className="text-xs">Limited production active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-apex-red to-transparent opacity-50"></div>
    </footer>
  );
}
