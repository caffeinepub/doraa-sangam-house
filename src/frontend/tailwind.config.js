/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Royal Banarasi-Kanpur luxury palette
        plum: {
          DEFAULT: '#2E1A47',
          dark: '#1A0F2E',
          light: '#3C1F5B',
        },
        gold: {
          DEFAULT: '#C9A96E',
          dark: '#B08B4F',
          light: '#E0C89A',
        },
        copper: '#B87333',
        ivory: '#F8F1E9',
        beige: '#D4C9B0',
        rose: '#A68A9A',
        'pearl-off-white': '#F5F5F0',
        // Light theme specific
        'light-bg': '#F8F9FA',
        'light-text': '#1A1A1A',
        'light-muted': '#6B6B6B',
        'light-gold': '#B8860B',
        'light-gold-dark': '#8B6914',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        script: ['Great Vibes', 'cursive'],
        sans: ['Lora', 'serif'],
        button: ['Montserrat', 'Raleway', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
      },
      lineHeight: {
        1.9: '1.9',
        2.0: '2.0',
        2.1: '2.1',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.6)',
        'gold-inner': 'inset 0 0 20px rgba(201, 169, 110, 0.2)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'script-entrance': 'scriptEntrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(201, 169, 110, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(201, 169, 110, 0.8)',
          },
        },
        scriptEntrance: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px) scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
