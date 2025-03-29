/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'butcher-red': '#dc2626',
        'premium-gold': '#d97706',
        'meat-dark': '#1f2937'

      },
      boxShadow: {
        'butcher': '0 4px 6px -1px rgba(220, 38, 38, 0.1), 0 2px 4px -1px rgba(220, 38, 38, 0.06)'
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      visibility: ['print'],
      display: ['print']
    }
  }
};
