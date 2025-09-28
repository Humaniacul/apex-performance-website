'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TachometerSVGProps {
  /** Current RPM value (0-8000) */
  rpm?: number;
  /** Size of the tachometer */
  size?: number;
  /** Whether to show the initial animation */
  animate?: boolean;
  /** Custom className for styling */
  className?: string;
}

/**
 * Custom SVG Tachometer Component
 * Features: Animated needle, redline glow, smooth transitions
 * Represents the Apex Performance brand's precision engineering
 */
export default function TachometerSVG({ 
  rpm = 0, 
  size = 200, 
  animate = true,
  className = '' 
}: TachometerSVGProps) {
  const [currentRPM, setCurrentRPM] = useState(0);
  const [isRedline, setIsRedline] = useState(false);

  // Calculate needle rotation (-90deg to 135deg range)
  const maxRPM = 8000;
  const needleRotation = (currentRPM / maxRPM) * 225 - 90;
  const redlineStart = 6500;

  useEffect(() => {
    if (animate) {
      // Initial dramatic sweep animation
      const timer1 = setTimeout(() => {
        setCurrentRPM(7200); // Shoot to redline
        setIsRedline(true);
      }, 1000);
      
      // Then settle back to idle
      const timer2 = setTimeout(() => {
        setCurrentRPM(1200); // Settle to idle
        setIsRedline(false);
      }, 3000);
      
      // Continuous subtle variation
      const interval = setInterval(() => {
        setCurrentRPM(prev => {
          const variation = (Math.random() - 0.5) * 400; // ±200 RPM variation
          const newRpm = Math.max(800, Math.min(1600, 1200 + variation));
          setIsRedline(newRpm > redlineStart);
          return newRpm;
        });
      }, 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearInterval(interval);
      };
    } else {
      setCurrentRPM(rpm);
      setIsRedline(rpm > redlineStart);
    }
  }, [rpm, animate, redlineStart]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-lg"
        role="img"
        aria-label={`Tachometer showing ${currentRPM} RPM`}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="faceGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
          
          <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isRedline ? "#E10600" : "#ffffff"} />
            <stop offset="100%" stopColor={isRedline ? "#B91C1C" : "#A6A6A6"} />
          </linearGradient>
          
          <radialGradient id="redlineGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(225, 6, 0, 0.8)" />
            <stop offset="100%" stopColor="rgba(225, 6, 0, 0)" />
          </radialGradient>
          
          {/* Filters */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="innerShadow">
            <feOffset dx="0" dy="2"/>
            <feGaussianBlur stdDeviation="2" result="offset-blur"/>
            <feFlood floodColor="#000000" floodOpacity="0.3"/>
            <feComposite in2="offset-blur" operator="in"/>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="url(#faceGradient)"
          stroke="#333"
          strokeWidth="2"
          filter="url(#innerShadow)"
        />
        
        {/* Outer ring */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="#444"
          strokeWidth="1"
        />
        
        {/* RPM markings and labels */}
        {Array.from({ length: 9 }, (_, i) => {
          const angle = (i * 225) / 8 - 90;
          const rpmValue = i * 1000;
          const isRedlineMarking = rpmValue >= redlineStart;
          
          // Major tick marks
          const x1 = 100 + 75 * Math.cos((angle * Math.PI) / 180);
          const y1 = 100 + 75 * Math.sin((angle * Math.PI) / 180);
          const x2 = 100 + 65 * Math.cos((angle * Math.PI) / 180);
          const y2 = 100 + 65 * Math.sin((angle * Math.PI) / 180);
          
          // Label position
          const labelX = 100 + 55 * Math.cos((angle * Math.PI) / 180);
          const labelY = 100 + 55 * Math.sin((angle * Math.PI) / 180);
          
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isRedlineMarking ? "#E10600" : "#666"}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <text
                x={labelX}
                y={labelY + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-current text-xs font-mono"
                fill={isRedlineMarking ? "#E10600" : "#A6A6A6"}
              >
                {rpmValue / 1000}
              </text>
            </g>
          );
        })}
        
        {/* Minor tick marks */}
        {Array.from({ length: 33 }, (_, i) => {
          const angle = (i * 225) / 32 - 90;
          const rpmValue = (i * maxRPM) / 32;
          const isRedlineMarking = rpmValue >= redlineStart;
          
          if (i % 4 === 0) return null; // Skip major marks
          
          const x1 = 100 + 75 * Math.cos((angle * Math.PI) / 180);
          const y1 = 100 + 75 * Math.sin((angle * Math.PI) / 180);
          const x2 = 100 + 70 * Math.cos((angle * Math.PI) / 180);
          const y2 = 100 + 70 * Math.sin((angle * Math.PI) / 180);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isRedlineMarking ? "#B91C1C" : "#555"}
              strokeWidth="1"
              strokeLinecap="round"
            />
          );
        })}
        
        {/* Redline glow effect (when in redline) */}
        {isRedline && (
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="url(#redlineGlow)"
            opacity={0.3}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Center hub */}
        <circle
          cx="100"
          cy="100"
          r="8"
          fill="#222"
          stroke="#666"
          strokeWidth="1"
        />
        
        {/* Needle */}
        <motion.g
          animate={{ 
            rotate: needleRotation,
          }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 15,
          }}
          style={{ originX: "100px", originY: "100px" }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke="url(#needleGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter={isRedline ? "url(#glow)" : undefined}
          />
          
          {/* Needle counterweight */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="115"
            stroke="url(#needleGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>
        
        {/* Center dot */}
        <circle
          cx="100"
          cy="100"
          r="4"
          fill={isRedline ? "#E10600" : "#666"}
        />
        
        {/* Brand name */}
        <text
          x="100"
          y="130"
          textAnchor="middle"
          className="fill-current text-xs font-bold tracking-wider"
          fill="#A6A6A6"
        >
          APEX
        </text>
        
        {/* RPM label */}
        <text
          x="100"
          y="145"
          textAnchor="middle"
          className="fill-current text-xs"
          fill="#666"
        >
          RPM × 1000
        </text>
        
        {/* Current RPM display */}
        <text
          x="100"
          y="165"
          textAnchor="middle"
          className="fill-current text-sm font-mono font-bold"
          fill={isRedline ? "#E10600" : "#fff"}
        >
          {Math.round(currentRPM).toLocaleString()}
        </text>
      </svg>
      
      {/* Screen reader content */}
      <div className="sr-only">
        <p>
          Engine tachometer showing {Math.round(currentRPM)} RPM
          {isRedline && " - in redline range"}
        </p>
      </div>
    </div>
  );
}
