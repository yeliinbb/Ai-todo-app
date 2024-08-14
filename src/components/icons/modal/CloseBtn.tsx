const CloseBtn = ({
  btnStyle,
  onClick,
  style
}: {
  btnStyle: string;
  onClick: () => void;
  style?: { top: number; left: number };
}) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="12 12 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={btnStyle}
      onClick={onClick}
      style={style}
    >
      <g filter="url(#filter0_b_1584_11126)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.1488 18.6483C29.5068 18.2904 29.5068 17.71 29.1488 17.352C28.7909 16.994 28.2105 16.994 27.8525 17.352L23.0007 22.2038L18.1488 17.352C17.7909 16.994 17.2105 16.994 16.8525 17.352C16.4945 17.71 16.4945 18.2904 16.8525 18.6483L21.7043 23.5002L16.8525 28.352C16.4945 28.71 16.4945 29.2904 16.8525 29.6483C17.2105 30.0063 17.7909 30.0063 18.1488 29.6483L23.0007 24.7965L27.8525 29.6483C28.2105 30.0063 28.7909 30.0063 29.1488 29.6483C29.5068 29.2904 29.5068 28.71 29.1488 28.352L24.297 23.5002L29.1488 18.6483Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <filter
          id="filter0_b_1584_11126"
          x="-26"
          y="-25.5"
          width="98"
          height="98"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="13" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1584_11126" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1584_11126" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};

export default CloseBtn;
