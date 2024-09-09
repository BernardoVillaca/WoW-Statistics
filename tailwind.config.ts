import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: {
          light: "#D1A7F9", // 80% of #8928F9
          DEFAULT: "#8928F9",  // Main primary color
          dark: "#1E1B1D",  // Secondary primary color
        },
        secondary: {
          light_black: "#2A2A2A",// 80% of #F98A28
          red: "#C25454",
          rose: "#9E4784",  // Rose color
          purple: "#66347F",  // Purple color
          gray: "#CCCCCC",  // Gray color
          navy: "#37306B",  // Dark navy color
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
