module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ This ensures Tailwind scans all components
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
