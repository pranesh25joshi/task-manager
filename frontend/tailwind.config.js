/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#A05A2C", // Warm Clay/Leather
        "primary-hover": "#824822", // Darker Leather
        "background-light": "#F5F2EB", // Oatmeal/Paper/Linen
        "background-dark": "#1a1614", // Deep brown-black
        "card-light": "#FFFCF9", // Creamy white
        "card-dark": "#2b2623", // Warm dark grey
        "card-hover-light": "#FDF6F0",
        "card-hover-dark": "#36302c",
        "border-light": "#E3DDD1", // Sand
        "border-dark": "#4a4440",
        "text-main": "#423429", // Espresso/Dark Wood
        "text-muted": "#8f847a", // Taupe/Stone
        "input-bg": "#FFFFFF",
        "input-bg-dark": "#221e1c",
        "priority-high": "#C25E45",
        "priority-med": "#D4A353",
        "priority-low": "#7FA07B",
      },
      fontFamily: {
        "display": ["DM Sans", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.375rem",
        "lg": "0.625rem",
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      boxShadow: {
        'earthy': '0 20px 40px -12px rgba(66, 52, 41, 0.08)',
        'card': '0 4px 6px -1px rgba(66, 52, 41, 0.05), 0 2px 4px -1px rgba(66, 52, 41, 0.03)',
        'floating': '0 10px 15px -3px rgba(66, 52, 41, 0.08), 0 4px 6px -2px rgba(66, 52, 41, 0.04)',
        'input': '0 1px 2px 0 rgba(66, 52, 41, 0.05)',
      }
    },
  },
  plugins: [],
}
