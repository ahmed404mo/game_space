"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  completedLevels: boolean[]
  starsEarned: number
}

export default function ProgressBar({ completedLevels = [], starsEarned = 0 }: ProgressBarProps) {
  const totalLevels = completedLevels?.length || 10
  const completedCount = completedLevels?.filter(Boolean).length || 0
  const progressPercentage = totalLevels > 0 ? (completedCount / totalLevels) * 100 : 0

  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.1,
    duration: 1.5 + Math.random() * 0.5,
  }))

  return (
    // تكبير الحشوة الخارجية قليلاً (py-4)
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-900 to-slate-900/80 backdrop-blur-sm border-b border-cyan-500/30 px-6 py-4">
      
      {/* تكبير العرض ليصبح متوسطاً (max-w-5xl) */}
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-sm font-bold text-cyan-400">
              LEVEL {completedCount}/{totalLevels}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              className="text-yellow-400 font-bold text-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
            >
              ★
            </motion.span>
            <span className="text-white font-bold text-base">{starsEarned}</span>
          </div>
        </div>

        {/* تكبير ارتفاع الشريط (h-14) */}
        <div className="relative h-14 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-full overflow-hidden border border-cyan-500/50 shadow-md shadow-cyan-500/20">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />

          {/* Track background stars */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {[...Array(totalLevels)].map((_, i) => (
              <motion.div
                key={i}
                className="text-sm text-slate-600" // حجم نجوم الخلفية
                animate={i < completedCount ? { scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3], color: "#fbbf24" } : {}}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }}
              >
                ★
              </motion.div>
            ))}
          </div>

          {/* Progress Light Beam */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-28 h-10 bg-gradient-to-r from-cyan-500/30 via-cyan-500/10 to-transparent blur-md rounded-full"
            animate={{ left: `calc(${progressPercentage}% - 56px)` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* تكبير أيقونة الصاروخ (text-3xl) */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 text-3xl z-10"
            animate={{ left: `calc(${progressPercentage}% - 18px)` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.4 }}
            >
              🚀
            </motion.div>
          </motion.div>

          {/* Sparkles */}
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute top-1/2 -translate-y-1/2 text-[10px]"
              animate={{
                left: `calc(${progressPercentage}% - 18px)`,
                x: Math.cos((sparkle.id / 8) * Math.PI * 2) * 28, // تعديل مدى الانتشار
                y: Math.sin((sparkle.id / 8) * Math.PI * 2) * 28,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: sparkle.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: sparkle.delay,
                ease: "easeOut",
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}