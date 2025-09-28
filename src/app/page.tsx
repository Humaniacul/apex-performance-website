'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Gauge, Cog, Image, Palette, Mail, Menu, X } from 'lucide-react';
import Hero from '@/components/Hero';
import SpecStrip from '@/components/SpecStrip';
import Gallery from '@/components/Gallery';
import Configurator from '@/components/Configurator';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

/**
 * Home Page - Apex Performance Marketing Website
 * Features: Full-page sections, smooth scrolling, progressive enhancement
 */
export default function HomePage() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Performance monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark('home-page-load');
    }

    // Improved scroll spy for active section detection
    const sections = ['hero', 'specifications', 'philosophy', 'gallery', 'configurator', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -75% 0px', // Optimized for smooth detection
      threshold: [0, 0.1, 0.25, 0.5, 0.75],
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Sort entries by intersection ratio to get the most visible section
      const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      
      if (visibleEntries.length > 0) {
        setActiveSection(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Wait for elements to be rendered, then observe
    setTimeout(() => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      observer.disconnect();
    };
  }, []);

  return (
    <main id="main-content" className="relative">
      {/* Menu Button - Top Right */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-6 right-6 z-50 w-9 h-9 bg-black/60 backdrop-blur-sm hover:bg-apex-red/90 rounded-lg border border-gray-800/50 hover:border-apex-red transition-all duration-200 flex items-center justify-center group"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X size={16} className="text-white" />
        ) : (
          <Menu size={16} className="text-apex-muted group-hover:text-white transition-colors duration-200" />
        )}
      </button>

      {/* Hero Section - Full viewport */}
      <section id="hero" className="relative">
        <Hero />
      </section>

      {/* Performance Specifications Strip */}
      <section id="specifications" className="relative bg-apex-black">
        <SpecStrip sticky={false} />
      </section>

      {/* Design & Engineering Philosophy */}
      <section id="philosophy" className="relative bg-apex-black section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Philosophy Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
                  Engineering 
                  <span className="gradient-text block">Excellence</span>
                </h2>
                <p className="text-xl text-apex-muted leading-relaxed">
                  Every component, every line, every surface exists for a purpose. 
                  We don't just build hypercars—we forge instruments of precision 
                  that blur the line between engineering and artistry.
                </p>
              </div>

              {/* Key Features */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-apex-red rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Carbon Monocoque Tub</h3>
                    <p className="text-apex-muted">
                      Aerospace-grade carbon fiber construction delivers unmatched 
                      rigidity while maintaining featherweight characteristics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-apex-red rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Active Aerodynamics</h3>
                    <p className="text-apex-muted">
                      Intelligent aerodynamic elements adapt in real-time, 
                      optimizing downforce and efficiency at every speed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-apex-red rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Hybrid Powertrain</h3>
                    <p className="text-apex-muted">
                      Twin-turbo V8 combined with electric assistance delivers 
                      1,200hp while maintaining surgical throttle response.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-apex-red rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Precision Manufacturing</h3>
                    <p className="text-apex-muted">
                      Hand-assembled by master craftsmen with tolerances 
                      measured in fractions of millimeters.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <motion.div
                className="pt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button className="btn-outline px-8 py-3">
                  Explore Technology
                </button>
              </motion.div>
            </motion.div>

            {/* Technical Diagram/Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative bg-gradient-to-br from-apex-grey/30 to-transparent rounded-2xl p-1 backdrop-blur-sm border border-white/5">
                <div className="aspect-square bg-apex-grey/20 rounded-xl flex items-center justify-center">
                  {/* Technical diagram placeholder */}
                  <div className="text-center text-apex-muted p-8">
                    <div className="w-32 h-32 mx-auto mb-6 border-2 border-dashed border-apex-red/30 rounded-lg flex items-center justify-center">
                      <span className="text-sm">Technical Diagram</span>
                    </div>
                    <p className="text-sm">
                      Interactive cutaway view showing internal components, 
                      materials, and engineering details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <motion.div
                className="absolute -top-6 -right-6 bg-apex-red text-white px-4 py-2 rounded-lg text-sm font-bold shadow-apex-red"
                animate={{
                  y: [-3, 3, -3],
                  boxShadow: [
                    '0 0 20px rgba(225, 6, 0, 0.3)',
                    '0 0 30px rgba(225, 6, 0, 0.5)',
                    '0 0 20px rgba(225, 6, 0, 0.3)',
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                1,350kg Total Weight
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium border border-white/10"
                animate={{
                  y: [3, -3, 3],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              >
                65% Carbon Fiber
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="relative">
        <Gallery 
          title="Automotive Artistry"
          description="Every angle tells the story of relentless pursuit of perfection"
        />
      </section>

      {/* Performance Deep-Dive */}
      <section id="performance" className="relative bg-apex-black section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
              Performance Deep-Dive
            </h2>
            <p className="text-xl text-apex-muted max-w-2xl mx-auto">
              Beneath the surface lies a symphony of engineering excellence
            </p>
            <div className="w-24 h-1 bg-apex-red mx-auto mt-6 rounded-full" />
          </motion.div>

          {/* Performance Tabs would go here - simplified for now */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Powertrain',
                stats: ['1,200 HP', '1,100 Nm', 'Hybrid V8'],
                description: 'Twin-turbocharged V8 with electric assistance delivers unprecedented power and efficiency.'
              },
              {
                title: 'Aerodynamics',
                stats: ['0.29 Cd', '800kg @ 300km/h', 'Active Elements'],
                description: 'Computational fluid dynamics and active aerodynamics create maximum efficiency and downforce.'
              },
              {
                title: 'Chassis',
                stats: ['Carbon Tub', '32,000 Nm/deg', 'Push-rod Suspension'],
                description: 'Motorsport-derived chassis engineering provides the ultimate balance of rigidity and weight.'
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                className="bg-apex-grey/30 rounded-xl p-6 border border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">{section.title}</h3>
                <div className="space-y-2 mb-4">
                  {section.stats.map((stat, i) => (
                    <div key={i} className="text-apex-red font-mono text-lg">
                      {stat}
                    </div>
                  ))}
                </div>
                <p className="text-apex-muted text-sm leading-relaxed">
                  {section.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Configurator Section */}
      <section id="configurator" className="relative">
        <Configurator />
      </section>

      {/* Press & Reviews */}
      <section id="press" className="relative bg-apex-black section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
              Press & Reviews
            </h2>
            <p className="text-xl text-apex-muted max-w-2xl mx-auto">
              What the world's leading automotive publications are saying
            </p>
            <div className="w-24 h-1 bg-apex-red mx-auto mt-6 rounded-full" />
          </motion.div>

          {/* Press Quotes */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {[
              {
                quote: "The Apex hypercar isn't just fast—it's surgically precise. Every input, every response feels calculated yet visceral.",
                author: "James Harrison",
                publication: "Motor Trend",
                rating: "★★★★★"
              },
              {
                quote: "In a world of hypercars, Apex Performance has created something truly extraordinary. This is automotive art in motion.",
                author: "Sarah Mitchell",
                publication: "Car and Driver",
                rating: "★★★★★"
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                className="bg-apex-grey/20 rounded-xl p-8 border border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="text-apex-red mb-4 text-lg">{review.rating}</div>
                <blockquote className="text-lg text-white leading-relaxed mb-6">
                  "{review.quote}"
                </blockquote>
                <div className="text-apex-muted">
                  <div className="font-semibold text-white">{review.author}</div>
                  <div className="text-sm">{review.publication}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Publication Logos */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 opacity-60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {['Motor Trend', 'Car and Driver', 'Road & Track', 'Automotive News', 'Top Gear'].map((pub) => (
              <div key={pub} className="text-apex-muted font-medium tracking-wide text-sm">
                {pub}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative">
        <ContactForm />
      </section>

      {/* Footer */}
      <Footer />

      {/* Smart Navigation with Active States */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden xl:block">
        <div className="flex flex-col space-y-5">
          {[
            { id: 'hero', label: 'Home', icon: Home },
            { id: 'specifications', label: 'Specs', icon: Gauge },
            { id: 'philosophy', label: 'Engineering', icon: Cog },
            { id: 'gallery', label: 'Gallery', icon: Image },
            { id: 'configurator', label: 'Configure', icon: Palette },
            { id: 'contact', label: 'Contact', icon: Mail },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  const element = document.getElementById(item.id);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-8 h-8 flex items-center justify-center transition-all duration-500 ease-out group relative ${
                  isActive 
                    ? 'text-apex-red' 
                    : 'text-apex-muted hover:text-apex-red'
                }`}
                aria-label={`Go to ${item.label} section`}
                animate={{
                  scale: isActive ? 1.3 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 25,
                  duration: 0.4,
                }}
                whileHover={{
                  scale: isActive ? 1.4 : 1.15,
                  transition: { duration: 0.15 }
                }}
              >
                <Icon size={16} />
                
                {/* Active indicator dot - perfectly centered with icons */}
                <motion.div
                  className="absolute -right-3 top-3 w-2 h-2 bg-apex-red rounded-full transform -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    delay: isActive ? 0.05 : 0,
                  }}
                />
                
                {/* Simple hover tooltip - only on hover, not when active */}
                <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-apex-black border border-gray-700 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none transform translate-x-2 group-hover:translate-x-0">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
