import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const RECIPIENTS_FILE = join(DATA_DIR, 'email-recipients.json');

interface EmailRecipient {
  id: string;
  email: string;
  addedAt: string;
}

// GET: 이메일 수신자 목록 조회
export async function GET() {
  try {
    const data = await readFile(RECIPIENTS_FILE, 'utf-8');
    const recipients: EmailRecipient[] = JSON.parse(data);
    return NextResponse.json({ success: true, data: recipients });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ success: true, data: [] });
    }
    console.error('Error reading email recipients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read email recipients' },
      { status: 500 }
    );
  }
}

// POST: 이메일 수신자 추가
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

    // 기존 수신자 목록 읽기
    let recipients: EmailRecipient[] = [];
    try {
      const existingData = await readFile(RECIPIENTS_FILE, 'utf-8');
      recipients = JSON.parse(existingData);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    const { email } = await request.json();

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '올바른 이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 중복 확인
    const normalizedEmail = email.toLowerCase().trim();
    if (recipients.some((r) => r.email.toLowerCase() === normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: '이미 등록된 이메일 주소입니다.' },
        { status: 400 }
      );
    }

    // 새 수신자 추가
    const newRecipient: EmailRecipient = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: normalizedEmail,
      addedAt: new Date().toISOString(),
    };

    recipients.push(newRecipient);

    // 파일에 저장
    await writeFile(RECIPIENTS_FILE, JSON.stringify(recipients, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: '이메일 수신자가 추가되었습니다.',
      data: newRecipient,
    });
  } catch (error) {
    console.error('Error adding email recipient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add email recipient' },
      { status: 500 }
    );
  }
}

// DELETE: 이메일 수신자 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '이메일 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 기존 수신자 목록 읽기
    let recipients: EmailRecipient[] = [];
    try {
      const existingData = await readFile(RECIPIENTS_FILE, 'utf-8');
      recipients = JSON.parse(existingData);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json(
          { success: false, error: '수신자 목록이 없습니다.' },
          { status: 404 }
        );
      }
      throw error;
    }

    // 해당 ID의 수신자 제거
    const filteredRecipients = recipients.filter((r) => r.id !== id);

    if (filteredRecipients.length === recipients.length) {
      return NextResponse.json(
        { success: false, error: '해당 이메일을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 파일에 저장
    await writeFile(RECIPIENTS_FILE, JSON.stringify(filteredRecipients, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: '이메일 수신자가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Error deleting email recipient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete email recipient' },
      { status: 500 }
    );
  }
}
