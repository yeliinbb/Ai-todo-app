const MypageTap = ({ isSelected }: { isSelected: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <path
        fill={isSelected ? "#fff" : "#262627"}
        fillRule="evenodd"
        d="M7.536 1.221a11.667 11.667 0 1 1 8.929 21.558A11.667 11.667 0 0 1 7.535 1.22Zm11.599 16.796a9.333 9.333 0 1 0-14.269.001A5.834 5.834 0 0 1 9.667 15.5h4.666a5.834 5.834 0 0 1 4.802 2.517ZM6.613 19.622a3.501 3.501 0 0 1 3.054-1.789h4.667a3.5 3.5 0 0 1 3.054 1.788A9.342 9.342 0 0 1 12 21.333a9.334 9.334 0 0 1-5.387-1.711ZM8.7 6.367a4.667 4.667 0 1 1 6.6 6.6 4.667 4.667 0 0 1-6.6-6.6Zm3.3.966A2.333 2.333 0 1 0 12 12a2.333 2.333 0 0 0 0-4.667Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default MypageTap;
