"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, ArrowLeft, Volume2, ArrowRight, RotateCcw } from "lucide-react"
import { playSuccessSound, playWrong } from "@/lib/sounds"

interface MoonLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

const options = [
  { name: "Earth", emoji: "🌍", correct: true },
  { name: "Mars", emoji: "🔴", correct: false },
  { name: "Sun", emoji: "☀️", correct: false },
]

export default function MoonLevel({ onComplete, onBack }: MoonLevelProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")

  // تشغيل صوت السؤال رقم 4 عند الدخول
  useEffect(() => {
    playQuestionSound()
  }, [])

  const playQuestionSound = () => {
    try {
      const audio = new Audio("/soundQuetion/4.mp3")
      audio.play().catch(() => {})
    } catch (e) {
      console.log("Audio play failed")
    }
  }

  const handleSelect = (name: string) => {
    if (status === "correct") return

    // إعادة الوضع للعب عند اختيار جديد
    if (status === "wrong") {
      setStatus("playing")
      setFeedbackMessage("")
    }
    
    setSelected(name)
  }

  const handleMainButton = () => {
    // 1. إعادة المحاولة: مسح الاختيار
    if (status === "wrong") {
      setStatus("playing")
      setFeedbackMessage("")
      setSelected(null)
      return
    }

    // 2. التحقق من الإجابة
    const selectedOption = options.find(o => o.name === selected)
    
    if (selectedOption?.correct) {
      // ✅ إجابة صحيحة
      setStatus("correct")
      try { playSuccessSound() } catch (e) {}
      setShowSuccessModal(true)
    } else {
      // ❌ إجابة خاطئة
      setStatus("wrong")
      try { playWrong() } catch (e) {}
      setFeedbackMessage("Oops! Try again.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* وميض أحمر عند الخطأ */}
      {status === "wrong" && <div className="absolute inset-0 bg-red-500/20 z-0 animate-pulse" />}

      <Button onClick={onBack} variant="ghost" size="icon" className="absolute left-4 top-4 md:left-8 md:top-8 text-white hover:bg-white/20 z-10">
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-4xl text-center z-10">
        
        {/* الجزء العلوي: العنوان + السؤال بالتصميم الجديد */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-12 flex flex-col items-center">
          <div className="mb-4 text-8xl">🌙</div>
          <h2 className="mb-6 text-4xl font-bold text-white">The Moon</h2>
          
          {/* 🔥 تصميم السؤال: شريط أبيض + نص أسود 🔥 */}
          <div className="flex items-center justify-center gap-3 bg-white px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-transform duration-300 border-4 border-gray-200">
            <p className="text-xl md:text-2xl font-bold text-black">What does the Moon orbit around?</p>
            <button 
              onClick={playQuestionSound} 
              className="rounded-full bg-blue-500 p-3 hover:bg-blue-600 transition-colors shadow-md group"
            >
              <Volume2 className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
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

        {/* الخيارات */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          {options.map((option, index) => {
            const isSelected = selected === option.name
            
            // تصميم الأزرار (شفاف مع حدود)
            let borderColor = "border-white/20"
            let bgColor = "bg-slate-800/80"

            if (status === "playing" && isSelected) {
                borderColor = "border-blue-500"
                bgColor = "bg-blue-500/30"
            } else if (status === "correct" && isSelected) {
                borderColor = "border-green-500"
                bgColor = "bg-green-500/40"
            } else if (status === "wrong" && isSelected) {
                borderColor = "border-red-500"
                bgColor = "bg-red-500/40"
            }

            return (
              <motion.div
                key={option.name}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.15 }}
              >
                <Button
                  onClick={() => handleSelect(option.name)}
                  disabled={status === "correct"}
                  className={`h-64 w-full flex-col gap-6 rounded-3xl p-8 text-white transition-all hover:scale-105 border-4 ${borderColor} ${bgColor}`}
                >
                  <div className="text-8xl">{option.emoji}</div>
                  <div className="text-2xl font-bold">{option.name}</div>
                  
                  {status !== "playing" && isSelected && option.correct && (
                      <div className="absolute top-4 right-4 bg-green-500 rounded-full p-1 shadow-lg">
                        <CheckCircle2 className="text-white h-6 w-6" />
                      </div>
                  )}
                  {status !== "playing" && isSelected && !option.correct && (
                      <div className="absolute top-4 right-4 bg-red-500 rounded-full p-1 shadow-lg">
                        <XCircle className="text-white h-6 w-6" />
                      </div>
                  )}
                </Button>
              </motion.div>
            )
          })}
        </div>

        {/* زر التحقق الرئيسي */}
        <div>
          <Button
            onClick={handleMainButton}
            disabled={!selected && status === "playing"}
            className={`h-16 min-w-[260px] rounded-full text-2xl font-bold text-white shadow-xl transition-all hover:scale-105 disabled:opacity-50
                ${status === "wrong" ? "bg-red-500 hover:bg-red-600" : 
                  "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-blue-500/50"}
            `}
          >
            {status === "playing" ? "Check Answer" : 
             status === "wrong" ? <><RotateCcw className="mr-2 h-7 w-7" /> Try Again</> : 
             "Continue Journey 🚀"}
          </Button>
        </div>
      </div>

      {/* 🌟 نافذة النجاح (Popup) 🌟 */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md"
          >
            <div className="text-center p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                {/* أنيميشن القمر يدور حول الأرض */}
                <div className="relative inline-block">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="text-5xl absolute -right-4 -top-4"
                  >
                    🌙
                  </motion.div>
                  <div className="text-9xl">🌍</div>
                </div>
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-bold text-yellow-400 mb-2"
              >
                Perfect! 🎉
              </motion.h3>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl text-white mb-8 max-w-md mx-auto"
              >
                The Moon orbits around Earth!
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                    onClick={() => onComplete(3)} 
                    className="h-16 px-12 rounded-full text-2xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-xl hover:scale-105 transition-all animate-bounce"
                >
                    Continue Journey <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}