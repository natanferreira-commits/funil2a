import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#050505",
          gold: "#F5C542",
          goldSoft: "#B98F1F",
          green: "#22C55E",
          card: "rgba(20,20,20,0.72)"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(245,197,66,0.35), 0 10px 30px -10px rgba(245,197,66,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
