'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Download, Share2, RotateCcw, Palette, Settings, Car } from 'lucide-react';

interface ConfigOption {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  color?: string;
}

interface ConfigCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  options: ConfigOption[];
}

interface Configuration {
  paint: string;
  wheels: string;
  aero: string;
  interior: string;
  [key: string]: string;
}

interface ConfiguratorProps {
  /** Custom className */
  className?: string;
  /** Callback when configuration changes */
  onConfigurationChange?: (config: Configuration) => void;
  /** Base price of the vehicle */
  basePrice?: number;
}

const configCategories: ConfigCategory[] = [
  {
    id: 'paint',
    name: 'Exterior Paint',
    icon: Palette,
    options: [
      {
        id: 'stealth-black',
        name: 'Stealth Black',
        price: 0,
        color: '#0B0B0C',
        description: 'Signature matte black finish',
        image: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=800'
      },
      {
        id: 'apex-red',
        name: 'Apex Red',
        price: 15000,
        color: '#E10600',
        description: 'Exclusive metallic red',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'
      },
      {
        id: 'carbon-grey',
        name: 'Carbon Grey',
        price: 12000,
        color: '#2D2D2D',
        description: 'Exposed carbon fiber weave',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800'
      },
      {
        id: 'phantom-white',
        name: 'Phantom White',
        price: 10000,
        color: '#F8F8FF',
        description: 'Pearlescent white',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'
      },
    ],
  },
  {
    id: 'wheels',
    name: 'Wheels',
    icon: Settings,
    options: [
      {
        id: 'forged-carbon',
        name: 'Forged Carbon',
        price: 0,
        description: '20" front / 21" rear carbon wheels',
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800'
      },
      {
        id: 'titanium-sport',
        name: 'Titanium Sport',
        price: 25000,
        description: '20" front / 21" rear titanium',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800'
      },
      {
        id: 'track-focused',
        name: 'Track Focused',
        price: 35000,
        description: 'Magnesium racing wheels',
        image: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=800'
      },
    ],
  },
  {
    id: 'aero',
    name: 'Aerodynamics',
    icon: Car,
    options: [
      {
        id: 'touring',
        name: 'Touring Package',
        price: 0,
        description: 'Standard active aerodynamics',
      },
      {
        id: 'track',
        name: 'Track Package',
        price: 45000,
        description: 'Enhanced downforce kit',
      },
      {
        id: 'extreme',
        name: 'Extreme Package',
        price: 85000,
        description: 'Maximum aerodynamic efficiency',
      },
    ],
  },
  {
    id: 'interior',
    name: 'Interior',
    icon: Settings,
    options: [
      {
        id: 'sport',
        name: 'Sport Interior',
        price: 0,
        description: 'Alcantara and carbon fiber',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'
      },
      {
        id: 'luxury',
        name: 'Luxury Interior',
        price: 30000,
        description: 'Premium leather and wood',
      },
      {
        id: 'race',
        name: 'Race Interior',
        price: 20000,
        description: 'Full carbon fiber cockpit',
      },
    ],
  },
];

/**
 * Car Configurator Component
 * Features: Interactive customization, price calculation, shareable configurations
 */
export default function Configurator({
  className = '',
  onConfigurationChange,
  basePrice = 2500000
}: ConfiguratorProps) {
  const [activeCategory, setActiveCategory] = useState('paint');
  const [configuration, setConfiguration] = useState<Configuration>({
    paint: 'stealth-black',
    wheels: 'forged-carbon',
    aero: 'touring',
    interior: 'sport',
  });

  const [isSharing, setIsSharing] = useState(false);

  // Calculate total price
  const totalPrice = basePrice + configCategories.reduce((total, category) => {
    const selectedOption = category.options.find(
      option => option.id === configuration[category.id]
    );
    return total + (selectedOption?.price || 0);
  }, 0);

  // Get current main image based on paint selection
  const currentPaintOption = configCategories
    .find(cat => cat.id === 'paint')
    ?.options.find(opt => opt.id === configuration.paint);
  
  const mainImage = currentPaintOption?.image || configCategories[0].options[0].image;

  useEffect(() => {
    onConfigurationChange?.(configuration);
  }, [configuration, onConfigurationChange]);

  const handleOptionSelect = (categoryId: string, optionId: string) => {
    setConfiguration(prev => ({
      ...prev,
      [categoryId]: optionId
    }));
  };

  const resetConfiguration = () => {
    setConfiguration({
      paint: 'stealth-black',
      wheels: 'forged-carbon',
      aero: 'touring',
      interior: 'sport',
    });
  };

  const shareConfiguration = async () => {
    setIsSharing(true);
    
    try {
      const configUrl = `${window.location.origin}?config=${encodeURIComponent(JSON.stringify(configuration))}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Apex Performance Configuration',
          text: `Check out my custom Apex hypercar configuration - Total: $${totalPrice.toLocaleString()}`,
          url: configUrl,
        });
      } else {
        await navigator.clipboard.writeText(configUrl);
        // Show toast notification
        alert('Configuration URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadConfiguration = () => {
    const configData = {
      configuration,
      totalPrice,
      basePrice,
      timestamp: new Date().toISOString(),
      options: configCategories.map(category => ({
        category: category.name,
        selected: category.options.find(opt => opt.id === configuration[category.id])?.name,
        price: category.options.find(opt => opt.id === configuration[category.id])?.price,
      }))
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-configuration-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
            Configure Your Apex
          </h2>
          <p className="text-xl text-apex-muted max-w-2xl mx-auto">
            Tailor every detail to your exact specifications. Create your ultimate hypercar.
          </p>
          <div className="w-24 h-1 bg-apex-red mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Visual Preview */}
          <div className="space-y-6">
            {/* Main Image */}
            <motion.div
              className="relative aspect-car bg-apex-grey rounded-2xl overflow-hidden"
              key={configuration.paint}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={mainImage}
                alt={`Apex hypercar in ${currentPaintOption?.name}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Color overlay for paint simulation */}
              {currentPaintOption?.color && (
                <div 
                  className="absolute inset-0 mix-blend-multiply opacity-30"
                  style={{ backgroundColor: currentPaintOption.color }}
                />
              )}

              {/* Configuration Badge */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
                <h3 className="font-semibold text-sm mb-1">Current Configuration</h3>
                <div className="text-xs text-apex-muted space-y-1">
                  {Object.entries(configuration).map(([category, optionId]) => {
                    const categoryData = configCategories.find(cat => cat.id === category);
                    const option = categoryData?.options.find(opt => opt.id === optionId);
                    return (
                      <div key={category} className="flex justify-between">
                        <span className="capitalize">{category}:</span>
                        <span className="text-white">{option?.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Price Summary */}
            <motion.div
              className="bg-apex-grey rounded-xl p-6 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Price Summary</h3>
                <div className="text-2xl font-bold font-mono text-apex-red">
                  ${totalPrice.toLocaleString()}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-apex-muted">
                  <span>Base Price:</span>
                  <span>${basePrice.toLocaleString()}</span>
                </div>
                
                {configCategories.map(category => {
                  const selectedOption = category.options.find(
                    option => option.id === configuration[category.id]
                  );
                  const price = selectedOption?.price || 0;
                  
                  if (price === 0) return null;
                  
                  return (
                    <div key={category.id} className="flex justify-between text-apex-muted">
                      <span>{selectedOption?.name}:</span>
                      <span>+${price.toLocaleString()}</span>
                    </div>
                  );
                })}
                
                <div className="border-t border-gray-700 pt-2 mt-3">
                  <div className="flex justify-between text-white font-semibold">
                    <span>Total:</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={resetConfiguration}
                  className="flex-1 btn-outline text-sm py-2"
                  aria-label="Reset configuration"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </button>
                
                <button
                  onClick={shareConfiguration}
                  disabled={isSharing}
                  className="flex-1 btn-secondary text-sm py-2"
                  aria-label="Share configuration"
                >
                  <Share2 size={16} className="mr-2" />
                  {isSharing ? 'Sharing...' : 'Share'}
                </button>
                
                <button
                  onClick={downloadConfiguration}
                  className="flex-1 btn-primary text-sm py-2"
                  aria-label="Download configuration"
                >
                  <Download size={16} className="mr-2" />
                  Export
                </button>
              </div>
            </motion.div>
          </div>

          {/* Configuration Options */}
          <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {configCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-apex-red text-white shadow-apex-red'
                        : 'bg-apex-grey text-apex-muted hover:bg-apex-red/20 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Options Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {configCategories
                  .find(cat => cat.id === activeCategory)
                  ?.options.map((option) => {
                    const isSelected = configuration[activeCategory] === option.id;
                    
                    return (
                      <motion.div
                        key={option.id}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'border-apex-red bg-apex-red/10 shadow-apex-red'
                            : 'border-gray-700 bg-apex-grey hover:border-gray-600'
                        }`}
                        onClick={() => handleOptionSelect(activeCategory, option.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Color swatch for paint options */}
                            {option.color && (
                              <div
                                className="w-8 h-8 rounded-full border-2 border-white/20"
                                style={{ backgroundColor: option.color }}
                              />
                            )}
                            
                            <div>
                              <h4 className={`font-semibold ${isSelected ? 'text-white' : 'text-white'}`}>
                                {option.name}
                              </h4>
                              {option.description && (
                                <p className="text-sm text-apex-muted mt-1">
                                  {option.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`font-bold ${isSelected ? 'text-apex-red' : 'text-white'}`}>
                              {option.price === 0 ? 'Included' : `+$${option.price.toLocaleString()}`}
                            </div>
                            {isSelected && (
                              <div className="text-xs text-apex-red mt-1">
                                ✓ Selected
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          className="text-center mt-16 p-8 bg-gradient-to-r from-apex-grey to-apex-grey/50 rounded-2xl border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            Ready to Build Your Apex?
          </h3>
          <p className="text-apex-muted mb-6 max-w-2xl mx-auto">
            This configuration is uniquely yours. Contact our specialists to begin the creation process.
          </p>
          <button className="btn-primary text-lg px-8 py-4">
            Request Quote
          </button>
        </motion.div>
      </div>
    </section>
  );
}
