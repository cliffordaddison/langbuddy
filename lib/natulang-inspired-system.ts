// Natulang-Inspired Learning System
// Based on analysis of Natulang's decompiled APK

export interface LessonCommand {
  command: 'read' | 'ready' | 'repeat' | 'evaluation' | 'scientificIntervals'
  startHere: boolean
  order: number
  phraseId?: string
  phrase?: {
    source: string
    target?: string
    appendText: boolean
  }
  language?: 'source' | 'target'
  errors?: string[]
}

export interface NatulangLesson {
  id: string
  type: 'evaluation' | 'repetition' | 'conversation'
  language: string
  targetLanguage: string
  commands: LessonCommand[]
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedTime: number
    grammarFocus: string[]
    vocabularyFocus: string[]
  }
}

export interface Character {
  name: string
  personality: string
  speakingStyle: string
  avatar?: string
}

export interface ConversationTurn {
  id: string
  speaker: 'mo' | 'user'
  message: string
  translation?: string
  context: string
  grammarNotes?: string[]
  vocabularyNotes?: string[]
  pronunciation?: string
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
  lessonId: string
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

export class NatulangInspiredSystem {
  private lessons: NatulangLesson[] = []
  private currentSession: LearningSession | null = null
  private character: Character = {
    name: 'Mo',
    personality: 'Friendly and encouraging tutor',
    speakingStyle: 'Clear, patient, and supportive'
  }

  constructor() {
    this.initializeLessons()
  }

  private initializeLessons() {
    // French Evaluation Lesson (inspired by Natulang)
    this.lessons.push({
      id: 'fr_evaluation_1',
      type: 'evaluation',
      language: 'en-US',
      targetLanguage: 'fr-FR',
      commands: [
        {
          command: 'read',
          startHere: false,
          order: -1,
          phraseId: 'hiMoHere',
          phrase: {
            source: 'Hi, Mo here. I\'m going to evaluate your French level',
            appendText: false
          },
          language: 'source'
        },
        {
          command: 'ready',
          startHere: false,
          order: -0.71875,
          language: 'source'
        },
        {
          command: 'read',
          startHere: false,
          order: -0.3125,
          phrase: {
            source: 'Please translate the following sentences into French. Please speak out loud',
            appendText: false
          },
          language: 'source'
        },
        {
          command: 'read',
          startHere: false,
          order: 0.6875,
          phrase: {
            source: 'Don\'t worry if you don\'t know the translation - just press the skip button, and we will move forward',
            appendText: false
          },
          language: 'source'
        },
        {
          command: 'evaluation',
          startHere: false,
          order: 0,
          language: 'source'
        },
        {
          command: 'read',
          startHere: false,
          order: 3,
          phrase: {
            source: 'Good luck in your learning endeavor',
            appendText: false
          },
          language: 'source'
        }
      ],
      metadata: {
        difficulty: 'beginner',
        estimatedTime: 5,
        grammarFocus: ['basic greetings', 'simple sentences'],
        vocabularyFocus: ['common phrases', 'introductions']
      }
    })

    // French Repetition Lesson
    this.lessons.push({
      id: 'fr_repetition_1',
      type: 'repetition',
      language: 'fr-FR',
      targetLanguage: 'fr-FR',
      commands: [
        {
          command: 'read',
          startHere: false,
          order: -1,
          phraseId: 'hiMoHere',
          phrase: {
            source: 'Salut, c\'est encore Mo. Ceci est une leçon de révision',
            appendText: false
          },
          language: 'source'
        },
        {
          command: 'scientificIntervals',
          startHere: false,
          order: 0,
          language: 'source'
        },
        {
          command: 'ready',
          startHere: false,
          order: 0.5,
          language: 'source'
        },
        {
          command: 'repeat',
          startHere: false,
          order: 0,
          language: 'source'
        },
        {
          command: 'read',
          startHere: false,
          order: 1,
          phraseId: 'thatsItForNow',
          phrase: {
            source: 'C\'est fini pour l\'instant. À bientôt !',
            appendText: false
          },
          language: 'source'
        }
      ],
      metadata: {
        difficulty: 'beginner',
        estimatedTime: 3,
        grammarFocus: ['pronunciation', 'basic phrases'],
        vocabularyFocus: ['greetings', 'farewells']
      }
    })

    // Library Conversation (inspired by your original)
    this.lessons.push({
      id: 'library_conversation',
      type: 'conversation',
      language: 'en-US',
      targetLanguage: 'fr-FR',
      commands: [
        {
          command: 'read',
          startHere: false,
          order: -1,
          phraseId: 'scenario_intro',
          phrase: {
            source: 'Imagine that you are talking to a person in a library',
            appendText: false
          },
          language: 'source'
        },
        {
          command: 'read',
          startHere: false,
          order: -0.5,
          phraseId: 'start_conversation',
          phrase: {
            source: 'You start a conversation:',
            appendText: false
          },
          language: 'source'
        },
        {
          command: 'read',
          startHere: false,
          order: 0,
          phraseId: 'good_morning',
          phrase: {
            source: 'Good morning',
            target: 'Bonjour',
            appendText: false
          },
          language: 'source'
        },
        {
          command: 'ready',
          startHere: false,
          order: 0.5,
          language: 'source'
        },
        {
          command: 'repeat',
          startHere: false,
          order: 1,
          language: 'source'
        },
        {
          command: 'read',
          startHere: false,
          order: 2,
          phraseId: 'she_answers',
          phrase: {
            source: 'She answers:',
            appendText: false
          },
          language: 'source'
        },
        {
          command: 'read',
          startHere: false,
          order: 2.5,
          phraseId: 'good_morning_response',
          phrase: {
            source: 'Good morning, how is it going?',
            target: 'Bonjour, comment ça va?',
            appendText: false
          },
          language: 'source'
        }
      ],
      metadata: {
        difficulty: 'beginner',
        estimatedTime: 8,
        grammarFocus: ['greetings', 'question formation'],
        vocabularyFocus: ['library terms', 'basic conversation']
      }
    })
  }

  // Get all lessons
  getAllLessons(): NatulangLesson[] {
    return this.lessons
  }

  // Get lesson by ID
  getLessonById(id: string): NatulangLesson | undefined {
    return this.lessons.find(lesson => lesson.id === id)
  }

  // Start a new session
  startSession(lessonId: string): LearningSession {
    const lesson = this.getLessonById(lessonId)
    if (!lesson) {
      throw new Error(`Lesson ${lessonId} not found`)
    }

    const session: LearningSession = {
      id: `session_${Date.now()}`,
      lessonId,
      startTime: Date.now(),
      turns: this.generateConversationTurns(lesson),
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

  // Generate conversation turns from lesson commands
  private generateConversationTurns(lesson: NatulangLesson): ConversationTurn[] {
    const turns: ConversationTurn[] = []
    
    lesson.commands.forEach((command, index) => {
      if (command.command === 'read' && command.phrase) {
        turns.push({
          id: `turn_${index}`,
          speaker: 'mo',
          message: command.phrase.source,
          translation: command.phrase.target,
          context: command.phraseId || 'instruction',
          grammarNotes: this.getGrammarNotes(command.phrase.source),
          vocabularyNotes: this.getVocabularyNotes(command.phrase.source),
          pronunciation: this.getPronunciation(command.phrase.source),
          difficulty: this.calculateDifficulty(command.phrase.source)
        })
      } else if (command.command === 'repeat') {
        // Add a user turn for repetition
        const previousTurn = turns[turns.length - 1]
        if (previousTurn) {
          turns.push({
            id: `turn_${index}_user`,
            speaker: 'user',
            message: '',
            context: 'User repetition',
            expectedResponse: previousTurn.message,
            alternatives: this.generateAlternatives(previousTurn.message),
            difficulty: previousTurn.difficulty
          })
        }
      }
    })

    return turns
  }

  // Get grammar notes for a phrase
  private getGrammarNotes(phrase: string): string[] {
    const notes: string[] = []
    
    if (phrase.includes('Bonjour')) {
      notes.push('Formal greeting - "Bonjour" is used in the morning')
    }
    if (phrase.includes('comment ça va')) {
      notes.push('Question formation with "comment"')
    }
    if (phrase.includes('je')) {
      notes.push('First person singular pronoun "je"')
    }
    
    return notes
  }

  // Get vocabulary notes for a phrase
  private getVocabularyNotes(phrase: string): string[] {
    const notes: string[] = []
    
    if (phrase.includes('Bonjour')) {
      notes.push('bonjour = hello/good morning')
    }
    if (phrase.includes('comment')) {
      notes.push('comment = how')
    }
    if (phrase.includes('ça va')) {
      notes.push('ça va = it goes (how are you)')
    }
    
    return notes
  }

  // Get pronunciation guide
  private getPronunciation(phrase: string): string {
    const pronunciationMap: Record<string, string> = {
      'Bonjour': 'bohn-zhoor',
      'comment ça va': 'koh-mahn sah vah',
      'Salut': 'sah-loo',
      'À bientôt': 'ah bee-ahn-toh'
    }
    
    for (const [word, pronunciation] of Object.entries(pronunciationMap)) {
      if (phrase.includes(word)) {
        return pronunciation
      }
    }
    
    return phrase.toLowerCase()
  }

  // Calculate difficulty based on phrase complexity
  private calculateDifficulty(phrase: string): number {
    const words = phrase.split(' ').length
    const hasComplexGrammar = phrase.includes('comment') || phrase.includes('pourquoi')
    
    if (words <= 3) return 1
    if (words <= 5 && !hasComplexGrammar) return 2
    if (words <= 7 || hasComplexGrammar) return 3
    return 4
  }

  // Generate alternative responses
  private generateAlternatives(phrase: string): string[] {
    const alternatives: string[] = []
    
    if (phrase.includes('Bonjour')) {
      alternatives.push('Salut')
      alternatives.push('Bonjour, comment allez-vous?')
    }
    if (phrase.includes('comment ça va')) {
      alternatives.push('Comment allez-vous?')
      alternatives.push('Comment vas-tu?')
    }
    
    return alternatives
  }

  // Process user response
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
    const similarity = this.calculateSimilarity(spoken, expected)
    return Math.max(0, Math.min(100, similarity * 100))
  }

  // Assess grammar
  private assessGrammar(spoken: string, expectedTurn: ConversationTurn): number {
    let score = 100
    
    if (expectedTurn.grammarNotes) {
      if (expectedTurn.grammarNotes.includes('Formal greeting') && spoken.includes('tu')) {
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

  // Get character
  getCharacter(): Character {
    return this.character
  }
} 