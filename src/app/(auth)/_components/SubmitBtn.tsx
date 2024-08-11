type Propstype = {
  text: string;
  type: "button" | "submit";
  isDisabled?: boolean;
};

const SubmitBtn = ({ text, type, isDisabled }: Propstype) => {
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${text === "재발송" ? "min-w-[303px] min-h-[44px]" : "min-w-[343px] min-h-[52px]"} mt-[52px] px-7 py-3 rounded-[28px] text-base font-extrabold text-system-white hover:border hover:border-paiTrans-60032 ${isDisabled ? "bg-gray-300 border-none" : "bg-gradient-pai400-fai500-br"} active:bg-gradient-pai600-fai700-br`}
    >
      {text}
    </button>
  );
};

export default SubmitBtn;
