/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#ededed',
        card: '#141414',
        border: '#2a2a2a',
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8'
        },
        success: {
          DEFAULT: '#10b981',
          dark: '#047857'
        },
        warning: {
          DEFAULT: '#f59e0b',
          dark: '#b45309'
        }
      }
    },
  },
  plugins: [],
}
