import ChevronRight from "./ChevronRight";

interface CommonChatSystemButtonProps {
  onClick: (() => void) | (() => Promise<void>);
  disabled?: boolean;
  children: React.ReactNode;
}

const CommonChatSystemButton: React.FC<CommonChatSystemButtonProps> = ({ onClick, disabled = false, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-system-white border border-solid border-gray400 backdrop-blur-md text-gray-600 text-h7 pr-3 pl-5 py-1.5 rounded-full w-full flex justify-between items-center cursor-pointer"
    >
      <span>{children}</span>
      <ChevronRight width={16} height={16} fill="#A5A4A7" />
    </button>
  );
};

export default CommonChatSystemButton;
