import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '박재훈 × SEGYM | 올라잇 프로모션',
  description:
    '하드코어 보디빌더 박재훈과 AI 스마트 트레이닝 플랫폼 세짐의 콜라보레이션. 박재훈 전용 혜택 받기.',
  openGraph: {
    title: '박재훈 × SEGYM | 올라잇 프로모션',
    description: '하드코어 보디빌딩의 상징, 올라잇 박재훈과 세짐의 특별한 만남.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
