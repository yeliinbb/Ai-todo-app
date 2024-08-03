import Image from "next/image";

const Logo = () => {
  return <Image src="/logo.svg" width={100} height={100} alt="logo" priority />;
};

export default Logo;
