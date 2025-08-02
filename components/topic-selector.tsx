"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Coffee, 
  ShoppingBag, 
  Bus, 
  Building, 
  Heart, 
  Users, 
  Newspaper, 
  GraduationCap,
  Globe,
  Music,
  Utensils,
  Plane,
  Sparkles,
  Brain,
  BookOpen
} from 'lucide-react'

interface TopicSelectorProps {
  onStartSession: (topic: string, difficulty: 'easy' | 'medium' | 'hard') => void
}

const topics = [
  {
    id: 'dynamic',
    title: 'Conversation Dynamique',
    description: 'Conversations naturelles et fluides comme dans la vraie vie. Les sujets changent naturellement et le vocabulaire s\'enrichit organiquement.',
    icon: Sparkles,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    scenarios: [
      'Conversations spontanées et naturelles',
      'Changement de sujets fluide',
      'Vocabulaire enrichi organiquement',
      'Expressions idiomatiques intégrées',
      'Apprentissage contextuel avancé'
    ],
    vocabularyFocus: 'Complet - Tous les domaines'
  },
  {
    id: 'daily-life',
    title: 'Vie quotidienne',
    description: 'Conversations sur la routine quotidienne, les habitudes et la vie de tous les jours avec vocabulaire enrichi',
    icon: Coffee,
    color: 'bg-blue-500',
    scenarios: [
      'Se présenter et parler de soi',
      'Décrire sa routine matinale',
      'Parler de ses hobbies et loisirs',
      'Discuter de la météo et des saisons'
    ],
    vocabularyFocus: 'Corps humain, vêtements, routine, temps'
  },
  {
    id: 'shopping',
    title: 'Shopping et achats',
    description: 'Faire des courses, négocier les prix et interagir avec les commerçants avec vocabulaire commercial',
    icon: ShoppingBag,
    color: 'bg-green-500',
    scenarios: [
      'Acheter des vêtements',
      'Faire les courses au supermarché',
      'Négocier dans un marché',
      'Retourner un article'
    ],
    vocabularyFocus: 'Commerce, argent, vêtements, nourriture'
  },
  {
    id: 'transport',
    title: 'Transport public',
    description: 'Utiliser les transports en commun, demander des directions avec vocabulaire urbain',
    icon: Bus,
    color: 'bg-yellow-500',
    scenarios: [
      'Acheter un billet de transport',
      'Demander son chemin',
      'Se plaindre d\'un retard',
      'Demander des informations touristiques'
    ],
    vocabularyFocus: 'Ville, transport, directions, temps'
  },
  {
    id: 'work',
    title: 'Travail et bureau',
    description: 'Conversations professionnelles, réunions et culture d\'entreprise avec vocabulaire professionnel',
    icon: Building,
    color: 'bg-purple-500',
    scenarios: [
      'Se présenter en entretien',
      'Participer à une réunion',
      'Discuter de projets professionnels',
      'Parler de la culture d\'entreprise'
    ],
    vocabularyFocus: 'Professions, bureau, projets, relations'
  },
  {
    id: 'relationships',
    title: 'Relations et amitié',
    description: 'Se faire des amis, parler de relations et de sentiments avec vocabulaire émotionnel',
    icon: Heart,
    color: 'bg-pink-500',
    scenarios: [
      'Se faire des amis français',
      'Parler de ses relations',
      'Exprimer ses sentiments',
      'Participer à des événements sociaux'
    ],
    vocabularyFocus: 'Émotions, relations, sentiments, famille'
  },
  {
    id: 'community',
    title: 'Vie communautaire',
    description: 'Participer à la vie locale, associations et événements avec vocabulaire communautaire',
    icon: Users,
    color: 'bg-indigo-500',
    scenarios: [
      'Rejoindre une association',
      'Participer à des événements locaux',
      'Faire du bénévolat',
      'Intégrer un club sportif'
    ],
    vocabularyFocus: 'Communauté, activités, sports, événements'
  },
  {
    id: 'media',
    title: 'Médias et actualités',
    description: 'Discuter de films, musique, actualités et culture française avec vocabulaire médiatique',
    icon: Newspaper,
    color: 'bg-red-500',
    scenarios: [
      'Parler de films français',
      'Discuter de l\'actualité',
      'Partager des opinions politiques',
      'Parler de musique française'
    ],
    vocabularyFocus: 'Médias, culture, politique, opinions'
  },
  {
    id: 'education',
    title: 'Éducation et examens',
    description: 'Préparation aux examens TCF/TEF et études en France avec vocabulaire académique',
    icon: GraduationCap,
    color: 'bg-teal-500',
    scenarios: [
      'Préparer l\'examen TCF',
      'Parler de ses études',
      'Discuter de l\'éducation française',
      'Préparer un entretien universitaire'
    ],
    vocabularyFocus: 'Éducation, études, examens, académique'
  },
  {
    id: 'culture',
    title: 'Culture et traditions',
    description: 'Découvrir les traditions françaises et les différences culturelles avec vocabulaire culturel',
    icon: Globe,
    color: 'bg-orange-500',
    scenarios: [
      'Parler des fêtes françaises',
      'Discuter des traditions',
      'Comprendre les codes sociaux',
      'Découvrir l\'histoire française'
    ],
    vocabularyFocus: 'Traditions, fêtes, histoire, coutumes'
  },
  {
    id: 'entertainment',
    title: 'Divertissement',
    description: 'Sorties, restaurants, concerts et activités de loisirs avec vocabulaire récréatif',
    icon: Music,
    color: 'bg-emerald-500',
    scenarios: [
      'Réserver au restaurant',
      'Aller au cinéma',
      'Assister à un concert',
      'Planifier une sortie'
    ],
    vocabularyFocus: 'Loisirs, divertissement, sorties, arts'
  },
  {
    id: 'food',
    title: 'Cuisine et gastronomie',
    description: 'Parler de cuisine française, recettes et restaurants avec vocabulaire culinaire',
    icon: Utensils,
    color: 'bg-amber-500',
    scenarios: [
      'Parler de cuisine française',
      'Partager des recettes',
      'Discuter de vins',
      'Découvrir la gastronomie'
    ],
    vocabularyFocus: 'Cuisine, nourriture, boissons, gastronomie'
  },
  {
    id: 'travel',
    title: 'Voyage et tourisme',
    description: 'Planifier des voyages, visiter des sites touristiques avec vocabulaire touristique',
    icon: Plane,
    color: 'bg-cyan-500',
    scenarios: [
      'Réserver un hôtel',
      'Planifier un voyage',
      'Visiter des musées',
      'Découvrir des régions françaises'
    ],
    vocabularyFocus: 'Voyage, tourisme, géographie, hébergement'
  }
]

const difficulties = [
  { id: 'easy', label: 'Facile', description: 'Vocabulaire simple, phrases courtes, expressions de base' },
  { id: 'medium', label: 'Intermédiaire', description: 'Vocabulaire varié, conversations naturelles, expressions idiomatiques' },
  { id: 'hard', label: 'Avancé', description: 'Expressions idiomatiques, discussions complexes, vocabulaire spécialisé' }
]

export default function TopicSelector({ onStartSession }: TopicSelectorProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')

  const handleStartSession = () => {
    if (selectedTopic) {
      const topic = topics.find(t => t.id === selectedTopic)
      if (topic) {
        onStartSession(topic.title, selectedDifficulty)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choisissez votre expérience d'apprentissage
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sélectionnez un mode de conversation et un niveau de difficulté pour enrichir votre vocabulaire français
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => {
          const Icon = topic.icon
          const isSelected = selectedTopic === topic.id
          const isDynamic = topic.id === 'dynamic'
          
          return (
            <motion.button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
              } ${isDynamic ? 'ring-2 ring-purple-200 dark:ring-purple-800' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${topic.color} text-white ${isDynamic ? 'animate-pulse' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {topic.title}
                    </h3>
                    {isDynamic && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">
                        RECOMMANDÉ
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {topic.description}
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
                      Vocabulaire: {topic.vocabularyFocus}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {topic.scenarios.slice(0, 2).map((scenario, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>{scenario}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Difficulty Selection */}
      {selectedTopic && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Niveau de difficulté et enrichissement vocabulaire
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.id}
                onClick={() => setSelectedDifficulty(difficulty.id as 'easy' | 'medium' | 'hard')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedDifficulty === difficulty.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="text-center">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {difficulty.label}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {difficulty.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Start Session Button */}
      {selectedTopic && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <button
            onClick={handleStartSession}
            className="btn-primary px-8 py-3 text-lg flex items-center space-x-2"
          >
            <Brain className="w-5 h-5" />
            <span>Commencer l'apprentissage dynamique</span>
          </button>
        </motion.div>
      )}
    </div>
  )
} 