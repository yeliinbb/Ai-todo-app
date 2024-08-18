import Image from "next/image";

const LoadingSpinnerSmall = () => {
  return (
    <>
      <Image alt="로딩 중" src="/loadingSpinner.gif" width={25} height={25} priority />
      {/* <p>로딩 중...</p> */}
    </>
  );
};

export default LoadingSpinnerSmall;
