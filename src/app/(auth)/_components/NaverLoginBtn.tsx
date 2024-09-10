import Naver from "@/components/icons/authIcons/Naver";

const NaverLoginBtn = () => {
  return (
    <div className="min-w-[44px] min-h-[44px] duration-200 flex justify-center box-border items-center rounded-full bg-naver-default hover:cursor-pointer hover:border hover:border-naver-line active:bg-naver-active active:border-none">
      <Naver />
    </div>
  );
};

export default NaverLoginBtn;
