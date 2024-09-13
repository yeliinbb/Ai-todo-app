interface CommonChatFixedButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  className: string;
}

const CommonChatFixedButton = ({ onClick, disabled = false, children, className = "" }: CommonChatFixedButtonProps) => {
  const baseClassName =
    "bg-grayTrans-90020 px-6 py-3 backdrop-blur-xl rounded-2xl text-system-white w-full text-sh6 desktop:text-sh4 cursor-pointer";
  const disabledClassName = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button onClick={onClick} className={`${baseClassName} ${className} ${disabledClassName}`} disabled={disabled}>
      {children}
    </button>
  );
};

export default CommonChatFixedButton;
