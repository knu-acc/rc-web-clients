import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const LOGIN_PATH = "/login";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;
  const isLogin = path === LOGIN_PATH;

  // Logged in but on login page -> redirect to projects
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // Not logged in and not on login page -> redirect to login
  if (!user && !isLogin) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
