"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  BarChart3, 
  Settings, 
  BookOpen, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Monitor,
  Headphones
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLearningStore } from '@/lib/store'
import ConversationInterface from './conversation-interface'
import ProgressOverview from './progress-overview'
import SettingsPanel from './settings-panel'
import AudioMemoryInterface from './audio-memory-interface'

type TabType = 'conversation' | 'audio-memory' | 'progress' | 'settings'

interface Tab {
  id: TabType
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('conversation')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const { theme, setTheme } = useTheme()
  const { userProgress } = useLearningStore()

  const tabs: Tab[] = [
    { id: 'conversation', label: 'Conversation', icon: MessageCircle },
    { id: 'audio-memory', label: 'Audio Memory', icon: Headphones },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleAudioSessionComplete = (assessment: any) => {
    // Update user progress based on audio session results
    console.log('Audio session completed:', assessment)
    // You could update the store here with audio session results
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-7 h-7 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LangBuddy</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Level: {userProgress.level}</span>
            <span className="font-medium">Streak: {userProgress.streak} 🔥</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsListening(!isListening)}
              className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} transition-colors`}
              title={isListening ? "Stop Listening" : "Start Listening"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsSpeaking(!isSpeaking)}
              className={`p-2 rounded-full ${isSpeaking ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} transition-colors`}
              title={isSpeaking ? "Stop Speaking" : "Start Speaking"}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : theme === 'light' ? <Moon className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-card border-b border-border px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'conversation' && <ConversationInterface />}
          {activeTab === 'audio-memory' && <AudioMemoryInterface onSessionComplete={handleAudioSessionComplete} />}
          {activeTab === 'progress' && <ProgressOverview />}
          {activeTab === 'settings' && <SettingsPanel />}
        </motion.div>
      </main>
    </div>
  )
} 