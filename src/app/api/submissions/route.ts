import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { sendLeadNotificationEmail } from '@/lib/email';

const DATA_DIR = join(process.cwd(), 'data');
const DATA_FILE = join(DATA_DIR, 'submissions.json');

interface Submission {
  id: string;
  name: string;
  phone: string;
  facility: string;
  discountCode: string;
  availableTime?: string;
  privacyAgree: boolean;
  submittedAt: string;
}

// GET: 모든 제출 데이터 조회
export async function GET() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    const submissions: Submission[] = JSON.parse(data);
    return NextResponse.json({ success: true, data: submissions });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ success: true, data: [] });
    }
    console.error('Error reading submissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read submissions' },
      { status: 500 }
    );
  }
}

// POST: 새 제출 데이터 저장
export async function POST(request: NextRequest) {
  try {
    // data 디렉토리 생성 (없는 경우)
    try {
      await mkdir(DATA_DIR, { recursive: true });
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    // 기존 데이터 읽기
    let submissions: Submission[] = [];
    try {
      const existingData = await readFile(DATA_FILE, 'utf-8');
      submissions = JSON.parse(existingData);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // 새 제출 데이터 추가
    const body = await request.json();
    const newSubmission: Submission = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...body,
    };

    submissions.push(newSubmission);

    // 파일에 저장
    await writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf-8');

    // 이메일 알림 전송 (비동기로 처리하여 응답 지연 방지)
    sendLeadNotificationEmail(newSubmission).catch((error) => {
      console.error('이메일 알림 전송 실패:', error);
      // 이메일 전송 실패해도 제출은 성공으로 처리
    });

    return NextResponse.json({
      success: true,
      message: 'Submission saved successfully',
      id: newSubmission.id,
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save submission' },
      { status: 500 }
    );
  }
}
