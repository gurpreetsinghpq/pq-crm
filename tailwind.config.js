/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    boxShadow: {
      xs: "0 1px 2px 0 rgb(16 24 40 / 0.05)"
    },
    fontSize: {

      'xs':[ '12px',{
        lineHeight: "18px",
        fontWeight: "600"
      }],
      'sm': ['14px',
        {
          lineHeight: "20px",
          fontWeight: "600"
        }
      ],
      'md': ['16px',
        {
          lineHeight: "24px",
          fontWeight: "400"
        }
      ],
      'lg': ['18px',
        {
          lineHeight: "28px",
          fontWeight: "600"
        }

      ],
      'xl': ['20px',
        {
          lineHeight: "30px",
          fontWeight: "600",
        }
      ],

    },
    colors: {
      purple: {
        100: "#F4EBFF",
        200: "#E9D7FE",
        300: "#D6BBFB",
        600: "#7F56D9",
        700: "#6941C6",
        800: "#53389E",
        900: "#42307D"
      },
      gray: {
        100: "#F2F4F7",
        200: "#EAECF0",
        300: "#D0D5DD",
        400: "#98A2B3",
        500: "#667085",
        600: "#475467",
        700: "#344054",
        900: "#101828"
      },
      white: {
        900: "#FFFFFF"
      },
      blue: {
        600: "#1570EF"
      }
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      boxShadow: {
        custom1: '0px 0px 0px 4px #F4EBFF, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        custom2: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)'
      },
      colors: {
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
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  variants: {
    fill: ['hover', 'focus'],
  },
  plugins: [require("tailwindcss-animate")],
}