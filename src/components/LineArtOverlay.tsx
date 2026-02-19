'use client';

import { motion } from 'framer-motion';

export default function LineArtOverlay() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-ember-500"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <motion.path
        d="M 100 400 L 300 200 L 500 300 L 700 250"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-steel-500"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.path
        d="M 200 500 L 400 350 L 600 400 L 800 350"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-ember-500"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, delay: 0.3, ease: 'easeInOut' }}
      />
    </svg>
  );
}
