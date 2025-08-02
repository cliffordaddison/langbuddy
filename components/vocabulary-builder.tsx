"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Brain, Sparkles, Eye, Heart, Utensils, Cloud, Briefcase, Home, Globe } from 'lucide-react'

interface VocabularyBuilderProps {
  currentFocus: string
  onVocabularySelect: (word: string, category: string) => void
}

const vocabularyCategories = {
  bodyParts: {
    icon: Eye,
    color: 'bg-blue-500',
    basic: ['tête', 'yeux', 'nez', 'bouche', 'oreilles', 'cou', 'épaules', 'bras', 'mains', 'doigts'],
    advanced: ['front', 'sourcils', 'cils', 'lèvres', 'dents', 'langue', 'gorge', 'poitrine', 'ventre', 'dos'],
    expressions: ['avoir mal à la tête', 'se casser la tête', 'avoir les yeux plus gros que le ventre']
  },
  emotions: {
    icon: Heart,
    color: 'bg-pink-500',
    basic: ['heureux', 'triste', 'fatigué', 'énervé', 'content', 'déçu', 'surpris', 'inquiet'],
    advanced: ['ravi', 'déprimé', 'épuisé', 'furieux', 'satisfait', 'désespéré', 'stupéfait', 'anxieux'],
    expressions: ['être aux anges', 'avoir le cafard', 'être sur les nerfs', 'être aux oiseaux']
  },
  food: {
    icon: Utensils,
    color: 'bg-orange-500',
    basic: ['pain', 'fromage', 'vin', 'café', 'thé', 'eau', 'lait', 'jus'],
    advanced: ['baguette', 'camembert', 'champagne', 'espresso', 'infusion', 'eau minérale'],
    expressions: ['avoir la faim', 'avoir soif', 'manger comme un ogre', 'avoir un petit creux']
  },
  weather: {
    icon: Cloud,
    color: 'bg-cyan-500',
    basic: ['soleil', 'pluie', 'neige', 'vent', 'nuages', 'orage', 'brouillard'],
    advanced: ['ensoleillé', 'pluvieux', 'neigeux', 'venteux', 'nuageux', 'orageux', 'brumeux'],
    expressions: ['il fait un temps de chien', 'il pleut des cordes', 'il fait un froid de canard']
  },
  work: {
    icon: Briefcase,
    color: 'bg-purple-500',
    basic: ['bureau', 'réunion', 'projet', 'collègue', 'patron', 'salaire', 'congés'],
    advanced: ['open space', 'brainstorming', 'deadline', 'team building', 'burn-out'],
    expressions: ['travailler comme un forçat', 'être débordé', 'avoir du pain sur la planche']
  },
  dailyLife: {
    icon: Home,
    color: 'bg-green-500',
    basic: ['se lever', 'se doucher', 's\'habiller', 'prendre le petit-déjeuner', 'aller au travail'],
    advanced: ['faire du sport', 'lire', 'cuisiner', 'nettoyer', 'sortir avec des amis'],
    expressions: ['se lever du bon pied', 'avoir une journée chargée', 'être débordé']
  },
  idioms: {
    icon: Sparkles,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    basic: ['avoir le cafard', 'être dans la lune', 'avoir la pêche', 'être au bout du rouleau'],
    advanced: ['mettre les pieds dans le plat', 'avoir un poil dans la main', 'être comme un poisson dans l\'eau'],
    expressions: ['ça marche comme sur des roulettes', 'c\'est du gâteau', 'ça ne casse pas trois pattes à un canard']
  }
}

export default function VocabularyBuilder({ currentFocus, onVocabularySelect }: VocabularyBuilderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<'basic' | 'advanced' | 'expressions'>('basic')

  const handleVocabularyClick = (word: string, category: string) => {
    onVocabularySelect(word, category)
  }

  const getCurrentCategories = () => {
    if (!currentFocus) return Object.keys(vocabularyCategories)
    
    const categories = currentFocus.split(', ')
    return categories.map(cat => cat.toLowerCase())
  }

  const currentCategories = getCurrentCategories()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Constructeur de Vocabulaire
        </h3>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(vocabularyCategories).map(([key, category]) => {
          const Icon = category.icon
          const isActive = currentCategories.includes(key) || !currentFocus
          const isSelected = selectedCategory === key
          
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(isSelected ? null : key)}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : isActive
                  ? 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                  : 'border-gray-200 dark:border-gray-700 opacity-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${category.color} text-white`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium capitalize">
                  {key === 'bodyParts' ? 'Corps' : 
                   key === 'dailyLife' ? 'Vie quotidienne' : 
                   key === 'idioms' ? 'Expressions' : key}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Level Selection */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex space-x-2"
        >
          {(['basic', 'advanced', 'expressions'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedLevel === level
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {level === 'basic' ? 'Basique' : 
               level === 'advanced' ? 'Avancé' : 'Expressions'}
            </button>
          ))}
        </motion.div>
      )}

      {/* Vocabulary List */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center space-x-2 mb-3">
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              {selectedCategory === 'bodyParts' ? 'Parties du corps' : 
               selectedCategory === 'dailyLife' ? 'Vie quotidienne' : 
               selectedCategory === 'idioms' ? 'Expressions idiomatiques' : 
               selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {vocabularyCategories[selectedCategory as keyof typeof vocabularyCategories][selectedLevel].map((word, index) => (
              <button
                key={index}
                onClick={() => handleVocabularyClick(word, selectedCategory)}
                className="p-2 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left"
              >
                {word}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Access */}
      {!selectedCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Accès rapide - Expressions courantes
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {vocabularyCategories.idioms.expressions.slice(0, 6).map((expression, index) => (
              <button
                key={index}
                onClick={() => handleVocabularyClick(expression, 'idioms')}
                className="p-2 text-sm bg-white dark:bg-gray-800 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left border border-gray-200 dark:border-gray-700"
              >
                {expression}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
} 