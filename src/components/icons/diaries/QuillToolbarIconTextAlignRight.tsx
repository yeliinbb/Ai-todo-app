const QuillToolbarIconTextAlignRight = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      width="18"
      height="14"
      viewBox="7.7 9 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:text-fai-500 text-gray-500 transition-all"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 10C7.5 9.44772 7.94772 9 8.5 9H24.5C25.0523 9 25.5 9.44772 25.5 10C25.5 10.5523 25.0523 11 24.5 11H8.5C7.94772 11 7.5 10.5523 7.5 10ZM13.5 16C13.5 15.4477 13.9477 15 14.5 15H24.5C25.0523 15 25.5 15.4477 25.5 16C25.5 16.5523 25.0523 17 24.5 17H14.5C13.9477 17 13.5 16.5523 13.5 16ZM10.5 21C9.94772 21 9.5 21.4477 9.5 22C9.5 22.5523 9.94772 23 10.5 23H24.5C25.0523 23 25.5 22.5523 25.5 22C25.5 21.4477 25.0523 21 24.5 21H10.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default QuillToolbarIconTextAlignRight;
