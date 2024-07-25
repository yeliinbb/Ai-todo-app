import { Auth } from "@/types/auth.type";
import { emailReg, passwordReg } from "@/utils/authValidation";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const { email, password }: Auth = await request.json();

    const errorMessage = {
      email: "",
      password: ""
    };

    // 이메일 유효성 검사
    const { data: emailExists, error: emailExistsError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    // 1. 존재여부
    if (!emailExists) {
      errorMessage.email = "가입되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.";
    }

    // 2. 이메일 형식
    if (!emailReg.test(email)) {
      errorMessage.email = "잘못된 형식의 이메일 주소입니다. 이메일 주소를 정확히 입력해주세요.";
    }

    // 비밀번호 유효성 검사
    // if (!passwordReg.test(password)) {
    //   errorMessage.password = "영문, 숫자, 특수문자를 조합하여 입력해주세요.(6~12자)";
    // }

    const hasErrors = Object.values(errorMessage).some((value) => value !== "");

    if (hasErrors) {
      return NextResponse.json({ errorMessage }, { status: 400 });
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 400 });
    }

    return NextResponse.json(signInData);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
