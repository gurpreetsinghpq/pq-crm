import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const  {origin} =request.nextUrl
    if(!token){
        return NextResponse.redirect(`${origin}/signin`)
    } else {
        const url = request.nextUrl.clone()   
        if (url.pathname === '/') {
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        } else{
            return NextResponse.next();
        }
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|images|favicon.ico|email-verify|forgotpassword|setpassword|signin|link-invalid|password-reset).*)',
    ],
}