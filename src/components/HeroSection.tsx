'use client';

import { motion } from 'framer-motion';
import LineArtOverlay from './LineArtOverlay';

// YouTube 비디오 ID (예: https://youtube.com/watch?v=ABC123 → ABC123)
const YOUTUBE_VIDEO_ID = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || '';

export default function HeroSection() {
  const handleScrollToCTA = () => {
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 약간의 딜레이 후 페이지 리로드 느낌을 주기 위해
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
  };
  return (
    <section className="relative flex min-h-0 flex-col gap-0 overflow-hidden bg-void md:min-h-screen md:block">
      {/* SEGYM 브랜드 - 모바일: 상단 검은 바 중앙, 데스크톱: 상단 검은 바 중간 */}
      <div className="flex h-14 flex-shrink-0 items-center justify-center bg-void py-3 md:absolute md:inset-x-0 md:top-0 md:h-20 md:z-20 md:justify-start md:px-12 md:py-0">
        <button
          onClick={handleLogoClick}
          type="button"
          className="cursor-pointer transition-opacity hover:opacity-80 active:opacity-60"
          aria-label="홈으로 이동"
        >
          <span className="text-xl font-bold italic tracking-wide text-white md:text-2xl">
            <span style={{ fontFamily: "'Isamanru', sans-serif" }}>SEGYM</span>
            <span className="mx-1.5 font-normal not-italic text-chrome-300">X</span>
            <span className="font-sans">jaehun_allright</span>
          </span>
        </button>
      </div>

      {/* 모바일: 영상 전체 보이게(contain), 데스크톱: 전체 배경(cover) (YouTube 또는 대체 이미지) */}
      <div className="relative flex h-[22vh] flex-shrink-0 items-center justify-center overflow-hidden bg-void md:absolute md:inset-0 md:h-full md:block">
        {YOUTUBE_VIDEO_ID ? (
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            title="세짐 × 박재훈"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden"
            style={{
              width: '39.11vh',
              height: '22vh',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat md:absolute md:inset-0 md:h-full md:w-full"
            style={{ backgroundImage: "url('/main2.jpg')" }}
          />
        )}
        {YOUTUBE_VIDEO_ID && (
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            title="세짐 × 박재훈"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
            style={{
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.78vh',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void/50 md:bg-gradient-to-tr md:from-void/60 md:via-transparent md:to-void/40" />
      </div>

      {/* Robot blueprint line art overlay - 데스크톱만 */}
      <div className="hidden md:block">
        <LineArtOverlay />
      </div>

      {/* Content - 모바일: 영상 밑 배치, 데스크톱: 영상 위 오버레이 */}
      <div className="relative z-10 flex flex-col justify-start bg-void px-6 pt-3 pb-16 text-center md:absolute md:inset-0 md:flex-initial md:justify-end md:items-start md:bg-transparent md:px-12 md:py-0 md:pb-40 md:pl-20 md:text-left">
        <motion.h1
          className="font-display mx-auto mb-4 max-w-xl text-3xl font-black leading-[1.6] tracking-tight sm:text-4xl md:mx-0 md:max-w-2xl md:text-4xl lg:text-5xl [&>span]:block [&>span]:mb-1.5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-white via-chrome-200 to-chrome-400 bg-clip-text text-transparent">
            세짐 앞에서 한계는 없어
          </span>
          <span className="bg-gradient-to-r from-ember-400 via-ember-500 to-ember-600 bg-clip-text text-transparent">
            넌 그냥 강해지면 돼
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex justify-center md:justify-start"
        >
          <motion.button
            onClick={handleScrollToCTA}
            className="btn-cta-hero inline-flex items-center gap-2 rounded-lg px-8 py-4 text-lg font-bold text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            세짐 × 박재훈 할인혜택 보기
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
