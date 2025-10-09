"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { playSuccessSound, playWrongSound } from "@/lib/sounds"

interface JupiterLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

const sizes = [
  { planet: "Mercury", emoji: "☀️", size: "small" },
  { planet: "Earth", emoji: "🌍", size: "medium" },
  { planet: "Jupiter", emoji: "🪐", size: "large" },
]

export default function JupiterLevel({ onComplete, onBack }: JupiterLevelProps) {
  const [selectedOrder, setSelectedOrder] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSelect = (planet: string) => {
    if (selectedOrder.includes(planet)) return
    const newOrder = [...selectedOrder, planet]
    setSelectedOrder(newOrder)

    if (newOrder.length === 3) {
      const correctOrder = ["Mercury", "Earth", "Jupiter"]
      const isCorrect = newOrder.every((p, i) => p === correctOrder[i])

      if (isCorrect) {
        playSuccessSound()
        setShowSuccess(true)
        setTimeout(() => onComplete(3), 2000)
      } else {
        playWrongSound()
        setShake(true)
        setTimeout(() => {
          setSelectedOrder([])
          setShake(false)
        }, 1000)
      }
    }
  }

  const getSizeClass = (size: string) => {
    switch (size) {
      case "small":
        return "text-4xl md:text-5xl"
      case "medium":
        return "text-6xl md:text-7xl"
      case "large":
        return "text-8xl md:text-9xl"
      default:
        return "text-6xl"
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Button onClick={onBack} variant="ghost" size="icon" className="absolute left-4 top-4 md:left-8 md:top-8">
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-4xl text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8">
          <div className="mb-4 text-8xl">🪐</div>
          <h2 className="mb-2 text-4xl font-bold text-foreground">Jupiter</h2>
          <p className="text-xl text-muted-foreground">Order the planets from smallest to largest!</p>
        </motion.div>

        <div className="mb-8 flex justify-center gap-4">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${
                selectedOrder[num - 1] ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <motion.div
          className="flex items-end justify-center gap-8"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {sizes.map((item, index) => (
            <motion.button
              key={item.planet}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              onClick={() => handleSelect(item.planet)}
              disabled={selectedOrder.includes(item.planet)}
              className={`flex flex-col items-center gap-2 transition-all hover:scale-110 disabled:opacity-30 ${
                selectedOrder.includes(item.planet) ? "grayscale" : ""
              }`}
            >
              <div className={getSizeClass(item.size)}>{item.emoji}</div>
              <p className="text-sm font-bold text-foreground md:text-base">{item.planet}</p>
            </motion.button>
          ))}
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
                🪐
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
                Jupiter is the biggest planet!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
