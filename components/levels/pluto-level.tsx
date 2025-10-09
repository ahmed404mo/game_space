"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { playSuccessSound } from "@/lib/sounds"

interface PlutoLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

const sizes = [
  { name: "Big", size: "large", correct: false },
  { name: "Small", size: "small", correct: true },
]

export default function PlutoLevel({ onComplete, onBack }: PlutoLevelProps) {
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
          <div className="mb-4 text-8xl">❄️</div>
          <h2 className="mb-2 text-4xl font-bold text-foreground">Pluto</h2>
          <p className="text-xl text-muted-foreground">Is Pluto big or small?</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {sizes.map((size, index) => (
            <motion.div
              key={size.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2, type: "spring" }}
            >
              <Button
                onClick={() => handleSelect(size.name, size.correct)}
                disabled={selected !== null}
                className={`h-80 w-full flex-col gap-8 rounded-3xl bg-card p-8 text-card-foreground transition-all hover:scale-105 hover:bg-secondary ${
                  selected === size.name && !size.correct ? "opacity-50" : ""
                }`}
              >
                <div className={size.size === "large" ? "text-9xl" : "text-6xl"}>❄️</div>
                <div className="text-3xl font-bold">{size.name}</div>
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
                className="mb-6 text-9xl"
              >
                ❄️
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
                Pluto is a small dwarf planet!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
