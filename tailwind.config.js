/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Deep Olive/Forest Green Palette ---
        "primary-color": "#264653", // Main dark green (Deep Teal/Dark Forest Green)
        "primary-light": "#38665A", // Dark Sage Green
        "primary-dark": "#1E3C46", // Even darker green for depth
        "primary-dark-alpha": "rgba(38, 70, 83, 0.75)", // Alpha version for overlays

        // --- Cream/Soft Gold Palette ---
        "secondary-color": "#E5D8BD", // Main creamy gold accent
        "secondary-light": "#FFF0C8", // Lighter creamy gold
        "accent-color": "#FFDE99", // Brighter gold highlight
        "accent-light": "#FFF0C8", // Alias for secondary-light, useful for light accents

        // --- Neutrals and Text ---
        "creamy-bg": "#FCFCF4", // Soft creamy background (replaces gray-50)
        "dark-text": "#2C2C2C", // Dark text for contrast on light backgrounds
        "light-text": "#F8F8F8", // Light text for contrast on dark backgrounds
        "subtle-text": "#666666", // Secondary text color
      },
      fontFamily: {
        // Added custom fonts for better consistency
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      
    },
  },
  plugins: [],
};
