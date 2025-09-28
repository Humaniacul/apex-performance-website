'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn, Download, Heart } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
  width: number;
  height: number;
}

interface GalleryProps {
  /** Array of images to display */
  images?: GalleryImage[];
  /** Gallery title */
  title?: string;
  /** Gallery description */
  description?: string;
  /** Layout type */
  layout?: 'grid' | 'masonry' | 'carousel';
  /** Number of columns for grid layout */
  columns?: number;
  /** Custom className */
  className?: string;
}

const defaultImages: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=1200',
    alt: 'Apex Hypercar - Front View',
    title: 'Aggressive Front Design',
    description: 'Aerodynamic excellence meets visual dominance',
    category: 'Exterior',
    width: 1200,
    height: 800,
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200',
    alt: 'Apex Hypercar - Side Profile',
    title: 'Sculptural Side Profile',
    description: 'Carbon fiber bodywork with active aerodynamics',
    category: 'Exterior',
    width: 1200,
    height: 675,
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200',
    alt: 'Apex Hypercar - Interior Dashboard',
    title: 'Cockpit Command Center',
    description: 'Driver-focused interior with premium materials',
    category: 'Interior',
    width: 1200,
    height: 800,
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200',
    alt: 'Apex Hypercar - Engine Bay',
    title: 'Hybrid Powertrain',
    description: 'V8 twin-turbo with electric assistance',
    category: 'Technical',
    width: 1200,
    height: 900,
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200',
    alt: 'Apex Hypercar - Rear View',
    title: 'Distinctive Rear Design',
    description: 'Integrated active rear wing and diffuser',
    category: 'Exterior',
    width: 1200,
    height: 800,
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200',
    alt: 'Apex Hypercar - Wheel Detail',
    title: 'Carbon-Ceramic Brakes',
    description: 'Forged carbon wheels with racing-grade brakes',
    category: 'Details',
    width: 1200,
    height: 800,
  },
];

/**
 * Gallery Component with Lightbox
 * Features: Multiple layouts, lightbox modal, image navigation, responsive design
 */
export default function Gallery({
  images = defaultImages,
  title = 'Gallery',
  description = 'Explore every detail of automotive perfection',
  layout = 'grid',
  columns = 3,
  className = ''
}: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))];
  
  // Filter images by category
  const filteredImages = selectedCategory === 'All' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const toggleFavorite = (imageId: string) => {
    setFavorites(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const downloadImage = async (src: string, filename: string) => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const gridClassName = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`;

  return (
    <section className={`section-padding ${className}`}>
      <div className="max-w-7xl mx-auto container-padding">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-apex-muted max-w-2xl mx-auto">
            {description}
          </p>
          <div className="w-24 h-1 bg-apex-red mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
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
        </motion.div>

        {/* Gallery Grid */}
        <div ref={galleryRef} className={gridClassName}>
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="group relative overflow-hidden rounded-xl bg-apex-grey cursor-pointer aspect-[4/3]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {image.category && (
                  <span className="inline-block bg-apex-red px-2 py-1 rounded text-xs font-medium mb-2">
                    {image.category}
                  </span>
                )}
                {image.title && (
                  <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                )}
                {image.description && (
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {image.description}
                  </p>
                )}
              </div>

              {/* Zoom icon */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ZoomIn size={16} />
              </div>

              {/* Favorite button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(image.id);
                }}
                className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-apex-red/50"
              >
                <Heart
                  size={16}
                  className={`transition-colors ${
                    favorites.includes(image.id) ? 'fill-apex-red text-apex-red' : ''
                  }`}
                />
              </button>
            </motion.div>
          ))}
        </div>

        {/* View count */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-apex-muted">
            Showing {filteredImages.length} of {images.length} images
          </p>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-apex-red/50 transition-colors"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-apex-red/50 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-apex-red/50 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image */}
            <motion.div
              key={currentImageIndex}
              className="relative max-w-5xl max-h-[80vh] mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredImages[currentImageIndex]?.src}
                alt={filteredImages[currentImageIndex]?.alt}
                width={filteredImages[currentImageIndex]?.width}
                height={filteredImages[currentImageIndex]?.height}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                priority
              />

              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <div className="flex items-end justify-between">
                  <div className="text-white">
                    {filteredImages[currentImageIndex]?.category && (
                      <span className="inline-block bg-apex-red px-2 py-1 rounded text-xs font-medium mb-2">
                        {filteredImages[currentImageIndex].category}
                      </span>
                    )}
                    {filteredImages[currentImageIndex]?.title && (
                      <h3 className="font-bold text-xl mb-1">
                        {filteredImages[currentImageIndex].title}
                      </h3>
                    )}
                    {filteredImages[currentImageIndex]?.description && (
                      <p className="text-gray-300">
                        {filteredImages[currentImageIndex].description}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleFavorite(filteredImages[currentImageIndex].id)}
                      className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-apex-red/50 transition-colors"
                      aria-label="Toggle favorite"
                    >
                      <Heart
                        size={16}
                        className={`transition-colors ${
                          favorites.includes(filteredImages[currentImageIndex].id) 
                            ? 'fill-apex-red text-apex-red' 
                            : ''
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => {
                        const image = filteredImages[currentImageIndex];
                        downloadImage(image.src, `apex-${image.id}.jpg`);
                      }}
                      className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-apex-red/50 transition-colors"
                      aria-label="Download image"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
              {currentImageIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
