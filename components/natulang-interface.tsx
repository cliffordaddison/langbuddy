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
  Headphones,
  MessageCircle,
  BookOpen,
  Lightbulb,
  Crown
} from 'lucide-react'
import { NatuLangStyleSystem, LearningSession, SpeechAnalysis } from '@/lib/natulang-style-system'

interface NatuLangInterfaceProps {
  onSessionComplete?: (session: LearningSession) => void
}

export default function NatuLangInterface({ onSessionComplete }: NatuLangInterfaceProps) {
  const [system] = useState(() => new NatuLangStyleSystem())
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<string>('')
  const [lastAnalysis, setLastAnalysis] = useState<SpeechAnalysis | null>(null)
  const [sessionStatus, setSessionStatus] = useState<'idle' | 'active' | 'paused' | 'completed'>('idle')
  const [showHint, setShowHint] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  // Monitor system state
  useEffect(() => {
    const interval = setInterval(() => {
      const session = system.getCurrentSession()
      if (session !== currentSession) {
        setCurrentSession(session)
        if (session) {
          setSessionStatus(session.status)
          const prompt = session.prompts[session.currentPromptIndex]
          if (prompt) {
            setCurrentPrompt(prompt.targetText)
          }
        }
      }

      setIsListening(system.isCurrentlyListening())
      setIsSpeaking(system.isCurrentlySpeaking())
    }, 100)

    return () => clearInterval(interval)
  }, [system, currentSession])

  // Start a new session
  const startSession = async (level: 'beginner' | 'intermediate' | 'advanced' = 'beginner') => {
    try {
      const session = await system.startSession('user_1', level)
      setCurrentSession(session)
      setSessionStatus('active')
      
      // Start with the first prompt
      const firstPrompt = session.prompts[0]
      if (firstPrompt) {
        setCurrentPrompt(firstPrompt.targetText)
        await system.playPrompt(firstPrompt)
      }
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  // Pause/Resume session
  const toggleSession = () => {
    if (sessionStatus === 'active') {
      system.pauseSession()
      setSessionStatus('paused')
    } else if (sessionStatus === 'paused') {
      system.resumeSession()
      setSessionStatus('active')
    }
  }

  // Skip current prompt
  const skipPrompt = () => {
    if (currentSession) {
      // In a real implementation, this would advance to the next prompt
      console.log('Skipping current prompt')
    }
  }

  // Show hint for current prompt
  const showCurrentHint = () => {
    if (currentSession) {
      const prompt = currentSession.prompts[currentSession.currentPromptIndex]
      if (prompt?.hints && prompt.hints.length > 0) {
        setShowHint(true)
        setTimeout(() => setShowHint(false), 3000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header - NatuLang Style */}
      <header className="bg-blue-600 p-4 flex items-center justify-between">
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {sessionStatus === 'idle' ? (
          // Session Selection Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <Headphones className="w-16 h-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-2xl font-bold mb-4">NatuLang-Style Learning</h2>
            <p className="text-gray-300 mb-8">
              Hands-free French learning with real-time speech feedback. 
              Just speak and learn naturally!
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => startSession('beginner')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Start Beginner Lesson
              </button>
              <button
                onClick={() => startSession('intermediate')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Start Intermediate Lesson
              </button>
            </div>
          </motion.div>
        ) : (
          // Active Learning Interface
          <div className="w-full max-w-lg">
            {/* Current Prompt Display */}
            <motion.div
              key={currentPrompt}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-8"
            >
              <div className="bg-gray-800 rounded-lg p-6 mb-4">
                <h3 className="text-lg text-gray-300 mb-2">Listen and Repeat:</h3>
                <p className="text-2xl font-medium text-white">{currentPrompt}</p>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center justify-center space-x-4 mb-6">
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

              {/* Feedback Display */}
              <AnimatePresence>
                {lastAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-4 p-4 rounded-lg ${
                      lastAnalysis.isCorrect 
                        ? 'bg-green-900/50 border border-green-500' 
                        : 'bg-red-900/50 border border-red-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {lastAnalysis.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="font-medium">
                        {lastAnalysis.isCorrect ? 'Excellent!' : 'Try Again'}
                      </span>
                    </div>
                    
                    {!lastAnalysis.isCorrect && lastAnalysis.suggestions.length > 0 && (
                      <p className="text-sm text-gray-300">
                        {lastAnalysis.suggestions[0]}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hint Display */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4 p-4 bg-yellow-900/50 border border-yellow-500 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-yellow-200">Hint: Speak clearly and slowly</span>
                    </div>
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
                onClick={skipPrompt}
                className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
              >
                <SkipForward className="w-5 h-5 text-white" />
              </button>

              {/* Hint Button */}
              <button
                onClick={showCurrentHint}
                className="w-12 h-12 bg-yellow-600 hover:bg-yellow-700 rounded-full flex items-center justify-center transition-colors"
              >
                <Lightbulb className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Session Progress */}
            {currentSession && (
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-sm text-gray-400">Progress:</span>
                  <span className="text-sm text-white">
                    {currentSession.currentPromptIndex + 1} / {currentSession.prompts.length}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${((currentSession.currentPromptIndex + 1) / currentSession.prompts.length) * 100}%` 
                    }}
                    className="bg-blue-600 h-2 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation - NatuLang Style */}
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