import Image from "next/image";

const LoadingSpinnerSmall = () => {
  return (
    <div>
      <Image alt="로딩 중" src="/LoadingSpinner.gif" width={25} height={25} priority />
    </div>
  );
};

export default LoadingSpinnerSmall;
