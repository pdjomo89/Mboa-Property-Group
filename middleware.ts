import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/news",
  "/partners",
  "/contact",
  "/services",
  "/rentals",
  "/careers",
  "/auth/login",
  "/auth/register",
]);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    if (!isPublicRoute(request) && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/auth/login");
    }
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
