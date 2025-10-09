"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { playSuccessSound } from "@/lib/sounds"

interface UranusLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

const directions = [
  { name: "Sideways", rotation: 90, correct: true },
  { name: "Upright", rotation: 0, correct: false },
  { name: "Upside Down", rotation: 180, correct: false },
]

export default function UranusLevel({ onComplete, onBack }: UranusLevelProps) {
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
          <div className="mb-4 text-8xl">🌀</div>
          <h2 className="mb-2 text-4xl font-bold text-foreground">Uranus</h2>
          <p className="text-xl text-muted-foreground">How does Uranus spin?</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {directions.map((direction, index) => (
            <motion.div
              key={direction.name}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.15 }}
            >
              <Button
                onClick={() => handleSelect(direction.name, direction.correct)}
                disabled={selected !== null}
                className={`h-64 w-full flex-col gap-6 rounded-3xl bg-card p-8 text-card-foreground transition-all hover:scale-105 hover:bg-secondary ${
                  selected === direction.name && !direction.correct ? "opacity-50" : ""
                }`}
              >
                <motion.div animate={{ rotate: direction.rotation }} className="text-7xl">
                  🌀
                </motion.div>
                <div className="text-2xl font-bold">{direction.name}</div>
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
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1.2, 1], rotate: [0, 90] }}
                transition={{ duration: 0.6 }}
                className="mb-6 text-9xl"
              >
                🌀
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl font-bold text-primary"
              >
                Amazing! 🎉
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-2xl text-foreground"
              >
                Uranus spins on its side!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
