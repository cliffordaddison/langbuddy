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
  BookOpen,
  Lightbulb,
  Target,
  Award,
  Clock,
  User,
  Bot
} from 'lucide-react'
import { 
  ConversationSystem, 
  ConversationContext, 
  ConversationTurn, 
  ResponseAnalysis,
  LearningSession 
} from '@/lib/conversation-system'

interface ConversationInterfaceProps {
  context: ConversationContext
  onComplete?: (session: LearningSession) => void
  onBack?: () => void
}

export default function ConversationInterface({ context, onComplete, onBack }: ConversationInterfaceProps) {
  const [conversationSystem] = useState(() => new ConversationSystem())
  const [session, setSession] = useState<LearningSession | null>(null)
  const [currentTurn, setCurrentTurn] = useState<ConversationTurn | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [userResponse, setUserResponse] = useState('')
  const [feedback, setFeedback] = useState<ResponseAnalysis | null>(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showGrammarNotes, setShowGrammarNotes] = useState(false)
  const [sessionStatus, setSessionStatus] = useState<'active' | 'paused' | 'completed'>('active')
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([])
  
  const speechRecognitionRef = useRef<any>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    initializeSpeechRecognition()
    initializeSpeechSynthesis()
    startConversation()
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

  const startConversation = async () => {
    const newSession = conversationSystem.startSession(context.id)
    setSession(newSession)
    setCurrentTurn(newSession.turns[0])
    setConversationHistory([newSession.turns[0]])
    
    if (newSession.turns[0].speaker === 'ai') {
      await speakTurn(newSession.turns[0])
    }
  }

  const speakTurn = async (turn: ConversationTurn): Promise<void> => {
    if (!speechSynthesisRef.current) return

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(turn.message)
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
        
        // If it's a user turn, start listening
        if (turn.speaker === 'user') {
          setTimeout(() => {
            startListening()
          }, 500)
        } else {
          // If it's AI turn, advance to next turn
          setTimeout(() => {
            advanceToNextTurn()
          }, 1000)
        }
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
    
    try {
      const analysis = conversationSystem.processUserResponse(spokenText)
      setFeedback(analysis)

      // Add user response to conversation history
      const userTurn: ConversationTurn = {
        id: `user_${Date.now()}`,
        speaker: 'user',
        message: spokenText,
        context: 'User response',
        difficulty: currentTurn?.difficulty || 1
      }
      setConversationHistory(prev => [...prev, userTurn])

      // Handle feedback and next steps
      setTimeout(() => {
        if (analysis.nextStep === 'continue') {
          advanceToNextTurn()
        } else if (analysis.nextStep === 'repeat') {
          // Repeat the current turn
          if (currentTurn) {
            speakTurn(currentTurn)
          }
        } else if (analysis.nextStep === 'explain') {
          // Show grammar explanation
          setShowGrammarNotes(true)
          setTimeout(() => {
            setShowGrammarNotes(false)
            if (currentTurn) {
              speakTurn(currentTurn)
            }
          }, 3000)
        }
      }, 2000)
    } catch (error) {
      console.error('Error processing user response:', error)
    }
  }

  const advanceToNextTurn = () => {
    if (!session) return

    conversationSystem.advanceTurn()
    const nextTurn = conversationSystem.getCurrentTurn()
    
    if (nextTurn) {
      setCurrentTurn(nextTurn)
      setConversationHistory(prev => [...prev, nextTurn])
      setFeedback(null)
      setUserResponse('')
      setShowTranslation(false)
      setShowGrammarNotes(false)

      if (nextTurn.speaker === 'ai') {
        speakTurn(nextTurn)
      } else {
        // User turn - start listening
        setTimeout(() => {
          startListening()
        }, 500)
      }
    } else {
      // Conversation completed
      setSessionStatus('completed')
      if (onComplete && session) {
        onComplete(session)
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
      if (currentTurn) {
        speakTurn(currentTurn)
      }
    }
  }

  const skipTurn = () => {
    advanceToNextTurn()
  }

  const repeatTurn = () => {
    if (currentTurn) {
      speakTurn(currentTurn)
    }
  }

  const copyMessage = () => {
    if (currentTurn) {
      navigator.clipboard.writeText(currentTurn.message)
    }
  }

  const getPerformanceStats = () => {
    if (!session) return null
    return conversationSystem.getSessionPerformance()
  }

  const performance = getPerformanceStats()

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
            width: session ? `${((session.currentTurnIndex + 1) / session.turns.length) * 100}%` : 0
          }}
          className="bg-blue-600 h-1"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4">
        <div className="max-w-4xl mx-auto w-full space-y-4">
          {/* Context Information */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">{context.title}</h2>
            <p className="text-gray-300 text-sm mb-3">{context.scenario}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>Difficulty: {context.difficulty}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lightbulb className="w-4 h-4" />
                <span>Grammar: {context.grammarFocus.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Conversation History */}
          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">Conversation</h3>
            <div className="space-y-3">
              {conversationHistory.map((turn, index) => (
                <motion.div
                  key={turn.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${turn.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                    turn.speaker === 'ai' 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      {turn.speaker === 'ai' ? (
                        <Bot className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span className="text-xs opacity-75">
                        {turn.speaker === 'ai' ? context.characters[0]?.name : 'You'}
                      </span>
                    </div>
                    <p className="text-sm">{turn.message}</p>
                    {turn.translation && (
                      <p className="text-xs text-gray-400 mt-1">{turn.translation}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Current Turn */}
          {currentTurn && (
            <motion.div
              key={currentTurn.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {currentTurn.speaker === 'ai' ? (
                    <Bot className="w-5 h-5 text-blue-400" />
                  ) : (
                    <User className="w-5 h-5 text-green-400" />
                  )}
                  <span className="font-medium">
                    {currentTurn.speaker === 'ai' ? 'Listen' : 'Your Turn'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {isSpeaking && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="flex items-center space-x-1 text-blue-400"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span className="text-xs">Speaking...</span>
                    </motion.div>
                  )}
                  {isListening && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="flex items-center space-x-1 text-red-400"
                    >
                      <Mic className="w-4 h-4" />
                      <span className="text-xs">Listening...</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-xl font-medium mb-2">{currentTurn.message}</p>
                  {currentTurn.translation && (
                    <button
                      onClick={() => setShowTranslation(!showTranslation)}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      {showTranslation ? 'Hide' : 'Show'} Translation
                    </button>
                  )}
                  {showTranslation && currentTurn.translation && (
                    <p className="text-sm text-gray-400 mt-1">{currentTurn.translation}</p>
                  )}
                </div>

                {/* Grammar Notes */}
                {currentTurn.grammarNotes && currentTurn.grammarNotes.length > 0 && (
                  <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Grammar Notes</span>
                    </div>
                    <ul className="text-xs space-y-1">
                      {currentTurn.grammarNotes.map((note, index) => (
                        <li key={index} className="text-gray-300">• {note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Vocabulary Notes */}
                {currentTurn.vocabularyNotes && currentTurn.vocabularyNotes.length > 0 && (
                  <div className="bg-green-900/20 border border-green-500 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">Vocabulary</span>
                    </div>
                    <ul className="text-xs space-y-1">
                      {currentTurn.vocabularyNotes.map((note, index) => (
                        <li key={index} className="text-gray-300">• {note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* User Response */}
          {userResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700 rounded-lg p-4"
            >
              <p className="text-sm text-gray-300 mb-1">You said:</p>
              <p className="text-white">{userResponse}</p>
            </motion.div>
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
                <div className="flex items-center space-x-2 mb-3">
                  {feedback.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="font-medium">
                    {feedback.isCorrect ? 'Excellent!' : 'Let\'s try again'}
                  </span>
                </div>
                
                {!feedback.isCorrect && feedback.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">Suggestions:</p>
                    {feedback.suggestions.map((suggestion, index) => (
                      <p key={index} className="text-sm text-gray-300">
                        • {suggestion}
                      </p>
                    ))}
                  </div>
                )}

                {/* Performance Scores */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">Pronunciation:</span>
                    <span className={feedback.pronunciationScore > 70 ? 'text-green-400' : 'text-red-400'}>
                      {feedback.pronunciationScore.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">Grammar:</span>
                    <span className={feedback.grammarScore > 70 ? 'text-green-400' : 'text-red-400'}>
                      {feedback.grammarScore.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Performance Overview */}
          {performance && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>Performance</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Correct Responses</p>
                  <p className="text-white font-medium">
                    {performance.correctResponses} / {performance.totalTurns}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Average Score</p>
                  <p className="text-white font-medium">
                    {((performance.averagePronunciationScore + performance.averageGrammarScore) / 2).toFixed(0)}%
                  </p>
                </div>
              </div>
              {performance.weakAreas.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-1">Focus on:</p>
                  <div className="flex flex-wrap gap-1">
                    {performance.weakAreas.map((area, index) => (
                      <span key={index} className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
              onClick={skipTurn}
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>

            {/* Repeat Button */}
            <button
              onClick={repeatTurn}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
            >
              <Volume2 className="w-5 h-5 text-white" />
            </button>

            {/* Copy Button */}
            <button
              onClick={copyMessage}
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <Copy className="w-5 h-5 text-white" />
            </button>
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
            <span className="text-xs text-blue-400">Conversations</span>
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <Crown className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Challenging</span>
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <Lightbulb className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Practice</span>
          </div>
        </div>
      </nav>
    </div>
  )
} 