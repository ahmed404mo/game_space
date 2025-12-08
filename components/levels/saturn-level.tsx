"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight } from "lucide-react"
import { playSuccessSound, playWrong } from "@/lib/sounds"

interface SaturnLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

// بيانات السؤال
const question = {
  title: "Ringed Planets",
  text: "Which planets have rings?",
  soundFile: "/soundQuetion/7.mp3", 
  options: [
    { id: "saturn", label: "Saturn", emoji: "🪐", hasRings: true },
    { id: "earth", label: "Earth", emoji: "🌍", hasRings: false },
    { id: "mars", label: "Mars", emoji: "🔴", hasRings: false },
    { id: "uranus", label: "Uranus", emoji: "🌀", hasRings: true },
  ],
}

export default function SaturnLevel({ onComplete, onBack }: SaturnLevelProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")

  // تشغيل الصوت عند الدخول
  useEffect(() => {
    playQuestionSound()
  }, [])

  const playQuestionSound = () => {
    try {
      const audio = new Audio(question.soundFile)
      audio.play().catch(() => {})
    } catch (e) {
      console.log("Audio play failed")
    }
  }

  const toggleOption = (id: string) => {
    if (status === "correct") return

    // إعادة الوضع للطبيعي عند المحاولة مرة أخرى
    if (status === "wrong") {
      setStatus("playing")
      setFeedbackMessage("")
    }

    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  const handleMainButton = () => {
    // 1. إعادة المحاولة
    if (status === "wrong") {
      setStatus("playing")
      setFeedbackMessage("")
      setSelected([])
      return
    }

    // 2. التحقق من الإجابة
    const correctIds = question.options.filter((o) => o.hasRings).map((o) => o.id)
    const selectedCorrect = selected.filter((id) => correctIds.includes(id))
    const selectedWrong = selected.filter((id) => !correctIds.includes(id))

    const isMissing = selectedCorrect.length < correctIds.length
    const hasWrong = selectedWrong.length > 0

    if (!hasWrong && !isMissing) {
      // ✅ إجابة صحيحة (اختار كل الكواكب ذات الحلقات)
      setStatus("correct")
      try { playSuccessSound() } catch (e) {}
      setShowSuccessModal(true)
    } else {
      // ❌ إجابة خاطئة
      setStatus("wrong")
      try { playWrong() } catch (e) {}

      if (hasWrong) {
        setFeedbackMessage("Oops! Some selected planets don't have rings.")
      } else if (isMissing) {
        setFeedbackMessage("You missed one! Look for another ringed planet.")
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* وميض أحمر عند الخطأ */}
      {status === "wrong" && <div className="absolute inset-0 bg-red-500/20 z-0 animate-pulse" />}

      <Button variant="ghost" onClick={onBack} className="absolute left-4 top-4 text-white z-10 hover:bg-white/20">
        <ArrowLeft className="mr-2 h-6 w-6" /> Back
      </Button>

      <div className="w-full max-w-5xl flex flex-col items-center z-10">
        
        {/* 🔥 Header + Question Bar (Unified Style) 🔥 */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8 flex flex-col items-center">
          <div className="mb-4 text-8xl inline-block animate-spin-slow">
            🪐
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-purple-300 mb-6 drop-shadow-lg">{question.title}</h2>
          
          {/* شريط السؤال الأبيض */}
          <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-purple-200">
            <p className="text-xl md:text-2xl font-bold text-black">{question.text}</p>
            <button 
                onClick={playQuestionSound} 
                className="rounded-full bg-blue-500 p-3 hover:bg-blue-600 transition-colors shadow-md group"
            >
              <Volume2 className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* رسالة التغذية الراجعة */}
        <div className="h-8 mb-4">
            <AnimatePresence>
                {feedbackMessage && !showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xl font-bold text-orange-400 drop-shadow-md"
                    >
                        {feedbackMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* الخيارات (Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 w-full max-w-5xl">
          {question.options.map((option, index) => {
            const isSelected = selected.includes(option.id)
            
            // تصميم الأزرار (شفاف مع حدود)
            let borderColor = "border-white/20"
            let bgColor = "bg-slate-800/80" 
            
            if (status === "playing") {
                if (isSelected) { borderColor = "border-blue-500"; bgColor = "bg-blue-500/30" }
            } else if (status === "correct") {
                if (option.hasRings) { borderColor = "border-green-500"; bgColor = "bg-green-500/40" }
            } else if (status === "wrong") {
                if (isSelected && !option.hasRings) { borderColor = "border-red-500"; bgColor = "bg-red-500/40" }
                else if (isSelected && option.hasRings) { borderColor = "border-green-500"; bgColor = "bg-green-500/20" }
            }

            return (
              <motion.div
                key={option.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                    onClick={() => toggleOption(option.id)}
                    disabled={status === "correct"} 
                    className={`h-48 w-full flex-col gap-4 rounded-3xl p-4 transition-all hover:scale-105 border-4 ${borderColor} ${bgColor} relative group`}
                >
                    <div className="text-6xl drop-shadow-2xl transition-transform group-hover:scale-110">
                        {option.emoji}
                    </div>
                    <span className="text-2xl font-bold text-white tracking-wide">{option.label}</span>
                    
                    {/* أيقونات الحالة (صح/خطأ) */}
                    {status !== "playing" && isSelected && option.hasRings && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg animate-in zoom-in">
                            <CheckCircle2 className="text-white h-5 w-5" />
                        </div>
                    )}
                    {status !== "playing" && isSelected && !option.hasRings && (
                        <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1 shadow-lg animate-in zoom-in">
                            <XCircle className="text-white h-5 w-5" />
                        </div>
                    )}
                </Button>
              </motion.div>
            )
          })}
        </div>

        {/* الزر الرئيسي (Check Answer) */}
        <div className="mb-8">
          <Button
            onClick={handleMainButton}
            disabled={selected.length === 0 && status === "playing"}
            className={`h-16 min-w-[260px] rounded-full text-2xl font-bold text-white shadow-xl transition-all hover:scale-105 disabled:opacity-50
                ${status === "wrong" ? "bg-red-500 hover:bg-red-600" : 
                  "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-blue-500/50"}
            `}
          >
            {status === "wrong" ? (
                <> <RotateCcw className="mr-2 h-7 w-7" /> Try Again </>
            ) : (
                "Check Answer"
            )}
          </Button>
        </div>
      </div>

      {/* نافذة النجاح (Popup) */}
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
                <div className="relative inline-block">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="text-9xl mb-2 inline-block"
                  >
                    💫
                  </motion.div>
                </div>
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-bold text-yellow-400 mb-2"
              >
                Excellent! 🎉
              </motion.h3>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl text-white mb-8 max-w-md mx-auto"
              >
                Both Saturn and Uranus have beautiful rings!
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                    onClick={() => onComplete(3)} 
                    className="h-14 px-8 rounded-full text-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-xl hover:scale-105 transition-all animate-bounce"
                >
                    Continue Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}