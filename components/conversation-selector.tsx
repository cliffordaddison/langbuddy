"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  BookOpen, 
  Target, 
  Clock, 
  Star,
  Play,
  Crown,
  Lightbulb,
  Users,
  MapPin,
  Coffee,
  Building
} from 'lucide-react'
import { ConversationSystem, ConversationContext } from '@/lib/conversation-system'

interface ConversationSelectorProps {
  onSelectContext: (context: ConversationContext) => void
  onBack?: () => void
}

export default function ConversationSelector({ onSelectContext, onBack }: ConversationSelectorProps) {
  const [conversationSystem] = useState(() => new ConversationSystem())
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const contexts = conversationSystem.getAllContexts()
  
  const filteredContexts = contexts.filter(context => {
    const matchesDifficulty = selectedDifficulty === 'all' || context.difficulty === selectedDifficulty
    const matchesSearch = context.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         context.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesDifficulty && matchesSearch
  })

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Target className="w-4 h-4 text-green-400" />
      case 'intermediate':
        return <Star className="w-4 h-4 text-yellow-400" />
      case 'advanced':
        return <Crown className="w-4 h-4 text-purple-400" />
      default:
        return <Target className="w-4 h-4 text-gray-400" />
    }
  }

  const getContextIcon = (contextId: string) => {
    switch (contextId) {
      case 'library_conversation':
        return <Building className="w-6 h-6" />
      case 'restaurant_conversation':
        return <Coffee className="w-6 h-6" />
      case 'travel_conversation':
        return <MapPin className="w-6 h-6" />
      default:
        return <MessageCircle className="w-6 h-6" />
    }
  }

  const getEstimatedTime = (context: ConversationContext) => {
    // Estimate based on number of turns and difficulty
    const baseTime = context.difficulty === 'beginner' ? 3 : context.difficulty === 'intermediate' ? 5 : 8
    return `${baseTime}-${baseTime + 2} min`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-blue-600 p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-white"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold">Conversations</h1>
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search and Filter */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Difficulty Filter */}
            <div className="flex space-x-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === difficulty
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {difficulty === 'all' ? 'All' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContexts.map((context) => (
              <motion.div
                key={context.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => onSelectContext(context)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      {getContextIcon(context.id)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{context.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getDifficultyIcon(context.difficulty)}
                        <span className="text-xs text-gray-400 capitalize">{context.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                    <Play className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">{context.description}</p>

                {/* Details */}
                <div className="space-y-2">
                  {/* Characters */}
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{context.characters.length} characters</span>
                  </div>

                  {/* Grammar Focus */}
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Lightbulb className="w-4 h-4" />
                    <span>{context.grammarFocus.length} grammar points</span>
                  </div>

                  {/* Estimated Time */}
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{getEstimatedTime(context)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {context.grammarFocus.slice(0, 2).map((focus, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded"
                    >
                      {focus}
                    </span>
                  ))}
                  {context.vocabularyFocus.slice(0, 1).map((vocab, index) => (
                    <span
                      key={index}
                      className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded"
                    >
                      {vocab}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredContexts.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
              <p className="text-gray-400">
                Try adjusting your search or difficulty filter
              </p>
            </div>
          )}

          {/* Quick Start Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Quick Start</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium mb-1">Beginner</h4>
                <p className="text-sm text-gray-400">Start with basic greetings and introductions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium mb-1">Intermediate</h4>
                <p className="text-sm text-gray-400">Practice everyday situations and conversations</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium mb-1">Advanced</h4>
                <p className="text-sm text-gray-400">Master complex grammar and cultural nuances</p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-blue-400" />
              <span>Learning Tips</span>
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Speak clearly and at a natural pace</p>
              <p>• Don't worry about making mistakes - that's how you learn!</p>
              <p>• Listen carefully to the pronunciation</p>
              <p>• Practice regularly for best results</p>
            </div>
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