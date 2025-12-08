"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, ArrowLeft, Volume2, ArrowRight, RotateCcw } from "lucide-react"
import { playSuccessSound, playWrong } from "@/lib/sounds"

interface NeptuneLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

const colors = [
  { name: "Blue", color: "bg-blue-500", correct: true },
  { name: "Red", color: "bg-red-500", correct: false },
  { name: "Green", color: "bg-green-500", correct: false },
  { name: "Yellow", color: "bg-yellow-500", correct: false },
]

export default function NeptuneLevel({ onComplete, onBack }: NeptuneLevelProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")

  // تشغيل الصوت عند الدخول (السؤال رقم 9)
  useEffect(() => {
    playQuestionSound()
  }, [])

  const playQuestionSound = () => {
    try {
      const audio = new Audio("/soundQuetion/8.mp3")
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
    const selectedColor = colors.find(c => c.name === selected)
    
    if (selectedColor?.correct) {
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

      {/* ✅ تصميم بدون خلفية (عائم) */}
      <div className="w-full max-w-5xl flex flex-col items-center z-10">
        
        {/* الجزء العلوي: العنوان + شريط السؤال الأبيض */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8 flex flex-col items-center">
          <div className="mb-4 text-8xl inline-block">
            🔵
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6 drop-shadow-lg">Neptune Challenge</h2>
          
          {/* 🔥 تصميم السؤال: شريط أبيض + نص أسود 🔥 */}
          <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-cyan-200">
            <p className="text-xl md:text-2xl font-bold text-black">What color is Neptune?</p>
            <button 
                onClick={playQuestionSound} 
                className="rounded-full bg-cyan-500 p-3 hover:bg-cyan-600 transition-colors shadow-md group"
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
          {colors.map((item, index) => {
            const isSelected = selected === item.name
            
            // تصميم الأزرار (شفاف مع حدود)
            let borderColor = "border-white/20"
            let bgColor = "bg-slate-800/80"

            if (status === "playing" && isSelected) {
                borderColor = "border-cyan-500"
                bgColor = "bg-cyan-500/30"
            } else if (status === "correct" && isSelected) {
                borderColor = "border-green-500"
                bgColor = "bg-green-500/40"
            } else if (status === "wrong" && isSelected) {
                borderColor = "border-red-500"
                bgColor = "bg-red-500/40"
            }

            return (
              <motion.div
                key={item.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                <Button
                  onClick={() => handleSelect(item.name)}
                  disabled={status === "correct"}
                  className={`h-40 w-full flex-col gap-4 rounded-3xl p-6 transition-all hover:scale-105 border-4 ${borderColor} ${bgColor}`}
                >
                  <div className={`h-20 w-20 rounded-full ${item.color} shadow-lg ring-4 ring-white/20`} />
                  <div className="text-xl font-bold text-white tracking-wide">{item.name}</div>
                  
                  {status !== "playing" && isSelected && item.correct && (
                      <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg">
                        <CheckCircle2 className="text-white h-5 w-5" />
                      </div>
                  )}
                  {status !== "playing" && isSelected && !item.correct && (
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
                  "bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-cyan-500/50"}
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
                animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div className="text-9xl">🔵</div>
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-bold text-cyan-400 mb-2"
              >
                Perfect! 🎉
              </motion.h3>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl text-white mb-8 max-w-md mx-auto"
              >
                Neptune is a beautiful blue planet!
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