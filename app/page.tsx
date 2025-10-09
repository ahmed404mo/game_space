"use client"

import { useState } from "react"
import StartScreen from "@/components/start-screen"
import LevelMap from "@/components/level-map"
import EarthLevel from "@/components/levels/earth-level"
import MarsLevel from "@/components/levels/mars-level"
import JupiterLevel from "@/components/levels/jupiter-level"
import SaturnLevel from "@/components/levels/saturn-level"
import NeptuneLevel from "@/components/levels/neptune-level"
import VenusLevel from "@/components/levels/venus-level"
import UranusLevel from "@/components/levels/uranus-level"
import MercuryLevel from "@/components/levels/mercury-level"
import PlutoLevel from "@/components/levels/pluto-level"
import MoonLevel from "@/components/levels/moon-level"
import EndScreen from "@/components/end-screen"
import StarField from "@/components/star-field"

export default function SpaceExplorer() {
  const [gameState, setGameState] = useState<"start" | "map" | "playing" | "end">("start")
  const [currentLevel, setCurrentLevel] = useState(0)
  const [completedLevels, setCompletedLevels] = useState<boolean[]>(new Array(10).fill(false))
  const [starsEarned, setStarsEarned] = useState(0)

  const handleStartGame = () => {
    setGameState("map")
  }

  const handleSelectLevel = (level: number) => {
    setCurrentLevel(level)
    setGameState("playing")
  }

  const handleLevelComplete = (stars: number) => {
    const newCompleted = [...completedLevels]
    newCompleted[currentLevel] = true
    setCompletedLevels(newCompleted)
    setStarsEarned((prev) => prev + stars)

    // Check if all levels completed
    if (newCompleted.every((completed) => completed)) {
      setTimeout(() => setGameState("end"), 1500)
    } else {
      setTimeout(() => setGameState("map"), 1500)
    }
  }

  const handleBackToMap = () => {
    setGameState("map")
  }

  const handlePlayAgain = () => {
    setGameState("start")
    setCurrentLevel(0)
    setCompletedLevels(new Array(10).fill(false))
    setStarsEarned(0)
  }

  const levelComponents = [
    EarthLevel,
    MarsLevel,
    JupiterLevel,
    SaturnLevel,
    NeptuneLevel,
    VenusLevel,
    UranusLevel,
    MercuryLevel,
    PlutoLevel,
    MoonLevel,
  ]

  const CurrentLevelComponent = levelComponents[currentLevel]

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <StarField />

      {gameState === "start" && <StartScreen onStart={handleStartGame} />}

      {gameState === "map" && (
        <LevelMap completedLevels={completedLevels} onSelectLevel={handleSelectLevel} starsEarned={starsEarned} />
      )}

      {gameState === "playing" && CurrentLevelComponent && (
        <CurrentLevelComponent onComplete={handleLevelComplete} onBack={handleBackToMap} />
      )}

      {gameState === "end" && <EndScreen starsEarned={starsEarned} onPlayAgain={handlePlayAgain} />}
    </main>
  )
}
