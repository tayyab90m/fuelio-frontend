/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b80c09", // Deep red
        secondary: "#373f51", // Dark slate
        accent: "#e5e7e6", // Light gray
        lightGray: "#b7b5b3", // Light gray
        darkGray: "#141301", // Dark gray
      },
    },
  },
  plugins: [],
}

