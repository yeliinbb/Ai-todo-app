const QuillToolbarIconItalic = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      width="13"
      height="16"
      viewBox="7 3.6 13 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:text-fai-500 text-gray-500 transition-all"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 5.00026C7.5 4.44797 7.94772 4.00026 8.5 4.00026H19.5C20.0523 4.00026 20.5 4.44797 20.5 5.00026V6.00026C20.5 6.55254 20.0523 7.00026 19.5 7.00026C18.9477 7.00026 18.5 6.55254 18.5 6.00026H9.5C9.5 6.55254 9.05228 7.00026 8.5 7.00026C7.94772 7.00026 7.5 6.55254 7.5 6.00026V5.00026Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 19.0003C7.5 18.448 7.94772 18.0003 8.5 18.0003H12.5C13.0523 18.0003 13.5 18.448 13.5 19.0003C13.5 19.5525 13.0523 20.0003 12.5 20.0003H8.5C7.94772 20.0003 7.5 19.5525 7.5 19.0003Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7747 4.03873C15.3058 4.19046 15.6132 4.74394 15.4615 5.27498L11.4615 19.275C11.3098 19.806 10.7563 20.1135 10.2253 19.9618C9.69424 19.8101 9.38675 19.2566 9.53848 18.7255L13.5385 4.72554C13.6902 4.1945 14.2437 3.88701 14.7747 4.03873Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default QuillToolbarIconItalic;
