import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const primitiveColors = {
  system: {
    black: "#000000",
    white: "#ffffff",
    error: "#FF334B"
  },
  gray: {
    100: "#F2F2F2",
    200: "#D8D8D9",
    300: "#BFBEC0",
    400: "#A5A4A7",
    500: "#8B8A8E",
    600: "#727175",
    700: "#58585B",
    800: "#3F3F41",
    900: "#262627"
  },
  pai: {
    100: "#E7E5FF",
    200: "#B9B2FF",
    300: "#8A80FF",
    400: "#5B4DFF",
    500: "#2C19FF",
    600: "#1200E5",
    700: "#0E00B2",
    800: "#0E00B2",
    900: "#06004C"
  },
  fai: {
    100: "#FFF8F0",
    200: "#FFDFBD",
    300: "#FFC68A",
    400: "#FFAE57",
    500: "#FF9524",
    600: "#F07C00",
    700: "#BD6200",
    800: "#8A4700",
    900: "#572D00"
  }
};

const transparentColors = {
  grayTrans: {
    20032: "#D8D8D932",
    20060: "#D8D8D960",
    30080: "#BFBEC080",
    60080: "#72717580",
    90020: "#26262720",
    90052: "#26262752",
    90080: "#26262780"
  },
  purpleTrans: {
    p10080: "#E7E5FF80",
    p40060: "#5B4DFF60",
    p40080: "#5B4DFF80",
    p60032: "#1200E532"
  },
  orangeTrans: {
    f50060: "#FF952460"
  },
  modalBg: {
    black40: "#00000040"
  }
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      tablet: "640px",
      tabletLg: "840px",
      desktop: "1200px"
    },
    colors: {
      ...primitiveColors,
      ...transparentColors
    },
    extend: {
      backgroundImage: {
        "gradient-pai600-fai700-br": `linear-gradient(to bottom right, ${primitiveColors.pai[600]},  ${primitiveColors.fai[700]})`,
        "gradient-pai400-fai500-br": `linear-gradient(to bottom right, ${primitiveColors.pai[400]},  ${primitiveColors.fai[500]})`,
        "gradient-pai200-fai200-br": `linear-gradient(to bottom right, ${primitiveColors.pai[200]},  ${primitiveColors.fai[200]})`,
        "gradient-gray300-gray200-br": `linear-gradient(to bottom right, ${primitiveColors.gray[300]},  ${primitiveColors.gray[200]})`
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
  plugins: [
    plugin(({ addUtilities, theme }) => {
      const newUtilities = {
        ".gradient-pai400-fai500-br-opacity-60": {
          position: "relative",
          isolation: "isolate",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "0",
            "background-image": `linear-gradient(to bottom right, ${primitiveColors.pai[400]}, ${primitiveColors.fai[500]})`,
            opacity: "0.6",
            "z-index": "-1"
          }
        },
        ".gradient-gray300-gray200-br-opacity-60": {
          position: "relative",
          isolation: "isolate",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "0",
            "background-image": `linear-gradient(to bottom right, ${primitiveColors.gray[300]},  ${primitiveColors.gray[200]})`,
            opacity: "0.6",
            "z-index": "-1"
          }
        },
        // 아래 3가지 원형 그라디언트 속성
        // 1) 그라디언트 컨테이너
        ".gradient-container": {
          position: "relative",
          overflow: "hidden"
        },
        // 2) 그라디언트 부분
        ".gradient-ellipse": {
          "background-image": `radial-gradient(ellipse 20% 43% at center, ${theme("colors.pai.200")} -10%, ${theme(
            "colors.fai.100"
          )} 77%)`
        },
        // 3) 그라디언트 회전
        ".gradient-rotated": {
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          transform: "rotate(-33deg)"
        }
      };
      addUtilities(newUtilities, { respectPrefix: true, respectImportant: true });
    })
  ] as const
};
export default config;
