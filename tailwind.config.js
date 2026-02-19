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
        // Hardcore High-Tech Palette
        void: {
          DEFAULT: '#0A0A0A',
          950: '#050505',
          900: '#0A0A0A',
          800: '#111111',
          700: '#1A1A1A',
          600: '#222222',
        },
        ember: {
          DEFAULT: '#E63946',
          50: '#FFF0F1',
          100: '#FFD6D9',
          200: '#FFADB3',
          300: '#FF858D',
          400: '#FF5C67',
          500: '#E63946',
          600: '#CC2F3D',
          700: '#B32634',
          800: '#991C2B',
          900: '#7F1322',
        },
        steel: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        chrome: {
          DEFAULT: '#94A3B8',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
        },
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-diagonal': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'metal-texture': 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
      },
      boxShadow: {
        'ember-glow': '0 0 20px rgba(230, 57, 70, 0.5), 0 0 40px rgba(230, 57, 70, 0.3)',
        'steel-glow': '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)',
        'chrome-shine': 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.5)',
      },
      animation: {
        'ember-flicker': 'ember-flicker 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'ember-flicker': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.9', filter: 'brightness(1.2)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(230, 57, 70, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(230, 57, 70, 0.7)' },
        },
      },
    },
  },
  plugins: [],
};
