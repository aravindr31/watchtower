/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      backgroundImage: {
        "dots-pattern": "radial-gradient(circle, #000 2px, transparent 2px)",
      },
      width: {
        96: "24rem",
      },
    },
  },
  plugins: [],
};
