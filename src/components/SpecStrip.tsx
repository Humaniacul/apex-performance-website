'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { animateValue } from '@/lib/utils';

interface Specification {
  id: string;
  value: number;
  unit: string;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

interface SpecStripProps {
  /** Whether the strip should stick to top on scroll */
  sticky?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Custom specifications array */
  specifications?: Specification[];
}

const defaultSpecs: Specification[] = [
  {
    id: 'acceleration',
    value: 2.3,
    unit: 's',
    label: '0-60 MPH',
    decimals: 1,
  },
  {
    id: 'power',
    value: 1200,
    unit: 'HP',
    label: 'MAX POWER',
  },
  {
    id: 'topspeed',
    value: 218,
    unit: 'MPH',
    label: 'TOP SPEED',
  },
  {
    id: 'weight',
    value: 1350,
    unit: 'KG',
    label: 'KERB WEIGHT',
  },
  {
    id: 'torque',
    value: 1100,
    unit: 'NM',
    label: 'MAX TORQUE',
  },
];

/**
 * Performance Specifications Strip
 * Features: Animated count-up numbers, sticky scroll behavior, responsive design
 */
export default function SpecStrip({ 
  sticky = false, 
  className = '',
  specifications = defaultSpecs
}: SpecStripProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stripRef, { 
    threshold: 0.5,
    margin: "-100px"
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      
      // Animate each specification number
      specifications.forEach((spec, index) => {
        const element = document.getElementById(`spec-${spec.id}`);
        if (element) {
          setTimeout(() => {
            animateValue(element, 0, spec.value, 1500, {
              formatter: (value) => {
                const formatted = spec.decimals 
                  ? (value).toFixed(spec.decimals)
                  : Math.floor(value).toString();
                return `${spec.prefix || ''}${formatted}`;
              },
              suffix: spec.unit
            });
          }, index * 200);
        }
      });
    }
  }, [isInView, hasAnimated, specifications]);

  useEffect(() => {
    if (!sticky) return;

    const handleScroll = () => {
      if (stripRef.current) {
        const rect = stripRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);

  return (
    <>
      {/* Spacer for sticky positioning */}
      {sticky && isSticky && <div className="h-20" />}
      
      <motion.section
        ref={stripRef}
        className={`
          ${sticky ? 'sticky top-0 z-40' : 'relative'}
          ${isSticky ? 'bg-apex-black/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}
          transition-all duration-300
          ${className}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full py-4 lg:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Title (only show when not sticky) */}
            {!sticky && (
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                  Performance Specifications
                </h2>
                <div className="w-24 h-1 bg-apex-red mx-auto rounded-full" />
              </motion.div>
            )}

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
              {specifications.map((spec, index) => (
                <motion.div
                  key={spec.id}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Animated number */}
                  <div className="relative">
                    <div
                      id={`spec-${spec.id}`}
                      className="text-3xl md:text-4xl lg:text-5xl font-bold font-mono text-white mb-1 transition-colors duration-300 group-hover:text-apex-red"
                      aria-live="polite"
                    >
                      {hasAnimated ? `${spec.prefix || ''}${spec.value}${spec.unit}` : '0'}
                    </div>
                    
                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 bg-apex-red/20 blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Label */}
                  <div className="text-xs md:text-sm text-apex-muted uppercase tracking-wider font-medium">
                    {spec.label}
                  </div>

                  {/* Decorative line */}
                  <motion.div
                    className="w-8 h-0.5 bg-apex-red mx-auto mt-2 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hasAnimated ? 1 : 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Additional context (only when not sticky) */}
            {!sticky && (
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-sm text-apex-muted max-w-2xl mx-auto">
                  Every number represents thousands of hours of engineering excellence. 
                  These aren't just statistics—they're the foundation of automotive perfection.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom border when sticky */}
        {sticky && isSticky && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-apex-red to-transparent" />
        )}
      </motion.section>
    </>
  );
}

/**
 * Compact version for sticky header
 */
export function CompactSpecStrip({ className = '' }: { className?: string }) {
  const compactSpecs = [
    { value: '2.3s', label: '0-60' },
    { value: '1,200HP', label: 'POWER' },
    { value: '218MPH', label: 'TOP SPEED' },
  ];

  return (
    <div className={`flex items-center space-x-8 ${className}`}>
      {compactSpecs.map((spec, index) => (
        <div key={index} className="text-center">
          <div className="text-lg font-bold font-mono text-white">
            {spec.value}
          </div>
          <div className="text-xs text-apex-muted uppercase tracking-wide">
            {spec.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Animated counter hook for reuse in other components
 */
export function useAnimatedCounter(
  endValue: number,
  duration: number = 1500,
  startValue: number = 0,
  formatter?: (value: number) => string
) {
  const [currentValue, setCurrentValue] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const startTime = Date.now();
    
    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = startValue + (endValue - startValue) * easeOutQuart;
      
      setCurrentValue(value);
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(updateValue);
  };

  const displayValue = formatter ? formatter(currentValue) : currentValue;

  return { currentValue, displayValue, animate, isAnimating };
}
