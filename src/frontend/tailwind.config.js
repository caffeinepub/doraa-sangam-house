/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Premium Light Theme - Banarasi/Kanpur Heritage
        ivory: '#F8F5F0',
        'beige-gradient-start': '#F8F5F0',
        'beige-gradient-end': '#F5F0E6',
        'antique-gold': '#C9A96E',
        'warm-gold': '#D4B37D',
        'blush-rose-gold': '#E8C0C8',
        'deep-charcoal': '#1A1A1A',
        'warm-taupe': '#5C4B51',
        'pure-white': '#FFFFFF',
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
        playfair: ['Playfair Display', 'serif'],
        vibes: ['Great Vibes', 'cursive'],
        lora: ['Lora', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
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
      letterSpacing: {
        '2px': '0.125rem',
        '3px': '0.1875rem',
        '4px': '0.25rem',
      },
      fontSize: {
        'script-sm': 'clamp(2.8rem, 4vw, 3.2rem)',
        'script-md': 'clamp(3rem, 5vw, 3.5rem)',
        'script-lg': 'clamp(3.2rem, 6vw, 3.8rem)',
      },
      boxShadow: {
        'warm-gold-glow': '0 0 18px rgba(201, 169, 110, 0.45)',
        'gold-inner': 'inset 0 0 20px rgba(201, 169, 110, 0.15)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'script-entrance': 'scriptEntrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 18px rgba(201, 169, 110, 0.35)',
          },
          '50%': {
            boxShadow: '0 0 24px rgba(201, 169, 110, 0.55)',
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
