const QuillToolbarIconUnderline = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="8 7.8 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:text-fai-500 text-gray-500 transition-all"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.3041 17.2058C13.8219 16.727 13.5 15.9972 13.5 15V9C13.5 8.44771 13.0523 8 12.5 8C11.9477 8 11.5 8.44771 11.5 9V15C11.5 16.444 11.9775 17.7142 12.895 18.6251C13.8113 19.5349 15.0795 20 16.5 20C17.9205 20 19.1887 19.5349 20.105 18.6251C21.0225 17.7142 21.5 16.444 21.5 15V9C21.5 8.44771 21.0523 8 20.5 8C19.9477 8 19.5 8.44771 19.5 9V15C19.5 15.9972 19.1782 16.727 18.6959 17.2058C18.2125 17.6858 17.4808 18 16.5 18C15.5192 18 14.7875 17.6858 14.3041 17.2058Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 23C8.5 22.4477 8.94772 22 9.5 22H23.5C24.0523 22 24.5 22.4477 24.5 23C24.5 23.5523 24.0523 24 23.5 24H9.5C8.94772 24 8.5 23.5523 8.5 23Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default QuillToolbarIconUnderline;
