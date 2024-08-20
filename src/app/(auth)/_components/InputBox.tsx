import Email from "@/components/icons/authIcons/Email";
import Invisible from "@/components/icons/authIcons/Invisible";
import Nickname from "@/components/icons/authIcons/Nickname";
import Password from "@/components/icons/authIcons/Password";
import PasswordConfirm from "@/components/icons/authIcons/PasswordConfirm";
import Visible from "@/components/icons/authIcons/Visible";
import InputValueDelete from "@/components/icons/myPage/InputValueDelete";
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
  setNickname?: (nickname: string) => void;
};

const InputBox = ({
  text,
  id,
  type,
  value,
  onChange,
  placeholder,
  error,
  hidePw,
  setHidePw,
  setNickname
}: PropsType) => {
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
    if (text.includes("현재 닉네임")) {
      return (
        <div
          className="absolute right-4 top-[77%] -translate-y-[21px] hover:cursor-pointer"
          onClick={() => setNickname && setNickname("")}
        >
          <InputValueDelete />
        </div>
      );
    }
  };

  const maxLength = id === "nickname" ? 10 : id === "password" || id === "passwordConfirm" ? 12 : undefined;

  return (
    <div className="gap-1">
      <div className="gap-1 relative flex flex-col">
        <label
          htmlFor={id}
          className="desktop:min-w-[580px] desktop:text-xl w-[21.438rem] h-[1.75rem] min-w-[343px] min-h-[28px] mt-2 flex items-center self-stretch px-4 font-bold text-base text-gray-900"
        >
          {text}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`desktop:min-w-[580px] desktop:text-xl w-[21.438rem] h-[3.75rem] min-w-[343px] min-h-[60px] p-4  border border-gray-400 indent-9 rounded-[32px] font-bold text-base ${error[id] !== "" ? "text-system-error border border-system-error" : "text-gray-900"} focus:outline-pai-400 focus:text-pai-400 ${value?.length !== 0 && "bg-pai-100"} `}
        />
        {renderPrefixIcon(id)}
        {renderPasswordShowIcon(id)}
      </div>
      <p className="desktop:mb-10 desktop:text-sm px-4 py-1 font-extrabold text-xs text-system-error">{error[id]}</p>
    </div>
  );
};

export default InputBox;
