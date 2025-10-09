// Simple sound generation using Web Audio API
export function playSuccessSound() {
  if (typeof window === "undefined") return

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

  // Create a cheerful ascending tone
  const notes = [523.25, 659.25, 783.99] // C5, E5, G5

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = "sine"

    const startTime = audioContext.currentTime + index * 0.1
    const duration = 0.15

    gainNode.gain.setValueAtTime(0.3, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
  })
}

export function playWrongSound() {
  if (typeof window === "undefined") return

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

  // Create a gentle descending tone (not harsh or punishing)
  const notes = [440, 392] // A4, G4 - gentle and encouraging

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = "sine"

    const startTime = audioContext.currentTime + index * 0.15
    const duration = 0.2

    gainNode.gain.setValueAtTime(0.15, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
  })
}

export function playButtonClick() {
  if (typeof window === "undefined") return

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 800
  oscillator.type = "sine"

  const startTime = audioContext.currentTime
  const duration = 0.05

  gainNode.gain.setValueAtTime(0.1, startTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

export function playRocketSound() {
  if (typeof window === "undefined") return

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.setValueAtTime(100, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5)
  oscillator.type = "sawtooth"

  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

let ambientOscillator: OscillatorNode | null = null
let ambientGain: GainNode | null = null
let ambientContext: AudioContext | null = null

export function playAmbientMusic() {
  if (typeof window === "undefined") return
  if (ambientOscillator) return // Already playing

  ambientContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  ambientOscillator = ambientContext.createOscillator()
  ambientGain = ambientContext.createGain()

  ambientOscillator.connect(ambientGain)
  ambientGain.connect(ambientContext.destination)

  ambientOscillator.frequency.value = 220
  ambientOscillator.type = "sine"

  ambientGain.gain.setValueAtTime(0.03, ambientContext.currentTime)

  ambientOscillator.start()
}

export function stopAmbientMusic() {
  if (ambientOscillator && ambientContext) {
    ambientOscillator.stop()
    ambientOscillator = null
    ambientGain = null
    ambientContext = null
  }
}
