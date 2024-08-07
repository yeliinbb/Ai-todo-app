import Image from "next/image";

const Logo = () => {
  return <Image src="/logo.svg" width={75} height={75} alt="logo" priority />;
};

export default Logo;
