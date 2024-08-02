import { Auth } from "@/types/auth.type";
import { emailReg, nicknameReg, passwordReg } from "@/lib/utils/auth/authValidation";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const { nickname, email, password, passwordConfirm, isOAuth }: Auth = await request.json();
    // 에러가 하나라도 존재하면 에러메세지 객체 리턴
    const errorMessage = {
      nickname: "",
      email: "",
      password: "",
      passwordConfirm: ""
    };

    // 닉네임 유효성 검사
    if (!nicknameReg.test(nickname)) {
      errorMessage.nickname = "사용 불가능한 닉네임입니다.";
    }

    // 이메일 유효성 검사
    const { data: emailExists, error: emailExistsError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    // 1. 존재여부
    if (emailExists) {
      errorMessage.email = "이미 가입된 이메일입니다. 다른 이메일을 입력해주세요.";
    }

    // 2. 이메일 형식
    if (!emailReg.test(email)) {
      errorMessage.email = "잘못된 형식의 이메일 주소입니다.";
    }

    // 비밀번호 유효성 검사
    if (!passwordReg.test(password)) {
      errorMessage.password = "영문, 숫자, 특수문자를 조합하여 입력해주세요.(6~12자)";
    }

    // 비밀번호확인 유효성 검사
    if (password !== passwordConfirm) {
      errorMessage.passwordConfirm = "입력한 비밀번호와 일치하지 않습니다.";
    }

    if (!passwordConfirm) {
      errorMessage.passwordConfirm = "빈칸을 입력해주세요.";
    }

    const hasErrors = Object.values(errorMessage).some((value) => value !== "");

    if (hasErrors) {
      return NextResponse.json({ errorMessage }, { status: 400 });
    }

    // 메일 전송 라이브러리(직접 인증 기능 구현/이진매니저님) or 수파베이스 유료버전
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
          isOAuth
        }
      }
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    const { error: insertUserError } = await supabase.from("users").insert([
      {
        user_id: signUpData?.user?.id as string,
        nickname,
        email,
        isOAuth
      }
    ]);

    if (insertUserError) {
      return NextResponse.json({ error: insertUserError.message }, { status: 400 });
    }

    return NextResponse.json(signUpData);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
