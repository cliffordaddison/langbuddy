"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  BookOpen, 
  Target, 
  Award,
  BarChart3,
  Activity,
  Trophy,
  Star
} from 'lucide-react'
import { useLearningStore } from '@/lib/store'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function ProgressOverview() {
  const { userProgress, sessions } = useLearningStore()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')

  // Mock data for charts - in production, this would come from real analytics
  const weeklyData = [
    { day: 'Lun', sessions: 3, minutes: 45, vocabulary: 12 },
    { day: 'Mar', sessions: 2, minutes: 30, vocabulary: 8 },
    { day: 'Mer', sessions: 4, minutes: 60, vocabulary: 15 },
    { day: 'Jeu', sessions: 1, minutes: 20, vocabulary: 5 },
    { day: 'Ven', sessions: 5, minutes: 75, vocabulary: 18 },
    { day: 'Sam', sessions: 2, minutes: 35, vocabulary: 10 },
    { day: 'Dim', sessions: 3, minutes: 50, vocabulary: 14 },
  ]

  const skillData = [
    { name: 'Vocabulaire', value: 75, color: '#3B82F6' },
    { name: 'Grammaire', value: 65, color: '#10B981' },
    { name: 'Prononciation', value: 80, color: '#F59E0B' },
    { name: 'Compréhension', value: 70, color: '#EF4444' },
  ]

  const levelProgress = {
    A1: 100,
    A2: 85,
    B1: 60,
    B2: 40,
    C1: 20,
    C2: 10
  }

  const achievements = [
    { id: 1, name: 'Première conversation', description: 'Avez votre première conversation en français', earned: true },
    { id: 2, name: 'Streak de 7 jours', description: 'Apprenez 7 jours de suite', earned: true },
    { id: 3, name: '100 mots appris', description: 'Maîtrisez 100 mots de vocabulaire', earned: true },
    { id: 4, name: 'Conversation avancée', description: 'Ayez une conversation de 30 minutes', earned: false },
    { id: 5, name: 'Niveau B1', description: 'Atteignez le niveau B1', earned: false },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Progression d'apprentissage
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Suivez vos progrès et vos réalisations
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Année'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Niveau actuel</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProgress.level}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Série actuelle</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProgress.streak} jours</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Temps total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProgress.conversationMinutes} min</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vocabulaire</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProgress.vocabularyLearned} mots</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activité hebdomadaire
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="minutes" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skills Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Compétences par domaine
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Progression des niveaux
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Object.entries(levelProgress).map(([level, progress]) => (
            <div key={level} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={userProgress.level === level ? "#3B82F6" : "#10B981"}
                    strokeWidth="3"
                    strokeDasharray={`${progress}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">{progress}%</span>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{level}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Réalisations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  achievement.earned 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {achievement.earned ? (
                    <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Star className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    achievement.earned 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className={`text-sm ${
                    achievement.earned 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 