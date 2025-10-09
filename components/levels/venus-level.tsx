"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Flame, Snowflake } from "lucide-react"
import { playSuccessSound, playWrongSound } from "@/lib/sounds"

interface VenusLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

export default function VenusLevel({ onComplete, onBack }: VenusLevelProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSelect = (choice: string) => {
    setSelected(choice)

    if (choice === "hot") {
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
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-12 text-center">
          <div className="mb-4 text-8xl">🌟</div>
          <h2 className="mb-2 text-4xl font-bold text-foreground">Venus</h2>
          <p className="text-xl text-muted-foreground">Is Venus hot or cold?</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Button
              onClick={() => handleSelect("hot")}
              disabled={selected !== null}
              className={`h-64 w-full flex-col gap-6 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white transition-all hover:scale-105 ${
                selected === "cold" ? "opacity-50" : ""
              }`}
            >
              <Flame className="h-24 w-24" />
              <div className="text-3xl font-bold">HOT</div>
            </Button>
          </motion.div>

          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Button
              onClick={() => handleSelect("cold")}
              disabled={selected !== null}
              className={`h-64 w-full flex-col gap-6 rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-600 p-8 text-white transition-all hover:scale-105 ${
                selected === "cold" && selected !== null ? "opacity-50" : ""
              }`}
            >
              <Snowflake className="h-24 w-24" />
              <div className="text-3xl font-bold">COLD</div>
            </Button>
          </motion.div>
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
                🌟
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
                Venus is the hottest planet!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
