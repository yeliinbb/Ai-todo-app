const MyInfo = () => {
  return (
    <div className="w-full  flex flex-col justify-center items-center">
      <div className="md:w-8/12">
        <div className="min-w-[300px] min-h-[60px] flex flex-col justify-between mt-32 ml-10 font-bold">
          <h1 className="text-xl">르탄이님,</h1>
          <h3 className="text-base">당신의 하루를 늘 응원해요!</h3>
        </div>
        <div className="flex justify-center items-center min-w-[343px] h-32 mt-10 bg-slate-200 rounded-[20px] ">
          Todo Progress Bar
        </div>
        <ul className="mt-16">
          <li className="min-w-[310px] h-16 flex items-center indent-3 border-b-[1px] border-black">닉네임 변경</li>
          <li className="min-w-[310px] h-16 flex items-center indent-3 border-b-[1px] border-black">비밀번호 변경</li>
          <li className="min-w-[310px] h-16 flex items-center indent-3 border-b-[1px] border-black">로그아웃</li>
          <li className="min-w-[310px] h-16 flex items-center indent-3 border-b-[1px] border-black">회원탈퇴</li>
        </ul>
      </div>
    </div>
  );
};

export default MyInfo;
