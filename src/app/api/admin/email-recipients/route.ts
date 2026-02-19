import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

const BLOB_PATH = 'email-recipients.json';

interface EmailRecipient {
  id: string;
  email: string;
  addedAt: string;
}

async function getRecipients(): Promise<EmailRecipient[]> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: 'email-recipients' });
      const blob = blobs.find(
        (b) => b.pathname === BLOB_PATH || b.pathname.endsWith(BLOB_PATH)
      );
      if (blob?.url) {
        const res = await fetch(blob.url);
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch {
      return [];
    }
    return [];
  }

  const { readFile } = await import('fs/promises');
  const { join } = await import('path');
  const DATA_DIR = join(process.cwd(), 'data');
  const RECIPIENTS_FILE = join(DATA_DIR, 'email-recipients.json');
  try {
    const data = await readFile(RECIPIENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'ENOENT') return [];
    throw e;
  }
}

async function saveRecipients(recipients: EmailRecipient[]): Promise<void> {
  const data = JSON.stringify(recipients, null, 2);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(BLOB_PATH, data, { access: 'public', addRandomSuffix: false });
    return;
  }

  const { writeFile, mkdir } = await import('fs/promises');
  const { join } = await import('path');
  const DATA_DIR = join(process.cwd(), 'data');
  const RECIPIENTS_FILE = join(DATA_DIR, 'email-recipients.json');
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(RECIPIENTS_FILE, data, 'utf-8');
}

// GET: 이메일 수신자 목록 조회
export async function GET() {
  try {
    const recipients = await getRecipients();
    return NextResponse.json({ success: true, data: recipients });
  } catch (error) {
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
    const recipients = await getRecipients();
    const { email } = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '올바른 이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (recipients.some((r) => r.email.toLowerCase() === normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: '이미 등록된 이메일 주소입니다.' },
        { status: 400 }
      );
    }

    const newRecipient: EmailRecipient = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: normalizedEmail,
      addedAt: new Date().toISOString(),
    };

    recipients.push(newRecipient);
    await saveRecipients(recipients);

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

    const recipients = await getRecipients();
    const filteredRecipients = recipients.filter((r) => r.id !== id);

    if (filteredRecipients.length === recipients.length) {
      return NextResponse.json(
        { success: false, error: '해당 이메일을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await saveRecipients(filteredRecipients);

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
