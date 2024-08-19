import { NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  //const cookieStore = cookies();
  // 네임 갖고오는 방법
  //const token = cookieStore.get("sb-hyirkcgdjbjlutppxsyx-auth-token");

  //if (request.nextUrl.pathname.startsWith("/my-page")) {
  //  const token = request.cookies.get("sb-hyirkcgdjbjlutppxsyx-auth-token")?.value;

  //if (!token) {
  // token 이 없는 상태로 마이페이지에 접근 시도 시 홈 화면으로 리다이렉트 시킵니다.
  // 랜딩, 다이어리, 투두페이지도, 채팅페이지는 일단 접근 가능 (채팅 버튼을 누르고 시작하려고 하면 로그인 페이지로)
  //return NextResponse.redirect(new URL("/", request.url));
  // }
  //  return NextResponse.next();
  //}
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
  //matcher: ["/", "/chat", "/diary", "/todo-list"]
};
