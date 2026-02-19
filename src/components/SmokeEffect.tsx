'use client';

import { motion } from 'framer-motion';

export default function SmokeEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30">
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% 100%, rgba(230, 57, 70, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 40%)`,
        }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
