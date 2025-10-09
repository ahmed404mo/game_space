"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { playSuccessSound, playWrongSound } from "@/lib/sounds"

interface NeptuneLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

const colors = [
  { name: "Blue", color: "bg-blue-500", correct: true },
  { name: "Red", color: "bg-red-500", correct: false },
  { name: "Green", color: "bg-green-500", correct: false },
  { name: "Yellow", color: "bg-yellow-500", correct: false },
]

export default function NeptuneLevel({ onComplete, onBack }: NeptuneLevelProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSelect = (name: string, correct: boolean) => {
    setSelected(name)

    if (correct) {
      playSuccessSound()
      setShowSuccess(true)
      setTimeout(() => onComplete(3), 2000)
    } else {
      playWrongSound()
      setShake(true)
      setTimeout(() => {
        setSelected(null)
        setShake(false)
      }, 500)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Button onClick={onBack} variant="ghost" size="icon" className="absolute left-4 top-4 md:left-8 md:top-8">
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-4xl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8 text-center">
          <div className="mb-4 text-8xl">🔵</div>
          <h2 className="mb-2 text-4xl font-bold text-foreground">Neptune</h2>
          <p className="text-xl text-muted-foreground">What color is Neptune?</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {colors.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              <Button
                onClick={() => handleSelect(item.name, item.correct)}
                disabled={selected !== null}
                className={`h-40 w-full flex-col gap-4 rounded-3xl p-6 transition-all hover:scale-105 ${
                  selected === item.name && !item.correct ? "opacity-50" : ""
                }`}
              >
                <div className={`h-20 w-20 rounded-full ${item.color} shadow-lg`} />
                <div className="text-xl font-bold text-foreground">{item.name}</div>
              </Button>
            </motion.div>
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
                🔵
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
                Neptune is a beautiful blue planet!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
