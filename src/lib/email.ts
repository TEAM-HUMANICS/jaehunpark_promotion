import nodemailer from 'nodemailer';
import { list } from '@vercel/blob';

interface SubmissionData {
  id: string;
  name: string;
  phone: string;
  facility: string;
  discountCode: string;
  availableTime?: string;
  privacyAgree: boolean;
  submittedAt: string;
}

interface EmailRecipient {
  id: string;
  email: string;
  addedAt: string;
}

// 이메일 수신자 목록 가져오기 (Vercel Blob 또는 로컬 파일)
async function getEmailRecipients(): Promise<string[]> {
  // Vercel Blob 사용 (배포 환경)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: 'email-recipients' });
      const blob = blobs.find(
        (b) =>
          b.pathname === 'email-recipients.json' ||
          b.pathname.endsWith('email-recipients.json') ||
          b.pathname.includes('email-recipients')
      );
      if (blob?.url) {
        const res = await fetch(blob.url);
        const recipients: EmailRecipient[] = await res.json();
        return Array.isArray(recipients) ? recipients.map((r) => r.email) : [];
      }
    } catch (e) {
      console.error('Error reading recipients from Blob:', e);
    }
    return [];
  }

  // 로컬 개발: 파일 시스템
  try {
    const { readFile } = await import('fs/promises');
    const { join } = await import('path');
    const RECIPIENTS_FILE = join(process.cwd(), 'data', 'email-recipients.json');
    const data = await readFile(RECIPIENTS_FILE, 'utf-8');
    const recipients: EmailRecipient[] = JSON.parse(data);
    return recipients.map((r) => r.email);
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'ENOENT') {
      const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || '';
      return RECIPIENT_EMAIL ? [RECIPIENT_EMAIL] : [];
    }
    console.error('Error reading email recipients:', e);
    return [];
  }
}

// 이메일 전송 함수
export async function sendLeadNotificationEmail(submission: SubmissionData, isTest: boolean = false) {
  // 환경변수에서 이메일 설정 가져오기 (없으면 기본값 사용)
  const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
  const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
  const SMTP_USER = process.env.SMTP_USER || '';
  const SMTP_PASS = process.env.SMTP_PASS || '';

  // 이메일 설정이 없으면 전송하지 않음
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('이메일 설정이 없어 알림을 전송하지 않습니다.');
    return { success: false, error: '이메일 설정이 없습니다.' };
  }

  // 디버깅: 설정 확인 (비밀번호는 마스킹)
  console.log('SMTP 설정 확인:', {
    host: SMTP_HOST,
    port: SMTP_PORT,
    user: SMTP_USER,
    passLength: SMTP_PASS?.length || 0,
  });

  // 수신자 목록 가져오기
  const recipients = await getEmailRecipients();
  
  if (recipients.length === 0) {
    console.warn('이메일 수신자가 없어 알림을 전송하지 않습니다.');
    return { success: false, error: '이메일 수신자가 없습니다.' };
  }

  try {
    // 네이버 메일의 경우 특별한 설정 필요
    const isNaverMail = SMTP_HOST.includes('naver.com');
    
    // Nodemailer transporter 생성
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // 465 포트는 SSL 사용
      requireTLS: SMTP_PORT === 587 && !isNaverMail, // 네이버는 requireTLS 사용 안 함
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS.trim(), // 공백 제거
      },
      tls: isNaverMail ? {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
      } : undefined,
      debug: false, // 디버깅 모드 비활성화 (너무 많은 로그 방지)
      logger: false, // 로그 출력 비활성화
    });

    // 이메일 내용
    const mailOptions = {
      from: `"세짐 프로모션" <${SMTP_USER}>`,
      to: recipients.join(','), // 여러 수신자에게 전송
      subject: `${isTest ? '[테스트] ' : ''}[세짐 × 박재훈 프로모션] 새로운 리드 신청 - ${submission.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Pretendard', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #E63946 0%, #DC2626 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 4px; }
            .label { font-weight: bold; color: #E63946; margin-bottom: 5px; }
            .value { color: #333; }
            .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #E63946; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>새로운 리드 신청이 접수되었습니다</h2>
            </div>
            <div class="content">
              <div class="highlight">
                <strong>신청 시간:</strong> ${new Date(submission.submittedAt).toLocaleString('ko-KR')}
              </div>
              
              <div class="info-row">
                <div class="label">성함</div>
                <div class="value">${submission.name}</div>
              </div>
              
              <div class="info-row">
                <div class="label">연락처</div>
                <div class="value">${submission.phone}</div>
              </div>
              
              <div class="info-row">
                <div class="label">시설명</div>
                <div class="value">${submission.facility || '-'}</div>
              </div>
              
              <div class="info-row">
                <div class="label">할인 코드</div>
                <div class="value"><strong>${submission.discountCode}</strong></div>
              </div>
              
              ${submission.availableTime ? `
              <div class="info-row">
                <div class="label">상담 가능한 시간</div>
                <div class="value">${submission.availableTime}</div>
              </div>
              ` : ''}
              
              <div class="info-row">
                <div class="label">개인정보 동의</div>
                <div class="value">${submission.privacyAgree ? '✅ 동의' : '❌ 미동의'}</div>
              </div>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd;">
                <p style="color: #666; font-size: 14px;">
                  어드민 페이지에서 상세 정보를 확인하실 수 있습니다.<br>
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/admin" style="color: #E63946;">어드민 페이지 바로가기</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
새로운 리드 신청이 접수되었습니다.

신청 시간: ${new Date(submission.submittedAt).toLocaleString('ko-KR')}
성함: ${submission.name}
연락처: ${submission.phone}
시설명: ${submission.facility || '-'}
할인 코드: ${submission.discountCode}
${submission.availableTime ? `상담 가능한 시간: ${submission.availableTime}` : ''}
개인정보 동의: ${submission.privacyAgree ? '동의' : '미동의'}
      `,
    };

    // 이메일 전송
    const info = await transporter.sendMail(mailOptions);
    console.log('이메일 전송 성공:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('이메일 전송 실패:', error);
    console.error('에러 상세:', {
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command,
    });
    return { 
      success: false, 
      error: error.response || error.message || '이메일 전송에 실패했습니다.' 
    };
  }
}
