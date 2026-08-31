import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Exact palette copied from the original site's css/styles.css :root ----
        "primary-green": "#008748",
        "primary-green-hover": "#006837",
        "primary-navy": "#0A2540",
        "primary-navy-light": "#163B66",
        "accent-emerald": "#059669",
        "accent-gold": "#E9C46A",
        "accent-gold-vibrant": "#D97706",
        "accent-soft-green": "#F0FDF4",
        "accent-soft-gold": "#FEF3C7",

        "bg-main": "#F8FAFC",
        "bg-surface": "#FFFFFF",
        "bg-alt": "#F1F5F9",
        "bg-card": "#FFFFFF",
        "text-dark": "#0F172A",
        "text-body": "#1E293B",
        "text-muted": "#475569",
        "border-light": "#E2E8F0",
        "border-active": "#008748",

        // shadcn/ui semantic tokens (used only by shadcn/ui primitives, not by migrated site markup)
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
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "24px",
        full: "9999px",
      },
      fontFamily: {
        main: ["Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0, 135, 72, 0.08)",
        md: "0 8px 24px rgba(10, 37, 64, 0.1)",
        lg: "0 16px 40px rgba(10, 37, 64, 0.15)",
        glow: "0 0 25px rgba(0, 135, 72, 0.3)",
      },
    },
  },
  plugins: [],
} satisfies Config
