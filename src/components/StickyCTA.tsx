'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PurchaseModal from './PurchaseModal';

export default function StickyCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        data-sticky-cta
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-void-600 bg-void/95 backdrop-blur-md transition-opacity duration-300"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">박재훈 × SEGYM 전용 혜택</p>
            <p className="text-xs text-chrome-500">지금 상담 신청 시 특별 가격 적용</p>
          </div>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="btn-cta-hero flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white sm:flex-none sm:px-8 sm:text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="whitespace-nowrap">
              <span className="hidden sm:inline">세짐 × 박재훈 프로모션 </span>특별 혜택 신청하기
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* 구매 모달 */}
      <PurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
