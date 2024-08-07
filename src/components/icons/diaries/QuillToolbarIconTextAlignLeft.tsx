const QuillToolbarIconTextAlignLeft = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      width="18"
      height="14"
      viewBox="7 9 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:text-fai-500 text-gray-500 transition-all"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 10C7.5 9.44772 7.94772 9 8.5 9H24.5C25.0523 9 25.5 9.44772 25.5 10C25.5 10.5523 25.0523 11 24.5 11H8.5C7.94772 11 7.5 10.5523 7.5 10ZM7.5 16C7.5 15.4477 7.94772 15 8.5 15H18.5C19.0523 15 19.5 15.4477 19.5 16C19.5 16.5523 19.0523 17 18.5 17H8.5C7.94772 17 7.5 16.5523 7.5 16ZM8.5 21C7.94772 21 7.5 21.4477 7.5 22C7.5 22.5523 7.94772 23 8.5 23H22.5C23.0523 23 23.5 22.5523 23.5 22C23.5 21.4477 23.0523 21 22.5 21H8.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default QuillToolbarIconTextAlignLeft;
