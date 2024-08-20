import UserIcon from "../../assets/user.svg";
import Logo from "../Logo";
import CommonBtn from "../CommonBtn";

interface HeaderWithAlertProps {
  className?: string;
  onClick?: () => void;
}

const HeaderWithAlert = ({ className, onClick }: HeaderWithAlertProps) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-10  flex flex-shrink-0 justify-between items-center h-[4.5rem] desktop:h-[5.375rem] px-4 pt-2 pb-5 ${className}`}
    >
      <Logo type="main" />
      <CommonBtn icon={<UserIcon />} onClick={onClick} />
    </div>
  );
};

export default HeaderWithAlert;
