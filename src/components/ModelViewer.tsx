'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ModelViewerProps {
  /** Path to the .glb/.gltf model file */
  modelSrc?: string;
  /** Fallback image for when model fails to load */
  fallbackImage?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Custom className for styling */
  className?: string;
  /** Whether to auto-rotate the model */
  autoRotate?: boolean;
  /** Loading state callback */
  onLoading?: (loading: boolean) => void;
  /** Error callback */
  onError?: (error: string) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src: string;
        alt?: string;
        poster?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'auto-rotate-delay'?: number;
        'rotation-per-second'?: string;
        'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
        'interaction-prompt-threshold'?: number;
        'camera-orbit'?: string;
        'field-of-view'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'shadow-intensity'?: number;
        'shadow-softness'?: number;
        environment?: string;
        skybox?: string;
        'exposure'?: number;
        'tone-mapping'?: string;
        onLoad?: () => void;
        onError?: (event: CustomEvent) => void;
      }, HTMLElement>;
    }
  }
}

/**
 * 3D Model Viewer Component
 * Uses model-viewer web component for 3D car model display
 * Features: Auto-rotation, camera controls, progressive loading, accessibility
 */
export default function ModelViewer({
  modelSrc = '/assets/apex-hypercar.glb',
  fallbackImage = '/assets/car-hero.jpg',
  alt = 'Apex Performance Hypercar - Interactive 3D Model',
  className = '',
  autoRotate = true,
  onLoading,
  onError,
}: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load model-viewer script dynamically
    const loadModelViewer = async () => {
      try {
        if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
          const { default: modelViewer } = await import('@google/model-viewer');
          setModelViewerLoaded(true);
        } else {
          setModelViewerLoaded(true);
        }
      } catch (error) {
        console.warn('Failed to load model-viewer:', error);
        setHasError(true);
        onError?.('Failed to load model viewer');
      }
    };

    loadModelViewer();
  }, [onError]);

  const handleModelLoad = () => {
    setIsLoading(false);
    onLoading?.(false);
  };

  const handleModelError = (event: CustomEvent) => {
    console.warn('Model failed to load:', event.detail);
    setHasError(true);
    setIsLoading(false);
    onError?.('Model failed to load');
    onLoading?.(false);
  };

  if (hasError || !modelViewerLoaded) {
    return (
      <div className={`relative ${className}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full aspect-car bg-apex-grey rounded-xl overflow-hidden"
        >
          <Image
            src={fallbackImage}
            alt={alt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          {/* Overlay with fallback message */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-12 h-12 mx-auto mb-4 opacity-50">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>
              </div>
              <p className="text-sm font-medium">3D Model Unavailable</p>
              <p className="text-xs text-apex-muted mt-1">Showing static preview</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-apex-grey rounded-xl flex items-center justify-center z-10"
        >
          <div className="text-center text-white">
            {/* Loading animation */}
            <div className="w-16 h-16 mx-auto mb-4">
              <motion.div
                className="w-full h-full border-4 border-apex-muted border-t-apex-red rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            <p className="text-sm font-medium">Loading 3D Model</p>
            <p className="text-xs text-apex-muted mt-1">Please wait...</p>
          </div>
        </motion.div>
      )}

      {/* Model Viewer */}
      <model-viewer
        src={modelSrc}
        alt={alt}
        poster={fallbackImage}
        loading="lazy"
        camera-controls
        auto-rotate={autoRotate}
        auto-rotate-delay={3000}
        rotation-per-second="15deg"
        interaction-prompt="auto"
        interaction-prompt-threshold={2000}
        camera-orbit="45deg 75deg 2.5m"
        field-of-view="45deg"
        min-camera-orbit="auto auto 1.5m"
        max-camera-orbit="auto auto 4m"
        shadow-intensity={1.2}
        shadow-softness={0.8}
        exposure={1}
        tone-mapping="aces"
        onLoad={handleModelLoad}
        onError={handleModelError}
        className="w-full aspect-car bg-transparent rounded-xl"
        style={{
          '--poster-color': 'transparent',
          '--progress-bar-color': '#E10600',
          '--progress-mask': 'rgba(0, 0, 0, 0.8)',
        } as React.CSSProperties}
      />

      {/* Interactive hints */}
      {!isLoading && !hasError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-white pointer-events-none"
        >
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M13 9V3.5L22 12L13 20.5V15C6 15 2 19 2 19S3 14 13 9Z" />
              </svg>
            </motion.div>
            <span>Drag to rotate • Scroll to zoom</span>
          </div>
        </motion.div>
      )}

      {/* Model info overlay */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
        <h3 className="text-sm font-semibold mb-1">Interactive 3D Model</h3>
        <div className="text-xs text-apex-muted space-y-1">
          <p>• Drag to rotate view</p>
          <p>• Scroll to zoom in/out</p>
          <p>• Double-click to reset</p>
        </div>
      </div>

      {/* Performance stats overlay */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs"
      >
        <h4 className="text-sm font-semibold mb-2 text-apex-red">Quick Specs</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-apex-muted">0-60 mph:</span>
            <span className="font-mono">2.3s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-apex-muted">Top Speed:</span>
            <span className="font-mono">218 mph</span>
          </div>
          <div className="flex justify-between">
            <span className="text-apex-muted">Power:</span>
            <span className="font-mono">1,200 hp</span>
          </div>
          <div className="flex justify-between">
            <span className="text-apex-muted">Weight:</span>
            <span className="font-mono">1,350 kg</span>
          </div>
        </div>
      </motion.div>

      {/* Accessibility enhancements */}
      <div className="sr-only">
        <p>
          Interactive 3D model of the Apex Performance hypercar. 
          {isLoading ? 'Model is currently loading.' : 'Use mouse to rotate and zoom the model.'}
        </p>
      </div>
    </div>
  );
}
