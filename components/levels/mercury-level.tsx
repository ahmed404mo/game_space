"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { playSuccessSound } from "@/lib/sounds"

interface MercuryLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

const planets = [
  { name: "Mercury", emoji: "☀️", distance: 1, correct: true },
  { name: "Venus", emoji: "🌟", distance: 2, correct: false },
  { name: "Earth", emoji: "🌍", distance: 3, correct: false },
]

export default function MercuryLevel({ onComplete, onBack }: MercuryLevelProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSelect = (name: string, correct: boolean) => {
    setSelected(name)

    if (correct) {
      playSuccessSound()
      setShowSuccess(true)
      setTimeout(() => onComplete(3), 2000)
    } else {
      setTimeout(() => setSelected(null), 500)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Button onClick={onBack} variant="ghost" size="icon" className="absolute left-4 top-4 md:left-8 md:top-8">
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-5xl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-12 text-center">
          <div className="mb-4 text-8xl">☀️</div>
          <h2 className="mb-2 text-4xl font-bold text-foreground">Mercury</h2>
          <p className="text-xl text-muted-foreground">Which planet is closest to the Sun?</p>
        </motion.div>

        {/* Sun and planets visualization */}
        <div className="relative mb-12 flex items-center justify-center">
          {/* Sun */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute left-0 text-9xl">
            ☀️
          </motion.div>

          {/* Planets at different distances */}
          <div className="ml-32 flex gap-16 md:ml-48 md:gap-24">
            {planets.map((planet, index) => (
              <motion.button
                key={planet.name}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                onClick={() => handleSelect(planet.name, planet.correct)}
                disabled={selected !== null}
                className={`flex flex-col items-center gap-3 transition-all hover:scale-110 disabled:opacity-50 ${
                  selected === planet.name && !planet.correct ? "opacity-30" : ""
                }`}
              >
                <div className="text-6xl md:text-7xl">{planet.emoji}</div>
                <p className="text-sm font-bold text-foreground md:text-base">{planet.name}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 0.6 }}
                className="mb-6 text-9xl"
              >
                ☀️
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl font-bold text-primary"
              >
                Brilliant! 🎉
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-2xl text-foreground"
              >
                Mercury is closest to the Sun!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
