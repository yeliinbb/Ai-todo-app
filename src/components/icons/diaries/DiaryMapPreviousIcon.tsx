const DiaryMapPreviousIcon = ({ handlePrevPage }: { handlePrevPage: () => void }) => {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handlePrevPage}
      className="cursor-pointer"
    >
      <g filter="url(#filter0_bi_1645_29844)">
        <rect width="56" height="56" rx="28" fill="white" />
        <rect x="0.5" y="0.5" width="55" height="55" rx="27.5" stroke="white" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M31.7071 21.2929C32.0976 21.6834 32.0976 22.3166 31.7071 22.7071L26.4142 28L31.7071 33.2929C32.0976 33.6834 32.0976 34.3166 31.7071 34.7071C31.3166 35.0976 30.6834 35.0976 30.2929 34.7071L24.2929 28.7071C23.9024 28.3166 23.9024 27.6834 24.2929 27.2929L30.2929 21.2929C30.6834 20.9024 31.3166 20.9024 31.7071 21.2929Z"
          fill="#58585B"
        />
      </g>
      <defs>
        <filter
          id="filter0_bi_1645_29844"
          x="-60"
          y="-60"
          width="176"
          height="176"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="30" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1645_29844" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1645_29844" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.74902 0 0 0 0 0.745098 0 0 0 0 0.752941 0 0 0 0.8 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1645_29844" />
        </filter>
      </defs>
    </svg>
  );
};

export default DiaryMapPreviousIcon;
