import RoundNextBtn from "@/components/icons/myPage/RoundNextBtn";

const MyInfoSkeleton = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center mt-5 h-full">
        <div className="animate-pulse h-[calc(100vh-105px)]">
          <div className="min-w-[343px] min-h-[60px] flex flex-col justify-between">
            <h1 className="desktop:text-[32px] desktop:mt-52 w-full text-[22px] text-gray-300 font-bold leading-7">
              로그인 후,
            </h1>
            <h1 className="desktop:text-[32px] desktop:mt-8 w-full text-[22px] text-gray-300 font-bold leading-7">
              서비스 이용이 가능합니다
            </h1>
          </div>
          <div
            className={`desktop:min-w-[580px] desktop:rounded-[40px] desktop:mt-11 flex flex-col justify-center relative px-5 py-4 min-w-[347px] min-h-[76px] mt-7 bg-system-white border-2 border-gray-200 rounded-[32px] text-gray-400`}
          >
            <h1 className="desktop:text-[22px] text-gray-300 font-extrabold text-lg leading-7 z-10">로그인 하러가기</h1>
            <div className="absolute right-5 top-5 -translate-y-0.5">
              <RoundNextBtn />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="w-full h-full">
        <div className="animate-pulse md:w-8/12 flex flex-col justify-center items-center mt-5 h-full">
          <div className="desktop:min-w-[580px] desktop:mt-5 animate-pulse min-w-[343px] min-h-[60px] flex flex-col justify-between ">
            <h1 className="desktop:text-[32px] desktop:font-extrabold w-full text-[22px] text-gray-300 font-bold leading-7">
              회원님,
            </h1>
            <h3 className="desktop:text-[24px] desktop:mt-5 text-lg text-gray-300 font-bold leading-7">
              당신의 하루를 늘 응원해요!
            </h3>
          </div>
          <div className="desktop:mt-32 min-h-[180px] flex justify-center items-end">
            <SkeletonBar />
          </div>
          <div
            style={{ boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.16)" }}
            className="desktop:max-w-[580px] desktop:mt-10 desktop:px-5 desktop:rounded-t-[60px] w-full min-h-[480px] max-w-[390px] mt-5 pt-5 px-4 rounded-t-[48px] bg-system-white h-full"
          >
            <h1 className="desktop:text-[26px] desktop:my-3 desktop:leading-7 min-w-[343px] h-7 flex items-center pl-3 text-gray-300 font-extrabold text-base">
              설정
            </h1>
            <ul>
              <li
                className={`desktop:min-h-[92px] relative min-w-[343px] h-16 flex items-center px-3 py-5 border-b-[1px] border-gray-100 text-gray-300 `}
              >
                <div className="desktop:hidden block">
                  <EmailSmall />
                </div>
                <div className="desktop:block hidden">
                  <Email />
                </div>
                <p className="desktop:text-[22px] desktop:ml-2 desktop:mb-0.5 flex items-center h-[28px] ml-1 text-gray-300  font-medium text-base">
                  이메일 계정
                </p>
              </li>
              <li className="desktop:h-[92px] relative min-w-[343px] h-16 flex items-center px-3 py-5 border-b-[1px] border-gray-100 duration-200 text-gray-300">
                <div className="desktop:hidden block">
                  <NicknameSmall />
                </div>
                <div className="desktop:block hidden">
                  <Nickname />
                </div>
                <p className="desktop:text-[22px] desktop:ml-2 desktop:mb-0.5 flex items-center h-[28px] ml-1 text-gray-300  font-medium text-base">
                  닉네임 변경
                </p>
                <div className="desktop:right-3 absolute right-2">
                  <div className="desktop:hidden block">
                    <NextBtn />
                  </div>
                  <div className="desktop:block hidden">
                    <NextLargeBtn />
                  </div>
                </div>
              </li>
              <li className="desktop:h-[92px] relative min-w-[343px] h-16 flex items-center px-3 py-5 border-b-[1px]  border-gray-100 duration-200 text-gray-300">
                <div className="desktop:hidden block">
                  <PasswordSmall />
                </div>
                <div className="desktop:block hidden">
                  <Password />
                </div>
                <p className="desktop:text-[22px] desktop:ml-2 desktop:mb-0.5 flex items-center h-[28px] ml-1 text-gray-300  font-medium text-base">
                  비밀번호 변경
                </p>
                <div className="desktop:right-3 absolute right-2">
                  <div className="desktop:hidden block">
                    <NextBtn />
                  </div>
                  <div className="desktop:block hidden">
                    <NextLargeBtn />
                  </div>
                </div>
              </li>
              <li className="desktop:h-[92px] desktop:mt-10 relative min-w-[343px] h-16 mt-5 flex items-center px-3 py-5 border-b-[1px]  border-gray-100 duration-200 text-gray-800 font-medium text-base">
                <p className="desktop:text-[22px] text-gray-300  font-medium text-base">로그아웃</p>
                <div className="desktop:right-3 absolute right-2">
                  <div className="desktop:hidden block">
                    <NextBtn />
                  </div>
                  <div className="desktop:block hidden">
                    <NextLargeBtn />
                  </div>
                </div>
              </li>
              <li className="desktop:h-[92px] relative min-w-[343px] h-16 flex items-center px-3 py-5 border-b-[1px]  border-gray-100 duration-200 text-gray-800 font-medium text-base">
                <p className="desktop:text-[22px] text-gray-300  font-medium text-base">회원탈퇴</p>
                <div className="desktop:right-3 absolute right-2">
                  <div className="desktop:hidden block">
                    <NextBtn />
                  </div>
                  <div className="desktop:block hidden">
                    <NextLargeBtn />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default MyInfoSkeleton;
