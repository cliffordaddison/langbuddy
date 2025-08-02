"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Volume2, 
  Mic, 
  Globe, 
  Target, 
  BookOpen,
  Download,
  Upload,
  Trash2,
  Save
} from 'lucide-react'
import { useLearningStore } from '@/lib/store'

export default function SettingsPanel() {
  const { settings, updateSettings, clearConversation, sessions } = useLearningStore()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExportData = () => {
    setIsExporting(true)
    const data = {
      settings,
      sessions,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `langbuddy-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setTimeout(() => setIsExporting(false), 1000)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        // In a real app, you'd validate and import the data
        console.log('Imported data:', data)
        alert('Données importées avec succès !')
      } catch (error) {
        alert('Erreur lors de l\'importation des données.')
      }
      setIsImporting(false)
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.')) {
      clearConversation()
      // In a real app, you'd clear all stored data
      alert('Toutes les données ont été supprimées.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paramètres
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Personnalisez votre expérience d'apprentissage
        </p>
      </div>

      {/* Speech Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Volume2 className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Paramètres de parole
          </h3>
        </div>

        <div className="space-y-4">
          {/* Speech Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vitesse de parole
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.speechSpeed}
                onChange={(e) => updateSettings({ speechSpeed: parseFloat(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                {settings.speechSpeed}x
              </span>
            </div>
          </div>

          {/* Accent Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Accent français
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateSettings({ accent: 'french' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  settings.accent === 'french'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Français de France</span>
                </div>
              </button>
              <button
                onClick={() => updateSettings({ accent: 'quebec' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  settings.accent === 'quebec'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Français québécois</span>
                </div>
              </button>
            </div>
          </div>

          {/* Auto Speech Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lecture automatique des réponses
                </span>
              </div>
              <button
                onClick={() => updateSettings({ autoSpeak: !settings.autoSpeak })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoSpeak ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoSpeak ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mic className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reconnaissance vocale automatique
                </span>
              </div>
              <button
                onClick={() => updateSettings({ autoListen: !settings.autoListen })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoListen ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoListen ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Learning Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Paramètres d'apprentissage
          </h3>
        </div>

        <div className="space-y-4">
          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Niveau de difficulté par défaut
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => updateSettings({ difficulty })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.difficulty === difficulty
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-sm font-medium capitalize">
                      {difficulty === 'easy' ? 'Facile' : difficulty === 'medium' ? 'Intermédiaire' : 'Avancé'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domaines d'apprentissage prioritaires
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['vocabulary', 'grammar', 'pronunciation', 'comprehension'].map((area) => (
                <button
                  key={area}
                  onClick={() => {
                    const newFocusAreas = settings.focusAreas.includes(area)
                      ? settings.focusAreas.filter(a => a !== area)
                      : [...settings.focusAreas, area]
                    updateSettings({ focusAreas: newFocusAreas })
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.focusAreas.includes(area)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">
                      {area === 'vocabulary' ? 'Vocabulaire' : 
                       area === 'grammar' ? 'Grammaire' : 
                       area === 'pronunciation' ? 'Prononciation' : 'Compréhension'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gestion des données
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isExporting ? 'Exportation...' : 'Exporter les données'}
            </span>
          </button>

          <label className="flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isImporting ? 'Importation...' : 'Importer des données'}
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>

          <button
            onClick={handleClearAllData}
            className="flex items-center justify-center space-x-2 p-3 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Supprimer tout</span>
          </button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <button className="btn-primary px-8 py-3 text-lg flex items-center space-x-2">
          <Save className="w-5 h-5" />
          <span>Sauvegarder les paramètres</span>
        </button>
      </motion.div>
    </div>
  )
} 