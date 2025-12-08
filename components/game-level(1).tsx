"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { playSuccessSound } from "@/lib/sounds"

interface GameLevelProps {
  level: number
  onComplete: () => void
  starsEarned: number
}

const levels = [
  {
    planet: "Earth",
    emoji: "🌍",
    question: "Which planet do we live on?",
    options: [
      { name: "Earth", emoji: "🌍", correct: true },
      { name: "Mars", emoji: "🔴", correct: false },
      { name: "Jupiter", emoji: "🪐", correct: false },
    ],
  },
  {
    planet: "Mars",
    emoji: "🔴",
    question: "Which planet is red?",
    options: [
      { name: "Jupiter", emoji: "🪐", correct: false },
      { name: "Mars", emoji: "🔴", correct: true },
      { name: "Neptune", emoji: "🔵", correct: false },
    ],
  },
  {
    planet: "Jupiter",
    emoji: "🪐",
    question: "Which planet is the biggest?",
    options: [
      { name: "Saturn", emoji: "💫", correct: false },
      { name: "Earth", emoji: "🌍", correct: false },
      { name: "Jupiter", emoji: "🪐", correct: true },
    ],
  },
  {
    planet: "Saturn",
    emoji: "💫",
    question: "Which planet has beautiful rings?",
    options: [
      { name: "Mars", emoji: "🔴", correct: false },
      { name: "Saturn", emoji: "💫", correct: true },
      { name: "Neptune", emoji: "🔵", correct: false },
    ],
  },
  {
    planet: "Neptune",
    emoji: "🔵",
    question: "Which planet is blue and very far away?",
    options: [
      { name: "Earth", emoji: "🌍", correct: false },
      { name: "Neptune", emoji: "🔵", correct: true },
      { name: "Jupiter", emoji: "🪐", correct: false },
    ],
  },
  {
    planet: "Venus",
    emoji: "🌟",
    question: "Which planet is the hottest?",
    options: [
      { name: "Venus", emoji: "🌟", correct: true },
      { name: "Mercury", emoji: "☀️", correct: false },
      { name: "Mars", emoji: "🔴", correct: false },
    ],
  },
  {
    planet: "Uranus",
    emoji: "🌀",
    question: "Which planet spins on its side?",
    options: [
      { name: "Saturn", emoji: "💫", correct: false },
      { name: "Uranus", emoji: "🌀", correct: true },
      { name: "Neptune", emoji: "🔵", correct: false },
    ],
  },
  {
    planet: "Mercury",
    emoji: "☀️",
    question: "Which planet is closest to the Sun?",
    options: [
      { name: "Venus", emoji: "🌟", correct: false },
      { name: "Earth", emoji: "🌍", correct: false },
      { name: "Mercury", emoji: "☀️", correct: true },
    ],
  },
  {
    planet: "Pluto",
    emoji: "❄️",
    question: "Which dwarf planet is very cold and small?",
    options: [
      { name: "Mars", emoji: "🔴", correct: false },
      { name: "Pluto", emoji: "❄️", correct: true },
      { name: "Neptune", emoji: "🔵", correct: false },
    ],
  },
  {
    planet: "Moon",
    emoji: "🌙",
    question: "What orbits around Earth?",
    options: [
      { name: "Sun", emoji: "☀️", correct: false },
      { name: "Moon", emoji: "🌙", correct: true },
      { name: "Mars", emoji: "🔴", correct: false },
    ],
  },
]

export default function GameLevel({ level, onComplete, starsEarned }: GameLevelProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const currentLevel = levels[level]

  const handleAnswer = (option: (typeof currentLevel.options)[0]) => {
    setSelectedAnswer(option.name)

    if (option.correct) {
      playSuccessSound()
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
        setSelectedAnswer(null)
        onComplete()
      }, 2000)
    } else {
      setTimeout(() => {
        setSelectedAnswer(null)
      }, 500)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* Stars counter */}
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-card px-4 py-2 md:left-8 md:top-8">
        <Star className="h-6 w-6 fill-primary text-primary" />
        <span className="text-xl font-bold text-foreground">{starsEarned}</span>
      </div>

      {/* Level indicator */}
      <div className="absolute right-4 top-4 rounded-full bg-card px-4 py-2 md:right-8 md:top-8">
        <span className="text-xl font-bold text-foreground">Level {level + 1}/10</span>
      </div>

      <div className="w-full max-w-4xl">
        {/* Astronaut */}
        <motion.div
          className="mb-8 text-center astronaut-float"
          key={`astronaut-${level}`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-8xl">🧑‍🚀</div>
        </motion.div>

        {/* Question */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-5xl">{currentLevel.question}</h2>
        </motion.div>

        {/* Options */}
        <div className="grid gap-4 md:grid-cols-3">
          {currentLevel.options.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`h-auto w-full flex-col gap-4 rounded-3xl bg-card p-8 text-card-foreground transition-all hover:scale-105 hover:bg-secondary hover:text-secondary-foreground ${
                  selectedAnswer === option.name && !option.correct ? "opacity-50" : ""
                }`}
              >
                <div className="text-7xl">{option.emoji}</div>
                <div className="text-2xl font-bold">{option.name}</div>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Success animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="flex justify-center gap-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 0 }}
                      animate={{ y: [-20, 0] }}
                      transition={{
                        delay: i * 0.1,
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 0.6,
                      }}
                    >
                      <Star className="h-16 w-16 fill-primary text-primary" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-bold text-primary"
              >
                Great Job! 🎉
              </motion.h3>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-2xl text-foreground"
              >
                Flying to the next planet...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
