'use client';

import { motion } from 'framer-motion';
import { Zap, TrendingDown, FileText } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: Zap,
    title: '터치 한 번에 무게 조절',
    desc: '스쿼트 300kg 세팅하는데 몇 분 걸려요? 세짐은 터치 한 번이면 끝입니다. 원판 끼우고 빼는 시간에 이미 다음 세트를 시작했을 거예요.',
  },
  {
    icon: TrendingDown,
    title: '자동 드롭세트 기능',
    desc: '파트너 없이 혼자 드롭세트 하려면? 세트 끝나면 자동으로 무게가 줄어들어요. 쉬는 시간 없이 근육을 끝까지 태워버릴 수 있습니다.',
  },
  {
    icon: FileText,
    title: '운동 자동기록 기능',
    desc: '오늘 몇 kg 들었는지, 몇 REP 했는지 기억 안 나죠? 세짐은 모든 걸 자동으로 기록해줍니다. 무게부터 속도, 밸런스까지. 이 데이터로 다음 훈련을 설계하세요.',
  },
];

export default function JaehunFavoritesSection() {
  return (
    <section className="bg-void py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          className="font-display mb-4 text-center text-2xl font-black text-white md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          박재훈 선수가 가장 좋아하는 기능은?
        </motion.h2>
        {/* PC: 이미지와 기능 카드 양옆 배치, 모바일: 세로 배치 */}
        <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-6">
          {/* 박재훈 사진 */}
          <motion.div
            className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-2xl md:mx-0 md:w-1/2 md:flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/main_jaehun.jpg"
              alt="올라잇 박재훈"
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* 기능 카드들 */}
          <div className="grid gap-6 md:w-1/2 md:grid-cols-1">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-void-600 bg-void-800/50 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <item.icon className="mb-4 h-10 w-10 text-ember-500" />
                <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                <p className="text-chrome-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
