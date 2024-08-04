import NotificationsIcon from "../assets/bell.alert.svg";
import Logo from "./Logo";
import CommonBtn from "./CommonBtn";

const HeaderWithAlert = () => {
  return (
    <div className="flex flex-shrink-0 justify-between items-center h-[4.5rem] px-4 py-2 bg-gray-100 mb-2">
      <Logo />
      <CommonBtn icon={<NotificationsIcon />} />
    </div>
  );
};

export default HeaderWithAlert;
