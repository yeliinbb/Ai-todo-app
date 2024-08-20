interface ModalBtnProps {
  className: string;
  onClick: () => void;
  text: string;
}

const ModalBtn = ({ className, onClick, text }: ModalBtnProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full w-full transition text-bc4 flex justify-center items-center cursor-pointer border-transparent border-2 disabled:text-system-white desktop:text-h5 ${className} box-border`}
    >
      {text}
    </button>
  );
};

export default ModalBtn;
