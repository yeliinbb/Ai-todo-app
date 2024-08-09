interface ModalBtnProps {
  className: string;
  onClick: () => void;
  text: string;
}

const ModalBtn = ({ className, onClick, text }: ModalBtnProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-system-white px-6 py-2 rounded-full w-full transition text-sm font-extrabold flex justify-center items-center cursor-pointer ${className}`}
    >
      {text}
    </button>
  );
};

export default ModalBtn;
