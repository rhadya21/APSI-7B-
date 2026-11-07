import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "kopioz_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const isLoginRolePage = pathname === "/login/kasir" || pathname === "/login/pemilik";

  if (pathname === "/login" || pathname === "/" || isLoginRolePage) {
    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie) as { role?: string };

        if (isLoginRolePage) {
          const expectedRole = pathname === "/login/kasir" ? "kasir" : "pemilik";
          if (session.role === expectedRole) {
            return NextResponse.redirect(new URL(`/${expectedRole}`, request.url));
          }

          if (session.role === "kasir") {
            return NextResponse.redirect(new URL("/kasir", request.url));
          }

          if (session.role === "pemilik") {
            return NextResponse.redirect(new URL("/pemilik", request.url));
          }
        }

        if (session.role === "kasir") {
          return NextResponse.redirect(new URL("/kasir", request.url));
        }

        if (session.role === "pemilik") {
          return NextResponse.redirect(new URL("/pemilik", request.url));
        }
      } catch {
        // Ignore malformed cookie; allow the user to log in again.
      }
    }

    return NextResponse.next();
  }

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const session = JSON.parse(sessionCookie) as { role?: string };

    if (pathname.startsWith("/kasir") && session.role !== "kasir") {
      return NextResponse.redirect(
        new URL(session.role === "pemilik" ? "/pemilik" : "/login", request.url),
      );
    }

    if (pathname.startsWith("/pemilik") && session.role !== "pemilik") {
      return NextResponse.redirect(
        new URL(session.role === "kasir" ? "/kasir" : "/login", request.url),
      );
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/login/:path*", "/kasir/:path*", "/pemilik/:path*"],
};
