import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const protectedPath = "/admin";
const loginPath = "/login";
const publicRoutes = [loginPath];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.indexOf(protectedPath) === 0;
  const isPublicRoute = publicRoutes.includes(path);
  const cookiePromise = await cookies()

  const cookie = cookiePromise.get("session")?.value;
  const session = await decrypt(cookie);

  // console.log('middleware info', {
  //   path,
  //   isProtectedRoute,
  //   isPublicRoute,
  //   session,
  // });

  // if (isProtectedRoute && !session?.userId) {
  //   return NextResponse.redirect(new URL(loginPath, req.nextUrl));
  // }
  //
  // if (isPublicRoute && session?.userId) {
  //   return NextResponse.redirect(new URL(protectedPath, req.nextUrl));
  // }

  return NextResponse.next();
}