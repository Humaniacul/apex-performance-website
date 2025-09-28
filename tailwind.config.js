const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        'apex-black': '#0B0B0C',
        'apex-grey': '#111214',
        'apex-red': '#E10600',
        'apex-white': '#FFFFFF',
        'apex-muted': '#A6A6A6',
        // Extended palette
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#E10600',
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
          500: '#A6A6A6',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111214',
          950: '#0B0B0C',
        },
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        heading: ['Sora', 'Poppins', ...fontFamily.sans],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      backgroundImage: {
        'carbon-texture': 'var(--carbon-texture, url("/assets/bg-carbon.png"))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'needle-sweep': 'needleSweep 2s ease-out',
        'count-up': 'countUp 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(225, 6, 0, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(225, 6, 0, 0.6)' },
        },
        needleSweep: {
          '0%': { transform: 'rotate(-90deg)' },
          '100%': { transform: 'rotate(45deg)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'apex': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'apex-red': '0 0 20px rgba(225, 6, 0, 0.3)',
        'apex-red-lg': '0 0 40px rgba(225, 6, 0, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    // Custom texture utility plugin
    function({ addUtilities, theme, e }) {
      const textures = {
        '.texture': {
          '--carbon-texture': 'url("/assets/bg-carbon.png")',
          backgroundImage: 'var(--carbon-texture)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        },
        '.texture-subtle': {
          '--carbon-texture': 'url("/assets/bg-carbon.png")',
          backgroundImage: 'var(--carbon-texture)',
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
          opacity: '0.1',
        },
      };
      addUtilities(textures);
    },
  ],
};
