/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        panel: '#0b0b0d',
        surface: '#0f1114',
        muted: '#9ca3af',
        accent: '#10b981',
        brand: '#4f46e5'
      }
    }
  },
  plugins: []
};
