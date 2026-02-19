import { NextRequest, NextResponse } from 'next/server';
import { sendLeadNotificationEmail } from '@/lib/email';

// 테스트 이메일 전송
export async function POST(request: NextRequest) {
  try {
    // 테스트용 더미 데이터 생성
    const testSubmission = {
      id: 'test-' + Date.now(),
      name: '테스트 사용자',
      phone: '010-1234-5678',
      facility: '테스트 헬스장',
      discountCode: 'JAEHUNSEGYM',
      availableTime: '평일 오후 2시~6시',
      privacyAgree: true,
      submittedAt: new Date().toISOString(),
    };

    // 이메일 전송 (테스트 모드)
    const result = await sendLeadNotificationEmail(testSubmission, true);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '테스트 이메일이 성공적으로 전송되었습니다.',
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || '이메일 전송에 실패했습니다.',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || '테스트 이메일 전송 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
