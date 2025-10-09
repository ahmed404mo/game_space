"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { playSuccessSound } from "@/lib/sounds"

interface MoonLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

const options = [
  { name: "Earth", emoji: "🌍", correct: true },
  { name: "Mars", emoji: "🔴", correct: false },
  { name: "Sun", emoji: "☀️", correct: false },
]

export default function MoonLevel({ onComplete, onBack }: MoonLevelProps) {
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

      <div className="w-full max-w-4xl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-12 text-center">
          <div className="mb-4 text-8xl">🌙</div>
          <h2 className="mb-2 text-4xl font-bold text-foreground">The Moon</h2>
          <p className="text-xl text-muted-foreground">What does the Moon orbit around?</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {options.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.15 }}
            >
              <Button
                onClick={() => handleSelect(option.name, option.correct)}
                disabled={selected !== null}
                className={`h-64 w-full flex-col gap-6 rounded-3xl bg-card p-8 text-card-foreground transition-all hover:scale-105 hover:bg-secondary ${
                  selected === option.name && !option.correct ? "opacity-50" : ""
                }`}
              >
                <div className="text-8xl">{option.emoji}</div>
                <div className="text-2xl font-bold">{option.name}</div>
              </Button>
            </motion.div>
          ))}
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
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div className="relative inline-block">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="text-5xl"
                  >
                    🌙
                  </motion.div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl">🌍</div>
                </div>
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl font-bold text-primary"
              >
                Perfect! 🎉
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-2xl text-foreground"
              >
                The Moon orbits around Earth!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
