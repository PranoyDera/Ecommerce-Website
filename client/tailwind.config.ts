import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      poppins: ["var(--font-poppins)", "sans-serif"],
      roboto: ["var(--font-roboto)", "sans-serif"],
      geist: ["var(--font-geist-sans)", "sans-serif"],
      geistMono: ["var(--font-geist-mono)", "monospace"],
    },
  },
};

export default config;
