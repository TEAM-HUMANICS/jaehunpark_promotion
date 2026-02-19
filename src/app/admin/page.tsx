'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download, RefreshCw, LogOut, Mail, Plus, Trash2, Send } from 'lucide-react';

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

interface EmailRecipient {
  id: string;
  email: string;
  addedAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 이메일 수신자 관리
  const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  // 인증 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth');
        const result = await response.json();

        if (result.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/submissions');
      const result = await response.json();

      if (result.success) {
        // 최신순으로 정렬
        const sorted = result.data.sort(
          (a: Submission, b: Submission) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        setSubmissions(sorted);
        setError(null);
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
      fetchEmailRecipients();
    }
  }, [isAuthenticated]);

  const fetchEmailRecipients = async () => {
    try {
      const response = await fetch('/api/admin/email-recipients', { cache: 'no-store' });
      const result = await response.json();
      if (result.success) {
        setEmailRecipients(result.data);
      }
    } catch (err) {
      console.error('Error fetching email recipients:', err);
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      setEmailError('이메일 주소를 입력해주세요.');
      return;
    }

    setEmailLoading(true);
    setEmailError(null);

    try {
      const response = await fetch('/api/admin/email-recipients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail.trim() }),
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok) {
        setEmailError(result.error || `오류 (${response.status}): 이메일 추가에 실패했습니다.`);
        return;
      }

      if (result.success) {
        setNewEmail('');
        setEmailError(null);
        // API에서 반환한 목록으로 즉시 업데이트 (refetch 지연 방지)
        if (Array.isArray(result.recipients)) {
          setEmailRecipients(result.recipients);
        } else {
          await fetchEmailRecipients();
        }
      } else {
        setEmailError(result.error || '이메일 추가에 실패했습니다.');
      }
    } catch (err) {
      setEmailError('이메일 추가 중 오류가 발생했습니다.');
      console.error('Error adding email:', err);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDeleteEmail = async (id: string) => {
    if (!confirm('정말 이 이메일을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/email-recipients?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchEmailRecipients();
      } else {
        alert(result.error || '이메일 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('이메일 삭제 중 오류가 발생했습니다.');
      console.error('Error deleting email:', err);
    }
  };

  const handleTestEmail = async () => {
    if (emailRecipients.length === 0) {
      setTestEmailResult({
        success: false,
        message: '이메일 수신자가 없습니다. 먼저 이메일을 추가해주세요.',
      });
      return;
    }

    setTestEmailLoading(true);
    setTestEmailResult(null);

    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        setTestEmailResult({
          success: true,
          message: `테스트 이메일이 ${emailRecipients.length}명의 수신자에게 전송되었습니다.`,
        });
      } else {
        setTestEmailResult({
          success: false,
          message: result.error || '테스트 이메일 전송에 실패했습니다.',
        });
      }
    } catch (err) {
      setTestEmailResult({
        success: false,
        message: '테스트 이메일 전송 중 오류가 발생했습니다.',
      });
      console.error('Error sending test email:', err);
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', '성함', '연락처', '시설명', '할인코드', '상담가능시간', '개인정보동의', '제출일시'];
    const rows = submissions.map((sub) => [
      sub.id,
      sub.name,
      sub.phone,
      sub.facility || '-',
      sub.discountCode,
      sub.availableTime || '-',
      sub.privacyAgree ? '동의' : '미동의',
      new Date(sub.submittedAt).toLocaleString('ko-KR'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void-900">
        <p className="text-chrome-400">인증 확인 중...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-void-900 py-12 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-white md:text-4xl">
              박재훈 × SEGYM 프로모션 관리자
            </h1>
            <p className="mt-2 text-chrome-400">할인 혜택 신청 내역 조회</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchSubmissions}
              className="flex items-center gap-2 rounded-lg border border-void-600 bg-void-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-void-700"
            >
              <RefreshCw className="h-4 w-4" />
              새로고침
            </button>
            <button
              onClick={handleExportCSV}
              disabled={submissions.length === 0}
              className="flex items-center gap-2 rounded-lg border border-ember-500/50 bg-ember-500/10 px-4 py-2 text-sm font-semibold text-ember-400 transition-colors hover:bg-ember-500/20 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              CSV 다운로드
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-void-600 bg-void-800 px-4 py-2 text-sm font-semibold text-chrome-400 transition-colors hover:bg-void-700 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
          </div>
        </div>

        {/* 통계 */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-void-600 bg-void-800 p-4">
            <p className="text-sm text-chrome-400">총 신청 건수</p>
            <p className="mt-1 text-2xl font-black text-white">{submissions.length}</p>
          </div>
          <div className="rounded-xl border border-void-600 bg-void-800 p-4">
            <p className="text-sm text-chrome-400">오늘 신청 건수</p>
            <p className="mt-1 text-2xl font-black text-white">
              {
                submissions.filter(
                  (sub) =>
                    new Date(sub.submittedAt).toDateString() === new Date().toDateString()
                ).length
              }
            </p>
          </div>
          <div className="rounded-xl border border-void-600 bg-void-800 p-4">
            <p className="text-sm text-chrome-400">시설명 입력 건수</p>
            <p className="mt-1 text-2xl font-black text-white">
              {submissions.filter((sub) => sub.facility).length}
            </p>
          </div>
        </div>

        {/* 이메일 수신자 관리 */}
        <div className="mb-6 rounded-xl border border-void-600 bg-void-800 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-ember-400" />
            <h2 className="text-xl font-bold text-white">이메일 수신자 관리</h2>
            <span className="ml-2 rounded-full bg-ember-500/20 px-2 py-1 text-xs font-semibold text-ember-400">
              {emailRecipients.length}명
            </span>
          </div>
          
          <p className="mb-4 text-sm text-chrome-400">
            새로운 리드 신청 알림을 받을 이메일 주소를 관리합니다.
          </p>

          {/* 테스트 이메일 버튼 */}
          <div className="mb-4">
            <button
              onClick={handleTestEmail}
              disabled={testEmailLoading || emailRecipients.length === 0}
              className="flex items-center gap-2 rounded-lg border border-ember-500/50 bg-ember-500/10 px-4 py-2 text-sm font-semibold text-ember-400 transition-colors hover:bg-ember-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              {testEmailLoading ? '전송 중...' : '테스트 이메일 발송'}
            </button>
            {testEmailResult && (
              <div
                className={`mt-2 rounded-lg border p-3 text-sm ${
                  testEmailResult.success
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-ember-500/50 bg-ember-500/10 text-ember-400'
                }`}
              >
                {testEmailResult.message}
              </div>
            )}
          </div>

          {/* 이메일 추가 폼 */}
          <div className="mb-4 flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setEmailError(null);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !emailLoading) {
                  handleAddEmail();
                }
              }}
              placeholder="이메일 주소를 입력하세요"
              className="flex-1 rounded-lg border border-void-600 bg-void-900 px-4 py-2 text-white placeholder-chrome-500 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50"
            />
            <button
              onClick={handleAddEmail}
              disabled={emailLoading}
              className="flex items-center gap-2 rounded-lg border border-ember-500/50 bg-ember-500/10 px-4 py-2 text-sm font-semibold text-ember-400 transition-colors hover:bg-ember-500/20 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              추가
            </button>
          </div>

          {emailError && (
            <div className="mb-4 rounded-lg border border-ember-500/50 bg-ember-500/10 p-3">
              <p className="text-sm text-ember-400">{emailError}</p>
            </div>
          )}

          {/* 이메일 목록 */}
          {emailRecipients.length === 0 ? (
            <div className="rounded-lg border border-void-600 bg-void-900/50 p-4 text-center">
              <p className="text-sm text-chrome-500">등록된 이메일이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {emailRecipients.map((recipient) => (
                <motion.div
                  key={recipient.id}
                  className="flex items-center justify-between rounded-lg border border-void-600 bg-void-900/50 p-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{recipient.email}</p>
                    <p className="text-xs text-chrome-500">
                      추가일: {new Date(recipient.addedAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEmail(recipient.id)}
                    className="ml-4 rounded-lg p-2 text-chrome-400 transition-colors hover:bg-void-700 hover:text-ember-400"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 데이터 테이블 */}
        {loading ? (
          <div className="rounded-xl border border-void-600 bg-void-800 p-12 text-center">
            <p className="text-chrome-400">데이터를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-ember-500/50 bg-ember-500/10 p-12 text-center">
            <p className="text-ember-400">{error}</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-xl border border-void-600 bg-void-800 p-12 text-center">
            <p className="text-chrome-400">신청 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-void-600 bg-void-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-void-700 bg-void-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-chrome-400">
                      제출일시
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-chrome-400">
                      성함
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-chrome-400">
                      연락처
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-chrome-400">
                      시설명
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-chrome-400">
                      할인코드
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-chrome-400">
                      상담가능시간
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-chrome-400">
                      동의여부
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-void-700">
                  {submissions.map((submission) => (
                    <motion.tr
                      key={submission.id}
                      className="transition-colors hover:bg-void-700/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-4 py-3 text-sm text-chrome-300">
                        {new Date(submission.submittedAt).toLocaleString('ko-KR')}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-white">
                        {submission.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-chrome-300">{submission.phone}</td>
                      <td className="px-4 py-3 text-sm text-chrome-300">
                        {submission.facility || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-ember-400">
                        {submission.discountCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-chrome-300">
                        {submission.availableTime || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            submission.privacyAgree
                              ? 'bg-ember-500/20 text-ember-400'
                              : 'bg-void-600 text-chrome-500'
                          }`}
                        >
                          {submission.privacyAgree ? '동의' : '미동의'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
