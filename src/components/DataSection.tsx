'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Activity, Gauge, BarChart3 } from 'lucide-react';

const dataPoints = [
  { label: '근력 타겟팅', value: 98, color: 'ember' },
  { label: '속도 측정 정밀도', value: 95, color: 'steel' },
  { label: '좌우 밸런스 분석', value: 97, color: 'ember' },
  { label: '실시간 피드백', value: 99, color: 'steel' },
];

function AnimatedBar({ value, label, color, index }: { value: number; label: string; color: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between">
        <span className="text-chrome-400">{label}</span>
        <motion.span
          className="font-mono text-2xl font-bold text-white font-digital"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {value}%
        </motion.span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-void-700">
        <motion.div
          className={`h-full rounded-full ${
            color === 'ember' ? 'bg-gradient-to-r from-ember-600 to-ember-500' : 'bg-gradient-to-r from-steel-600 to-steel-500'
          }`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function DataSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="snap-section section-diagonal flex min-h-screen items-center bg-void-800 py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 text-steel-400">
            <BarChart3 className="h-5 w-5" />
            <span className="text-sm font-medium">세짐만의 정밀 데이터</span>
          </div>
          <h2 className="font-display text-4xl font-black text-white sm:text-5xl md:text-6xl">
            DATA-DRIVEN
            <br />
            <span className="text-steel-400">PROOF</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-chrome-400">
            AI 로봇만이 가능한 근육 타겟팅 정밀 데이터. 수치로 증명된 퍼포먼스.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Bar chart */}
          <motion.div
            className="space-y-8 rounded-2xl border border-void-600 bg-void/50 p-8 backdrop-blur-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-ember-500" />
              <h3 className="text-xl font-bold">근육 타겟팅 지표</h3>
            </div>
            {dataPoints.map((item, i) => (
              <AnimatedBar
                key={item.label}
                value={item.value}
                label={item.label}
                color={item.color}
                index={i}
              />
            ))}
          </motion.div>

          {/* Stats cards */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { icon: Gauge, value: '380', unit: 'kg', label: '최대 하중 1kg 단위 설정' },
              { icon: Activity, value: '실시간', label: '힘·속도·밸런스 측정' },
              { icon: BarChart3, value: 'VBT', label: '추진 속도 기반 맞춤 코칭' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="btn-metallic rounded-xl border border-void-600 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              >
                <stat.icon className="mb-3 h-8 w-8 text-steel-500" />
                <div className="font-mono text-3xl font-bold text-white font-digital">
                  {stat.value}
                  {stat.unit && <span className="text-ember-500">{stat.unit}</span>}
                </div>
                <p className="mt-1 text-chrome-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
