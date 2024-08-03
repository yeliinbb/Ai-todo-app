import Alert from "./Alert";
import Logo from "./Logo";

const HeaderWithAlert = () => {
  return (
    <div className="flex justify-between items-center h-[4.5rem] px-4 py-2 bg-gray-100 mb-2">
      <Logo />
      <Alert />
    </div>
  );
};

export default HeaderWithAlert;
