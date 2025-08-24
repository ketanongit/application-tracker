import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this!

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  
  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    
    // Set HTTP-only cookie
    response.cookies.set('job-tracker-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    return response;
  }
  
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
