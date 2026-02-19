import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { sendLeadNotificationEmail } from '@/lib/email';

const BLOB_PATH = 'submissions.json';

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

async function getSubmissions(): Promise<Submission[]> {
  // Vercel Blob 사용 가능 시 (배포 환경)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list();
      const blob = blobs.find(
        (b) =>
          b.pathname === BLOB_PATH ||
          b.pathname.endsWith(BLOB_PATH) ||
          b.pathname.includes('submissions.json')
      );
      if (blob?.url) {
        const res = await fetch(blob.url, { cache: 'no-store' });
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (e) {
      console.error('getSubmissions blob error:', e);
      return [];
    }
    return [];
  }

  // 로컬 개발: 파일 시스템 사용
  const { readFile, mkdir, writeFile } = await import('fs/promises');
  const { join } = await import('path');
  const DATA_DIR = join(process.cwd(), 'data');
  const DATA_FILE = join(DATA_DIR, 'submissions.json');
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'ENOENT') return [];
    throw e;
  }
}

async function saveSubmissions(submissions: Submission[]): Promise<void> {
  const data = JSON.stringify(submissions, null, 2);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(BLOB_PATH, data, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  const { writeFile, mkdir } = await import('fs/promises');
  const { join } = await import('path');
  const DATA_DIR = join(process.cwd(), 'data');
  const DATA_FILE = join(DATA_DIR, 'submissions.json');
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, data, 'utf-8');
}

// GET: 모든 제출 데이터 조회
export async function GET() {
  try {
    const submissions = await getSubmissions();
    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
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
    const submissions = await getSubmissions();

    const body = await request.json();
    const newSubmission: Submission = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...body,
    };

    submissions.push(newSubmission);
    await saveSubmissions(submissions);

    // 이메일 알림 전송 (비동기로 처리하여 응답 지연 방지)
    sendLeadNotificationEmail(newSubmission).catch((error) => {
      console.error('이메일 알림 전송 실패:', error);
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
