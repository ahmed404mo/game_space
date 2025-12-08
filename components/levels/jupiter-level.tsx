"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, ArrowRight, RotateCcw } from "lucide-react"
import { playSuccessSound, playWrong } from "@/lib/sounds"

interface JupiterLevelProps {
  onComplete: (stars: number) => void
  onBack: () => void
}

// بيانات السؤال والكواكب
const question = {
  title: "Planet Sizes",
  text: "Order the planets from Smallest to Largest!",
  soundFile: "/soundQuetion/6.mp3", // 🔊 ملف الصوت المطلوب
  items: [
    { id: "mercury", label: "Mercury", emoji: "🌑", size: 1 },
    { id: "earth", label: "Earth", emoji: "🌍", size: 2 },
    { id: "jupiter", label: "Jupiter", emoji: "🪐", size: 3 },
  ],
}

export default function JupiterLevel({ onComplete, onBack }: JupiterLevelProps) {
  const [selectedOrder, setSelectedOrder] = useState<string[]>([])
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

  const handleSelect = (id: string) => {
    if (status === "correct") return

    // لو كان فيه خطأ سابق، نرجعه لوضع اللعب عند المحاولة
    if (status === "wrong") {
      setStatus("playing")
      setFeedbackMessage("")
      setSelectedOrder([id]) // نبدأ الاختيار من جديد
      return
    }

    // المنطق: إضافة للكوب (الترتيب) أو إزالة منه
    if (selectedOrder.includes(id)) {
      setSelectedOrder(selectedOrder.filter((item) => item !== id))
    } else {
      // السماح باختيار 3 عناصر كحد أقصى
      if (selectedOrder.length < 3) {
        setSelectedOrder([...selectedOrder, id])
      }
    }
  }

  const handleMainButton = () => {
    // 1. إعادة المحاولة
    if (status === "wrong") {
      setStatus("playing")
      setFeedbackMessage("")
      setSelectedOrder([])
      return
    }

    // 2. التحقق من الإجابة (الترتيب الصحيح: عطارد -> الأرض -> المشترى)
    const correctOrder = ["mercury", "earth", "jupiter"]
    
    // هل الطول 3؟ وهل الترتيب مطابق؟
    const isCorrectLength = selectedOrder.length === 3
    const isCorrectOrder = JSON.stringify(selectedOrder) === JSON.stringify(correctOrder)

    if (isCorrectLength && isCorrectOrder) {
      // ✅ إجابة صحيحة
      setStatus("correct")
      try { playSuccessSound() } catch (e) {}
      setShowSuccessModal(true)
    } else {
      // ❌ إجابة خاطئة
      setStatus("wrong")
      try { playWrong() } catch (e) {}
      
      if (!isCorrectLength) {
        setFeedbackMessage("Please select ALL 3 planets!")
      } else {
        setFeedbackMessage("Wrong order! Remember: Smallest to Largest.")
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
        
        {/* 🔥 Header + Question Bar (نفس تصميم Earth بالضبط) 🔥 */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8 flex flex-col items-center">
          <div className="mb-4 text-8xl inline-block animate-spin-slow">
            🪐
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-orange-400 mb-6 drop-shadow-lg">{question.title}</h2>
          
          {/* شريط السؤال الأبيض */}
          <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-orange-200">
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

        {/* منطقة الترتيب (Slots visualizer) - إضافة بسيطة عشان الطفل يعرف هو اختار ايه */}
        <div className="flex gap-4 mb-8 h-20 items-center justify-center">
             {[0, 1, 2].map((index) => {
                 const itemId = selectedOrder[index]
                 const item = question.items.find(i => i.id === itemId)
                 return (
                    <motion.div 
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: item ? 1 : 1 }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed
                            ${item ? "bg-slate-800 border-solid border-blue-400" : "border-white/20"}
                        `}
                    >
                        {item ? <span className="text-3xl">{item.emoji}</span> : <span className="text-white/20 text-xl">{index + 1}</span>}
                    </motion.div>
                 )
             })}
        </div>

        {/* Grid Options (نفس ستايل Earth) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8 w-full max-w-4xl">
          {question.items.map((item, index) => {
            const isSelected = selectedOrder.includes(item.id)
            const orderIndex = selectedOrder.indexOf(item.id) + 1 // رقم الترتيب (1, 2, 3)

            // تصميم الأزرار (شفاف مع حدود)
            let borderColor = "border-white/20"
            let bgColor = "bg-slate-800/80" 
            
            if (status === "playing") {
                if (isSelected) { borderColor = "border-blue-500"; bgColor = "bg-blue-500/30" }
            } else if (status === "correct") {
                 borderColor = "border-green-500"; bgColor = "bg-green-500/40" 
            } else if (status === "wrong") {
                 borderColor = "border-red-500"; bgColor = "bg-red-500/40" 
            }

            return (
              <motion.div
                key={item.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                    onClick={() => handleSelect(item.id)}
                    disabled={status === "correct"} 
                    className={`h-40 w-full flex-col gap-4 rounded-3xl p-4 transition-all hover:scale-105 border-4 ${borderColor} ${bgColor} relative`}
                >
                    <span className={item.size === 3 ? "text-7xl" : item.size === 2 ? "text-6xl" : "text-5xl"}>
                        {item.emoji}
                    </span>
                    <span className="text-2xl font-bold text-white tracking-wide">{item.label}</span>
                    
                    {/* Badge الرقم عند الاختيار */}
                    {isSelected && (
                        <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="absolute top-4 right-4 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg"
                        >
                            {orderIndex}
                        </motion.div>
                    )}
                </Button>
              </motion.div>
            )
          })}
        </div>

        {/* الزر الرئيسي (Check Order) */}
        <div className="mb-8">
          <Button
            onClick={handleMainButton}
            disabled={selectedOrder.length < 3 && status === "playing"}
            className={`h-16 min-w-[260px] rounded-full text-2xl font-bold text-white shadow-xl transition-all hover:scale-105 disabled:opacity-50
                ${status === "wrong" ? "bg-red-500 hover:bg-red-600" : 
                  "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-blue-500/50"}
            `}
          >
            {status === "wrong" ? (
                <> <RotateCcw className="mr-2 h-7 w-7" /> Try Again </>
            ) : (
                "Check Order"
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
                    🪐
                  </motion.div>
                </div>
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-4"
              >
                Awesome! 🎉
              </motion.h3>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl text-white mb-8 max-w-md mx-auto"
              >
                You ordered them perfectly!
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