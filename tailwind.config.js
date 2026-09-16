/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b80c09", // Deep blue
        secondary: "#373f51", // Purple
        accent: "#e5e7e6", // Yellow
        lightGray: "#b7b5b3", // Light gray
        darkGray: "#141301", // Dark gray
      },
    },
  },
  plugins: [],
}

