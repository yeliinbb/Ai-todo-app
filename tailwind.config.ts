import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const primitiveColors = {
  system: {
    black: "#000000",
    white: "#ffffff",
    red: "#FF334B",
    red200: "#FF001E",
    red300: "#CC0018",
    error: "#FF334B"
  },
  kakao: {
    line: "#665C00",
    default: "#FAE100",
    active: "#C7B300"
  },
  google: {
    line: "#093990",
    default: "#377AF3",
    active: "#0E5BE7"
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
  whiteTrans: {
    wh72: "#FFFFFF72",
    wh56: "#FFFFFF56",
    wh40: "#FFFFFF40"
  },
  grayTrans: {
    20032: "#D8D8D932",
    20060: "#D8D8D960",
    30080: "#BFBEC080",
    60080: "#72717580",
    90020: "#26262720",
    90052: "#26262752",
    90080: "#26262780"
  },
  paiTrans: {
    10080: "#E7E5FF80",
    40060: "#5B4DFF60",
    40080: "#5B4DFF80",
    60032: "#1200E532"
  },
  faiTrans: {
    50060: "#FF952460",
    20060: "#FFDFBD60",
    20080: "#FFDFBD80"
  },
  modalBg: {
    black40: "#00000040"
  }
};

type FontStyleValue = [string, { lineHeight: string; letterSpacing: string; fontWeight: string }];

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    screens: {
      mobile: "375px",
      desktop: "1200px"
    },
    colors: {
      ...primitiveColors,
      ...transparentColors,
      transparent: "transparent"
    },
    extend: {
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900"
      },
      fontSize: {
        // Head styles
        h1: ["1.625rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "800" }],
        h2: ["1.5rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "800" }],
        h3: ["1.375rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "800" }],
        h4: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "800" }],
        h5: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "800" }],
        h6: ["1rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "800" }],
        h7: ["0.875rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "800" }],

        // Sub head styles
        sh1: ["1.5rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "700" }],
        sh2: ["1.375rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "700" }],
        sh3: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "700" }],
        sh4: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "700" }],
        sh5: ["1rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "700" }],
        sh6: ["0.875rem", { lineHeight: "1.75rem", letterSpacing: "0.05rem", fontWeight: "700" }],

        // Body styles
        b1: ["1.375rem", { lineHeight: "1.875rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        b2: ["1.25rem", { lineHeight: "1.875rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        b3: ["1.125rem", { lineHeight: "1.875rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        b4: ["1rem", { lineHeight: "1.875rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        b5: ["0.875rem", { lineHeight: "1.875rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        b6: ["0.75rem", { lineHeight: "1.875rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        b7: ["0.625rem", { lineHeight: "1.875rem", letterSpacing: "0.05rem", fontWeight: "500" }],

        // Body-chat styles
        bc1: ["1.375rem", { lineHeight: "1.5rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        bc2: ["1.25rem", { lineHeight: "1.5rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        bc3: ["1.125rem", { lineHeight: "1.5rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        bc4: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        bc5: ["0.875rem", { lineHeight: "1.5rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        bc6: ["0.75rem", { lineHeight: "1.5rem", letterSpacing: "0.05rem", fontWeight: "500" }],
        bc7: ["0.625rem", { lineHeight: "1.5rem", letterSpacing: "0.05rem", fontWeight: "500" }],

        // Caption styles
        c1: ["0.75rem", { lineHeight: "1.25rem", letterSpacing: "0.05rem", fontWeight: "700" }],
        c2: ["0.625rem", { lineHeight: "1.25rem", letterSpacing: "0.05rem", fontWeight: "700" }]
      },
      backgroundImage: {
        "gradient-pai600-fai700-br": `linear-gradient(to bottom right, ${primitiveColors.pai[600]},  ${primitiveColors.fai[700]})`,
        "gradient-pai400-fai500-br": `linear-gradient(to bottom right, ${primitiveColors.pai[400]},  ${primitiveColors.fai[500]})`,
        "gradient-pai200-fai200-br": `linear-gradient(to bottom right, ${primitiveColors.pai[200]},  ${primitiveColors.fai[200]})`,
        "gradient-gray300-gray200-br": `linear-gradient(to bottom right, ${primitiveColors.gray[300]},  ${primitiveColors.gray[200]})`,
        "header-gradient": `linear-gradient(180deg, ${primitiveColors.gray[100]} 68.96%, ${primitiveColors.gray[100]}00 99.9%)`,
        "gradient-gray-white-lr": `linear-gradient(to right, #F6F6F6, ${primitiveColors.system.white})`,
        "header-white-gradient": `linear-gradient(180deg, ${primitiveColors.system.white} 55.27%, ${primitiveColors.system.white}00 99.9%)`
      },
      opacity: {
        "stroke-border": "0.95"
      },
      maxHeight: {
        "0": "0",
        screen: "100vh"
      },
      transitionProperty: {
        "max-height": "max-height"
      },
      fontFamily: {
        sans: ["SUIT", "sans-serif"], // 기본 sans-serif 폰트로 SUIT 설정
        custom: ["SUIT", "sans-serif"] // custom 클래스 유지
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      },
      height: {
        myPageList: "calc(100svh - 370px)"
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
    }),
    // 폰트 스타일 플러그인
    plugin(function ({ addUtilities, theme }) {
      const fontStyles = theme("fontSize") as Record<string, FontStyleValue>;
      const fontUtilities: Record<string, Record<string, string>> = {};

      Object.entries(fontStyles).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length === 2 && typeof value[1] === "object") {
          const [fontSize, styles] = value;
          fontUtilities[`.text-${key}`] = {
            fontSize,
            lineHeight: styles.lineHeight,
            letterSpacing: styles.letterSpacing,
            fontWeight: styles.fontWeight
          };
          fontUtilities[`.typo-${key}`] = {
            fontSize,
            lineHeight: styles.lineHeight,
            letterSpacing: styles.letterSpacing,
            fontWeight: styles.fontWeight
          };
        }
      });

      // 특별한 경우 처리: bc5-20
      fontUtilities[".text-bc5-20"] = {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        letterSpacing: "0.05rem",
        fontWeight: "500"
      };

      addUtilities(fontUtilities);
    }),
    plugin(function ({ addUtilities }) {
      const gradientTextUtilities = {
        ".gradient-text-pai400-fai500-br": {
          backgroundImage: `linear-gradient(to bottom right, ${primitiveColors.pai[400]}, ${primitiveColors.fai[500]})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }
      };

      addUtilities(gradientTextUtilities, { respectPrefix: true, respectImportant: true });
    }),
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide")
  ]
} satisfies Config;

export default config;
