import { Database } from "@/types/supabase";
import { createServerClient } from "@supabase/ssr";
import { getCookie } from "cookies-next";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        }
      }
    }
  );

  const restrictedPaths = ["/my-page"];
  const hasVisited = getCookie("visitedMainPage", { req: request });

  if (hasVisited && request.nextUrl.pathname === "/") {
    // 홈(메인)페이지 접속한 기록 있으면 랜딩 페이지 띄우지 않고 메인으로 리다이렉트
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
