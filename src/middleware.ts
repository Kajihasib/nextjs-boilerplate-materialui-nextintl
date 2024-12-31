import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper function to check permissions
const hasPermission = (permissions: string[], codename: string): boolean => {
  return permissions.some((permission) => permission === codename);
};

// Middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Fetch token from cookies
  const token_value = request.cookies.get("user_token")?.value || "";

  // Fetch permissions dynamically using the API
  const permissions = (await fetchPermissions(token_value)) ?? [];

  // Define permissions required for specific paths
  const permissionMapping: Record<string, string> = {
    "/create-cistern": "add_cistern",
    "/cisterns-map": "view_cistern",
    "/cisterns": "view_cistern",
    "/cistern-size": "view_cisternsize",
    "/recommended-by": "view_recommendedbyuser",
    "/users": "view_userinfo",
    "/add-user": "add_userinfo",
  };

  // Check for dynamic routes
  const dynamicRoutes = [
    { prefix: "/cistern-edit", permission: "change_cistern" },
    { prefix: "/cistern-details", permission: "view_cistern" },
    { prefix: "/edit-user", permission: "change_userinfo" },
  ];

  for (const route of dynamicRoutes) {
    if (pathname.startsWith(route.prefix)) {
      if (!hasPermission(permissions, route.permission)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  // Check for static routes
  const requiredPermission = permissionMapping[pathname];
  if (requiredPermission && !hasPermission(permissions, requiredPermission)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Handle public and protected routes
  const publicUrls: string[] = ["/", "/forgot-password", "/reset-password"];

  if (token_value && publicUrls.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token_value && !publicUrls.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Fetch permissions using API
async function fetchPermissions(token: string): Promise<string[] | null> {
  try {
    const response = await fetch(`${process.env.BASE_URL}get-user-profile`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data.user_info.permissions.permissions?.map(
        (perm: { permission_codename: string }) => perm.permission_codename
      );
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Config to define routes middleware should run on
export const config = {
  matcher: [
    "/dashboard",
    "/department",
    "/arrondissement",
    "/commune",
    "/communal-section",
    "/cisterns-map",
    "/places",
    "/create-cistern",
    "/cistern-size",
    "/account",
    "/recommended-by",
    "/cisterns",
    "/users",
    "/role",
    "/add-user",
    "/edit-user/:path*",
    "/cistern-details/:path*",
    "/cistern-edit/:path*",
    "/activity-list",
    "/",
    "/forgot-password",
    "/reset-password",
  ],
};
