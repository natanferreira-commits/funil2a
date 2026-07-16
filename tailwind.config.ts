import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#050505",
          gold: "#C0FF00",
          goldSoft: "#84CC16",
          green: "#22C55E",
          card: "rgba(20,20,20,0.72)"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(192,255,0,0.4), 0 10px 30px -10px rgba(192,255,0,0.5)"
      }
    }
  },
  plugins: []
};

export default config;
