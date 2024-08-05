const AddContentBtn = ({ className }: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className={className}>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default AddContentBtn;
