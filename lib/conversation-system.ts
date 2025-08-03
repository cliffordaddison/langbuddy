// Advanced Conversation-Based Learning System
// Mimics Natulang's AI-driven approach with dynamic conversations

export interface ConversationContext {
  id: string
  title: string
  description: string
  scenario: string
  characters: Character[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  grammarFocus: string[]
  vocabularyFocus: string[]
  culturalNotes: string[]
}

export interface Character {
  name: string
  role: string
  personality: string
  speakingStyle: string
}

export interface ConversationTurn {
  id: string
  speaker: 'ai' | 'user'
  message: string
  translation?: string
  context: string
  grammarNotes?: string[]
  vocabularyNotes?: string[]
  pronunciation?: string
  audioUrl?: string
  expectedResponse?: string
  alternatives?: string[]
  difficulty: number
  feedback?: TurnFeedback
}

export interface TurnFeedback {
  isCorrect: boolean
  pronunciationScore: number
  grammarScore: number
  suggestions: string[]
  corrections: string[]
  encouragement: string
}

export interface UserResponse {
  spokenText: string
  confidence: number
  timestamp: number
  analysis: ResponseAnalysis
}

export interface ResponseAnalysis {
  isCorrect: boolean
  pronunciationScore: number
  grammarScore: number
  vocabularyScore: number
  fluencyScore: number
  suggestions: string[]
  corrections: string[]
  nextStep: 'continue' | 'repeat' | 'explain' | 'practice'
}

export interface LearningSession {
  id: string
  contextId: string
  startTime: number
  endTime?: number
  turns: ConversationTurn[]
  userResponses: UserResponse[]
  currentTurnIndex: number
  sessionPerformance: SessionPerformance
  status: 'active' | 'paused' | 'completed'
}

export interface SessionPerformance {
  totalTurns: number
  correctResponses: number
  averagePronunciationScore: number
  averageGrammarScore: number
  averageVocabularyScore: number
  averageFluencyScore: number
  weakAreas: string[]
  strongAreas: string[]
  recommendedFocus: string[]
}

export interface UserProfile {
  userId: string
  level: 'beginner' | 'intermediate' | 'advanced'
  strengths: string[]
  weaknesses: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
  preferredTopics: string[]
  completedContexts: string[]
  sessionHistory: LearningSession[]
  vocabularyMastery: Record<string, number>
  grammarMastery: Record<string, number>
  pronunciationIssues: string[]
  commonMistakes: string[]
}

export class ConversationSystem {
  private contexts: ConversationContext[] = []
  private userProfile: UserProfile | null = null
  private currentSession: LearningSession | null = null

  constructor() {
    this.initializeContexts()
  }

  private initializeContexts() {
    // Context 1: Library Conversation
    this.contexts.push({
      id: 'library_conversation',
      title: 'At the Library',
      description: 'Practice French while asking for help at a library',
      scenario: 'You are in a French library and need help finding a book. You start a conversation with the librarian.',
      characters: [
        {
          name: 'Marie',
          role: 'Librarian',
          personality: 'Helpful and patient',
          speakingStyle: 'Formal but friendly'
        },
        {
          name: 'You',
          role: 'Student',
          personality: 'Curious and polite',
          speakingStyle: 'Learning French, making some mistakes'
        }
      ],
      difficulty: 'beginner',
      grammarFocus: ['present tense', 'question formation', 'polite expressions'],
      vocabularyFocus: ['library terms', 'book genres', 'asking for help'],
      culturalNotes: [
        'French libraries are very quiet places',
        'It\'s polite to greet before asking for help',
        'Librarians are highly respected in French culture'
      ]
    })

    // Context 2: Restaurant Conversation
    this.contexts.push({
      id: 'restaurant_conversation',
      title: 'At the Restaurant',
      description: 'Order food and interact with waitstaff in French',
      scenario: 'You are at a French restaurant and need to order food, ask about dishes, and handle the dining experience.',
      characters: [
        {
          name: 'Pierre',
          role: 'Waiter',
          personality: 'Professional and attentive',
          speakingStyle: 'Clear and slightly formal'
        },
        {
          name: 'You',
          role: 'Customer',
          personality: 'Hungry and curious about French cuisine',
          speakingStyle: 'Trying to be polite, making some errors'
        }
      ],
      difficulty: 'intermediate',
      grammarFocus: ['imperative mood', 'conditional tense', 'food vocabulary'],
      vocabularyFocus: ['menu items', 'cooking methods', 'restaurant etiquette'],
      culturalNotes: [
        'French meals are social events',
        'It\'s customary to say "bon appétit" before eating',
        'Tipping is included in the bill in France'
      ]
    })

    // Context 3: Travel Conversation
    this.contexts.push({
      id: 'travel_conversation',
      title: 'Traveling in France',
      description: 'Navigate travel situations and interact with locals',
      scenario: 'You are traveling in France and need to ask for directions, book accommodations, and handle travel logistics.',
      characters: [
        {
          name: 'Sophie',
          role: 'Local Resident',
          personality: 'Friendly and helpful',
          speakingStyle: 'Natural and conversational'
        },
        {
          name: 'You',
          role: 'Tourist',
          personality: 'Adventurous but sometimes confused',
          speakingStyle: 'Basic French with some mistakes'
        }
      ],
      difficulty: 'intermediate',
      grammarFocus: ['future tense', 'conditional mood', 'prepositions'],
      vocabularyFocus: ['transportation', 'accommodations', 'directions'],
      culturalNotes: [
        'French people appreciate when tourists try to speak French',
        'Greeting is very important in French culture',
        'Public transportation is excellent in French cities'
      ]
    })
  }

  // Get all conversation contexts
  getAllContexts(): ConversationContext[] {
    return this.contexts
  }

  // Get context by ID
  getContextById(id: string): ConversationContext | undefined {
    return this.contexts.find(context => context.id === id)
  }

  // Start a new conversation session
  startSession(contextId: string): LearningSession {
    const context = this.getContextById(contextId)
    if (!context) {
      throw new Error(`Context ${contextId} not found`)
    }

    const session: LearningSession = {
      id: `session_${Date.now()}`,
      contextId,
      startTime: Date.now(),
      turns: this.generateConversationTurns(context),
      userResponses: [],
      currentTurnIndex: 0,
      sessionPerformance: {
        totalTurns: 0,
        correctResponses: 0,
        averagePronunciationScore: 0,
        averageGrammarScore: 0,
        averageVocabularyScore: 0,
        averageFluencyScore: 0,
        weakAreas: [],
        strongAreas: [],
        recommendedFocus: []
      },
      status: 'active'
    }

    this.currentSession = session
    return session
  }

  // Generate conversation turns based on context
  private generateConversationTurns(context: ConversationContext): ConversationTurn[] {
    const turns: ConversationTurn[] = []

    switch (context.id) {
      case 'library_conversation':
        turns.push(
          {
            id: 'turn_1',
            speaker: 'ai',
            message: 'Bonjour, comment puis-je vous aider ?',
            translation: 'Hello, how can I help you?',
            context: 'The librarian greets you and offers help',
            grammarNotes: ['Formal "vous" form', 'Question formation with "comment"'],
            vocabularyNotes: ['bonjour = hello', 'aider = to help'],
            pronunciation: 'bohn-zhoor, koh-mahn pwee zhuh voo zah-day',
            difficulty: 1
          },
          {
            id: 'turn_2',
            speaker: 'user',
            message: 'Bonjour, je cherche un livre',
            translation: 'Hello, I am looking for a book',
            context: 'You respond with a simple request',
            expectedResponse: 'Bonjour, je cherche un livre',
            alternatives: [
              'Bonjour, je voudrais un livre',
              'Bonjour, j\'ai besoin d\'un livre'
            ],
            grammarNotes: ['Present tense of "chercher"', 'Indefinite article "un"'],
            vocabularyNotes: ['chercher = to look for', 'livre = book'],
            pronunciation: 'bohn-zhoor, zhuh shersh uhn leevr',
            difficulty: 1
          },
          {
            id: 'turn_3',
            speaker: 'ai',
            message: 'Quel type de livre cherchez-vous ?',
            translation: 'What type of book are you looking for?',
            context: 'The librarian asks for more specific information',
            grammarNotes: ['Question formation with "quel"', 'Present tense with "vous"'],
            vocabularyNotes: ['type = type', 'chercher = to look for'],
            pronunciation: 'kel teep duh leevr shersh-ay voo',
            difficulty: 2
          },
          {
            id: 'turn_4',
            speaker: 'user',
            message: 'Je cherche un roman français',
            translation: 'I am looking for a French novel',
            context: 'You specify the type of book you want',
            expectedResponse: 'Je cherche un roman français',
            alternatives: [
              'Je voudrais un roman français',
              'J\'ai besoin d\'un roman français'
            ],
            grammarNotes: ['Indefinite article "un"', 'Adjective agreement'],
            vocabularyNotes: ['roman = novel', 'français = French'],
            pronunciation: 'zhuh shersh uhn roh-mahn frahn-say',
            difficulty: 2
          },
          {
            id: 'turn_5',
            speaker: 'ai',
            message: 'Parfait ! Nous avons une grande collection de romans français. Avez-vous un auteur préféré ?',
            translation: 'Perfect! We have a large collection of French novels. Do you have a favorite author?',
            context: 'The librarian confirms they have what you need and asks about preferences',
            grammarNotes: ['Present tense "avoir"', 'Question formation with "avez-vous"'],
            vocabularyNotes: ['collection = collection', 'auteur = author', 'préféré = favorite'],
            pronunciation: 'par-fay, noo zah-vohn uhn grahnd koh-lek-see-ohn duh roh-mahn frahn-say, ah-vay voo uhn oh-tuhr pray-fay-ray',
            difficulty: 3
          }
        )
        break

      case 'restaurant_conversation':
        turns.push(
          {
            id: 'turn_1',
            speaker: 'ai',
            message: 'Bonjour, bienvenue ! Avez-vous une réservation ?',
            translation: 'Hello, welcome! Do you have a reservation?',
            context: 'The waiter greets you and asks about your reservation',
            grammarNotes: ['Question formation with "avez-vous"', 'Formal "vous" form'],
            vocabularyNotes: ['bienvenue = welcome', 'réservation = reservation'],
            pronunciation: 'bohn-zhoor, bee-ahn-vuh-nuh, ah-vay voo uhn ray-zer-vah-see-ohn',
            difficulty: 2
          },
          {
            id: 'turn_2',
            speaker: 'user',
            message: 'Non, je n\'ai pas de réservation',
            translation: 'No, I don\'t have a reservation',
            context: 'You respond that you don\'t have a reservation',
            expectedResponse: 'Non, je n\'ai pas de réservation',
            alternatives: [
              'Non, pas de réservation',
              'Je n\'ai pas réservé'
            ],
            grammarNotes: ['Negative construction with "ne...pas"', 'Partitive article "de"'],
            vocabularyNotes: ['réservation = reservation'],
            pronunciation: 'nohn, zhuh nay pah duh ray-zer-vah-see-ohn',
            difficulty: 2
          },
          {
            id: 'turn_3',
            speaker: 'ai',
            message: 'Pas de problème ! Nous avons une table libre. Combien êtes-vous ?',
            translation: 'No problem! We have a free table. How many are you?',
            context: 'The waiter confirms they can accommodate you and asks about your party size',
            grammarNotes: ['Question formation with "combien"', 'Être conjugation'],
            vocabularyNotes: ['problème = problem', 'table = table', 'libre = free'],
            pronunciation: 'pah duh proh-blem, noo zah-vohn uhn tah-bluh lee-bruh, kohm-bee-ahn et voo',
            difficulty: 2
          }
        )
        break

      case 'travel_conversation':
        turns.push(
          {
            id: 'turn_1',
            speaker: 'ai',
            message: 'Bonjour ! Vous semblez perdu. Puis-je vous aider ?',
            translation: 'Hello! You seem lost. Can I help you?',
            context: 'A local resident notices you look lost and offers help',
            grammarNotes: ['Adjective agreement with "perdu"', 'Question formation with "puis-je"'],
            vocabularyNotes: ['sembler = to seem', 'perdu = lost', 'aider = to help'],
            pronunciation: 'bohn-zhoor, voo suh-blay per-dy, pwee zhuh voo zah-day',
            difficulty: 2
          },
          {
            id: 'turn_2',
            speaker: 'user',
            message: 'Oui, s\'il vous plaît. Je cherche la gare',
            translation: 'Yes, please. I am looking for the train station',
            context: 'You accept the help and ask for directions to the train station',
            expectedResponse: 'Oui, s\'il vous plaît. Je cherche la gare',
            alternatives: [
              'Oui, merci. Où est la gare ?',
              'Oui, je cherche la gare'
            ],
            grammarNotes: ['Polite expression "s\'il vous plaît"', 'Definite article "la"'],
            vocabularyNotes: ['gare = train station', 'chercher = to look for'],
            pronunciation: 'wee, seel voo play, zhuh shersh lah gahr',
            difficulty: 2
          }
        )
        break
    }

    return turns
  }

  // Process user response and provide feedback
  processUserResponse(spokenText: string): ResponseAnalysis {
    if (!this.currentSession) {
      throw new Error('No active session')
    }

    const currentTurn = this.currentSession.turns[this.currentSession.currentTurnIndex]
    if (!currentTurn || currentTurn.speaker !== 'user') {
      throw new Error('Not expecting user response')
    }

    const analysis = this.analyzeResponse(spokenText, currentTurn)
    
    // Add response to session
    const userResponse: UserResponse = {
      spokenText,
      confidence: this.calculateConfidence(spokenText, currentTurn),
      timestamp: Date.now(),
      analysis
    }

    this.currentSession.userResponses.push(userResponse)
    this.updateSessionPerformance(analysis)

    return analysis
  }

  // Analyze user response
  private analyzeResponse(spokenText: string, expectedTurn: ConversationTurn): ResponseAnalysis {
    const normalizedSpoken = this.normalizeFrenchText(spokenText)
    const normalizedExpected = this.normalizeFrenchText(expectedTurn.expectedResponse || '')
    
    const isCorrect = this.checkCorrectness(normalizedSpoken, normalizedExpected)
    const pronunciationScore = this.assessPronunciation(spokenText, expectedTurn.pronunciation || '')
    const grammarScore = this.assessGrammar(normalizedSpoken, expectedTurn)
    const vocabularyScore = this.assessVocabulary(normalizedSpoken, expectedTurn)
    const fluencyScore = this.assessFluency(spokenText)

    const suggestions = this.generateSuggestions(normalizedSpoken, normalizedExpected, expectedTurn)
    const corrections = this.generateCorrections(normalizedSpoken, normalizedExpected, expectedTurn)
    const nextStep = this.determineNextStep(isCorrect, pronunciationScore, grammarScore)

    return {
      isCorrect,
      pronunciationScore,
      grammarScore,
      vocabularyScore,
      fluencyScore,
      suggestions,
      corrections,
      nextStep
    }
  }

  // Normalize French text for comparison
  private normalizeFrenchText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâä]/g, 'a')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/[ûüù]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z\s]/g, '')
      .trim()
  }

  // Check if response is correct
  private checkCorrectness(spoken: string, expected: string): boolean {
    if (spoken === expected) return true
    
    // Check alternatives
    const alternatives = expected.split('|').map(alt => this.normalizeFrenchText(alt.trim()))
    return alternatives.some(alt => spoken === alt)
  }

  // Assess pronunciation
  private assessPronunciation(spoken: string, expected: string): number {
    // Simplified pronunciation assessment
    const similarity = this.calculateSimilarity(spoken, expected)
    return Math.max(0, Math.min(100, similarity * 100))
  }

  // Assess grammar
  private assessGrammar(spoken: string, expectedTurn: ConversationTurn): number {
    let score = 100
    
    // Check for common grammar mistakes
    if (expectedTurn.grammarNotes) {
      if (expectedTurn.grammarNotes.includes('Formal "vous" form') && spoken.includes('tu')) {
        score -= 20
      }
      if (expectedTurn.grammarNotes.includes('Question formation') && !spoken.includes('?')) {
        score -= 15
      }
    }
    
    return Math.max(0, score)
  }

  // Assess vocabulary
  private assessVocabulary(spoken: string, expectedTurn: ConversationTurn): number {
    let score = 100
    
    if (expectedTurn.vocabularyNotes) {
      const expectedWords = expectedTurn.vocabularyNotes.map(note => 
        note.split('=')[0].trim().toLowerCase()
      )
      
      const spokenWords = spoken.split(' ')
      const foundWords = expectedWords.filter(word => 
        spokenWords.some(spokenWord => spokenWord.includes(word))
      )
      
      score = (foundWords.length / expectedWords.length) * 100
    }
    
    return Math.max(0, score)
  }

  // Assess fluency
  private assessFluency(spoken: string): number {
    // Simplified fluency assessment based on length and complexity
    const words = spoken.split(' ')
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length
    
    let score = 100
    if (words.length < 3) score -= 20
    if (avgWordLength < 3) score -= 15
    
    return Math.max(0, score)
  }

  // Calculate confidence score
  private calculateConfidence(spoken: string, expectedTurn: ConversationTurn): number {
    const analysis = this.analyzeResponse(spoken, expectedTurn)
    return (analysis.pronunciationScore + analysis.grammarScore + analysis.vocabularyScore) / 3
  }

  // Generate suggestions
  private generateSuggestions(spoken: string, expected: string, turn: ConversationTurn): string[] {
    const suggestions: string[] = []
    
    if (!this.checkCorrectness(spoken, expected)) {
      suggestions.push('Try saying: "' + (turn.expectedResponse || '') + '"')
      
      if (turn.grammarNotes) {
        suggestions.push('Focus on: ' + turn.grammarNotes.join(', '))
      }
      
      if (turn.vocabularyNotes) {
        suggestions.push('Key vocabulary: ' + turn.vocabularyNotes.join(', '))
      }
    }
    
    return suggestions
  }

  // Generate corrections
  private generateCorrections(spoken: string, expected: string, turn: ConversationTurn): string[] {
    const corrections: string[] = []
    
    if (!this.checkCorrectness(spoken, expected)) {
      corrections.push('Expected: "' + (turn.expectedResponse || '') + '"')
      corrections.push('You said: "' + spoken + '"')
    }
    
    return corrections
  }

  // Determine next step
  private determineNextStep(isCorrect: boolean, pronunciationScore: number, grammarScore: number): 'continue' | 'repeat' | 'explain' | 'practice' {
    if (isCorrect && pronunciationScore > 70 && grammarScore > 70) {
      return 'continue'
    } else if (pronunciationScore < 50 || grammarScore < 50) {
      return 'explain'
    } else {
      return 'repeat'
    }
  }

  // Update session performance
  private updateSessionPerformance(analysis: ResponseAnalysis): void {
    if (!this.currentSession) return
    
    const perf = this.currentSession.sessionPerformance
    perf.totalTurns++
    
    if (analysis.isCorrect) {
      perf.correctResponses++
    }
    
    // Update averages
    const totalTurns = perf.totalTurns
    perf.averagePronunciationScore = ((perf.averagePronunciationScore * (totalTurns - 1)) + analysis.pronunciationScore) / totalTurns
    perf.averageGrammarScore = ((perf.averageGrammarScore * (totalTurns - 1)) + analysis.grammarScore) / totalTurns
    perf.averageVocabularyScore = ((perf.averageVocabularyScore * (totalTurns - 1)) + analysis.vocabularyScore) / totalTurns
    perf.averageFluencyScore = ((perf.averageFluencyScore * (totalTurns - 1)) + analysis.fluencyScore) / totalTurns
    
    // Update weak/strong areas
    if (analysis.pronunciationScore < 70) {
      if (!perf.weakAreas.includes('pronunciation')) {
        perf.weakAreas.push('pronunciation')
      }
    }
    
    if (analysis.grammarScore < 70) {
      if (!perf.weakAreas.includes('grammar')) {
        perf.weakAreas.push('grammar')
      }
    }
    
    if (analysis.pronunciationScore > 85) {
      if (!perf.strongAreas.includes('pronunciation')) {
        perf.strongAreas.push('pronunciation')
      }
    }
  }

  // Calculate similarity between strings
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  // Levenshtein distance calculation
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  // Get current session
  getCurrentSession(): LearningSession | null {
    return this.currentSession
  }

  // Get current turn
  getCurrentTurn(): ConversationTurn | null {
    if (!this.currentSession) return null
    return this.currentSession.turns[this.currentSession.currentTurnIndex] || null
  }

  // Advance to next turn
  advanceTurn(): void {
    if (!this.currentSession) return
    
    if (this.currentSession.currentTurnIndex < this.currentSession.turns.length - 1) {
      this.currentSession.currentTurnIndex++
    } else {
      this.currentSession.status = 'completed'
      this.currentSession.endTime = Date.now()
    }
  }

  // Get session performance
  getSessionPerformance(): SessionPerformance | null {
    return this.currentSession?.sessionPerformance || null
  }

  // Set user profile
  setUserProfile(profile: UserProfile): void {
    this.userProfile = profile
  }

  // Get user profile
  getUserProfile(): UserProfile | null {
    return this.userProfile
  }
} 