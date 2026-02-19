'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  '방금 올라잇짐에서 혜택 상담을 신청했습니다',
  '서울 강남 고객님이 박재훈 전용 혜택을 요청했습니다',
  '부산 해운대 센터에서 상담 문의가 들어왔습니다',
  '경기 성남 고객님이 SEGYM 체험을 예약했습니다',
  '대전 트레이너님이 도입 상담을 요청했습니다',
];

function getRandomMessage() {
  return messages[Math.floor(Math.random() * messages.length)];
}

function getRandomTime() {
  return Math.floor(Math.random() * 3) + 1; // 1-3 min ago
}

export default function FOMOToast() {
  const [toasts, setToasts] = useState<{ id: number; message: string; time: number }[]>([]);

  useEffect(() => {
    const addToast = () => {
      const newToast = {
        id: Date.now(),
        message: getRandomMessage(),
        time: getRandomTime(),
      };
      setToasts((prev) => [newToast, ...prev].slice(0, 3));
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    };

    // First toast after 8 seconds
    const firstTimer = setTimeout(addToast, 8000);

    // Then random interval 15-45 seconds
    const interval = setInterval(addToast, 15000 + Math.random() * 30000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-24 left-4 right-4 z-40 sm:bottom-24 sm:left-auto sm:right-6 sm:w-96">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="mb-2 rounded-lg border border-ember-500/30 bg-void-800/95 px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            <p className="text-sm text-white">{toast.message}</p>
            <p className="mt-1 text-xs text-chrome-500">{toast.time}분 전</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
