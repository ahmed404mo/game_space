"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { playSuccessSound, playWrongSound } from "@/lib/sounds"

interface EarthLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

const continents = [
  { name: "Africa", emoji: "🦁", correct: true },
  { name: "Asia", emoji: "🐼", correct: true },
  { name: "Europe", emoji: "🏰", correct: true },
  { name: "Antarctica", emoji: "🐧", correct: true },
  { name: "Mars", emoji: "🔴", correct: false },
  { name: "Jupiter", emoji: "🪐", correct: false },
]

export default function EarthLevel({ onComplete, onBack }: EarthLevelProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [shake, setShake] = useState(false)

  const handleSelect = (name: string) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((s) => s !== name))
    } else {
      setSelected([...selected, name])
    }
  }

  const handleSubmit = () => {
    setAttempts(attempts + 1)
    const correctAnswers = continents.filter((c) => c.correct).map((c) => c.name)
    const isCorrect = selected.length === correctAnswers.length && selected.every((s) => correctAnswers.includes(s))

    if (isCorrect) {
      playSuccessSound()
      setShowSuccess(true)
      const stars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1
      setTimeout(() => onComplete(stars), 2000)
    } else {
      playWrongSound()
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Button onClick={onBack} variant="ghost" size="icon" className="absolute left-4 top-4 md:left-8 md:top-8">
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-4xl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8 text-center">
          <div className="mb-4 text-8xl">🌍</div>
          <h2 className="mb-2 text-4xl font-bold text-foreground">Earth</h2>
          <p className="text-xl text-muted-foreground">Select all the continents on Earth!</p>
        </motion.div>

        <motion.div
          className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {continents.map((continent, index) => (
            <motion.div
              key={continent.name}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                onClick={() => handleSelect(continent.name)}
                className={`h-auto w-full flex-col gap-3 rounded-2xl p-6 transition-all ${
                  selected.includes(continent.name)
                    ? "scale-95 bg-primary text-primary-foreground ring-4 ring-primary/50"
                    : "bg-card text-card-foreground hover:bg-secondary"
                }`}
              >
                <div className="text-5xl">{continent.emoji}</div>
                <div className="text-lg font-bold">{continent.name}</div>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={handleSubmit}
            disabled={selected.length === 0}
            size="lg"
            className="rounded-full px-12 py-6 text-xl font-bold"
          >
            Check Answer
          </Button>
        </motion.div>
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
                🌍
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
                You know Earth well!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
