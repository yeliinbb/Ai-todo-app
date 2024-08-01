type Propstype = {
  text: string;
};

const SubmitBtn = ({ text }: Propstype) => {
  return (
    <button type="submit" className="min-w-[343px] h-12 mt-7 mb-2.5 bg-gray-200 rounded-[10px] ">
      {text}
    </button>
  );
};

export default SubmitBtn;
