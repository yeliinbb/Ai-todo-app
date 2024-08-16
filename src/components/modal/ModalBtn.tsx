interface ModalBtnProps {
  className: string;
  onClick: () => void;
  text: string;
}

const ModalBtn = ({ className, onClick, text }: ModalBtnProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-full w-full transition text-sm font-extrabold flex justify-center items-center cursor-pointer border-2 hover:border-2 hover:border-solid disabled:bg-gradient-gray300-gray200-br disabled:text-system-white desktop:text-h5 ${className} box-border`}
    >
      {text}
    </button>
  );
};

export default ModalBtn;
