"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Copy,
  Bookmark,
  Crown,
  MessageCircle,
  BookOpen
} from 'lucide-react'
import { Lesson, LessonPhrase } from '@/lib/lesson-system'

interface SpeakingInterfaceProps {
  lesson: Lesson
  onComplete?: (lesson: Lesson) => void
  onBack?: () => void
}

export default function SpeakingInterface({ lesson, onComplete, onBack }: SpeakingInterfaceProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [userResponse, setUserResponse] = useState('')
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean
    message: string
    suggestions: string[]
  } | null>(null)
  const [sessionStatus, setSessionStatus] = useState<'active' | 'paused' | 'completed'>('active')
  const [showText, setShowText] = useState(false)
  
  const speechRecognitionRef = useRef<any>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)

  const currentPhrase = lesson.phrases[currentPhraseIndex]

  useEffect(() => {
    initializeSpeechRecognition()
    initializeSpeechSynthesis()
    startLesson()
  }, [])

  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      speechRecognitionRef.current = new SpeechRecognition()
      speechRecognitionRef.current.continuous = false
      speechRecognitionRef.current.interimResults = false
      speechRecognitionRef.current.lang = 'fr-FR'
      speechRecognitionRef.current.maxAlternatives = 1

      speechRecognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        handleUserResponse(transcript)
      }

      speechRecognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      speechRecognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }

  const initializeSpeechSynthesis = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis
    }
  }

  const startLesson = async () => {
    setSessionStatus('active')
    await speakPhrase(currentPhrase)
  }

  const speakPhrase = async (phrase: LessonPhrase): Promise<void> => {
    if (!speechSynthesisRef.current) return

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(phrase.french)
      utterance.lang = 'fr-FR'
      utterance.rate = 0.8
      utterance.pitch = 1.0
      
      // Try to use a French voice
      const voices = speechSynthesisRef.current!.getVoices()
      const frenchVoice = voices.find(voice => 
        voice.lang.includes('fr') || voice.lang.includes('FR')
      )
      if (frenchVoice) {
        utterance.voice = frenchVoice
      }

      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        // Start listening for user response
        setTimeout(() => {
          startListening()
        }, 500)
        resolve()
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
        resolve()
      }

      speechSynthesisRef.current!.speak(utterance)
    })
  }

  const startListening = () => {
    if (!speechRecognitionRef.current || isListening) return

    setIsListening(true)
    speechRecognitionRef.current.start()
  }

  const handleUserResponse = (spokenText: string) => {
    setUserResponse(spokenText)
    const analysis = analyzeResponse(spokenText, currentPhrase.french)
    setFeedback(analysis)

    if (analysis.isCorrect) {
      // Move to next phrase
      setTimeout(() => {
        advanceToNextPhrase()
      }, 2000)
    } else {
      // Repeat the phrase
      setTimeout(() => {
        speakPhrase(currentPhrase)
      }, 2000)
    }
  }

  const analyzeResponse = (spoken: string, target: string) => {
    const normalizedSpoken = normalizeFrenchText(spoken)
    const normalizedTarget = normalizeFrenchText(target)
    
    const isCorrect = normalizedSpoken.toLowerCase() === normalizedTarget.toLowerCase()
    const similarity = calculateSimilarity(normalizedSpoken, normalizedTarget)
    
    if (isCorrect) {
      return {
        isCorrect: true,
        message: 'Excellent! Très bien!',
        suggestions: []
      }
    } else {
      const suggestions = generateSuggestions(normalizedSpoken, normalizedTarget)
      return {
        isCorrect: false,
        message: 'Pas exactement. Essayez encore.',
        suggestions
      }
    }
  }

  const normalizeFrenchText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâä]/g, 'a')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/[ûüù]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z\s]/g, '')
      .trim()
  }

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  const generateSuggestions = (spoken: string, target: string): string[] => {
    const suggestions: string[] = []
    
    if (spoken.length < target.length * 0.8) {
      suggestions.push('Try speaking more slowly and clearly')
    }
    
    if (spoken.length > target.length * 1.2) {
      suggestions.push('Try to be more concise')
    }
    
    if (!spoken.includes('bonjour') && target.includes('bonjour')) {
      suggestions.push('Remember to say "bonjour" (hello)')
    }
    
    return suggestions
  }

  const advanceToNextPhrase = () => {
    if (currentPhraseIndex < lesson.phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1)
      setFeedback(null)
      setUserResponse('')
      setTimeout(() => {
        speakPhrase(lesson.phrases[currentPhraseIndex + 1])
      }, 500)
    } else {
      // Lesson completed
      setSessionStatus('completed')
      if (onComplete) {
        onComplete(lesson)
      }
    }
  }

  const toggleSession = () => {
    if (sessionStatus === 'active') {
      setSessionStatus('paused')
      if (speechRecognitionRef.current && isListening) {
        speechRecognitionRef.current.stop()
      }
    } else if (sessionStatus === 'paused') {
      setSessionStatus('active')
      speakPhrase(currentPhrase)
    }
  }

  const skipPhrase = () => {
    advanceToNextPhrase()
  }

  const repeatPhrase = () => {
    speakPhrase(currentPhrase)
  }

  const copyPhrase = () => {
    navigator.clipboard.writeText(currentPhrase.french)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold">LangBuddy</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xs font-bold">FR</span>
          </div>
          <Crown className="w-5 h-5 text-yellow-400" />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-gray-800 h-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ 
            width: `${((currentPhraseIndex + 1) / lesson.phrases.length) * 100}%` 
          }}
          className="bg-blue-600 h-1"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-6">
          {/* Current Phrase */}
          <motion.div
            key={currentPhraseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-gray-800 rounded-lg p-6 mb-4">
              <h3 className="text-lg text-gray-300 mb-2">Listen and Repeat:</h3>
              <p className="text-2xl font-medium text-white mb-2">{currentPhrase.french}</p>
              <p className="text-sm text-gray-400">{currentPhrase.english}</p>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              {isSpeaking && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex items-center space-x-2 text-blue-400"
                >
                  <Volume2 className="w-5 h-5" />
                  <span className="text-sm">Speaking...</span>
                </motion.div>
              )}
              
              {isListening && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex items-center space-x-2 text-red-400"
                >
                  <Mic className="w-5 h-5" />
                  <span className="text-sm">Listening...</span>
                </motion.div>
              )}
            </div>

            {/* User Response */}
            {userResponse && (
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-300 mb-1">You said:</p>
                <p className="text-white">{userResponse}</p>
              </div>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-lg ${
                    feedback.isCorrect 
                      ? 'bg-green-900/50 border border-green-500' 
                      : 'bg-red-900/50 border border-red-500'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {feedback.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="font-medium">{feedback.message}</span>
                  </div>
                  
                  {feedback.suggestions.length > 0 && (
                    <div className="space-y-1">
                      {feedback.suggestions.map((suggestion, index) => (
                        <p key={index} className="text-sm text-gray-300">
                          • {suggestion}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            {/* Main Control Button */}
            <button
              onClick={toggleSession}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                sessionStatus === 'active' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {sessionStatus === 'active' ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Skip Button */}
            <button
              onClick={skipPhrase}
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>

            {/* Repeat Button */}
            <button
              onClick={repeatPhrase}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
            >
              <Volume2 className="w-5 h-5 text-white" />
            </button>

            {/* Copy Button */}
            <button
              onClick={copyPhrase}
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <Copy className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {currentPhraseIndex + 1} of {lesson.phrases.length} phrases
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-gray-900 p-4">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex flex-col items-center space-y-1">
            <BookOpen className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Lessons</span>
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <MessageCircle className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-blue-400">Free Dialogs</span>
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <Crown className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Challenging</span>
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <Mic className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Repetitions</span>
          </div>
        </div>
      </nav>
    </div>
  )
} 