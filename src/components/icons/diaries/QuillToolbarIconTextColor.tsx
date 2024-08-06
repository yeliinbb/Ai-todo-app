const QuillToolbarIconTextColor = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      width="18"
      height="16"
      viewBox="7.7 8 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:text-fai-500 text-gray-500 transition-all"
      onClick={onClick}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 9C7.5 8.44772 7.94772 8 8.5 8H22.5C23.0523 8 23.5 8.44772 23.5 9V11C23.5 11.5523 23.0523 12 22.5 12C21.9477 12 21.5 11.5523 21.5 11V10H9.5V11C9.5 11.5523 9.05228 12 8.5 12C7.94772 12 7.5 11.5523 7.5 11V9Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5 8C16.0523 8 16.5 8.44772 16.5 9V23C16.5 23.5523 16.0523 24 15.5 24C14.9477 24 14.5 23.5523 14.5 23V9C14.5 8.44772 14.9477 8 15.5 8Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 23C12.5 22.4477 12.9477 22 13.5 22H17.5C18.0523 22 18.5 22.4477 18.5 23C18.5 23.5523 18.0523 24 17.5 24H13.5C12.9477 24 12.5 23.5523 12.5 23Z"
        fill="currentColor"
      />
      <path
        d="M20.5 19.8333C20.5 19.6123 20.5878 19.4004 20.7441 19.2441C20.9004 19.0878 21.1123 19 21.3333 19H24.6667C24.8877 19 25.0996 19.0878 25.2559 19.2441C25.4122 19.4004 25.5 19.6123 25.5 19.8333V23.1667C25.5 23.3877 25.4122 23.5996 25.2559 23.7559C25.0996 23.9122 24.8877 24 24.6667 24H21.3333C21.1123 24 20.9004 23.9122 20.7441 23.7559C20.5878 23.5996 20.5 23.3877 20.5 23.1667V19.8333Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default QuillToolbarIconTextColor;
