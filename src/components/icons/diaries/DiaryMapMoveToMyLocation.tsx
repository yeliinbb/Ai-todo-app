const DiaryMapMoveToMyLocation = ({
  getCurrentLocation,
  clasName
}: {
  getCurrentLocation: () => void;
  clasName?: string;
}) => {
  return (
    <svg
      width="54"
      height="54"
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${clasName} cursor-pointer`}
      onClick={getCurrentLocation}
    >
      <g filter="url(#filter0_d_1645_29808)">
        <rect x="5" y="4" width="44" height="44" rx="22" fill="white" fillOpacity="0.95" shapeRendering="crispEdges" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.5285 18.9289C21.4039 17.0536 23.9474 16 26.5996 16C29.2518 16 31.7953 17.0536 33.6707 18.9289C35.546 20.8043 36.5996 23.3478 36.5996 26C36.5996 27.3132 36.341 28.6136 35.8384 29.8268C35.3359 31.0401 34.5993 32.1425 33.6707 33.0711C32.7421 33.9997 31.6397 34.7362 30.4264 35.2388C29.2132 35.7413 27.9128 36 26.5996 36C25.2864 36 23.986 35.7413 22.7728 35.2388C21.5595 34.7362 20.4571 33.9997 19.5285 33.0711C18.6 32.1425 17.8634 31.0401 17.3608 29.8268C16.8583 28.6136 16.5996 27.3132 16.5996 26C16.5996 23.3478 17.6532 20.8043 19.5285 18.9289ZM26.5996 18C24.4779 18 22.443 18.8429 20.9428 20.3431C19.4425 21.8434 18.5996 23.8783 18.5996 26C18.5996 27.0506 18.8065 28.0909 19.2086 29.0615C19.6106 30.0321 20.1999 30.914 20.9428 31.6569C21.6856 32.3997 22.5675 32.989 23.5381 33.391C24.5087 33.7931 25.549 34 26.5996 34C27.6502 34 28.6905 33.7931 29.6611 33.391C30.6317 32.989 31.5136 32.3997 32.2565 31.6569C32.9993 30.914 33.5886 30.0321 33.9906 29.0615C34.3927 28.0909 34.5996 27.0506 34.5996 26C34.5996 23.8783 33.7568 21.8434 32.2565 20.3431C30.7562 18.8429 28.7213 18 26.5996 18Z"
          fill="#262627"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.5996 16C27.1519 16 27.5996 16.4477 27.5996 17V21C27.5996 21.5523 27.1519 22 26.5996 22C26.0473 22 25.5996 21.5523 25.5996 21V17C25.5996 16.4477 26.0473 16 26.5996 16Z"
          fill="#262627"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.5996 30C27.1519 30 27.5996 30.4477 27.5996 31V35C27.5996 35.5523 27.1519 36 26.5996 36C26.0473 36 25.5996 35.5523 25.5996 35V31C25.5996 30.4477 26.0473 30 26.5996 30Z"
          fill="#262627"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5996 26C16.5996 25.4477 17.0473 25 17.5996 25H21.5996C22.1519 25 22.5996 25.4477 22.5996 26C22.5996 26.5523 22.1519 27 21.5996 27H17.5996C17.0473 27 16.5996 26.5523 16.5996 26Z"
          fill="#262627"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30.5996 26C30.5996 25.4477 31.0473 25 31.5996 25H35.5996C36.1519 25 36.5996 25.4477 36.5996 26C36.5996 26.5523 36.1519 27 35.5996 27H31.5996C31.0473 27 30.5996 26.5523 30.5996 26Z"
          fill="#262627"
        />
        <path
          d="M27.5996 26C27.5996 26.5523 27.1519 27 26.5996 27C26.0473 27 25.5996 26.5523 25.5996 26C25.5996 25.4477 26.0473 25 26.5996 25C27.1519 25 27.5996 25.4477 27.5996 26Z"
          fill="#262627"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_1645_29808"
          x="0.2"
          y="0.4"
          width="53.6"
          height="53.6"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1.2" />
          <feGaussianBlur stdDeviation="2.4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1645_29808" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1645_29808" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};

export default DiaryMapMoveToMyLocation;
