"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { playSuccessSound } from "@/lib/sounds"

interface MarsLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

export default function MarsLevel({ onComplete, onBack }: MarsLevelProps) {
  const [count, setCount] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const targetCount = 2 // Mars has 2 moons

  const handleCount = () => {
    const newCount = count + 1
    setCount(newCount)

    if (newCount === targetCount) {
      playSuccessSound()
      setShowSuccess(true)
      setTimeout(() => onComplete(3), 2000)
    }
  }

  const handleReset = () => {
    setCount(0)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Button onClick={onBack} variant="ghost" size="icon" className="absolute left-4 top-4 md:left-8 md:top-8">
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-4xl text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8">
          <div className="mb-4 text-8xl">🔴</div>
          <h2 className="mb-2 text-4xl font-bold text-foreground">Mars</h2>
          <p className="text-xl text-muted-foreground">How many moons does Mars have?</p>
          <p className="mt-2 text-lg text-muted-foreground">Click the moons to count them!</p>
        </motion.div>

        {/* Moons to click */}
        <div className="mb-8 flex justify-center gap-8">
          {[0, 1].map((index) => (
            <motion.button
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              onClick={handleCount}
              disabled={count > index}
              className={`text-7xl transition-all hover:scale-110 disabled:opacity-30 md:text-9xl ${
                count > index ? "grayscale" : ""
              }`}
            >
              🌙
            </motion.button>
          ))}
        </div>

        {/* Counter */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <div className="text-6xl font-bold text-primary">{count}</div>
          <p className="mt-2 text-xl text-muted-foreground">Moons counted</p>
        </motion.div>

        {/* Reset button */}
        {count > 0 && count !== targetCount && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button onClick={handleReset} variant="outline" size="lg" className="rounded-full bg-transparent">
              Try Again
            </Button>
          </motion.div>
        )}
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
                🔴
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl font-bold text-primary"
              >
                Correct! 🎉
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-2xl text-foreground"
              >
                Mars has 2 moons: Phobos and Deimos!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
