module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem'
      },
      colors: {
        sky: {
          600: '#0284c7',
        },
      },
      container: {
        center: true,
        padding: '1.5rem',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};