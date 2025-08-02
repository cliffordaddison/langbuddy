"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Crown, 
  Play, 
  MessageCircle, 
  BookOpen, 
  Lightbulb,
  ChevronRight,
  Clock,
  Star
} from 'lucide-react'
import { LessonSystem, Lesson } from '@/lib/lesson-system'

interface LessonsInterfaceProps {
  onLessonSelect?: (lesson: Lesson) => void
}

export default function LessonsInterface({ onLessonSelect }: LessonsInterfaceProps) {
  const [lessonSystem] = useState(() => new LessonSystem())
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [topics, setTopics] = useState<string[]>([])
  const [lessonsByTopic, setLessonsByTopic] = useState<Record<string, Lesson[]>>({})

  useEffect(() => {
    const allTopics = lessonSystem.getAllTopics()
    setTopics(allTopics)
    
    const lessonsMap: Record<string, Lesson[]> = {}
    allTopics.forEach(topic => {
      lessonsMap[topic] = lessonSystem.getLessonsByTopic(topic)
    })
    setLessonsByTopic(lessonsMap)
    
    // Set first topic as selected
    if (allTopics.length > 0 && !selectedTopic) {
      setSelectedTopic(allTopics[0])
    }
  }, [lessonSystem, selectedTopic])

  const handleLessonClick = (lesson: Lesson) => {
    if (onLessonSelect) {
      onLessonSelect(lesson)
    }
  }

  const getTopicIcon = (topic: string) => {
    // Return different icons based on topic
    if (topic.includes('family')) return '👨‍👩‍👧‍👦'
    if (topic.includes('directions')) return '🗺️'
    if (topic.includes('stories')) return '📖'
    if (topic.includes('plans')) return '📅'
    if (topic.includes('help')) return '🤝'
    return '💬'
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
      <main className="p-4">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Lessons</h2>
          <p className="text-gray-300">I speak French, a little</p>
        </div>

        {/* Interactive Elements */}
        <div className="flex justify-center space-x-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center"
          >
            <Play className="w-6 h-6 text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center"
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center relative"
          >
            <Lightbulb className="w-6 h-6 text-white" />
            <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
          </motion.button>
        </div>

        {/* Topics and Lessons */}
        <div className="space-y-6">
          {topics.map((topic, topicIndex) => (
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: topicIndex * 0.1 }}
              className="space-y-3"
            >
              {/* Topic Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-300">{topic}</h3>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              {/* Lessons in this topic */}
              <div className="space-y-2">
                {lessonsByTopic[topic]?.map((lesson, lessonIndex) => (
                  <motion.div
                    key={lesson.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLessonClick(lesson)}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-colors
                      ${lesson.isCompleted 
                        ? 'bg-green-900/20 border-green-500/50' 
                        : lesson.hasCrown 
                          ? 'bg-yellow-900/20 border-yellow-500/50' 
                          : 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-700/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Completion Status */}
                        {lesson.isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : lesson.hasCrown ? (
                          <Crown className="w-6 h-6 text-yellow-400" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-400" />
                        )}
                        
                        {/* Lesson Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{lesson.title}</h4>
                            {lesson.hasCrown && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{lesson.subtitle}</p>
                        </div>
                      </div>

                      {/* Lesson Details */}
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.estimatedTime} min</span>
                        <Star className="w-4 h-4" />
                        <span>{lesson.difficulty}/10</span>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    {lesson.isCompleted && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div className="bg-green-500 h-1 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4">
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
      </main>
    </div>
  )
} 