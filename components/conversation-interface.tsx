"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, Volume2, VolumeX, RotateCcw, MessageSquare, BookOpen, Sparkles, Brain } from 'lucide-react'
import { useLearningStore } from '@/lib/store'
import { useSpeechRecognition } from 'react-speech-recognition'
import MessageBubble from './message-bubble'
import TopicSelector from './topic-selector'
import { generateAIResponse } from '@/lib/ai-service'

export default function ConversationInterface() {
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentVocabularyFocus, setCurrentVocabularyFocus] = useState<string>('')
  const [showVocabularyPanel, setShowVocabularyPanel] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { 
    conversationHistory, 
    addMessage, 
    clearConversation, 
    settings,
    currentSession,
    startSession,
    endSession,
    userProgress
  } = useLearningStore()

  // Speech Recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  useEffect(() => {
    if (transcript && !isListening) {
      setInputMessage(transcript)
      resetTranscript()
    }
  }, [transcript, isListening, resetTranscript])

  useEffect(() => {
    scrollToBottom()
  }, [conversationHistory])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      role: 'user' as const,
      content: inputMessage,
    }

    addMessage(userMessage)
    setInputMessage('')
    setIsTyping(true)

    try {
      const aiResponse = await generateAIResponse(
        inputMessage,
        conversationHistory,
        userProgress.level,
        settings.difficulty
      )

      addMessage({
        role: 'assistant',
        content: aiResponse.content,
        corrections: aiResponse.corrections,
        grammarNotes: aiResponse.grammarNotes,
        vocabularyNotes: aiResponse.vocabularyNotes,
      })

      // Update vocabulary focus if provided
      if (aiResponse.vocabularyFocus) {
        setCurrentVocabularyFocus(aiResponse.vocabularyFocus)
      }

      // Show topic transition if available
      if (aiResponse.topicTransition) {
        setTimeout(() => {
          addMessage({
            role: 'assistant',
            content: `💡 ${aiResponse.topicTransition}`,
          })
        }, 2000)
      }

      // Auto-speak if enabled
      if (settings.autoSpeak) {
        speakText(aiResponse.content)
      }
    } catch (error) {
      console.error('Error generating AI response:', error)
      addMessage({
        role: 'assistant',
        content: "Désolé, j'ai eu un problème. Pouvez-vous répéter votre message ?",
      })
    } finally {
      setIsTyping(false)
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'fr-FR'
      utterance.rate = settings.speechSpeed
      utterance.voice = speechSynthesis.getVoices().find(voice => 
        voice.lang === 'fr-FR' && voice.name.includes(settings.accent === 'quebec' ? 'Québec' : 'France')
      ) || null
      
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      speechSynthesis.speak(utterance)
    }
  }

  const handleStartSession = (topic: string, difficulty: 'easy' | 'medium' | 'hard') => {
    startSession(topic, difficulty)
    
    if (topic.includes('Dynamique')) {
      addMessage({
        role: 'assistant',
        content: `🌟 Bienvenue dans votre conversation dynamique ! Je vais vous aider à enrichir votre vocabulaire français de manière naturelle. Nous pouvons parler de tout et n'importe quoi - comme dans la vraie vie ! Que souhaitez-vous aborder aujourd'hui ?`,
      })
    } else {
      addMessage({
        role: 'assistant',
        content: `Bonjour ! Commençons notre conversation sur "${topic}". Je vais adapter le niveau de difficulté à ${difficulty} et enrichir votre vocabulaire. Prêt(e) à commencer ?`,
      })
    }
  }

  const handleClearConversation = () => {
    clearConversation()
    endSession()
    setCurrentVocabularyFocus('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getVocabularyCategories = () => {
    if (!currentVocabularyFocus) return []
    
    const categories = currentVocabularyFocus.split(', ')
    return categories.map(cat => ({
      name: cat,
      icon: cat === 'bodyParts' ? '👤' : 
            cat === 'emotions' ? '😊' : 
            cat === 'food' ? '🍽️' : 
            cat === 'weather' ? '🌤️' : 
            cat === 'work' ? '💼' : 
            cat === 'dailyLife' ? '🏠' : '📚'
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Session Controls */}
      {!currentSession.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <TopicSelector onStartSession={handleStartSession} />
        </motion.div>
      )}

      {/* Conversation Area */}
      <div className="bg-card rounded-lg border border-border shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold">Conversation en Français</h2>
            {currentSession.isActive && (
              <span className="text-sm text-muted-foreground">
                • {currentSession.topic} ({currentSession.difficulty})
              </span>
            )}
            {currentSession.topic?.includes('Dynamique') && (
              <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Vocabulary Panel Toggle */}
            {currentVocabularyFocus && (
              <button
                onClick={() => setShowVocabularyPanel(!showVocabularyPanel)}
                className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Vocabulaire</span>
              </button>
            )}
            <button
              onClick={handleClearConversation}
              className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Nouvelle conversation</span>
            </button>
          </div>
        </div>

        {/* Vocabulary Panel */}
        {showVocabularyPanel && currentVocabularyFocus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-border"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                Vocabulaire en cours d'apprentissage
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {getVocabularyCategories().map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{category.icon}</span>
                  <span className="capitalize">{category.name}</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {conversationHistory.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MessageBubble message={message} onSpeak={speakText} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-muted-foreground"
            >
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
              <span className="text-sm">L'assistant réfléchit...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentSession.topic?.includes('Dynamique') 
                  ? "Parlez de n'importe quoi... Tout est possible !" 
                  : "Tapez votre message en français..."}
                className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={2}
                disabled={isTyping}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Speech Recognition */}
              {browserSupportsSpeechRecognition && (
                <button
                  onClick={() => {
                    if (listening) {
                      setIsListening(false)
                    } else {
                      setIsListening(true)
                      resetTranscript()
                    }
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    listening 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                  disabled={isTyping}
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Speech Status */}
          {listening && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              Écoute en cours... Parlez maintenant
            </div>
          )}

          {/* Dynamic Conversation Tips */}
          {currentSession.topic?.includes('Dynamique') && (
            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-purple-700 dark:text-purple-300">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Conseil :</span>
                <span>Parlez naturellement ! Je vais enrichir votre vocabulaire au fur et à mesure de notre conversation.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 