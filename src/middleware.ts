import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient(
        { 
            req: request, 
            res 
        }, 
        {
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
            supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        }
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // List of public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register']
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

    // If the user is not logged in and trying to access a protected route
    if (!session && !isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // If the user is logged in and trying to access login/register pages
    if (session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
        return NextResponse.redirect(new URL('/home', request.url))
    }

    return res
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
