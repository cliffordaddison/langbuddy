"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, AlertCircle, BookOpen, Lightbulb, Sparkles, Brain } from 'lucide-react'
import { ConversationMessage } from '@/lib/store'

interface MessageBubbleProps {
  message: ConversationMessage
  onSpeak: (text: string) => void
}

export default function MessageBubble({ message, onSpeak }: MessageBubbleProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  const isUser = message.role === 'user'
  const hasCorrections = message.corrections && message.corrections.length > 0
  const hasGrammarNotes = message.grammarNotes && message.grammarNotes.length > 0
  const hasVocabularyNotes = message.vocabularyNotes && message.vocabularyNotes.length > 0
  const hasNotes = hasCorrections || hasGrammarNotes || hasVocabularyNotes
  const isTopicTransition = message.content.includes('💡')
  const isDynamicIntro = message.content.includes('🌟')

  const handleSpeak = () => {
    if (isSpeaking) return
    
    setIsSpeaking(true)
    onSpeak(message.content)
    
    // Reset speaking state after a delay
    setTimeout(() => setIsSpeaking(false), 1000)
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${
          isUser 
            ? 'bg-primary-500 text-white' 
            : isTopicTransition
            ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100'
            : isDynamicIntro
            ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-900 dark:text-purple-100'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        } rounded-lg p-3 shadow-sm`}
      >
        {/* Message Content */}
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">{message.content}</p>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              {/* Speak Button */}
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className={`p-1 rounded transition-colors ${
                  isUser 
                    ? 'text-white/80 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>

              {/* Notes Toggle */}
              {hasNotes && (
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className={`p-1 rounded transition-colors ${
                    isUser 
                      ? 'text-white/80 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                </button>
              )}

              {/* Dynamic Learning Indicator */}
              {!isUser && (isTopicTransition || isDynamicIntro) && (
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-purple-600 dark:text-purple-400">
                    {isTopicTransition ? 'Transition' : 'Dynamique'}
                  </span>
                </div>
              )}
            </div>

            {/* Timestamp */}
            <span className={`text-xs ${
              isUser ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Learning Notes */}
        {showNotes && hasNotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2"
          >
            {/* Corrections */}
            {hasCorrections && (
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">
                    Corrections suggérées:
                  </span>
                </div>
                <ul className="text-xs space-y-1 pl-4">
                  {message.corrections!.map((correction, index) => (
                    <li key={index} className="text-red-600 dark:text-red-400">
                      • {correction}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Grammar Notes */}
            {hasGrammarNotes && (
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-3 h-3 text-blue-500" />
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Points de grammaire:
                  </span>
                </div>
                <ul className="text-xs space-y-1 pl-4">
                  {message.grammarNotes!.map((note, index) => (
                    <li key={index} className="text-blue-600 dark:text-blue-400">
                      • {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vocabulary Notes */}
            {hasVocabularyNotes && (
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Brain className="w-3 h-3 text-purple-500" />
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                    Vocabulaire enrichi:
                  </span>
                </div>
                <ul className="text-xs space-y-1 pl-4">
                  {message.vocabularyNotes!.map((note, index) => (
                    <li key={index} className="text-purple-600 dark:text-purple-400">
                      • {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* Topic Transition Indicator */}
        {isTopicTransition && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-2 flex items-center space-x-1 text-xs text-purple-600 dark:text-purple-400"
          >
            <Sparkles className="w-3 h-3" />
            <span>Nouveau sujet suggéré</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
} 