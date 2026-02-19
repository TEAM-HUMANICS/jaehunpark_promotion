'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(result.error || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void-900 px-4">
      <motion.div
        className="w-full max-w-md rounded-3xl border-2 border-ember-500/50 bg-gradient-to-br from-void-800 to-void-900 p-8 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-ember-500/50 bg-ember-500/10">
            <Lock className="h-8 w-8 text-ember-400" />
          </div>
          <h1 className="text-2xl font-black text-white md:text-3xl">
            관리자 로그인
          </h1>
          <p className="mt-2 text-sm text-chrome-400">
            박재훈 × SEGYM 프로모션 관리자 페이지
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              아이디
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
              className="w-full rounded-lg border border-void-600 bg-void-900 px-4 py-3 text-white placeholder-chrome-500 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              비밀번호
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              className="w-full rounded-lg border border-void-600 bg-void-900 px-4 py-3 text-white placeholder-chrome-500 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-ember-500/50 bg-ember-500/10 p-3">
              <p className="text-sm text-ember-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-cta-hero w-full rounded-xl px-8 py-4 text-lg font-bold text-white transition-opacity disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
