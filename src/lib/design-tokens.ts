/**
 * Apex Performance Design System Tokens
 * Central source of truth for all design values
 */

export const colors = {
  // Brand Primary Colors
  brand: {
    black: '#0B0B0C',      // Primary background
    grey: '#111214',       // Secondary background/panels
    red: '#E10600',        // Accent red
    white: '#FFFFFF',      // Primary text
    muted: '#A6A6A6',      // Muted text
  },
  
  // Extended palette for components
  primary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#E10600', // Brand red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  grey: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#A6A6A6', // Brand muted
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111214', // Brand grey
    950: '#0B0B0C', // Brand black
  },
} as const;

export const typography = {
  fontFamily: {
    heading: ['Sora', 'Poppins', 'system-ui', 'sans-serif'],
    body: ['Inter', 'system-ui', 'sans-serif'],
  },
  
  fontSize: {
    // Display sizes for hero sections
    'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
    'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
    
    // Standard sizes
    'xl': ['1.25rem', { lineHeight: '1.75' }],
    'lg': ['1.125rem', { lineHeight: '1.75' }],
    'base': ['1rem', { lineHeight: '1.5' }],
    'sm': ['0.875rem', { lineHeight: '1.5' }],
    'xs': ['0.75rem', { lineHeight: '1.5' }],
  },
} as const;

export const spacing = {
  // Premium spacing scale with comfortable negative space
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
  '2xl': '4rem',   // 64px
  '3xl': '6rem',   // 96px
  '4xl': '8rem',   // 128px
  '5xl': '12rem',  // 192px
  '6xl': '16rem',  // 256px
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

export const shadows = {
  // Premium shadow system
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Brand-specific shadows
  'apex': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  'apex-red': '0 0 20px rgba(225, 6, 0, 0.3)',
  'apex-red-lg': '0 0 40px rgba(225, 6, 0, 0.4)',
} as const;

export const animation = {
  duration: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export const assets = {
  logo: '/assets/logo-apex.png',
  logoText: '/assets/text.logo-apex.png',
  carModel: '/assets/apex-hypercar.glb',
  carHero: '/assets/car-hero.jpg',
  carbonTexture: '/assets/bg-carbon.png',
  
  // Placeholder images - replace with actual assets
  placeholders: {
    car: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=1200',
    interior: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    exterior: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    engine: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
  },
} as const;

// Export individual token groups for convenience
export { colors as designColors };
export { typography as designTypography };
export { spacing as designSpacing };
export { breakpoints as designBreakpoints };
export { zIndex as designZIndex };
export { shadows as designShadows };
export { animation as designAnimation };
export { assets as designAssets };
