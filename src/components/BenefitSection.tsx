'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Tag, Check } from 'lucide-react';
import Image from 'next/image';
import PurchaseModal from './PurchaseModal';

// 원가 13,990,000 → 프로모션가 11,000,000 → 3% 추가할인
const realOriginalPrice = 13_990_000; // 실제 원가
const promotionPrice = 11_000_000; // 박재훈 프로모션 가격
const additionalDiscountPercent = 3; // 3% 추가 할인
const finalPrice = Math.floor(promotionPrice * (1 - additionalDiscountPercent / 100)); // 10,670,000원
// 총 할인율: (원가 - 최종가) / 원가
const totalDiscountPercent = Math.round(
  ((realOriginalPrice - finalPrice) / realOriginalPrice) * 100
); // 약 24%

const additionalBenefits = [
  '배송비, 설치비 무료',
  '로보틱 트레이닝 기능 지원',
  '세짐 소프트웨어 평생 무료 업데이트',
  '24개월 무상 A/S 및 주기적인 방문 점검',
];

export default function BenefitSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="cta" className="bg-void py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          className="font-display mb-2 text-center text-xl font-black text-white md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          박재훈 선수 구독자들을 위한 혜택
        </motion.h2>
        <motion.p
          className="mb-12 text-center text-sm text-chrome-400 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          올라잇을 응원하는 당신을 위한 특별 할인
        </motion.p>

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          {/* 세짐 이미지 - sticky 효과 */}
          <motion.div
            className="flex-shrink-0 md:w-1/2 md:sticky md:top-8 md:self-start"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-void-600 bg-void-800">
              <Image
                src="/segym2.png"
                alt="세짐"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {/* 구매 페이지 스타일 */}
          <motion.div
            className="flex-1 overflow-hidden rounded-3xl border-2 border-ember-500/50 bg-gradient-to-br from-void-800 to-void-900 p-6 md:p-10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* 상품명 */}
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4 text-ember-400 md:h-5 md:w-5" />
                <span className="text-xs font-bold text-ember-400 md:text-sm">프로모션 상품</span>
              </div>
              <h3 className="text-xl font-black text-white md:text-2xl">
                세짐 × 박재훈 프로모션
              </h3>
              <p className="mt-1.5 text-xs text-chrome-500 md:text-sm">
                * 본 페이지에서만 구매 가능한 특별 상품
              </p>
            </div>

            {/* 박재훈 특별 프로모션 할인율 강조 */}
            <div className="mb-6 rounded-xl bg-gradient-to-r from-ember-500/30 to-ember-600/30 py-6 text-center backdrop-blur-sm">
              <p className="mb-2 text-sm font-semibold text-chrome-300 md:text-base">박재훈 선수 통해서 구매 시</p>
              <p className="text-5xl font-black text-ember-200 md:text-6xl">
                {totalDiscountPercent}%
              </p>
              <p className="mt-1 text-lg font-bold text-ember-300 md:text-xl">박재훈 특별 프로모션 할인</p>
            </div>

            {/* 가격 계산 영역 */}
            <div className="mb-6 space-y-3 rounded-xl border border-void-600 bg-void-900/50 p-5 md:space-y-4 md:p-6">
              {/* 원가 */}
              <div className="flex flex-col gap-2 border-b border-void-700 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                <span className="text-sm text-chrome-400 md:text-base">정가</span>
                <span className="text-base font-semibold text-chrome-400 line-through md:text-lg">
                  {realOriginalPrice.toLocaleString()}원
                </span>
              </div>

              {/* 할인 항목 */}
              <div className="flex items-center justify-between border-b border-void-700 pb-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-ember-400 md:h-4 md:w-4 mt-0.5" />
                  <span className="text-sm text-chrome-400 leading-relaxed md:text-base">
                    박재훈 특별 프로모션 할인
                  </span>
                </div>
                <span className="text-base font-bold text-ember-400 md:text-lg">
                  {totalDiscountPercent}%
                </span>
              </div>

              {/* 최종 가격 */}
              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                <span className="text-base font-bold text-white md:text-lg">최종 결제 금액</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-ember-300 md:text-3xl">
                    {finalPrice.toLocaleString()}원
                  </span>
                  <p className="mt-0.5 text-xs text-chrome-500">* 부가세 별도</p>
                </div>
              </div>
            </div>

            {/* 추가 혜택 */}
            <div className="mb-6 rounded-xl border border-void-600 bg-void-900/50 p-5 md:p-6">
              <h4 className="mb-4 text-base font-bold text-white md:text-lg">
                박재훈 선수 구독자들을 위한
                <br className="hidden sm:block" />
                <span className="text-ember-400"> 특별 추가혜택</span>
              </h4>
              <ul className="space-y-3">
                {additionalBenefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Check className="h-5 w-5 flex-shrink-0 text-ember-400 md:h-6 md:w-6" />
                    <span
                      className={`text-sm md:text-base ${
                        index === 0 ? 'font-bold text-white' : 'text-chrome-300'
                      }`}
                    >
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* 상담 신청 버튼 */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="btn-cta-hero mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white md:mt-8 md:px-8 md:text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="whitespace-nowrap">
                <span className="hidden sm:inline">세짐 × 박재훈 프로모션 </span>특별 혜택 신청하기
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* 구매 모달 */}
      <PurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
