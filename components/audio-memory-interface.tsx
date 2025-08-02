"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  SkipForward,
  Headphones,
  Brain,
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react'
import { AudioMemorySystem, AudioMemorySession, AudioPhrase, UserAudioResponse } from '@/lib/audio-memory-system'

interface AudioMemoryInterfaceProps {
  onSessionComplete: (assessment: any) => void
}

export default function AudioMemoryInterface({ onSessionComplete }: AudioMemoryInterfaceProps) {
  const [audioSystem] = useState(() => new AudioMemorySystem())
  const [currentSession, setCurrentSession] = useState<AudioMemorySession | null>(null)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showText, setShowText] = useState(false)
  const [sessionProgress, setSessionProgress] = useState(0)
  const [userAssessment, setUserAssessment] = useState(audioSystem.getUserAssessment())
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingChunksRef = useRef<Blob[]>([])

  const currentPhrase = currentSession?.phrases[currentPhraseIndex]

  // Start a new audio session
  const startSession = async (sessionType: AudioMemorySession['sessionType']) => {
    try {
      const session = await audioSystem.startAudioSession(sessionType)
      setCurrentSession(session)
      setCurrentPhraseIndex(0)
      setSessionProgress(0)
      setIsPlaying(false)
      setIsRecording(false)
      setShowText(false)
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  // Play current phrase audio
  const playPhrase = () => {
    if (!currentPhrase) return

    setIsPlaying(true)
    
    // In real implementation, this would play actual audio
    // For now, simulate audio playback
    setTimeout(() => {
      setIsPlaying(false)
      // Show text after audio plays (Pimsleur method)
      setShowText(true)
    }, 2000)
  }

  // Start recording user response
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      mediaRecorderRef.current = mediaRecorder
      recordingChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        recordingChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(recordingChunksRef.current, { type: 'audio/wav' })
        const audioBase64 = await blobToBase64(audioBlob)
        
        // Process user response
        await processUserResponse(audioBase64)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Process user audio response
  const processUserResponse = async (audioData: string) => {
    if (!currentPhrase) return

    const startTime = Date.now()
    const responseTime = Date.now() - startTime

    try {
      const response = await audioSystem.processUserResponse(
        currentPhrase.id,
        audioData,
        responseTime
      )

      // Move to next phrase or complete session
      if (currentPhraseIndex < (currentSession?.phrases.length || 0) - 1) {
        setCurrentPhraseIndex(currentPhraseIndex + 1)
        setShowText(false)
      } else {
        // Complete session
        const assessment = await audioSystem.completeSession()
        setUserAssessment(assessment)
        setCurrentSession(null)
        onSessionComplete(assessment)
      }

      // Update progress
      updateSessionProgress()
    } catch (error) {
      console.error('Failed to process response:', error)
    }
  }

  // Update session progress
  const updateSessionProgress = () => {
    if (!currentSession) return
    
    const progress = ((currentPhraseIndex + 1) / currentSession.phrases.length) * 100
    setSessionProgress(progress)
  }

  // Skip current phrase
  const skipPhrase = () => {
    if (currentPhraseIndex < (currentSession?.phrases.length || 0) - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1)
      setShowText(false)
      updateSessionProgress()
    }
  }

  // Repeat current phrase
  const repeatPhrase = () => {
    setShowText(false)
    playPhrase()
  }

  // Get session type display name
  const getSessionTypeName = (type: AudioMemorySession['sessionType']) => {
    switch (type) {
      case 'warmup': return 'Échauffement'
      case 'new_content': return 'Nouveau Contenu'
      case 'integration': return 'Intégration'
      case 'consolidation': return 'Consolidation'
      default: return type
    }
  }

  // Get memory phase display name
  const getMemoryPhaseName = (phase: string) => {
    switch (phase) {
      case 'introduction': return 'Introduction'
      case 'immediate_recall': return 'Rappel Immédiat'
      case 'short_term': return 'Court Terme'
      case 'medium_term': return 'Moyen Terme'
      case 'long_term': return 'Long Terme'
      case 'mastered': return 'Maîtrisé'
      default: return phase
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Session Selection */}
      {!currentSession && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <Headphones className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Système de Mémoire Audio Pimsleur
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Apprentissage audio-first avec répétition espacée et rappel progressif
            </p>
          </div>

          {/* Session Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['warmup', 'new_content', 'integration', 'consolidation'] as const).map((sessionType) => (
              <motion.button
                key={sessionType}
                onClick={() => startSession(sessionType)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="card p-6 text-left hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {getSessionTypeName(sessionType)}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {sessionType === 'warmup' && 'Révision des phrases précédentes'}
                  {sessionType === 'new_content' && 'Introduction de nouvelles phrases'}
                  {sessionType === 'integration' && 'Combinaison de phrases nouvelles et anciennes'}
                  {sessionType === 'consolidation' && 'Rappel rapide du contenu de la session'}
                </p>
              </motion.button>
            ))}
          </div>

          {/* User Assessment */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Votre Progression Audio
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(userAssessment).filter(([key]) => 
                ['overallProgress', 'pronunciationAccuracy', 'speakingFluency', 'memoryConsolidation'].includes(key)
              ).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {typeof value === 'number' ? `${Math.round(value)}%` : value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Active Session */}
      {currentSession && currentPhrase && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Session Header */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Session: {getSessionTypeName(currentSession.sessionType)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Niveau {currentSession.difficultyLevel} • Phrase {currentPhraseIndex + 1} sur {currentSession.phrases.length}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(currentSession.duration)} min
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${sessionProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Memory State */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Target className="w-4 h-4" />
              <span>Phase: {getMemoryPhaseName(currentPhrase.memoryState.phase)}</span>
              <span>•</span>
              <span>Confiance: {Math.round(currentPhrase.confidenceScore)}%</span>
              <span>•</span>
              <span>Rétention: {Math.round(currentPhrase.retentionScore)}%</span>
            </div>
          </div>

          {/* Current Phrase */}
          <div className="card text-center">
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Écoutez et répétez
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Écoutez d'abord, puis répétez après le signal
              </p>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={playPhrase}
                disabled={isPlaying}
                className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <button
                onClick={repeatPhrase}
                className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={skipPhrase}
                className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Phrase Display */}
            <AnimatePresence mode="wait">
              {showText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentPhrase.french}
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-400">
                    {currentPhrase.english}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {currentPhrase.pronunciation}
                  </div>
                  
                  {/* Cultural Context */}
                  {currentPhrase.culturalNotes && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        💡 {currentPhrase.culturalNotes}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recording Controls */}
            {showText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
              >
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-4 rounded-full transition-colors ${
                    isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {isRecording ? 'Enregistrement... Parlez maintenant' : 'Cliquez pour enregistrer votre réponse'}
                </p>
              </motion.div>
            )}
          </div>

          {/* Session Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowText(!showText)}
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {showText ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{showText ? 'Masquer le texte' : 'Afficher le texte'}</span>
            </button>

            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Mode Pimsleur - Audio-First
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hidden audio element for actual audio playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  )
} 