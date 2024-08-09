import NotificationsIcon from "../../assets/bell.alert.svg";
import Logo from "../Logo";
import CommonBtn from "../CommonBtn";

interface HeaderWithAlertProps {
  className?: string;
}

const HeaderWithAlert = ({ className }: HeaderWithAlertProps) => {
  const handleNotificationClick = () => {
    alert("아직 준비 중인 기능입니다!");
  };

  return (
    <div className={`flex flex-shrink-0 justify-between items-center h-[4.5rem] px-4 py-4 ${className}`}>
      <Logo />
      <CommonBtn icon={<NotificationsIcon />} onClick={handleNotificationClick} />
    </div>
  );
};

export default HeaderWithAlert;
