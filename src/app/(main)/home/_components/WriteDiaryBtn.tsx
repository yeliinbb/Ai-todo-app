const WriteDiaryBtn = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none">
      <g filter="url(#a)">
        <path
          fill="#FF9524"
          fillOpacity=".6"
          d="M0 26C0 11.64 11.64 0 26 0s26 11.64 26 26-11.64 26-26 26S0 40.36 0 26Z"
        />
        <path
          stroke="#FFF8F0"
          d="M.5 26C.5 11.917 11.917.5 26 .5S51.5 11.917 51.5 26 40.083 51.5 26 51.5.5 40.083.5 26Z"
        />
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M16.571 18.828c0-1.246 1.066-2.256 2.381-2.256h12.381c1.315 0 2.381 1.01 2.381 2.256v12.631c0 1.246-1.066 2.256-2.38 2.256H18.951c-1.315 0-2.38-1.01-2.38-2.256V18.828Zm2.143 11.73c-.657 0-1.19.504-1.19 1.127s.533 1.128 1.19 1.128h12.143c1.052 0 1.905-.808 1.905-1.805v-.45H18.714Zm-1.666 1.127c0-.872.746-1.579 1.666-1.579h14.048c.263 0 .476.202.476.451v.451c0 1.246-1.066 2.256-2.381 2.256H18.714c-.92 0-1.666-.707-1.666-1.579Zm4.523-8.797c-.394 0-.714.303-.714.677 0 .373.32.676.714.676h9.048c.394 0 .714-.302.714-.676 0-.374-.32-.677-.714-.677H21.57Zm-.714-2.481c0-.374.32-.677.714-.677h9.048c.394 0 .714.303.714.677 0 .374-.32.677-.714.677H21.57c-.394 0-.714-.303-.714-.677ZM18.952 17.7a.232.232 0 0 0-.238-.226.232.232 0 0 0-.238.226v11.73c0 .124.107.225.238.225a.232.232 0 0 0 .238-.226V17.7Z"
          clipRule="evenodd"
        />
        <path
          fill="url(#b)"
          d="M20.857 20.407c0-.374.32-.677.714-.677h9.048c.394 0 .714.303.714.677 0 .374-.32.677-.714.677H21.57c-.394 0-.714-.303-.714-.677Z"
        />
        <path
          fill="url(#c)"
          d="M20.857 23.565c0-.373.32-.676.714-.676h9.048c.394 0 .714.303.714.676 0 .374-.32.677-.714.677H21.57c-.394 0-.714-.303-.714-.677Z"
        />
        <path
          fill="#572D00"
          fillRule="evenodd"
          d="M27.714 32c0-.591.48-1.07 1.071-1.07h6.43a1.071 1.071 0 1 1 0 2.142h-6.43c-.591 0-1.071-.48-1.071-1.071Z"
          clipRule="evenodd"
        />
        <path
          fill="#572D00"
          fillRule="evenodd"
          d="M32 27.715c.592 0 1.071.48 1.071 1.071v6.43a1.071 1.071 0 0 1-2.143 0v-6.43c0-.591.48-1.071 1.072-1.071Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <linearGradient id="b" x1="22.469" x2="22.684" y1="19.753" y2="21.619" gradientUnits="userSpaceOnUse">
          <stop offset=".1" stopColor="#FF9524" />
          <stop offset=".9" stopColor="#5B4DFF" />
        </linearGradient>
        <linearGradient id="c" x1="22.469" x2="22.684" y1="22.911" y2="24.777" gradientUnits="userSpaceOnUse">
          <stop offset=".1" stopColor="#5B4DFF" />
          <stop offset=".9" stopColor="#FF9524" />
        </linearGradient>
        <filter
          id="a"
          width="172"
          height="172"
          x="-60"
          y="-60"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="30" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_3088_1499" />
          <feBlend in="SourceGraphic" in2="effect1_backgroundBlur_3088_1499" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};

export default WriteDiaryBtn;
