import React from "react";

interface BoxIconSendProps {
  width?: number;
  height?: number;
}

const BoxIconSend: React.FC<BoxIconSendProps> = ({ width = 68, height = 68 }) => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_b_623_20293)">
      <path
        d="M0 34C0 15.2223 15.2223 0 34 0C52.7777 0 68 15.2223 68 34C68 52.7777 52.7777 68 34 68C15.2223 68 0 52.7777 0 34Z"
        fill="#262627"
        fillOpacity="0.8"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45.325 22.6747C45.7806 23.1303 45.7806 23.869 45.325 24.3246L32.4916 37.158C32.036 37.6136 31.2973 37.6136 30.8417 37.158C30.3861 36.7024 30.3861 35.9637 30.8417 35.5081L43.675 22.6747C44.1307 22.2191 44.8693 22.2191 45.325 22.6747Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45.325 22.6747C45.6448 22.9946 45.7509 23.4705 45.5973 23.896L38.014 44.896C38.003 44.9264 37.9907 44.9563 37.9773 44.9857C37.833 45.3005 37.6014 45.5673 37.31 45.7543C37.0186 45.9413 36.6796 46.0407 36.3333 46.0407C35.9871 46.0407 35.6481 45.9413 35.3567 45.7543C35.0722 45.5718 34.8448 45.3133 34.6999 45.0083L30.7971 37.2026L22.9915 33.2998C22.6865 33.155 22.428 32.9275 22.2454 32.643C22.0584 32.3516 21.959 32.0126 21.959 31.6664C21.959 31.3201 22.0584 30.9811 22.2454 30.6897C22.4324 30.3983 22.6992 30.1667 23.014 30.0224C23.0434 30.009 23.0733 29.9967 23.1037 29.9857L44.1037 22.4024C44.5292 22.2488 45.0051 22.3549 45.325 22.6747ZM25.1004 31.7455L32.1884 35.2895C32.4142 35.4024 32.5973 35.5855 32.7102 35.8113L36.2542 42.8993L42.5585 25.4412L25.1004 31.7455Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_b_623_20293"
        x="-26"
        y="-26"
        width="120"
        height="120"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="13" />
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_623_20293" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_623_20293" result="shape" />
      </filter>
    </defs>
  </svg>
);

export default BoxIconSend;
