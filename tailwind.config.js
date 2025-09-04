/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
    // "./node_modules/flowbite-react/**/*.js", // si usas flowbite-react
  ],
  theme: { extend: {} },
  plugins: [require("flowbite/plugin")],
}
