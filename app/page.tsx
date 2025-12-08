"use client"

import { useState } from "react"
import StartScreen from "@/components/start-screen"
import LevelMap from "@/components/level-map"

// استيراد جميع المستويات
import MercuryLevel from "@/components/levels/mercury-level"
import VenusLevel from "@/components/levels/venus-level"
import EarthLevel from "@/components/levels/earth-level"
import MoonLevel from "@/components/levels/moon-level"
import MarsLevel from "@/components/levels/mars-level"
import JupiterLevel from "@/components/levels/jupiter-level"
import SaturnLevel from "@/components/levels/saturn-level"
import UranusLevel from "@/components/levels/uranus-level"
import NeptuneLevel from "@/components/levels/neptune-level"
import PlutoLevel from "@/components/levels/pluto-level"

import EndScreen from "@/components/end-screen"
import ProgressBar from "@/components/progress-bar"

// ✅ هذا الترتيب الجديد يطابق ترتيب الخريطة (level-map.tsx)
const LEVELS = [
  { id: 0, name: "Mercury", component: MercuryLevel }, // الكوكب 1
  { id: 1, name: "Venus", component: VenusLevel },     // الكوكب 2
  { id: 2, name: "Earth", component: EarthLevel },     // الكوكب 3
  { id: 3, name: "Moon", component: MoonLevel },       // الكوكب 4
  { id: 4, name: "Mars", component: MarsLevel },       // الكوكب 5
  { id: 5, name: "Jupiter", component: JupiterLevel }, // الكوكب 6
  { id: 6, name: "Saturn", component: SaturnLevel },   // الكوكب 7
  { id: 7, name: "Uranus", component: UranusLevel },   // الكوكب 8
  { id: 8, name: "Neptune", component: NeptuneLevel }, // الكوكب 9
  { id: 9, name: "Pluto", component: PlutoLevel },     // الكوكب 10
]

export default function Page() {
  const [gameState, setGameState] = useState<"start" | "map" | "playing" | "end">("start")
  const [currentLevel, setCurrentLevel] = useState(0)
  
  // مصفوفة لتخزين حالة المستويات (10 مستويات)
  const [completedLevels, setCompletedLevels] = useState<boolean[]>(new Array(LEVELS.length).fill(false))
  const [starsEarned, setStarsEarned] = useState(0)

  const handleStartGame = () => {
    setGameState("map")
  }

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevel(levelId)
    setGameState("playing")
  }

  const handleLevelComplete = (stars: number) => {
    const newCompletedLevels = [...completedLevels]
    
    // تسجيل المستوى الحالي كمكتمل
    newCompletedLevels[currentLevel] = true
    setCompletedLevels(newCompletedLevels)
    setStarsEarned(starsEarned + stars)

    if (newCompletedLevels.every(Boolean)) {
      setGameState("end")
    } else {
      // العودة للخريطة لفتح الكوكب التالي
      setGameState("map")
    }
  }

  const handleBackToMap = () => {
    setGameState("map")
  }

  const handleRestart = () => {
    setGameState("start")
    setCurrentLevel(0)
    setCompletedLevels(new Array(LEVELS.length).fill(false))
    setStarsEarned(0)
  }

  const showProgressBar = gameState === "map" || gameState === "playing"
  
  // تحديد المكون الذي سيتم عرضه بناءً على المستوى المختار
  const CurrentLevelComponent = LEVELS[currentLevel]?.component

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-950 overflow-y-auto overflow-x-hidden">
      {showProgressBar && <ProgressBar completedLevels={completedLevels} starsEarned={starsEarned} />}

      <div className={showProgressBar ? "pt-24 pb-12" : ""}>
        {gameState === "start" && <StartScreen onStart={handleStartGame} />}

        {gameState === "map" && (
          <LevelMap 
            completedLevels={completedLevels} 
            onSelectLevel={handleSelectLevel} 
            starsEarned={starsEarned} 
          />
        )}

        {/* key={currentLevel} يضمن إعادة تحميل المكون عند تغيير المستوى */}
        {gameState === "playing" && CurrentLevelComponent && (
          <div key={currentLevel}>
            <CurrentLevelComponent onComplete={handleLevelComplete} onBack={handleBackToMap} />
          </div>
        )}

        {gameState === "end" && (
          <EndScreen totalStars={starsEarned} totalLevels={LEVELS.length} onRestart={handleRestart} />
        )}
      </div>
    </div>
  )
}