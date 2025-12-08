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

// ترتيب الكواكب حسب الرحلة
const planets = [
  { name: "Mercury", emoji: "☀️", color: "from-gray-400 to-orange-300" }, // 0
  { name: "Venus", emoji: "🌟", color: "from-yellow-300 to-orange-400" }, // 1
  { name: "Earth", emoji: "🌍", color: "from-blue-500 to-green-500" },   // 2
  { name: "Moon", emoji: "🌙", color: "from-gray-200 to-gray-400" },     // 3
  { name: "Mars", emoji: "🔴", color: "from-red-500 to-orange-500" },    // 4
  { name: "Jupiter", emoji: "🪐", color: "from-orange-400 to-yellow-500" },// 5
  { name: "Saturn", emoji: "💫", color: "from-yellow-400 to-amber-500" }, // 6
  { name: "Uranus", emoji: "🌀", color: "from-cyan-400 to-blue-400" },    // 7
  { name: "Neptune", emoji: "🔵", color: "from-blue-600 to-cyan-500" },   // 8
  { name: "Pluto", emoji: "❄️", color: "from-gray-300 to-blue-300" },    // 9
]

// خريطة أسماء ملفات الصوت للكواكب (حسب الصورة المرفقة)
const planetSounds: { [key: string]: string } = {
  "Mercury": "marquri.mp3",
  "Venus": "veuns.mp3",
  "Earth": "earth.mp3", // افترضت وجوده
  "Moon": "moon.mp3",   // افترضت وجوده
  "Mars": "mars.mp3",
  "Jupiter": "juputer.mp3",
  "Saturn": "suturn.mp3",
  "Uranus": "urns.mp3",
  "Neptune": "Neptune.mp3",
  "Pluto": "pluto.mp3"  // افترضت وجوده
}

const pathPoints = [
  { x: 10, y: 80 }, { x: 18, y: 65 }, { x: 28, y: 52 }, { x: 39, y: 40 },
  { x: 50, y: 35 }, { x: 61, y: 40 }, { x: 72, y: 52 }, { x: 82, y: 65 },
  { x: 90, y: 80 }, { x: 80, y: 92 },
]

export default function LevelMap({ completedLevels, onSelectLevel, starsEarned }: LevelMapProps) {
  
  const currentLevelIndex = completedLevels.findIndex((completed) => !completed)
  const rocketPosition = currentLevelIndex === -1 ? planets.length - 1 : Math.max(0, currentLevelIndex)

  const pathString = pathPoints
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`
      return `Q ${point.x - 5} ${point.y - 5} ${point.x} ${point.y}`
    })
    .join(" ")

  const handleLevelSelect = (index: number) => {
    const isLocked = index > 0 && !completedLevels[index - 1]
    if (!isLocked) {
      try { playButtonClick() } catch (e) {}
      onSelectLevel(index)
    }
  }

  // دالة تشغيل صوت اسم الكوكب من الملفات
  const playPlanetName = (planetName: string) => {
    const fileName = planetSounds[planetName]
    if (fileName) {
      try {
        const audio = new Audio(`/names/${fileName}`)
        audio.play().catch(() => console.log("Audio play failed"))
      } catch (e) {
        console.log("Audio error")
      }
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 pb-32">
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-card px-6 py-3 shadow-lg md:left-8 md:top-8 z-50">
        <Star className="h-7 w-7 fill-primary text-primary" />
        <span className="text-2xl font-bold text-foreground">{starsEarned}</span>
      </div>

      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute left-1/2 top-8 -translate-x-1/2 z-50">
        {/* <h1 className="text-balance text-center text-4xl font-bold text-foreground md:text-5xl">Mission Control</h1> */}
      </motion.div>

      <div className="relative h-[500px] w-full max-w-6xl md:h-[600px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path d={pathString} fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" strokeDasharray="4 4" opacity="0.3" />
          <motion.path d={pathString} fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: rocketPosition / (planets.length - 1) }} transition={{ duration: 1, ease: "easeInOut" }} />
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
              className="absolute group cursor-pointer"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 20,
              }}
              // 🔥 تشغيل الصوت عند الوقوف على الكوكب 🔥
              onMouseEnter={() => playPlanetName(planet.name)}
            >
              <Button
                onClick={() => handleLevelSelect(index)}
                disabled={isLocked}
                className={`relative h-14 w-14 md:h-20 md:w-20 rounded-full bg-gradient-to-br p-0 shadow-xl transition-all duration-300 hover:scale-125 hover:shadow-2xl disabled:opacity-50 ${planet.color}`}
              >
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <div className="text-2xl md:text-3xl">{planet.emoji}</div>
                  {isCompleted && (
                    <div className="absolute -right-1 -top-1 rounded-full bg-green-500 p-1 shadow-sm">
                      <CheckCircle2 className="h-3 w-3 text-white md:h-4 md:w-4" />
                    </div>
                  )}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                      <Lock className="h-4 w-4 text-white md:h-6 md:w-6" />
                    </div>
                  )}
                </div>
              </Button>
              <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap z-30 pointer-events-none">
                <p className="rounded-full bg-slate-900/80 px-3 py-1 text-xs md:text-sm font-bold text-white shadow-lg border border-slate-700/50">
                  {planet.name}
                </p>
              </div>
            </motion.div>
          )
        })}

        <motion.div
          className="absolute z-10 pointer-events-none"
          initial={false}
          animate={{
            left: `${pathPoints[rocketPosition].x}%`,
            top: `${pathPoints[rocketPosition].y}%`,
          }}
          transition={{ duration: 1.5, ease: "easeInOut", type: "spring", damping: 15 }}
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="relative">
            <div className="relative">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 rounded-full bg-primary/30 blur-xl" />
              <Rocket className="relative h-10 w-10 md:h-12 md:w-12 fill-primary text-primary" />
            </div>
            <motion.div animate={{ scaleY: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 0.3, repeat: Infinity }} className="absolute left-1/2 top-full h-3 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-orange-500 to-red-500 md:h-5 md:w-2.5" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}