import { NextRequest, NextResponse } from "next/server";

const SPANISH_PATHS = ["/", "/sobre-mi", "/libros", "/conferencias", "/prensa", "/blog"];
const EN_PATHS = ["/en", "/en/about", "/en/books", "/en/speaking", "/en/press", "/en/blog"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, and already-localized paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/en/") ||
    pathname === "/en" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Only redirect on root path based on language preference
  if (pathname === "/") {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const preferredLang = acceptLanguage.split(",")[0].split("-")[0].toLowerCase();

    // If browser is set to English (and not Spanish), redirect to /en
    if (preferredLang === "en" && !acceptLanguage.toLowerCase().includes("es")) {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      return NextResponse.redirect(url, { status: 302 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
