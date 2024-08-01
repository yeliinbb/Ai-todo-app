type Propstype = {
  text: string;
};

const SubmitBtn = ({ text }: Propstype) => {
  return (
    <button
      type="submit"
      className="min-w-[343px] min-h-[52px] mt-[52px] px-7 py-3 bg-gradient-pai400-fai500-br rounded-[28px] text-base font-extrabold text-system-white "
    >
      {text}
    </button>
  );
};

export default SubmitBtn;
