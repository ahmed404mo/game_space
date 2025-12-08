"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, ArrowLeft, Volume2, ArrowRight, RotateCcw } from "lucide-react"
import { playSuccessSound, playWrong } from "@/lib/sounds"

interface MarsLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

const question = {
  title: "The Red Planet",
  text: "What color is Mars?",
  options: [
    { id: "red", label: "Red", emoji: "🔴", isCorrect: true },
    { id: "blue", label: "Blue", emoji: "🔵", isCorrect: false },
    { id: "yellow", label: "Yellow", emoji: "🟡", isCorrect: false },
    { id: "green", label: "Green", emoji: "🟢", isCorrect: false },
  ],
}

export default function MarsLevel({ onComplete, onBack }: MarsLevelProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")

  // تشغيل الصوت عند الدخول (السؤال رقم 5)
  useEffect(() => {
    playQuestionSound()
  }, [])

  const playQuestionSound = () => {
    try {
      const audio = new Audio("/soundQuetion/5.mp3")
      audio.play().catch(() => {})
    } catch (e) {
      console.log("Audio play failed")
    }
  }

  const handleSelect = (id: string) => {
    if (status === "correct") return

    // إعادة الوضع للعب عند اختيار جديد
    if (status === "wrong") {
      setStatus("playing")
      setFeedbackMessage("")
    }
    
    setSelected(id)
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
    const selectedOption = question.options.find(o => o.id === selected)
    
    if (selectedOption?.isCorrect) {
      // ✅ إجابة صحيحة
      setStatus("correct")
      try { playSuccessSound() } catch (e) {}
      setShowSuccessModal(true)
    } else {
      // ❌ إجابة خاطئة
      setStatus("wrong")
      try { playWrong() } catch (e) {}
      setFeedbackMessage("Oops! Wrong color.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* وميض أحمر عند الخطأ */}
      {status === "wrong" && <div className="absolute inset-0 bg-red-500/20 z-0 animate-pulse" />}

      <Button onClick={onBack} variant="ghost" size="icon" className="absolute left-4 top-4 md:left-8 md:top-8 text-white hover:bg-white/20 z-10">
        <ArrowLeft className="h-6 w-6" />
      </Button>

      {/* ✅ تصميم بدون خلفية (عائم) */}
      <div className="w-full max-w-5xl flex flex-col items-center z-10">
        
        {/* الجزء العلوي: العنوان + شريط السؤال الأبيض */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8 flex flex-col items-center">
          <div className="mb-4 text-8xl inline-block animate-pulse">
            🔴
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-red-400 mb-6 drop-shadow-lg">{question.title}</h2>
          
          {/* 🔥 تصميم السؤال: شريط أبيض + نص أسود 🔥 */}
          <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-red-200">
            <p className="text-xl md:text-2xl font-bold text-black">{question.text}</p>
            <button 
                onClick={playQuestionSound} 
                className="rounded-full bg-red-500 p-3 hover:bg-red-600 transition-colors shadow-md group"
            >
              <Volume2 className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* رسالة الخطأ */}
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

        {/* خيارات الإجابة */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 mb-8 w-full max-w-4xl">
          {question.options.map((option, index) => {
            const isSelected = selected === option.id
            
            // تصميم الأزرار (شفاف مع حدود)
            let borderColor = "border-white/20"
            let bgColor = "bg-slate-800/80"

            if (status === "playing" && isSelected) {
                borderColor = "border-red-500"
                bgColor = "bg-red-500/30"
            } else if (status === "correct" && isSelected) {
                borderColor = "border-green-500"
                bgColor = "bg-green-500/40"
            } else if (status === "wrong" && isSelected) {
                borderColor = "border-red-500"
                bgColor = "bg-red-500/40"
            }

            return (
              <motion.div
                key={option.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                <Button
                  onClick={() => handleSelect(option.id)}
                  disabled={status === "correct"}
                  className={`h-40 w-full flex-col gap-4 rounded-3xl p-6 transition-all hover:scale-105 border-4 ${borderColor} ${bgColor}`}
                >
                  <span className="text-5xl drop-shadow-md">{option.emoji}</span>
                  <span className="text-xl font-bold text-white tracking-wide">{option.label}</span>
                  
                  {status !== "playing" && isSelected && option.isCorrect && (
                      <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg">
                        <CheckCircle2 className="text-white h-5 w-5" />
                      </div>
                  )}
                  {status !== "playing" && isSelected && !option.isCorrect && (
                      <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1 shadow-lg">
                        <XCircle className="text-white h-5 w-5" />
                      </div>
                  )}
                </Button>
              </motion.div>
            )
          })}
        </div>

        {/* الزر الرئيسي */}
        <div className="mb-8">
          <Button
            onClick={handleMainButton}
            disabled={!selected && status === "playing"}
            className={`h-16 min-w-[260px] rounded-full text-2xl font-bold text-white shadow-xl transition-all hover:scale-105 disabled:opacity-50
                ${status === "wrong" ? "bg-red-500 hover:bg-red-600" : 
                  "bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-red-500/50"}
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
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-9xl mb-2 inline-block"
                  >
                    🔴
                  </motion.div>
                </div>
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-bold text-red-400 mb-2"
              >
                Correct! 🎉
              </motion.h3>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl text-white mb-8 max-w-md mx-auto"
              >
                Mars is known as the Red Planet!
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                    onClick={() => onComplete(3)} 
                    className="h-16 px-10 rounded-full text-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-xl hover:scale-105 transition-all animate-bounce"
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