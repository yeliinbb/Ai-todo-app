const DiaryCurrentLocation = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      width="35"
      height="35"
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="cursor-pointer"
    >
      <g clipPath="url(#clip0_1645_29805)">
        <g filter="url(#filter0_d_1645_29805)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.2793 2.87988C14.7161 2.87988 12.2105 3.62197 10.0792 5.0123C7.94797 6.40264 6.28686 8.37877 5.30593 10.6908C4.325 13.0029 4.06831 15.547 4.56832 18.0015C5.06833 20.456 6.30273 22.7107 8.11515 24.4803L14.2269 30.446C15.0369 31.2361 16.1351 31.6799 17.2801 31.6799C18.425 31.6799 19.5237 31.2356 20.3337 30.4455L26.4437 24.4802C28.2561 22.7106 29.4903 20.456 29.9904 18.0015C30.4904 15.547 30.2337 13.0029 29.2527 10.6908C28.2718 8.37877 26.6107 6.40264 24.4795 5.0123C22.3482 3.62197 19.8426 2.87988 17.2793 2.87988ZM14.2246 18.8946C13.4145 18.0844 12.9593 16.9856 12.9593 15.8399C12.9593 14.6941 13.4145 13.5953 14.2246 12.7852C15.0348 11.975 16.1336 11.5199 17.2793 11.5199C18.4251 11.5199 19.5239 11.975 20.334 12.7852C21.1442 13.5953 21.5993 14.6941 21.5993 15.8399C21.5993 16.9856 21.1442 18.0844 20.334 18.8946C19.5239 19.7047 18.4251 20.1599 17.2793 20.1599C16.1336 20.1599 15.0348 19.7047 14.2246 18.8946Z"
            fill="#FF334B"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_1645_29805"
          x="-0.000664234"
          y="0.719883"
          width="34.5599"
          height="37.4398"
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
          <feOffset dy="2.16" />
          <feGaussianBlur stdDeviation="2.16" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1645_29805" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1645_29805" result="shape" />
        </filter>
        <clipPath id="clip0_1645_29805">
          <rect width="34.56" height="34.56" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DiaryCurrentLocation;
