'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ModelViewer from './ModelViewer';

interface HeroProps {
  className?: string;
}

/**
 * Hero Section Component
 * Features: Full-bleed hero with carbon fiber background, headline, CTAs,
 * 3D model viewer, and animated tachometer
 */
export default function Hero({ className = '' }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial load animation
    setIsLoaded(true);
  }, []);

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      filter: 'blur(4px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      aria-labelledby="hero-heading"
    >
      {/* Background with carbon fiber texture */}
      <div className="absolute inset-0">
        {/* Base dark background */}
        <div className="absolute inset-0 bg-apex-black" />
        
        {/* Carbon fiber texture overlay */}
        <div className="absolute inset-0 texture-subtle opacity-10" />
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-apex-black/50 to-apex-black/80" />
        
        {/* Animated background particles/stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-apex-red rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">
          
          {/* Left side: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="space-y-8"
          >
            {/* Logo/Brand mark */}
            <motion.div variants={itemVariants} className="flex items-center space-x-6">
              <div className="w-20 h-20">
                <Image
                  src="/assets/logo-apex.png"
                  alt="Apex Performance Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="h-10">
                <Image
                  src="/assets/text.logo-apex.png"
                  alt="Apex Performance"
                  width={250}
                  height={40}
                  className="h-full w-auto object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.div variants={itemVariants} className="space-y-2">
              <h1 
                id="hero-heading"
                className="text-4xl md:text-5xl lg:text-6xl xl:text-display-lg font-bold font-heading text-white leading-tight"
              >
                <span className="block gradient-text">
                  Hypercar Reimagined
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-apex-muted font-light leading-relaxed max-w-lg">
                Surgical precision meets uncompromising performance. 
                Experience automotive engineering at its absolute pinnacle.
              </p>
            </motion.div>

            {/* Key specifications strip */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-8 py-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white font-mono">2.3<span className="text-sm">s</span></div>
                <div className="text-xs text-apex-muted uppercase tracking-wider">0-60 MPH</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white font-mono">1,200<span className="text-sm">HP</span></div>
                <div className="text-xs text-apex-muted uppercase tracking-wider">POWER</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white font-mono">218<span className="text-sm">MPH</span></div>
                <div className="text-xs text-apex-muted uppercase tracking-wider">TOP SPEED</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white font-mono">1,350<span className="text-sm">KG</span></div>
                <div className="text-xs text-apex-muted uppercase tracking-wider">KERB WEIGHT</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="btn-primary px-8 py-4 text-lg font-semibold group relative overflow-hidden"
                aria-label="Contact us for enquiry"
              >
                <span className="relative z-10">Enquire Now</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-apex-red to-red-700"
                  initial={false}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="btn-secondary px-8 py-4 text-lg font-semibold group"
                aria-label="Book a demonstration"
              >
                <span className="group-hover:text-apex-black transition-colors">Book a Demo</span>
              </motion.button>
            </motion.div>


            {/* Additional brand messaging */}
            <motion.div variants={itemVariants} className="pt-8">
              <div className="text-sm text-apex-muted space-y-2">
                <p className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-apex-red rounded-full"></span>
                  <span>Carbon fiber monocoque construction</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-apex-red rounded-full"></span>
                  <span>Hybrid powertrain with active aerodynamics</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-apex-red rounded-full"></span>
                  <span>Limited production: 99 units worldwide</span>
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side: 3D Model Viewer */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect behind model */}
              <div className="absolute inset-0 bg-gradient-radial from-apex-red/20 via-transparent to-transparent blur-3xl transform scale-110" />
              
              {/* Model viewer container */}
              <div className="relative bg-gradient-to-br from-apex-grey/30 to-transparent rounded-2xl p-1 backdrop-blur-sm border border-white/5">
                <ModelViewer
                  modelSrc="/assets/apex-hypercar.glb"
                  fallbackImage="/assets/car-hero.jpg"
                  alt="Apex Performance Hypercar - Interactive 3D Model"
                  autoRotate={true}
                  className="rounded-xl"
                />
              </div>

              {/* Floating performance indicators */}
              <motion.div
                className="absolute -top-4 -right-4 bg-apex-red text-white px-3 py-1 rounded-full text-xs font-bold"
                animate={{
                  y: [-2, 2, -2],
                  boxShadow: [
                    '0 0 20px rgba(225, 6, 0, 0.3)',
                    '0 0 30px rgba(225, 6, 0, 0.5)',
                    '0 0 20px rgba(225, 6, 0, 0.3)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                LIMITED EDITION
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10"
                animate={{
                  y: [2, -2, 2],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                99 UNITS ONLY
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>


      {/* Background audio trigger (optional - for engine sound on hover) */}
      <audio id="engine-sound" preload="none">
        <source src="/assets/engine-idle.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </section>
  );
}
