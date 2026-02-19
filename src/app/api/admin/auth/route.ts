import { NextRequest, NextResponse } from 'next/server';

// 관리자 계정 정보 (로그인과 동일하게 유지)
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

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get('admin_session')?.value;

  if (!sessionToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    // 세션 토큰 검증 (간단한 방식)
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const [username] = decoded.split(':');

    // 계정 존재 여부 확인
    const account = ADMIN_ACCOUNTS.find((acc) => acc.username === username);

    if (account) {
      return NextResponse.json({ authenticated: true, username });
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
