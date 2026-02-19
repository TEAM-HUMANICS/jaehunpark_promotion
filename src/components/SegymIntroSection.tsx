'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SegymIntroSection() {
  return (
    <section className="bg-void-800 pt-8 pb-16 md:pt-[4.5rem] md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          className="font-display mb-4 text-center text-2xl font-black leading-[1.6] text-white md:mb-12 md:text-3xl [&>span]:block [&>span]:mb-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-chrome-300">올라잇 박재훈이 선택한</span>
          <span className="text-ember-400">AI 로봇 프리웨이트 머신 세짐</span>
        </motion.h2>

        {/* 이미지 - 전체 보이게 (모바일/PC 동일) */}
        <motion.div
          className="relative mb-2 w-full overflow-hidden rounded-2xl border border-void-600 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative h-[45vh] w-full md:h-[75vh]">
            <Image
              src="/main2.jpg"
              alt="박재훈 × SEGYM AI 로봇 프리웨이트 머신"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </motion.div>

        {/* 세짐 핵심 기능 */}
        <motion.h3
          className="mb-4 text-center text-xl font-bold text-white md:mb-6 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          세짐의 핵심 기능들
        </motion.h3>
        <motion.div
          className="grid gap-4 md:grid-cols-2 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {[
            {
              emoji: '⚡',
              title: '터치 한 번에 무게 조절',
              desc: '스쿼트 300kg를 터치 한 번에 세팅. 원판 교체 시간 0초, 운동에만 집중하세요',
            },
            {
              emoji: '🔥',
              title: '자동 드롭세트 기능',
              desc: '근육에 터질 듯한 자극감. 혼자서도 드롭세트가 가능한 초고강도 훈련',
            },
            {
              emoji: '📊',
              title: '운동 자동기록 기능',
              desc: 'PT 수업 시 회원을 자세하게 지도하기에 최적. 실시간 데이터로 정밀 코칭',
            },
            {
              emoji: '🛡️',
              title: '운동 세이프티 기능',
              desc: '혼자서도 실패지점까지 가더라도 안전. 봉 놓치면 자동 무게 해제',
            },
            {
              emoji: '🤖',
              title: '로보틱 트레이닝',
              desc: '재활 PT나 재활운동 지도할 때 최적. 관절 부담 없는 등속성 운동',
            },
            {
              emoji: '🎯',
              title: '중력 반대방향 저항',
              desc: '랫풀다운, 트라이셉스 푸쉬다운 동작 가능. 올인원 머신으로 공간 절약',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              className="rounded-xl border border-void-600 bg-void/50 p-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">{feature.emoji}</span>
                <h3 className="text-base font-bold text-white md:text-lg">{feature.title}</h3>
              </div>
              <p className="text-base leading-relaxed text-chrome-400 md:text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
