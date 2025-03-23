import { NextRequest, NextResponse } from 'next/server';
import { getTokenData } from '@/lib/auth';

/**
 * Define protected routes that require authentication
 * Add or remove routes as needed for your application
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
];

/**
 * Middleware function to handle authentication and route protection
 * @param request The incoming request
 * @returns NextResponse
 */
export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    
    // Check if route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );
    
    if (isProtectedRoute) {
      // Get user data from token
      const userData = await getTokenData(request);
      
      // If no user data, redirect to login
      if (!userData) {
        const url = new URL('/login', request.url);
        // Pass the current URL as callback for post-login redirect
        url.searchParams.set('callbackUrl', encodeURI(pathname));
        return NextResponse.redirect(url);
      }
    }
    
    // Check if user is trying to access login/signup pages while already logged in
    if (pathname === '/login' || pathname === '/signup') {
      const userData = await getTokenData(request);
      if (userData) {
        // Redirect authenticated users away from auth pages
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // For middleware errors, it's better to continue than fail
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes that don't need auth (signup, login)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api/auth/signup|api/auth/login|_next/static|_next/image|favicon.ico|public).*)',
  ],
};