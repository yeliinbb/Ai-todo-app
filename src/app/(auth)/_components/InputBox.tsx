import Email from "@/components/icons/authIcons/Email";
import Invisible from "@/components/icons/authIcons/Invisible";
import Nickname from "@/components/icons/authIcons/Nickname";
import Password from "@/components/icons/authIcons/Password";
import PasswordConfirm from "@/components/icons/authIcons/PasswordConfirm";
import Visible from "@/components/icons/authIcons/Visible";
import { Dispatch, SetStateAction } from "react";

type PropsType = {
  text: string;
  id: "nickname" | "email" | "password" | "passwordConfirm";
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error: Record<string, string>;
  hidePw?: boolean;
  setHidePw?: Dispatch<SetStateAction<boolean>>;
};

const InputBox = ({ text, id, type, value, onChange, placeholder, error, hidePw, setHidePw }: PropsType) => {
  const renderPrefixIcon = (id: "nickname" | "email" | "password" | "passwordConfirm") => {
    return (
      <div className="absolute left-4 top-[77%] -translate-y-5">
        {id === "nickname" && <Nickname />}
        {id === "email" && <Email />}
        {id === "password" && <Password />}
        {id === "passwordConfirm" && <PasswordConfirm />}
      </div>
    );
  };

  const renderPasswordShowIcon = (id: "nickname" | "email" | "password" | "passwordConfirm") => {
    if (id === "password" || id === "passwordConfirm") {
      return (
        <div
          className="absolute right-4 top-[77%] -translate-y-5 hover:cursor-pointer"
          onClick={() => setHidePw && setHidePw(!hidePw)}
        >
          {hidePw ? <Visible /> : <Invisible />}
        </div>
      );
    }
  };

  return (
    <div className="gap-1">
      <div className="gap-1 relative flex flex-col">
        <label
          htmlFor={id}
          className="min-w-[343px] min-h-[28px] mt-2 flex items-center self-stretch px-4 font-bold text-base text-gray-900"
        >
          {text}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`min-w-[343px] min-h-[60px] p-4 bg-grayTrans-20032 indent-9 rounded-[32px] font-bold text-base ${error[id] !== "" ? "text-system-error border border-system-error" : "text-gray-900"} focus:outline-pai-400 focus:text-pai-400 ${value.length !== 0 && " border border-gray-400"}`}
        />
        {renderPrefixIcon(id)}
        {renderPasswordShowIcon(id)}
      </div>
      <p className=" px-4 py-1 font-extrabold text-[12px] text-system-error">{error[id]}</p>
    </div>
  );
};

export default InputBox;
