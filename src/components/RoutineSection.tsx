'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Dumbbell, Settings2, Target } from 'lucide-react';

const routineData = [
  { exercise: '스쿼트', weight: 150, sets: 4, reps: '8-10', mode: '3D' },
  { exercise: '벤치프레스', weight: 120, sets: 4, reps: '8-12', mode: '2D' },
  { exercise: '데드리프트', weight: 180, sets: 3, reps: '6-8', mode: '3D' },
  { exercise: '랫풀다운', weight: 80, sets: 4, reps: '10-12', mode: '1D' },
  { exercise: '로보틱 트레이닝', resistance: '70%', sets: 3, reps: 'AMRAP', mode: 'RT' },
];

export default function RoutineSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="snap-section section-diagonal-reverse flex min-h-screen items-center bg-void py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 text-ember-400">
            <Dumbbell className="h-5 w-5" />
            <span className="text-sm font-medium">올라잇 실제 루틴</span>
          </div>
          <h2 className="font-display text-4xl font-black text-white sm:text-5xl md:text-6xl">
            THE &apos;ALL-RIGHT&apos;
            <br />
            <span className="text-ember-500">ROUTINE</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-chrome-400">
            박재훈 선수가 실제로 사용하는 세짐 로봇 설정값과 운동 루틴 가이드
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Routine table */}
          <motion.div
            className="overflow-hidden rounded-2xl border border-void-600 bg-void-800/50"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="border-b border-void-600 bg-ember-500/10 px-6 py-4">
              <h3 className="flex items-center gap-2 font-bold text-white">
                <Settings2 className="h-5 w-5 text-ember-500" />
                세짐 설정값
              </h3>
            </div>
            <div className="divide-y divide-void-600">
              {routineData.map((row, i) => (
                <motion.div
                  key={row.exercise}
                  className="grid grid-cols-5 gap-4 px-6 py-4"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <span className="font-medium text-white">{row.exercise}</span>
                  <span className="font-mono text-ember-400 font-digital">
                    {'weight' in row ? `${row.weight}kg` : row.resistance}
                  </span>
                  <span className="font-mono text-chrome-400 font-digital">{row.sets}세트</span>
                  <span className="font-mono text-chrome-400 font-digital">{row.reps}</span>
                  <span className="rounded bg-steel-500/20 px-2 py-0.5 text-xs font-medium text-steel-400">
                    {row.mode}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Info card */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="rounded-2xl border border-void-600 bg-void-800/50 p-8">
              <Target className="mb-4 h-10 w-10 text-ember-500" />
              <h3 className="mb-4 text-xl font-bold text-white">바벨 모드 설명</h3>
              <ul className="space-y-2 text-chrome-400">
                <li><span className="text-steel-400">1D</span> – 일반 스미스머신 (상하 수직)</li>
                <li><span className="text-steel-400">2D</span> – 좌우 독립 움직임</li>
                <li><span className="text-steel-400">3D</span> – 프리웨이트 (전방위 자유)</li>
                <li><span className="text-ember-400">RT</span> – 로보틱 트레이닝 (저항 비율)</li>
              </ul>
            </div>
            <p className="text-sm text-chrome-500">
              * 실제 루틴은 개인 체력에 따라 조절 가능합니다. 상담 시 맞춤 가이드 제공.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
