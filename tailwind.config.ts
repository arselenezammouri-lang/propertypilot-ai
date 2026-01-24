import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* 🎨 PropertyPilot AI Premium Palette */
        'luxury-indigo': 'hsl(var(--luxury-indigo))',
        'royal-purple': 'hsl(var(--royal-purple))',
        'electric-blue': 'hsl(var(--electric-blue))',
        'pearl-white': 'hsl(var(--pearl-white))',
        'carbon-black': 'hsl(var(--carbon-black))',
        'neon-aqua': 'hsl(var(--neon-aqua))',
        'sunset-gold': 'hsl(var(--sunset-gold))',
        'silver-frost': 'hsl(var(--silver-frost))',
        
        /* Semantic Tokens */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: "hsl(var(--gold))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-ai-aurora': 'var(--gradient-ai-aurora)',
        'gradient-luxury-gold': 'var(--gradient-luxury-gold)',
        'gradient-cyber-glow': 'var(--gradient-cyber-glow)',
        'gradient-hero': 'var(--gradient-hero)',
      },
      boxShadow: {
        'glow-purple': '0 0 30px hsl(var(--royal-purple) / 0.3)',
        'glow-blue': '0 0 30px hsl(var(--electric-blue) / 0.3)',
        'glow-aqua': '0 0 30px hsl(var(--neon-aqua) / 0.3)',
        'glow-gold': '0 0 30px hsl(var(--sunset-gold) / 0.3)',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'fade-in-down': 'fade-in-down 0.8s ease-out',
        'slide-in-left': 'slide-in-left 0.8s ease-out',
        'slide-in-right': 'slide-in-right 0.8s ease-out',
        'scale-in': 'scale-in 0.6s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'scroll': 'scroll 60s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
