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
      className="bg-grayTrans-20060 backdrop-blur-3xl text-gray-600 font-semibold text-sm pr-3 pl-5 py-2 rounded-full w-full flex justify-between items-center cursor-pointer"
    >
      <span>{children}</span>
      <ChevronRight width={16} height={16} />
    </button>
  );
};

export default CommonChatSystemButton;
