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
  Lightbulb,
  Target,
  Star,
  Award,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  Bot
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLearningStore } from '@/lib/store'
import LessonsInterface from './lessons-interface'
import ConversationSelector from './conversation-selector'
import ConversationInterface from './conversation-interface'
import NatulangLessonSelector from './natulang-lesson-selector'
import NatulangInterface from './natulang-interface'
import SpeakingInterface from './speaking-interface'
import ProgressOverview from './progress-overview'
import SettingsPanel from './settings-panel'
import { Lesson } from '@/lib/lesson-system'
import { ConversationContext, LearningSession } from '@/lib/conversation-system'

type TabType = 'lessons' | 'conversations' | 'natulang' | 'challenging' | 'repetitions' | 'progress' | 'settings'

const CONVERSATIONS_TAB: TabType = 'conversations'
const LESSONS_TAB: TabType = 'lessons'

interface Tab {
  id: TabType
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('conversations')
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [selectedContext, setSelectedContext] = useState<ConversationContext | null>(null)
  const [completedSession, setCompletedSession] = useState<LearningSession | null>(null)
  const [selectedNatulangLesson, setSelectedNatulangLesson] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const { theme, setTheme } = useTheme()
  const { userProgress } = useLearningStore()

  const tabs: Tab[] = [
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'conversations', label: 'Conversations', icon: MessageCircle },
    { id: 'natulang', label: 'Natulang', icon: Bot },
    { id: 'challenging', label: 'Challenging', icon: Crown },
    { id: 'repetitions', label: 'Repetitions', icon: Lightbulb },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson)
  }

  const handleContextSelect = (context: ConversationContext) => {
    setSelectedContext(context)
  }

  const handleLessonComplete = (lesson: Lesson) => {
    // Mark lesson as completed
    lesson.isCompleted = true
    setSelectedLesson(null)
    // You could update the store here with lesson completion
  }

  const handleConversationComplete = (session: LearningSession) => {
    setCompletedSession(session)
    setSelectedContext(null)
    // You could update the store here with session completion
  }

  const handleBackToLessons = () => {
    setSelectedLesson(null)
  }

  const handleBackToConversations = () => {
    setSelectedContext(null)
  }

  const handleNatulangLessonSelect = (lessonId: string) => {
    setSelectedNatulangLesson(lessonId)
  }

  const handleNatulangLessonComplete = (session: any) => {
    setSelectedNatulangLesson(null)
    // You could update the store here with session completion
  }

  const handleBackToNatulangLessons = () => {
    setSelectedNatulangLesson(null)
  }

    // If a Natulang lesson is selected, show the Natulang interface
  if (selectedNatulangLesson) {
    return (
      <NatulangInterface 
        lessonId={selectedNatulangLesson}
        onComplete={handleNatulangLessonComplete}
        onBack={handleBackToNatulangLessons}
      />
    )
  }

  // If a conversation context is selected, show the conversation interface
  if (selectedContext) {
    return (
      <ConversationInterface 
        context={selectedContext}
        onComplete={handleConversationComplete}
        onBack={handleBackToConversations}
      />
    )
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

              // Show Natulang lesson selector for natulang tab
            if (activeTab === 'natulang') {
              return (
                <NatulangLessonSelector 
                  onSelectLesson={handleNatulangLessonSelect}
                  onBack={() => setActiveTab(LESSONS_TAB)}
                />
              )
            }

            // Show conversation selector for conversations tab
            if (activeTab === CONVERSATIONS_TAB) {
              return (
                <ConversationSelector 
                  onSelectContext={handleContextSelect}
                  onBack={() => setActiveTab(LESSONS_TAB)}
                />
              )
            }

  // Show lessons interface for lessons tab
  if (activeTab === 'lessons') {
    return (
      <LessonsInterface onLessonSelect={handleLessonSelect} />
    )
  }

  // Handle other tabs
  switch (activeTab) {
    case 'challenging':
    case 'repetitions':
    case 'progress':
    case 'settings':
      // These will be handled in the main return statement
      break
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

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Welcome to LangBuddy!</h2>
                <p className="text-gray-300">Your AI-powered French learning companion</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-medium">Beginner Friendly</p>
                  <p className="text-sm text-gray-400">Start with basic conversations</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="font-medium">Interactive Learning</p>
                  <p className="text-sm text-gray-400">Practice with real conversations</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-medium">Track Progress</p>
                  <p className="text-sm text-gray-400">Monitor your improvement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-gray-400">Lessons Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-gray-400">Conversations</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-gray-400">Accuracy</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-sm text-gray-400">Minutes Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'challenging' && (
              <div className="text-center py-12">
                <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <h2 className="text-2xl font-bold mb-2">Challenging</h2>
                <p className="text-gray-400 mb-6">
                  Test your French skills with advanced challenges and complex scenarios
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                    Advanced Conversations
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                    Grammar Challenges
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'repetitions' && (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h2 className="text-2xl font-bold mb-2">Smart Repetitions</h2>
                <p className="text-gray-400 mb-6">
                  Review and practice phrases you need to remember with spaced repetition
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                    Start Repetitions
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                    Review Weak Areas
                  </button>
                </div>
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