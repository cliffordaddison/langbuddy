"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Brain, Sparkles, GraduationCap, Target, CheckCircle } from 'lucide-react'

interface GrammarBuilderProps {
  currentTopic: string | null
  onGrammarSelect: (topic: string, level: string) => void
}

const grammarTopics = {
  basics: {
    salutations: {
      title: "Salutations",
      level: "A1",
      examples: ["Bonjour", "Salut", "Au revoir", "À bientôt", "Bonsoir"],
      rules: ["Formal vs informal greetings", "Time-based greetings", "Cultural context"],
      exercises: ["Complete the greeting", "Choose formal/informal", "Match greetings to time"]
    },
    weather_seasons: {
      title: "Weather, Seasons, Days, Numbers",
      level: "A1",
      examples: ["Il fait beau", "L'hiver", "Lundi", "Un, deux, trois"],
      rules: ["Weather expressions", "Season vocabulary", "Days of week", "Cardinal numbers"],
      exercises: ["Describe the weather", "Name the seasons", "Count in French"]
    },
    feelings_months: {
      title: "Feelings, Months, Dates",
      level: "A1",
      examples: ["Je suis content", "Janvier", "Le premier janvier"],
      rules: ["Emotional vocabulary", "Month names", "Date expressions"],
      exercises: ["Express emotions", "Name months", "Say dates"]
    },
    alphabet_pronunciation: {
      title: "Alphabet, Pronunciation",
      level: "A1",
      examples: ["A, B, C", "É, È, Ê", "Nasal sounds"],
      rules: ["French alphabet", "Accent marks", "Pronunciation rules"],
      exercises: ["Spell words", "Practice accents", "Nasal sounds"]
    }
  },
  articles: {
    definite: {
      title: "Definite Articles (le, la, les)",
      level: "A1",
      examples: ["le livre", "la maison", "les enfants"],
      rules: ["Gender agreement", "Plural forms", "Contractions"],
      exercises: ["Choose correct article", "Gender identification", "Plural forms"]
    },
    indefinite: {
      title: "Indefinite Articles (un, une, des)",
      level: "A1",
      examples: ["un chat", "une voiture", "des amis"],
      rules: ["Gender agreement", "Plural forms", "Usage contexts"],
      exercises: ["Choose indefinite article", "Count nouns", "Describe objects"]
    },
    partitive: {
      title: "Partitive Articles (du, de la, des)",
      level: "A2",
      examples: ["du pain", "de la viande", "des légumes"],
      rules: ["Uncountable nouns", "Food expressions", "Quantity expressions"],
      exercises: ["Food vocabulary", "Quantity expressions", "Shopping dialogue"]
    }
  },
  verbs: {
    aller_prepositions: {
      title: "Aller And Prepositions",
      level: "A2",
      examples: ["Je vais à Paris", "Aller chez", "Aller en"],
      rules: ["Conjugation of aller", "Preposition usage", "Location expressions"],
      exercises: ["Conjugate aller", "Use prepositions", "Location vocabulary"]
    },
    subject_pronouns: {
      title: "Subject Pronouns, Auxiliaries, Adjectives",
      level: "A1",
      examples: ["Je, tu, il", "Être, avoir", "Grand, petite"],
      rules: ["Pronoun usage", "Auxiliary verbs", "Adjective agreement"],
      exercises: ["Pronoun practice", "Auxiliary verbs", "Adjective agreement"]
    },
    tenses: {
      title: "French Tenses",
      level: "B1",
      examples: ["Présent", "Passé composé", "Futur simple", "Imparfait"],
      rules: ["Tense formation", "Usage contexts", "Conjugation patterns"],
      exercises: ["Conjugate verbs", "Choose tense", "Time expressions"]
    },
    irregular_verbs: {
      title: "Irregular Verbs",
      level: "A2",
      examples: ["Être, avoir, aller", "Faire, dire, venir"],
      rules: ["Common irregular patterns", "Memorization techniques"],
      exercises: ["Conjugate irregular verbs", "Pattern recognition", "Common verbs"]
    },
    reflexive: {
      title: "Reflexive Verbs",
      level: "A2",
      examples: ["Se lever", "Se laver", "S'habiller"],
      rules: ["Reflexive pronouns", "Daily routine verbs", "Conjugation"],
      exercises: ["Daily routine", "Reflexive conjugation", "Personal care"]
    }
  },
  negation: {
    simple: {
      title: "Simple Negations",
      level: "A1",
      examples: ["Ne...pas", "Je ne parle pas", "Il ne vient pas"],
      rules: ["Ne...pas structure", "Placement rules", "Common patterns"],
      exercises: ["Make negative", "Place negation", "Common patterns"]
    },
    complex: {
      title: "Complex Negations",
      level: "B1",
      examples: ["Ne...jamais", "Ne...rien", "Ne...personne"],
      rules: ["Multiple negation words", "Advanced patterns", "Usage contexts"],
      exercises: ["Advanced negation", "Multiple negations", "Context usage"]
    }
  },
  adjectives: {
    basic: {
      title: "Adjectives, Comparatives And Superlatives",
      level: "A2",
      examples: ["Grand, plus grand, le plus grand"],
      rules: ["Agreement rules", "Comparative forms", "Superlative forms"],
      exercises: ["Adjective agreement", "Make comparisons", "Superlatives"]
    },
    possessive: {
      title: "Possessive & Demonstrative Adjectives",
      level: "A2",
      examples: ["Mon, ma, mes", "Ce, cette, ces"],
      rules: ["Possessive forms", "Demonstrative usage", "Agreement"],
      exercises: ["Possessive adjectives", "Demonstratives", "Agreement practice"]
    },
    complex_comparative: {
      title: "Complex Comparative And Superlatives",
      level: "B2",
      examples: ["Plus...que", "Moins...que", "Le plus...de"],
      rules: ["Advanced comparisons", "Superlative structures", "Exceptions"],
      exercises: ["Advanced comparisons", "Complex superlatives", "Exceptions"]
    }
  },
  pronouns: {
    interrogative: {
      title: "Interrogative Adjectives/Pronouns",
      level: "A2",
      examples: ["Quel, quelle", "Qui, que, quoi"],
      rules: ["Question formation", "Pronoun usage", "Adjective agreement"],
      exercises: ["Ask questions", "Use interrogatives", "Question formation"]
    },
    relative: {
      title: "Relative Pronouns",
      level: "B1",
      examples: ["Qui, que, dont, où"],
      rules: ["Subject vs object", "Preposition usage", "Complex structures"],
      exercises: ["Relative clauses", "Pronoun choice", "Complex sentences"]
    },
    object: {
      title: "Direct & Indirect Object Pronouns",
      level: "B1",
      examples: ["Le, la, les", "Lui, leur"],
      rules: ["Placement rules", "Agreement", "Combination patterns"],
      exercises: ["Object pronouns", "Placement practice", "Combination rules"]
    },
    possessive_demonstrative: {
      title: "Possessive, Demonstrative & Emphatic Pronouns",
      level: "B2",
      examples: ["Le mien, la mienne", "Celui-ci", "Moi-même"],
      rules: ["Pronoun forms", "Emphatic usage", "Agreement patterns"],
      exercises: ["Possessive pronouns", "Emphatic usage", "Agreement patterns"]
    }
  },
  advanced: {
    subjonctif: {
      title: "Subjonctif",
      level: "B2",
      examples: ["Que je parle", "Il faut que", "Je veux que"],
      rules: ["Subjunctive triggers", "Conjugation patterns", "Usage contexts"],
      exercises: ["Subjunctive triggers", "Conjugation practice", "Context usage"]
    },
    conditionnel: {
      title: "Conditionnel Présent",
      level: "B1",
      examples: ["Je parlerais", "Si j'avais", "J'aimerais"],
      rules: ["Conditional formation", "Hypothetical situations", "Polite requests"],
      exercises: ["Conditional forms", "Hypothetical situations", "Polite requests"]
    },
    plus_que_parfait: {
      title: "Plus-Que-Parfait",
      level: "B2",
      examples: ["J'avais parlé", "Il était parti"],
      rules: ["Past perfect formation", "Usage contexts", "Time relationships"],
      exercises: ["Past perfect", "Time relationships", "Narrative past"]
    },
    futur_anterieur: {
      title: "Futur Antérieur",
      level: "B2",
      examples: ["J'aurai parlé", "Il sera parti"],
      rules: ["Future perfect formation", "Completed future actions"],
      exercises: ["Future perfect", "Completed actions", "Future time"]
    },
    conditionnel_passe: {
      title: "Le Conditionnel Passé",
      level: "B2",
      examples: ["J'aurais parlé", "Il serait parti"],
      rules: ["Past conditional", "Hypothetical past", "Regret expressions"],
      exercises: ["Past conditional", "Hypothetical past", "Regret expressions"]
    },
    passe_simple: {
      title: "Le Passé Simple",
      level: "C1",
      examples: ["Je parlai", "Il partit"],
      rules: ["Literary tense", "Historical context", "Conjugation patterns"],
      exercises: ["Literary texts", "Historical context", "Conjugation patterns"]
    }
  }
}

export default function GrammarBuilder({ currentTopic, onGrammarSelect }: GrammarBuilderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1'>('A1')

  const handleGrammarSelect = (topic: string, level: string) => {
    onGrammarSelect(topic, level)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1': return 'bg-green-500'
      case 'A2': return 'bg-blue-500'
      case 'B1': return 'bg-yellow-500'
      case 'B2': return 'bg-orange-500'
      case 'C1': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'] as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Constructeur de Grammaire
        </h3>
      </div>

      {/* Level Selection */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedLevel === level
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Grammar Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(grammarTopics).map(([categoryKey, category]) => (
          <div key={categoryKey} className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white capitalize">
              {categoryKey === 'basics' ? 'Bases' : 
               categoryKey === 'articles' ? 'Articles' :
               categoryKey === 'verbs' ? 'Verbes' :
               categoryKey === 'negation' ? 'Négation' :
               categoryKey === 'adjectives' ? 'Adjectifs' :
               categoryKey === 'pronouns' ? 'Pronoms' :
               categoryKey === 'advanced' ? 'Avancé' : categoryKey}
            </h4>
            
            <div className="space-y-2">
              {Object.entries(category).map(([topicKey, topic]) => {
                const isCurrentLevel = topic.level === selectedLevel
                const isCurrentTopic = currentTopic === topicKey
                
                return (
                  <motion.button
                    key={topicKey}
                    onClick={() => handleGrammarSelect(topicKey, topic.level)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      isCurrentTopic
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : isCurrentLevel
                        ? 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                        : 'border-gray-200 dark:border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-medium text-sm text-gray-900 dark:text-white">
                            {topic.title}
                          </h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getLevelColor(topic.level)}`}>
                            {topic.level}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {topic.examples.slice(0, 2).join(', ')}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            {topic.exercises.length} exercices
                          </span>
                        </div>
                      </div>
                      {isCurrentTopic && (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      {currentTopic && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Grammaire en cours d'apprentissage
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Continuez votre conversation pour pratiquer la grammaire sélectionnée !
          </p>
        </motion.div>
      )}
    </div>
  )
} 