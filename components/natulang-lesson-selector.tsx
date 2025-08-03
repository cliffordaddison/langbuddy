'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Target, 
  Clock, 
  Star, 
  Play,
  Search,
  Filter,
  Bot,
  GraduationCap,
  MessageSquare,
  Repeat
} from 'lucide-react'
import { NatulangInspiredSystem, NatulangLesson } from '@/lib/natulang-inspired-system'

interface NatulangLessonSelectorProps {
  onSelectLesson: (lessonId: string) => void
  onBack: () => void
}

export default function NatulangLessonSelector({ onSelectLesson, onBack }: NatulangLessonSelectorProps) {
  const [system] = useState(() => new NatulangInspiredSystem())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  const lessons = system.getAllLessons()

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.metadata.grammarFocus.some(focus => focus.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         lesson.metadata.vocabularyFocus.some(focus => focus.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDifficulty = selectedDifficulty === 'all' || lesson.metadata.difficulty === selectedDifficulty
    const matchesType = selectedType === 'all' || lesson.type === selectedType
    
    return matchesSearch && matchesDifficulty && matchesType
  })

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'evaluation':
        return <GraduationCap className="w-5 h-5 text-blue-400" />
      case 'repetition':
        return <Repeat className="w-5 h-5 text-green-400" />
      case 'conversation':
        return <MessageSquare className="w-5 h-5 text-purple-400" />
      default:
        return <BookOpen className="w-5 h-5 text-gray-400" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400 bg-green-900'
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-900'
      case 'advanced':
        return 'text-red-400 bg-red-900'
      default:
        return 'text-gray-400 bg-gray-700'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'evaluation':
        return 'border-blue-500 bg-blue-900/20'
      case 'repetition':
        return 'border-green-500 bg-green-900/20'
      case 'conversation':
        return 'border-purple-500 bg-purple-900/20'
      default:
        return 'border-gray-500 bg-gray-900/20'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center space-x-2">
                <Bot className="w-8 h-8 text-blue-400" />
                <h1 className="text-2xl font-bold">Natulang-Inspired Lessons</h1>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 max-w-2xl">
            Experience dynamic, AI-driven conversations with Mo, your personal French tutor. 
            Each lesson adapts to your learning pace and provides real-time feedback on pronunciation, 
            grammar, and vocabulary.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="evaluation">Evaluation</option>
                <option value="repetition">Repetition</option>
                <option value="conversation">Conversation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-lg border-2 ${getTypeColor(lesson.type)} hover:scale-105 transition-all duration-200 cursor-pointer`}
              onClick={() => onSelectLesson(lesson.id)}
            >
              {/* Lesson Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getLessonIcon(lesson.type)}
                  <div>
                    <h3 className="font-semibold text-lg capitalize">
                      {lesson.type.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {lesson.language} → {lesson.targetLanguage}
                    </p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.metadata.difficulty)}`}>
                  {lesson.metadata.difficulty}
                </span>
              </div>

              {/* Lesson Content */}
              <div className="space-y-3">
                {/* Estimated Time */}
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.metadata.estimatedTime} minutes</span>
                </div>

                {/* Grammar Focus */}
                {lesson.metadata.grammarFocus.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-blue-400 mb-1">Grammar Focus:</p>
                    <div className="flex flex-wrap gap-1">
                      {lesson.metadata.grammarFocus.slice(0, 3).map((focus, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
                          {focus}
                        </span>
                      ))}
                      {lesson.metadata.grammarFocus.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                          +{lesson.metadata.grammarFocus.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Vocabulary Focus */}
                {lesson.metadata.vocabularyFocus.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-green-400 mb-1">Vocabulary Focus:</p>
                    <div className="flex flex-wrap gap-1">
                      {lesson.metadata.vocabularyFocus.slice(0, 3).map((focus, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">
                          {focus}
                        </span>
                      ))}
                      {lesson.metadata.vocabularyFocus.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                          +{lesson.metadata.vocabularyFocus.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Commands Preview */}
                <div>
                  <p className="text-sm font-medium text-purple-400 mb-1">Lesson Structure:</p>
                  <div className="flex flex-wrap gap-1">
                    {lesson.commands.slice(0, 4).map((command, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs">
                        {command.command}
                      </span>
                    ))}
                    {lesson.commands.length > 4 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                        +{lesson.commands.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectLesson(lesson.id)
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Lesson</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No lessons found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find more lessons.
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span>Learning Statistics</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{lessons.length}</div>
              <div className="text-sm text-gray-400">Total Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {lessons.filter(l => l.metadata.difficulty === 'beginner').length}
              </div>
              <div className="text-sm text-gray-400">Beginner</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {lessons.filter(l => l.metadata.difficulty === 'intermediate').length}
              </div>
              <div className="text-sm text-gray-400">Intermediate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {lessons.filter(l => l.type === 'conversation').length}
              </div>
              <div className="text-sm text-gray-400">Conversations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 