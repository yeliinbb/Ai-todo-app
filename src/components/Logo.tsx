import Image from "next/image";

interface LogoProps {
  isFai?: boolean;
}

const Logo = ({ isFai }: LogoProps) => {
  return (
    <>
      {isFai ? (
        <Image src="/fai.svg" width={75} height={75} alt="logo" priority />
      ) : (
        <Image src="/pai.svg" width={75} height={75} alt="logo" priority />
      )}
    </>
  );
};

export default Logo;
