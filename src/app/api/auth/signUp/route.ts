import { Auth } from "@/types/auth.type";
import { nicknameReg } from "@/utils/authValidation";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const { nickname, email, password, ai_type }: Auth = await request.json();
    // 에러가 하나라도 존재하면 객체형태로 리턴
    const errorMessage = {
      nickname: "",
      email: "",
      password: ""
    };

    // 이메일 유효성 검사
    // 1. 존재여부
    const { data: emailExists, error: emailExistsError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (emailExists) {
      errorMessage.email = "이미 존재하는 이메일입니다.";
      //return NextResponse.json({ errorForEmail: "이미 존재하는 이메일입니다." }, { status: 400 });
    }

    // 닉네임 유효성 검사
    if (!nicknameReg.test(nickname)) {
      errorMessage.nickname = "사용 불가능한 닉네임입니다.";
      //return NextResponse.json({ errorForNickname: "사용 불가능한 닉네임입니다." }, { status: 400 });
    }
    // 2. 이메일 형태가 맞는지 ? => input type="email" ??
    //
    // 비밀번호 유효성 검사

    const hasErrors = Object.values(errorMessage).some((value) => value !== "");

    if (hasErrors) {
      return NextResponse.json({ errorMessage }, { status: 400 });
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
          ai_type
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
        ai_type
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
