import NotificationsIcon from "../assets/bell.alert.svg";
import Logo from "./Logo";
import CommonBtn from "./CommonBtn";

interface HeaderWithAlertProps {
  className?: string;
}

const HeaderWithAlert = ({ className }: HeaderWithAlertProps) => {
  return (
    <div className={`flex flex-shrink-0 justify-between items-center h-[4.5rem] px-4 py-4 ${className}`}>
      <Logo />
      <CommonBtn icon={<NotificationsIcon />} />
    </div>
  );
};

export default HeaderWithAlert;
