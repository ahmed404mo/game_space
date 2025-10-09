"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"
import { playRocketSound } from "@/lib/sounds"

interface StartScreenProps {
  onStart: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const handleStart = () => {
    playRocketSound()
    setTimeout(() => onStart(), 300)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          className="mb-8"
          initial={{ y: -50 }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <div className="mx-auto mb-6 text-9xl">🧑‍🚀</div>
        </motion.div>

        <motion.h1
          className="mb-4 font-sans text-6xl font-bold text-foreground md:text-8xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Space Explorer
        </motion.h1>

        <motion.p
          className="mb-8 text-balance text-xl text-muted-foreground md:text-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Help the astronaut travel through space and learn about the planets!
        </motion.p>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <Button
            onClick={handleStart}
            size="lg"
            className="gap-2 rounded-full bg-primary px-8 py-6 text-xl font-bold text-primary-foreground hover:bg-primary/90"
          >
            <Rocket className="h-6 w-6" />
            Start Mission
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
