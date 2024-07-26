import { IoPerson } from "react-icons/io5";

const EditNicknamePage = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="md:w-8/12">
        <div className="min-w-[343px] flex flex-col relative justify-between mt-16 ml-8 mr-8 font-bold">
          <h1 className="text-sm mb-2.5">이메일</h1>
          <div className="">
            <IoPerson className=" w-[18px] h-[18px] absolute left-3.5 top-1/3 -translate-y-1/3" />
            <p className="ml-12">welcome@example.com</p>
          </div>
          <input
            id="nickname"
            type="text"
            placeholder="영문, 한글, 숫자 2~10자"
            className="min-w-[340px] h-10 mt-1 mb-5 bg-slate-200 indent-10 rounded-[10px] focus:outline-none"
          />
          <p className="absolute top-20 left-2 -translate-y-3 text-[12px] text-red-500">ㅎㅎ</p>
          <button className="min-w-[340px] w-full h-12 mt-96 mb-2.5 absolute top-52 -translate-y-2  bg-slate-200 rounded-[10px]">
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNicknamePage;
