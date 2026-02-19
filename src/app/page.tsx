import HeroSection from '@/components/HeroSection';
import SegymIntroSection from '@/components/SegymIntroSection';
import JaehunFavoritesSection from '@/components/JaehunFavoritesSection';
import JaehunReviewSection from '@/components/JaehunReviewSection';
import BenefitSection from '@/components/BenefitSection';
import StickyCTA from '@/components/StickyCTA';
import ScrollToTop from '@/components/ScrollToTop';
import FireParticles from '@/components/FireParticles';
import SmokeEffect from '@/components/SmokeEffect';

export default function Home() {
  return (
    <main className="relative">
      <FireParticles />
      <SmokeEffect />

      <HeroSection />
      <SegymIntroSection />
      <JaehunFavoritesSection />
      <JaehunReviewSection />
      <BenefitSection />

      <div className="h-24" />
      <StickyCTA />
      <ScrollToTop />
    </main>
  );
}
