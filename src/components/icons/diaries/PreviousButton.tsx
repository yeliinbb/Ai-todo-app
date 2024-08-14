const PreviousButton = ({ className, onClick }: { className?: string; onClick?: () => void }) => {
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" fill="white" />
      <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" stroke="#D8D8D9" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.3979 16.8515C26.7558 17.2095 26.7558 17.7899 26.3979 18.1479L21.546 22.9997L26.3979 27.8515C26.7558 28.2095 26.7558 28.7899 26.3979 29.1479C26.0399 29.5058 25.4595 29.5058 25.1015 29.1479L19.6015 23.6479C19.2435 23.2899 19.2435 22.7095 19.6015 22.3515L25.1015 16.8515C25.4595 16.4935 26.0399 16.4935 26.3979 16.8515Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default PreviousButton;
