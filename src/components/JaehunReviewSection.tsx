'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function JaehunReviewSection() {
  return (
    <section className="relative overflow-hidden bg-void-900 md:min-h-[90vh]">
      {/* 전체 배경 이미지 - 드라마틱한 효과 */}
      <div className="absolute inset-0">
        <Image
          src="/insta_image3.png"
          alt="박재훈 선수"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        {/* 다크 그라데이션 오버레이 - 텍스트 가독성 */}
        <div className="absolute inset-0 bg-gradient-to-r from-void-900 via-void-900/80 to-void-900/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void-900/90" />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 py-12 md:min-h-[90vh] md:flex-row md:items-center md:py-24">
        {/* 왼쪽: 이미지 영역 - PC에서만 표시 */}
        <motion.div
          className="hidden md:block md:w-2/5"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="relative aspect-[3/4] overflow-hidden rounded-3xl"
            style={{
              boxShadow: `
                0 0 80px rgba(230, 57, 70, 0.4),
                0 40px 100px rgba(0, 0, 0, 0.9),
                inset 0 0 60px rgba(0, 0, 0, 0.5)
              `,
              filter: 'drop-shadow(0 0 30px rgba(230, 57, 70, 0.3))',
            }}
          >
            <Image
              src="/insta_image3.png"
              alt="올라잇 박재훈"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 0vw, 40vw"
            />
            {/* 내부 글로우 효과 */}
            <div className="absolute inset-0 bg-gradient-to-t from-void-900/50 via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* 오른쪽: 후기 텍스트 영역 */}
        <motion.div
          className="flex-1 space-y-4 md:w-3/5 md:space-y-6 md:pl-12"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* 제목 */}
          <motion.h2
            className="font-display text-3xl font-black text-white md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            박재훈 선수 후기
          </motion.h2>

          {/* 후기 텍스트 */}
          <div
            className="relative rounded-2xl border border-white/10 bg-void/60 p-8 backdrop-blur-md md:p-12"
            style={{
              boxShadow: `
                0 20px 60px rgba(0, 0, 0, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                0 0 40px rgba(230, 57, 70, 0.2)
              `,
            }}
          >
            <blockquote className="relative text-lg leading-relaxed text-chrome-100 md:text-xl md:leading-relaxed">
              <span className="absolute -left-2 -top-2 text-4xl font-bold leading-none text-ember-500/30 md:-left-4 md:-top-4 md:text-6xl">
                "
              </span>
              <span className="relative z-10 block space-y-3">
                <p>
                  스포엑스에서 세짐을 처음 만났을 때 정말 놀랐습니다. 일반적인 운동기구가
                  아닌, AI기술이 접목된 완전히 새로운 분야였거든요.
                </p>
                <p>
                  원판을 갈아끼울 필요 없이 터치 한 번으로 고중량 세팅이 끝나니 오직 운동강도에만
                  모든 정신을 쏟을 수 있어 저 같은 프로선수들의 실전 하드코어 훈련에서 빛을 발휘하는
                  것 같습니다.
                </p>
                <p>
                  2026년 시즌루틴에도 적극 활용해 더 완벽한 몸을 만들 계획입니다. 설레는 보디빌딩 여정,
                  세짐과 함께 돌격하겠습니다. 올라잇!
                </p>
              </span>
              <span className="absolute -bottom-4 -right-2 text-4xl font-bold leading-none text-ember-500/30 md:-bottom-6 md:-right-4 md:text-6xl">
                "
              </span>
            </blockquote>
          </div>
        </motion.div>
      </div>

      {/* 모바일: 이미지 미리보기 (작게) */}
      <motion.div
        className="relative mx-auto mb-6 block w-64 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-2xl"
          style={{
            boxShadow: `
              0 0 40px rgba(230, 57, 70, 0.3),
              0 20px 60px rgba(0, 0, 0, 0.8)
            `,
          }}
        >
          <Image
            src="/insta_image3.png"
            alt="올라잇 박재훈"
            fill
            className="object-cover object-center"
            sizes="256px"
          />
        </div>
      </motion.div>
    </section>
  );
}
