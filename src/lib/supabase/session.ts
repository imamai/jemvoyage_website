import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { publicEnv } from "@/lib/env";
import type { Database } from "@/lib/db/types";

/**
 * Refreshes the auth session on every request and writes the rotated cookies
 * onto the outgoing response. Without this, Server Components would eventually
 * read an expired token and silently fall back to anon.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getUser() revalidates against the auth server; getSession() would trust the
  // cookie as-is, which is not safe to gate protected routes on.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // /account now renders real customer data, and /sign-in exists, so it is
  // gated again. Signed-out visitors are sent to sign-in and returned here.
  const isProtected =
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/portal");

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
