"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star, RotateCcw } from "lucide-react"

interface EndScreenProps {
  starsEarned: number
  onPlayAgain: () => void
}

export default function EndScreen({ starsEarned, onPlayAgain }: EndScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Trophy/Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="mx-auto mb-6 text-9xl">🏆</div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="mb-4 font-sans text-5xl font-bold text-primary md:text-7xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Mission Complete!
        </motion.h1>

        <motion.p
          className="mb-8 text-balance text-2xl text-foreground md:text-3xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          You're a Space Hero! 🧑‍🚀
        </motion.p>

        {/* Stars earned */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="mb-8 flex items-center justify-center gap-2"
        >
          <Star className="h-12 w-12 fill-primary text-primary" />
          <span className="text-6xl font-bold text-primary">{starsEarned}</span>
          <span className="text-3xl text-muted-foreground">/ 5</span>
        </motion.div>

        {/* Certificate message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-8 rounded-3xl bg-card p-8"
        >
          <p className="text-balance text-xl text-card-foreground md:text-2xl">
            Congratulations, Commander! 🎖️
            <br />
            You explored all the planets of our Solar System!
          </p>
        </motion.div>

        {/* Play again button */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2 }}>
          <Button
            onClick={onPlayAgain}
            size="lg"
            className="gap-2 rounded-full bg-secondary px-8 py-6 text-xl font-bold text-secondary-foreground hover:bg-secondary/90"
          >
            <RotateCcw className="h-6 w-6" />
            Play Again
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
