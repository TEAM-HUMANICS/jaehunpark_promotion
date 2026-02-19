import { NextRequest, NextResponse } from 'next/server';

// 관리자 계정 정보 (실제 운영 시에는 환경변수나 DB로 관리)
const ADMIN_ACCOUNTS = [
  {
    username: 'segym_admin',
    password: 'Segym2026!@',
  },
  {
    username: 'jaehun_admin',
    password: 'Jaehun2026!@',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // 계정 확인
    const account = ADMIN_ACCOUNTS.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (!account) {
      return NextResponse.json(
        { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 간단한 세션 토큰 생성 (실제 운영 시에는 JWT 등 사용 권장)
    const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');

    // 쿠키에 세션 저장
    const response = NextResponse.json({
      success: true,
      message: '로그인 성공',
    });

    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
