const QuillToolbarIconBold = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      width="12.5"
      height="16"
      viewBox="10 8 12.5 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:text-fai-500 text-gray-500 transition-all"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5 8C10.9477 8 10.5 8.44772 10.5 9V16V23C10.5 23.5523 10.9477 24 11.5 24H18.5C19.6935 24 20.8381 23.5259 21.682 22.682C22.5259 21.8381 23 20.6935 23 19.5C23 18.3065 22.5259 17.1619 21.682 16.318C21.4031 16.0391 21.0914 15.8006 20.7559 15.6063C21.5535 14.7703 22 13.6582 22 12.5C22 11.3065 21.5259 10.1619 20.682 9.31802C19.8381 8.47411 18.6935 8 17.5 8H11.5ZM17.5 17H12.5V22H18.5C19.163 22 19.7989 21.7366 20.2678 21.2678C20.7366 20.7989 21 20.163 21 19.5C21 18.837 20.7366 18.2011 20.2678 17.7322C19.7989 17.2634 19.163 17 18.5 17H17.5ZM17.5 15C18.163 15 18.7989 14.7366 19.2678 14.2678C19.7366 13.7989 20 13.163 20 12.5C20 11.837 19.7366 11.2011 19.2678 10.7322C18.7989 10.2634 18.163 10 17.5 10H12.5V15H17.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default QuillToolbarIconBold;
