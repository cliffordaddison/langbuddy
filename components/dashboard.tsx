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
  Headphones,
  Crown,
  Lightbulb
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLearningStore } from '@/lib/store'
import LessonsInterface from './lessons-interface'
import SpeakingInterface from './speaking-interface'
import ProgressOverview from './progress-overview'
import SettingsPanel from './settings-panel'
import { Lesson } from '@/lib/lesson-system'

type TabType = 'lessons' | 'free-dialogs' | 'challenging' | 'repetitions' | 'progress' | 'settings'

interface Tab {
  id: TabType
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('lessons')
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const { theme, setTheme } = useTheme()
  const { userProgress } = useLearningStore()

  const tabs: Tab[] = [
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'free-dialogs', label: 'Free Dialogs', icon: MessageCircle },
    { id: 'challenging', label: 'Challenging', icon: Crown },
    { id: 'repetitions', label: 'Repetitions', icon: Lightbulb },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson)
  }

  const handleLessonComplete = (lesson: Lesson) => {
    // Mark lesson as completed
    lesson.isCompleted = true
    setSelectedLesson(null)
    // You could update the store here with lesson completion
  }

  const handleBackToLessons = () => {
    setSelectedLesson(null)
  }

  // If a lesson is selected, show the speaking interface
  if (selectedLesson) {
    return (
      <SpeakingInterface
        lesson={selectedLesson}
        onComplete={handleLessonComplete}
        onBack={handleBackToLessons}
      />
    )
  }

  // Show lessons interface for lessons tab
  if (activeTab === 'lessons') {
    return (
      <LessonsInterface onLessonSelect={handleLessonSelect} />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md transition-colors
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'free-dialogs' && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h2 className="text-2xl font-bold mb-2">Free Dialogs</h2>
                <p className="text-gray-400 mb-6">
                  Practice conversational French with AI-powered dialogues
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  Start Free Dialog
                </button>
              </div>
            )}

            {activeTab === 'challenging' && (
              <div className="text-center py-12">
                <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <h2 className="text-2xl font-bold mb-2">Challenging</h2>
                <p className="text-gray-400 mb-6">
                  Test your French skills with advanced challenges
                </p>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  Start Challenge
                </button>
              </div>
            )}

            {activeTab === 'repetitions' && (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h2 className="text-2xl font-bold mb-2">Repetitions</h2>
                <p className="text-gray-400 mb-6">
                  Review and practice phrases you need to remember
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  Start Repetitions
                </button>
              </div>
            )}

            {activeTab === 'progress' && <ProgressOverview />}
            {activeTab === 'settings' && <SettingsPanel />}
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
            <Lightbulb className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Repetitions</span>
          </div>
        </div>
      </nav>
    </div>
  )
} 