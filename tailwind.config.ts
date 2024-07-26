import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      colors: {
        "primary-400": "#5B4DFF"
      },
      maxHeight: {
        "0": "0",
        screen: "100vh"
      },
      transitionProperty: {
        "max-height": "max-height"
      }
    }
  },
  variants: {
    extend: {
      maxHeight: ["responsive", "hover", "focus"]
    }
  },
  plugins: []
};
export default config;
