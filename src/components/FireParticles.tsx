'use client';

import { motion } from 'framer-motion';

export default function FireParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-ember-500/30"
          style={{
            left: `${p.x}%`,
            bottom: 0,
            width: p.size,
            height: p.size,
          }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{
            y: [-20, -200],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 1.5,
          }}
        />
      ))}
    </div>
  );
}
