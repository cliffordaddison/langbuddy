'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Volume2, 
  Mic, 
  MicOff,
  CheckCircle,
  XCircle,
  Star,
  Target,
  BookOpen,
  MessageSquare,
  User,
  Bot
} from 'lucide-react'
import { 
  NatulangInspiredSystem, 
  NatulangLesson, 
  LearningSession, 
  ConversationTurn,
  ResponseAnalysis,
  Character
} from '@/lib/natulang-inspired-system'

interface NatulangInterfaceProps {
  lessonId: string
  onComplete: (session: LearningSession) => void
  onBack: () => void
}

export default function NatulangInterface({ lessonId, onComplete, onBack }: NatulangInterfaceProps) {
  const [system] = useState(() => new NatulangInspiredSystem())
  const [session, setSession] = useState<LearningSession | null>(null)
  const [currentTurn, setCurrentTurn] = useState<ConversationTurn | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [userResponse, setUserResponse] = useState('')
  const [feedback, setFeedback] = useState<ResponseAnalysis | null>(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showGrammarNotes, setShowGrammarNotes] = useState(false)
  const [sessionStatus, setSessionStatus] = useState<'loading' | 'active' | 'completed'>('loading')
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([])

  const speechRecognitionRef = useRef<any>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    initializeSession()
  }, [lessonId])

  const initializeSession = () => {
    try {
      const newSession = system.startSession(lessonId)
      setSession(newSession)
      setCurrentTurn(newSession.turns[0] || null)
      setSessionStatus('active')
      setConversationHistory([newSession.turns[0] || null].filter(Boolean))
    } catch (error) {
      console.error('Failed to start session:', error)
      setSessionStatus('completed')
    }
  }

  const speakMessage = (message: string, language: string = 'fr-FR') => {
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(message)
    utterance.lang = language
    utterance.rate = 0.8
    utterance.pitch = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesisRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'fr-FR'

    recognition.onstart = () => {
      setIsListening(true)
      setUserResponse('')
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setUserResponse(transcript)
      processUserResponse(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    speechRecognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const processUserResponse = (spokenText: string) => {
    if (!session || !currentTurn) return

    try {
      const analysis = system.processUserResponse(spokenText)
      setFeedback(analysis)

      // Add user response to conversation history
      const userTurn: ConversationTurn = {
        id: `user_${Date.now()}`,
        speaker: 'user',
        message: spokenText,
        context: 'User response',
        difficulty: currentTurn.difficulty
      }
      setConversationHistory(prev => [...prev, userTurn])

      // Show feedback for 3 seconds
      setTimeout(() => {
        setFeedback(null)
        advanceToNextTurn()
      }, 3000)
    } catch (error) {
      console.error('Error processing user response:', error)
    }
  }

  const advanceToNextTurn = () => {
    if (!session) return

    system.advanceTurn()
    const nextTurn = system.getCurrentTurn()
    
    if (nextTurn) {
      setCurrentTurn(nextTurn)
      setConversationHistory(prev => [...prev, nextTurn])
      
      // If it's Mo's turn, speak the message
      if (nextTurn.speaker === 'mo') {
        speakMessage(nextTurn.message)
      }
    } else {
      // Session completed
      const completedSession = system.getCurrentSession()
      if (completedSession) {
        setSessionStatus('completed')
        onComplete(completedSession)
      }
    }
  }

  const skipTurn = () => {
    advanceToNextTurn()
  }

  const repeatTurn = () => {
    if (currentTurn && currentTurn.speaker === 'mo') {
      speakMessage(currentTurn.message)
    }
  }

  const copyMessage = () => {
    if (currentTurn) {
      navigator.clipboard.writeText(currentTurn.message)
    }
  }

  const getCharacter = (): Character => {
    return system.getCharacter()
  }

  const getSessionPerformance = () => {
    return system.getSessionPerformance()
  }

  if (sessionStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (sessionStatus === 'completed') {
    const performance = getSessionPerformance()
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-8 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Lesson Completed!</h2>
            <p className="text-gray-300 mb-6">Great job! You've finished this lesson.</p>
            
            {performance && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{performance.correctResponses}/{performance.totalTurns}</div>
                  <div className="text-sm text-gray-400">Correct Responses</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">{Math.round(performance.averagePronunciationScore)}%</div>
                  <div className="text-sm text-gray-400">Pronunciation</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400">{Math.round(performance.averageGrammarScore)}%</div>
                  <div className="text-sm text-gray-400">Grammar</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">{Math.round(performance.averageVocabularyScore)}%</div>
                  <div className="text-sm text-gray-400">Vocabulary</div>
                </div>
              </div>
            )}
            
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Lessons
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-blue-400" />
              <span className="font-semibold">{getCharacter().name}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">
                {session?.turns.length || 0} turns
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">
                {getSessionPerformance()?.correctResponses || 0} correct
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Conversation History */}
        <div className="mb-6 max-h-64 overflow-y-auto bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Conversation</span>
          </h3>
          <div className="space-y-3">
            {conversationHistory.map((turn, index) => (
              <motion.div
                key={turn.id}
                initial={{ opacity: 0, x: turn.speaker === 'mo' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${turn.speaker === 'mo' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                  turn.speaker === 'mo' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-600 text-white'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {turn.speaker === 'mo' ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="text-xs opacity-75">
                      {turn.speaker === 'mo' ? getCharacter().name : 'You'}
                    </span>
                  </div>
                  <p className="text-sm">{turn.message}</p>
                  {turn.translation && (
                    <p className="text-xs opacity-75 mt-1 italic">
                      {turn.translation}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Turn */}
        {currentTurn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 mb-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              {currentTurn.speaker === 'mo' ? (
                <Bot className="w-8 h-8 text-blue-400" />
              ) : (
                <User className="w-8 h-8 text-green-400" />
              )}
              <div>
                <h3 className="text-lg font-semibold">
                  {currentTurn.speaker === 'mo' ? getCharacter().name : 'Your Turn'}
                </h3>
                <p className="text-sm text-gray-400">{currentTurn.context}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xl mb-2">{currentTurn.message}</p>
              {currentTurn.translation && (
                <p className="text-gray-400 italic">{currentTurn.translation}</p>
              )}
            </div>

            {/* Grammar and Vocabulary Notes */}
            {(currentTurn.grammarNotes || currentTurn.vocabularyNotes) && (
              <div className="mb-4 space-y-2">
                {currentTurn.grammarNotes && (
                  <div className="flex items-start space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-400">Grammar:</p>
                      <ul className="text-sm text-gray-300">
                        {currentTurn.grammarNotes.map((note, index) => (
                          <li key={index}>• {note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {currentTurn.vocabularyNotes && (
                  <div className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-400">Vocabulary:</p>
                      <ul className="text-sm text-gray-300">
                        {currentTurn.vocabularyNotes.map((note, index) => (
                          <li key={index}>• {note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pronunciation Guide */}
            {currentTurn.pronunciation && (
              <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Pronunciation:</p>
                <p className="text-sm font-mono">{currentTurn.pronunciation}</p>
              </div>
            )}

            {/* User Response Section */}
            {currentTurn.speaker === 'user' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isListening 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        <span>Stop Listening</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>Start Listening</span>
                      </>
                    )}
                  </button>
                  
                  {userResponse && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">You said:</span>
                      <span className="text-sm font-medium">{userResponse}</span>
                    </div>
                  )}
                </div>

                {/* Feedback */}
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg ${
                      feedback.isCorrect ? 'bg-green-900 border border-green-600' : 'bg-red-900 border border-red-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {feedback.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className="font-semibold">
                        {feedback.isCorrect ? 'Correct!' : 'Try Again'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-blue-400">{Math.round(feedback.pronunciationScore)}%</div>
                        <div className="text-xs text-gray-400">Pronunciation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-yellow-400">{Math.round(feedback.grammarScore)}%</div>
                        <div className="text-xs text-gray-400">Grammar</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-purple-400">{Math.round(feedback.vocabularyScore)}%</div>
                        <div className="text-xs text-gray-400">Vocabulary</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-green-400">{Math.round(feedback.fluencyScore)}%</div>
                        <div className="text-xs text-gray-400">Fluency</div>
                      </div>
                    </div>

                    {feedback.suggestions.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-semibold mb-1">Suggestions:</p>
                        <ul className="text-sm space-y-1">
                          {feedback.suggestions.map((suggestion, index) => (
                            <li key={index}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feedback.corrections.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-1">Corrections:</p>
                        <ul className="text-sm space-y-1">
                          {feedback.corrections.map((correction, index) => (
                            <li key={index}>• {correction}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {currentTurn?.speaker === 'mo' && (
            <button
              onClick={isSpeaking ? undefined : () => speakMessage(currentTurn.message)}
              disabled={isSpeaking}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              {isSpeaking ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isSpeaking ? 'Speaking...' : 'Play'}</span>
            </button>
          )}
          
          <button
            onClick={repeatTurn}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repeat</span>
          </button>
          
          <button
            onClick={skipTurn}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip</span>
          </button>
          
          <button
            onClick={copyMessage}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Copy</span>
          </button>
        </div>
      </div>
    </div>
  )
} 