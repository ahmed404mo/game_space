"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star, Lock, CheckCircle2, Rocket } from "lucide-react"
import { playButtonClick } from "@/lib/sounds"

interface LevelMapProps {
  completedLevels: boolean[]
  onSelectLevel: (level: number) => void
  starsEarned: number
}

const planets = [
  { name: "Earth", emoji: "🌍", color: "from-blue-500 to-green-500" },
  { name: "Mars", emoji: "🔴", color: "from-red-500 to-orange-500" },
  { name: "Jupiter", emoji: "🪐", color: "from-orange-400 to-yellow-500" },
  { name: "Saturn", emoji: "💫", color: "from-yellow-400 to-amber-500" },
  { name: "Neptune", emoji: "🔵", color: "from-blue-600 to-cyan-500" },
  { name: "Venus", emoji: "🌟", color: "from-yellow-300 to-orange-400" },
  { name: "Uranus", emoji: "🌀", color: "from-cyan-400 to-blue-400" },
  { name: "Mercury", emoji: "☀️", color: "from-gray-400 to-orange-300" },
  { name: "Pluto", emoji: "❄️", color: "from-gray-300 to-blue-300" },
  { name: "Moon", emoji: "🌙", color: "from-gray-200 to-gray-400" },
]

const pathPoints = [
  { x: 10, y: 80 }, // Earth - bottom left
  { x: 25, y: 60 }, // Mars
  { x: 35, y: 40 }, // Jupiter
  { x: 50, y: 30 }, // Saturn
  { x: 65, y: 35 }, // Neptune
  { x: 75, y: 50 }, // Venus
  { x: 85, y: 65 }, // Uranus
  { x: 75, y: 80 }, // Mercury
  { x: 55, y: 85 }, // Pluto
  { x: 35, y: 75 }, // Moon
]

export default function LevelMap({ completedLevels, onSelectLevel, starsEarned }: LevelMapProps) {
  const currentLevelIndex = completedLevels.findIndex((completed) => !completed)
  const rocketPosition = currentLevelIndex === -1 ? 9 : Math.max(0, currentLevelIndex)

  const pathString = pathPoints
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`
      return `Q ${point.x - 5} ${point.y - 5} ${point.x} ${point.y}`
    })
    .join(" ")

  const handleLevelSelect = (index: number) => {
    const isLocked = index > 0 && !completedLevels[index - 1]
    if (!isLocked) {
      playButtonClick()
      onSelectLevel(index)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* Stars counter */}
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-card px-6 py-3 shadow-lg md:left-8 md:top-8">
        <Star className="h-7 w-7 fill-primary text-primary" />
        <span className="text-2xl font-bold text-foreground">{starsEarned}</span>
      </div>

      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute left-1/2 top-8 -translate-x-1/2"
      >
        <h1 className="text-balance text-center text-4xl font-bold text-foreground md:text-5xl">Space Journey Map</h1>
      </motion.div>

      {/* Map Container */}
      <div className="relative h-[600px] w-full max-w-6xl md:h-[700px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Background path */}
          <motion.path
            d={pathString}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.3"
            strokeDasharray="2 2"
            opacity="0.3"
          />

          {/* Completed path */}
          <motion.path
            d={pathString}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: rocketPosition / (planets.length - 1) }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>

        {planets.map((planet, index) => {
          const isCompleted = completedLevels[index]
          const isLocked = index > 0 && !completedLevels[index - 1]
          const point = pathPoints[index]

          return (
            <motion.div
              key={planet.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="absolute"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Button
                onClick={() => handleLevelSelect(index)}
                disabled={isLocked}
                className={`group relative h-20 w-20 rounded-full bg-gradient-to-br p-0 shadow-xl transition-all hover:scale-110 hover:shadow-2xl disabled:opacity-50 md:h-28 md:w-28 ${planet.color}`}
              >
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <div className="text-3xl md:text-5xl">{planet.emoji}</div>
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 rounded-full bg-green-500 p-1"
                    >
                      <CheckCircle2 className="h-5 w-5 text-white md:h-6 md:w-6" />
                    </motion.div>
                  )}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                      <Lock className="h-6 w-6 text-white md:h-8 md:w-8" />
                    </div>
                  )}
                </div>
              </Button>

              {/* Planet name */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap"
              >
                <p className="rounded-full bg-card/80 px-3 py-1 text-xs font-bold text-foreground shadow-md md:text-sm">
                  {planet.name}
                </p>
              </motion.div>
            </motion.div>
          )
        })}

        <motion.div
          className="absolute z-10"
          initial={false}
          animate={{
            left: `${pathPoints[rocketPosition].x}%`,
            top: `${pathPoints[rocketPosition].y}%`,
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            type: "spring",
            damping: 15,
          }}
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* Rocket with glow effect */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
              />
              <Rocket className="relative h-12 w-12 fill-primary text-primary md:h-16 md:w-16" />
            </div>

            {/* Rocket flame */}
            <motion.div
              animate={{
                scaleY: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 0.3,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="absolute left-1/2 top-full h-4 w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-orange-500 to-red-500 md:h-6 md:w-3"
            />
          </motion.div>
        </motion.div>

        {/* Instruction text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          <p className="text-balance rounded-full bg-card/90 px-6 py-3 text-center text-sm font-medium text-foreground shadow-lg md:text-base">
            🚀 Click on a planet to start your adventure!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
