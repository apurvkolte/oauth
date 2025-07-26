# Getting Started with Create React App
# Create React App (CRA) and Tailwind CSS v3.4.3 not suppport 4 taiwindcss
npm install tailwindcss@^3.4.3 postcss autoprefixer
npx tailwindcss init -p

@tailwind base;
@tailwind components;
@tailwind utilities;


# tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ include all files in src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


# postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}