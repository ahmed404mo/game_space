"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, ArrowRight, RotateCcw } from "lucide-react"
import { playSuccessSound, playWrong } from "@/lib/sounds"

interface MercuryLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

const planets = [
  { name: "Mercury", emoji: "☀️", correct: true },
  { name: "Venus", emoji: "🌟", correct: false },
  { name: "Earth", emoji: "🌍", correct: false },
]

export default function MercuryLevel({ onComplete, onBack }: MercuryLevelProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")

  // تشغيل صوت السؤال رقم 1 عند الدخول
  useEffect(() => {
    playQuestionSound()
  }, [])

  const playQuestionSound = () => {
    try {
      const audio = new Audio("/soundQuetion/1.mp3")
      audio.play().catch(() => {})
    } catch (e) {
      console.log("Audio play failed")
    }
  }

  const handleSelect = (name: string) => {
    if (status === "correct") return
    if (status === "wrong") {
      setStatus("playing")
      setFeedbackMessage("")
    }
    setSelected(name)
  }

  const handleMainButton = () => {
    if (status === "wrong") {
      setStatus("playing")
      setFeedbackMessage("")
      setSelected(null)
      return
    }

    const selectedPlanet = planets.find(p => p.name === selected)
    
    if (selectedPlanet?.correct) {
      setStatus("correct")
      try { playSuccessSound() } catch (e) {}
      setShowSuccessModal(true)
    } else {
      setStatus("wrong")
      try { playWrong() } catch (e) {}
      setFeedbackMessage("Oops! Too far from the Sun.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* تأثير الخطأ (وميض أحمر) */}
      {status === "wrong" && <div className="absolute inset-0 bg-red-500/20 z-0 animate-pulse" />}

      <Button onClick={onBack} variant="ghost" size="icon" className="absolute left-4 top-4 md:left-8 md:top-8 text-white hover:bg-white/20 z-10">
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-5xl text-center z-10">
        
        {/* رأس الصفحة مع السؤال بتصميمه الجديد */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-12 flex flex-col items-center">
          <div className="mb-4 text-8xl">☀️</div>
          <h2 className="mb-6 text-4xl font-bold text-white">Mercury Challenge</h2>
          
          {/* 🔥 تصميم السؤال الجديد: خلفية بيضاء، نص أسود، حدود دائرية 🔥 */}
          <div className="flex items-center justify-center gap-3 bg-white px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-transform duration-300">
            <p className="text-xl md:text-2xl font-bold text-black">Which planet is closest to the Sun?</p>
            <button 
              onClick={playQuestionSound} 
              className="rounded-full bg-blue-500 p-3 hover:bg-blue-600 transition-colors shadow-md"
            >
              <Volume2 className="h-6 w-6 text-white" />
            </button>
          </div>
        </motion.div>

        {/* رسالة الخطأ */}
        <div className="h-8 mb-8">
            <AnimatePresence>
                {feedbackMessage && !showSuccessModal && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-lg font-bold text-orange-400">
                        {feedbackMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* خيارات الكواكب */}
        <div className="relative mb-12 flex items-center justify-center">
          <div className="absolute left-0 -ml-16 md:-ml-0 text-9xl z-0 opacity-50 md:opacity-100"></div>
          <div className="flex gap-8 md:gap-24 z-10 justify-center flex-wrap">
            {planets.map((planet, index) => (
              <motion.button
                key={planet.name}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                onClick={() => handleSelect(planet.name)}
                disabled={status === "correct"}
                className={`flex flex-col items-center gap-3 transition-all hover:scale-110 
                  ${selected === planet.name 
                    ? "scale-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                    : "opacity-80 hover:opacity-100"
                  }
                  ${selected && selected !== planet.name ? "opacity-40 grayscale" : ""}
                `}
              >
                <div className="text-6xl md:text-7xl">{planet.emoji}</div>
                <p className={`text-sm font-bold md:text-base px-3 py-1 rounded-full ${selected === planet.name ? "bg-white text-black" : "text-white"}`}>
                  {planet.name}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* زر التحقق الرئيسي */}
        <div>
          <Button
            onClick={handleMainButton}
            disabled={!selected && status === "playing"}
            className={`h-16 min-w-[240px] rounded-full text-2xl font-bold text-white shadow-lg transition-all hover:scale-105 disabled:opacity-50
                ${status === "wrong" ? "bg-red-500 hover:bg-red-600" : 
                  status === "correct" ? "bg-green-500 hover:bg-green-600" :
                  "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-blue-500/50"}
            `}
          >
            {status === "playing" ? "Check Answer" : 
             status === "wrong" ? <><RotateCcw className="mr-2 h-6 w-6" /> Try Again</> : 
             "Continue Journey 🚀"}
          </Button>
        </div>
      </div>

      {/* نافذة النجاح (Popup) */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
            <div className="text-center p-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} className="mb-6">
                <div className="relative inline-block">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="text-9xl mb-2 inline-block">
                    ☀️
                  </motion.div>
                </div>
              </motion.div>
              <h3 className="text-6xl font-bold text-yellow-400 mb-2">Brilliant! 🎉</h3>
              <p className="text-2xl text-white mb-8 max-w-md mx-auto">Mercury is indeed the closest planet to the Sun!</p>
              <Button onClick={() => onComplete(3)} className="h-16 px-12 rounded-full text-2xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-xl hover:scale-105 transition-all animate-bounce">
                  Continue Journey <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}