const PreviousButton = ({ className, onClick }: { className?: string; onClick?: () => void }) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="#000"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.3979 4.85149C14.7558 5.20947 14.7558 5.78988 14.3979 6.14786L9.54604 10.9997L14.3979 15.8515C14.7558 16.2095 14.7558 16.7899 14.3979 17.1479C14.0399 17.5058 13.4595 17.5058 13.1015 17.1479L7.60149 11.6479C7.24351 11.2899 7.24351 10.7095 7.60149 10.3515L13.1015 4.85149C13.4595 4.49351 14.0399 4.49351 14.3979 4.85149Z"
        fill="#000"
      />
    </svg>
  );
};


export default PreviousButton;
