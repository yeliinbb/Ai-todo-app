const QuillToolbarIconLIst = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      width="17"
      height="14"
      viewBox="8.6 9 17 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:text-fai-500 text-gray-500 transition-all"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 10C12.5 9.44772 12.9477 9 13.5 9H24.5C25.0523 9 25.5 9.44772 25.5 10C25.5 10.5523 25.0523 11 24.5 11H13.5C12.9477 11 12.5 10.5523 12.5 10Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 16C12.5 15.4477 12.9477 15 13.5 15H24.5C25.0523 15 25.5 15.4477 25.5 16C25.5 16.5523 25.0523 17 24.5 17H13.5C12.9477 17 12.5 16.5523 12.5 16Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 22C12.5 21.4477 12.9477 21 13.5 21H24.5C25.0523 21 25.5 21.4477 25.5 22C25.5 22.5523 25.0523 23 24.5 23H13.5C12.9477 23 12.5 22.5523 12.5 22Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 9C10.0523 9 10.5 9.44772 10.5 10V10.01C10.5 10.5623 10.0523 11.01 9.5 11.01C8.94772 11.01 8.5 10.5623 8.5 10.01V10C8.5 9.44772 8.94772 9 9.5 9Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 15C10.0523 15 10.5 15.4477 10.5 16V16.01C10.5 16.5623 10.0523 17.01 9.5 17.01C8.94772 17.01 8.5 16.5623 8.5 16.01V16C8.5 15.4477 8.94772 15 9.5 15Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 21C10.0523 21 10.5 21.4477 10.5 22V22.01C10.5 22.5623 10.0523 23.01 9.5 23.01C8.94772 23.01 8.5 22.5623 8.5 22.01V22C8.5 21.4477 8.94772 21 9.5 21Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default QuillToolbarIconLIst;
