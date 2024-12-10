// import NextAuth from "next-auth";
// import { authConfig } from "./auth.config";

// export default NextAuth(authConfig).auth;

// // export const config = {
// //   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// //   matcher: ["/((?!api|_next/static|_next/images|.*\\.jpg$).*)"],
// // };

// export { auth as middleware } from "@/auth";

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/images|favicon.ico|.*\\.svg$).*)",
//   ],
// };

import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from "@/lib/routes";
import { EsRutaAccesible, ObtenerMenus } from "./util/listas";

const { auth } = NextAuth(authConfig);

export default auth(async (req: { url?: any; auth?: any; nextUrl?: any }) => {
  const { nextUrl } = req;
  const loginUrl = new URL("/auth/signin", req.url);
  const notFoundUrl = new URL("/404", req.url);
  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  //Funciona, solo lo dejamos por si acaso
  // if (isPublicRoute && isAuthenticated)
  //   return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

  // if (!isAuthenticated && !isPublicRoute) return Response.redirect(loginUrl);

  //Forma final (con roles)
  if (isAuthenticated) {
    if (isPublicRoute) {
      return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
    } else {
      const esRutaAccesible = await EsRutaAccesible(nextUrl.pathname);
      if (!esRutaAccesible) {
        return Response.redirect(notFoundUrl);
      }
    }
  }
  //Si no está autenticado
  else {
    if (!isPublicRoute) return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/images|favicon.ico|.*\\.svg|.*\\.png$).*)",
  ],
};
