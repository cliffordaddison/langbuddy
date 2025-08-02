import { ConversationMessage } from './store'

export interface AudioMemorySession {
  id: string
  sessionType: 'warmup' | 'new_content' | 'integration' | 'consolidation'
  duration: number // in minutes
  phrases: AudioPhrase[]
  userResponses: UserAudioResponse[]
  sessionProgress: number // 0-100
  nextReviewTime: number
  difficultyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}

export interface AudioPhrase {
  id: string
  french: string
  english: string
  pronunciation: string
  context: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  emotionalContext?: string
  culturalNotes?: string
  memoryState: MemoryState
  introductionTime: number
  lastReviewTime: number
  nextReviewTime: number
  repetitionCount: number
  confidenceScore: number // 0-100
  retentionScore: number // 0-100
  responseTime: number // average response time in milliseconds
}

export interface MemoryState {
  phase: 'introduction' | 'immediate_recall' | 'short_term' | 'medium_term' | 'long_term' | 'extended' | 'mastered'
  interval: number // seconds until next review
  successRate: number // 0-100
  errorPatterns: string[]
  strengthIndicators: string[]
}

export interface UserAudioResponse {
  phraseId: string
  responseTime: number // milliseconds
  accuracy: number // 0-100
  pronunciation: number // 0-100
  confidence: number // 0-100
  hesitation: boolean
  timestamp: number
  audioData?: string // base64 audio recording
}

export interface AudioMemoryAssessment {
  overallProgress: number // 0-100
  vocabularyRetention: number // 0-100
  pronunciationAccuracy: number // 0-100
  responseSpeed: number // 0-100
  listeningComprehension: number // 0-100
  speakingFluency: number // 0-100
  memoryConsolidation: number // 0-100
  weakAreas: string[]
  strongAreas: string[]
  recommendedFocus: string[]
}

// Pimsleur-style learning strategies
const pimsleurStrategies = {
  graduatedIntervalRecall: {
    immediate: 5, // 5 seconds
    shortTerm: 30, // 30 seconds
    mediumTerm: 120, // 2 minutes
    longTerm: 600, // 10 minutes
    extended: 86400, // 24 hours
    deepMemory: 604800 // 1 week
  },
  
  sessionStructure: {
    warmup: { duration: 5, focus: 'review_previous' },
    new_content: { duration: 10, focus: 'introduce_new' },
    integration: { duration: 10, focus: 'combine_old_new' },
    consolidation: { duration: 5, focus: 'rapid_recall' }
  },
  
  complexityLevels: {
    A1: { phraseLength: 'single_words', grammar: 'basic_present', vocabulary: 'survival' },
    A2: { phraseLength: 'short_phrases', grammar: 'present_past', vocabulary: 'daily_life' },
    B1: { phraseLength: 'complete_sentences', grammar: 'future_conditional', vocabulary: 'cultural' },
    B2: { phraseLength: 'complex_sentences', grammar: 'subjunctive', vocabulary: 'professional' },
    C1: { phraseLength: 'paragraphs', grammar: 'advanced_tenses', vocabulary: 'academic' },
    C2: { phraseLength: 'discourse', grammar: 'literary', vocabulary: 'nuanced' }
  }
}

// Audio-first learning system
export class AudioMemorySystem {
  private userAssessment: AudioMemoryAssessment
  private currentSession: AudioMemorySession | null = null
  private phraseDatabase: Map<string, AudioPhrase> = new Map()
  private sessionHistory: AudioMemorySession[] = []

  constructor() {
    this.userAssessment = this.initializeAssessment()
    this.loadPhraseDatabase()
  }

  // Initialize user assessment
  private initializeAssessment(): AudioMemoryAssessment {
    return {
      overallProgress: 0,
      vocabularyRetention: 0,
      pronunciationAccuracy: 0,
      responseSpeed: 0,
      listeningComprehension: 0,
      speakingFluency: 0,
      memoryConsolidation: 0,
      weakAreas: [],
      strongAreas: [],
      recommendedFocus: []
    }
  }

  // Load comprehensive phrase database
  private loadPhraseDatabase() {
    const phrases = this.generateComprehensivePhraseDatabase()
    phrases.forEach(phrase => {
      this.phraseDatabase.set(phrase.id, phrase)
    })
  }

  // Generate comprehensive phrase database
  private generateComprehensivePhraseDatabase(): AudioPhrase[] {
    const phrases: AudioPhrase[] = []

    // A1 Foundation Phrases (600-800 phrases)
    const a1Phrases = [
      {
        french: "Bonjour",
        english: "Hello",
        pronunciation: "bohn-ZHOOR",
        context: "greeting",
        category: "salutations",
        emotionalContext: "friendly",
        culturalNotes: "Used throughout the day, formal greeting"
      },
      {
        french: "Comment allez-vous ?",
        english: "How are you?",
        pronunciation: "koh-MAHN tah-lay-VOO",
        context: "greeting",
        category: "salutations",
        emotionalContext: "concerned",
        culturalNotes: "Formal way to ask about someone's well-being"
      },
      {
        french: "Je vais bien",
        english: "I am well",
        pronunciation: "zhuh vay bee-AHN",
        context: "response",
        category: "wellbeing",
        emotionalContext: "positive",
        culturalNotes: "Standard response to 'how are you'"
      },
      {
        french: "Merci",
        english: "Thank you",
        pronunciation: "mehr-SEE",
        context: "gratitude",
        category: "politeness",
        emotionalContext: "appreciative",
        culturalNotes: "Essential in French culture"
      },
      {
        french: "S'il vous plaît",
        english: "Please",
        pronunciation: "seel voo PLEH",
        context: "request",
        category: "politeness",
        emotionalContext: "respectful",
        culturalNotes: "Formal way to say please"
      },
      {
        french: "Au revoir",
        english: "Goodbye",
        pronunciation: "oh ruh-VWAHR",
        context: "farewell",
        category: "salutations",
        emotionalContext: "friendly",
        culturalNotes: "Standard goodbye"
      },
      {
        french: "Oui",
        english: "Yes",
        pronunciation: "wee",
        context: "agreement",
        category: "basic_responses",
        emotionalContext: "affirmative",
        culturalNotes: "Simple yes"
      },
      {
        french: "Non",
        english: "No",
        pronunciation: "nohn",
        context: "disagreement",
        category: "basic_responses",
        emotionalContext: "negative",
        culturalNotes: "Simple no"
      },
      {
        french: "Je ne comprends pas",
        english: "I don't understand",
        pronunciation: "zhuh nuh kohn-PRAHN pah",
        context: "confusion",
        category: "communication",
        emotionalContext: "frustrated",
        culturalNotes: "Essential phrase for learners"
      },
      {
        french: "Pouvez-vous répéter ?",
        english: "Can you repeat?",
        pronunciation: "poo-vay-VOO ray-pay-TAY",
        context: "request",
        category: "communication",
        emotionalContext: "polite",
        culturalNotes: "Polite way to ask for repetition"
      }
    ]

    // Convert to AudioPhrase format
    a1Phrases.forEach((phrase, index) => {
      phrases.push({
        id: `a1_${index + 1}`,
        french: phrase.french,
        english: phrase.english,
        pronunciation: phrase.pronunciation,
        context: phrase.context,
        difficulty: 'easy',
        category: phrase.category,
        emotionalContext: phrase.emotionalContext,
        culturalNotes: phrase.culturalNotes,
        memoryState: {
          phase: 'introduction',
          interval: pimsleurStrategies.graduatedIntervalRecall.immediate,
          successRate: 0,
          errorPatterns: [],
          strengthIndicators: []
        },
        introductionTime: 0,
        lastReviewTime: 0,
        nextReviewTime: 0,
        repetitionCount: 0,
        confidenceScore: 0,
        retentionScore: 0,
        responseTime: 0
      })
    })

    // Add more comprehensive phrase sets for different levels
    // This would include hundreds more phrases for each level
    // For brevity, I'm showing the pattern

    return phrases
  }

  // Start a new audio memory session
  async startAudioSession(sessionType: AudioMemorySession['sessionType']): Promise<AudioMemorySession> {
    const session: AudioMemorySession = {
      id: Date.now().toString(),
      sessionType,
      duration: pimsleurStrategies.sessionStructure[sessionType].duration,
      phrases: [],
      userResponses: [],
      sessionProgress: 0,
      nextReviewTime: Date.now() + (pimsleurStrategies.sessionStructure[sessionType].duration * 60 * 1000),
      difficultyLevel: this.determineOptimalLevel()
    }

    // Select phrases based on session type and user level
    session.phrases = await this.selectPhrasesForSession(sessionType, session.difficultyLevel)
    
    this.currentSession = session
    return session
  }

  // Determine optimal difficulty level based on user assessment
  private determineOptimalLevel(): AudioMemorySession['difficultyLevel'] {
    const { overallProgress, vocabularyRetention, pronunciationAccuracy } = this.userAssessment
    
    if (overallProgress < 20) return 'A1'
    if (overallProgress < 40) return 'A2'
    if (overallProgress < 60) return 'B1'
    if (overallProgress < 80) return 'B2'
    if (overallProgress < 95) return 'C1'
    return 'C2'
  }

  // Select appropriate phrases for session
  private async selectPhrasesForSession(
    sessionType: AudioMemorySession['sessionType'],
    level: AudioMemorySession['difficultyLevel']
  ): Promise<AudioPhrase[]> {
    const phrases: AudioPhrase[] = []
    const now = Date.now()

    switch (sessionType) {
      case 'warmup':
        // Review phrases from previous sessions that need reinforcement
        phrases.push(...this.getPhrasesForReview(level, now))
        break
      
      case 'new_content':
        // Introduce new phrases appropriate for user level
        phrases.push(...this.getNewPhrasesForLevel(level))
        break
      
      case 'integration':
        // Combine new and old phrases in conversational contexts
        phrases.push(...this.getIntegrationPhrases(level))
        break
      
      case 'consolidation':
        // Rapid-fire recall of session content
        phrases.push(...this.getConsolidationPhrases(level))
        break
    }

    return phrases.slice(0, 10) // Limit to 10 phrases per session
  }

  // Get phrases that need review based on spaced repetition
  private getPhrasesForReview(level: string, currentTime: number): AudioPhrase[] {
    const reviewPhrases: AudioPhrase[] = []
    
    for (const phrase of Array.from(this.phraseDatabase.values())) {
      if (phrase.memoryState.phase !== 'mastered' && 
          phrase.nextReviewTime <= currentTime &&
          phrase.category.includes(level.toLowerCase())) {
        reviewPhrases.push(phrase)
      }
    }

    // Sort by priority (most in need of review first)
    return reviewPhrases.sort((a, b) => {
      const aPriority = this.calculateReviewPriority(a)
      const bPriority = this.calculateReviewPriority(b)
      return bPriority - aPriority
    })
  }

  // Calculate review priority based on memory state
  private calculateReviewPriority(phrase: AudioPhrase): number {
    const timeSinceLastReview = Date.now() - phrase.lastReviewTime
    const retentionDecay = 1 - (phrase.retentionScore / 100)
    const difficultyMultiplier = phrase.difficulty === 'hard' ? 1.5 : 1
    
    return timeSinceLastReview * retentionDecay * difficultyMultiplier
  }

  // Get new phrases for user level
  private getNewPhrasesForLevel(level: string): AudioPhrase[] {
    const newPhrases: AudioPhrase[] = []
    
    for (const phrase of Array.from(this.phraseDatabase.values())) {
      if (phrase.memoryState.phase === 'introduction' &&
          phrase.category.includes(level.toLowerCase()) &&
          newPhrases.length < 5) {
        newPhrases.push(phrase)
      }
    }

    return newPhrases
  }

  // Get phrases for integration practice
  private getIntegrationPhrases(level: string): AudioPhrase[] {
    const integrationPhrases: AudioPhrase[] = []
    
    // Mix new and previously learned phrases
    const newPhrases = this.getNewPhrasesForLevel(level)
    const reviewPhrases = this.getPhrasesForReview(level, Date.now())
    
    integrationPhrases.push(...newPhrases.slice(0, 3))
    integrationPhrases.push(...reviewPhrases.slice(0, 7))
    
    return integrationPhrases
  }

  // Get phrases for consolidation (rapid recall)
  private getConsolidationPhrases(level: string): AudioPhrase[] {
    const consolidationPhrases: AudioPhrase[] = []
    
    // Get phrases from current session that need reinforcement
    if (this.currentSession) {
      consolidationPhrases.push(...this.currentSession.phrases)
    }
    
    return consolidationPhrases
  }

  // Process user audio response
  async processUserResponse(
    phraseId: string,
    userAudio: string,
    responseTime: number
  ): Promise<UserAudioResponse> {
    const phrase = this.phraseDatabase.get(phraseId)
    if (!phrase) {
      throw new Error(`Phrase ${phraseId} not found`)
    }

    // Analyze user response (in real implementation, this would use speech recognition)
    const analysis = await this.analyzeUserResponse(userAudio, phrase)
    
    const response: UserAudioResponse = {
      phraseId,
      responseTime,
      accuracy: analysis.accuracy,
      pronunciation: analysis.pronunciation,
      confidence: analysis.confidence,
      hesitation: analysis.hesitation,
      timestamp: Date.now(),
      audioData: userAudio
    }

    // Update phrase memory state
    this.updatePhraseMemoryState(phrase, response)
    
    // Update session progress
    if (this.currentSession) {
      this.currentSession.userResponses.push(response)
      this.updateSessionProgress()
    }

    return response
  }

  // Analyze user audio response
  private async analyzeUserResponse(userAudio: string, targetPhrase: AudioPhrase): Promise<any> {
    // In real implementation, this would use speech recognition and analysis
    // For now, simulate analysis based on response time and other factors
    
    const baseAccuracy = Math.max(0, 100 - (Math.random() * 30))
    const basePronunciation = Math.max(0, 100 - (Math.random() * 25))
    const confidence = Math.max(0, 100 - (Math.random() * 20))
    const hesitation = Math.random() > 0.7

    return {
      accuracy: baseAccuracy,
      pronunciation: basePronunciation,
      confidence,
      hesitation
    }
  }

  // Update phrase memory state based on user response
  private updatePhraseMemoryState(phrase: AudioPhrase, response: UserAudioResponse) {
    const { accuracy, pronunciation, responseTime } = response
    
    // Update confidence and retention scores
    phrase.confidenceScore = (phrase.confidenceScore + response.confidence) / 2
    phrase.retentionScore = (phrase.retentionScore + (accuracy + pronunciation) / 2) / 2
    phrase.responseTime = (phrase.responseTime + responseTime) / 2
    phrase.repetitionCount++
    phrase.lastReviewTime = Date.now()

    // Determine next review interval based on performance
    const performance = (accuracy + pronunciation) / 2
    const newInterval = this.calculateNextInterval(phrase.memoryState.phase, performance)
    
    phrase.nextReviewTime = Date.now() + (newInterval * 1000)
    
    // Update memory phase if appropriate
    this.updateMemoryPhase(phrase, performance)
  }

  // Calculate next review interval based on Pimsleur graduated interval recall
  private calculateNextInterval(phase: MemoryState['phase'], performance: number): number {
    const intervals = pimsleurStrategies.graduatedIntervalRecall
    
    if (performance >= 90) {
      // Excellent performance - move to next phase
      switch (phase) {
        case 'introduction': return intervals.shortTerm
        case 'immediate_recall': return intervals.mediumTerm
        case 'short_term': return intervals.longTerm
        case 'medium_term': return intervals.extended
        case 'long_term': return intervals.deepMemory
        case 'extended': return intervals.deepMemory
        default: return intervals.immediate
      }
    } else if (performance >= 70) {
      // Good performance - stay in current phase
      switch (phase) {
        case 'introduction': return intervals.immediate
        case 'immediate_recall': return intervals.shortTerm
        case 'short_term': return intervals.mediumTerm
        case 'medium_term': return intervals.longTerm
        case 'long_term': return intervals.extended
        case 'extended': return intervals.deepMemory
        default: return intervals.immediate
      }
    } else {
      // Poor performance - repeat current phase
      switch (phase) {
        case 'introduction': return intervals.immediate
        case 'immediate_recall': return intervals.immediate
        case 'short_term': return intervals.shortTerm
        case 'medium_term': return intervals.mediumTerm
        case 'long_term': return intervals.longTerm
        case 'extended': return intervals.extended
        default: return intervals.immediate
      }
    }
  }

  // Update memory phase based on performance
  private updateMemoryPhase(phrase: AudioPhrase, performance: number) {
    const currentPhase = phrase.memoryState.phase
    
    if (performance >= 90 && phrase.repetitionCount >= 3) {
      // Move to next phase
      switch (currentPhase) {
        case 'introduction':
          phrase.memoryState.phase = 'immediate_recall'
          break
        case 'immediate_recall':
          phrase.memoryState.phase = 'short_term'
          break
        case 'short_term':
          phrase.memoryState.phase = 'medium_term'
          break
        case 'medium_term':
          phrase.memoryState.phase = 'long_term'
          break
        case 'long_term':
          phrase.memoryState.phase = 'extended'
          break
        case 'extended':
          phrase.memoryState.phase = 'mastered'
          break
      }
    }
  }

  // Update session progress
  private updateSessionProgress() {
    if (!this.currentSession) return

    const totalPhrases = this.currentSession.phrases.length
    const completedResponses = this.currentSession.userResponses.length
    
    this.currentSession.sessionProgress = Math.min(100, (completedResponses / totalPhrases) * 100)
  }

  // Complete current session
  async completeSession(): Promise<AudioMemoryAssessment> {
    if (!this.currentSession) {
      throw new Error('No active session to complete')
    }

    // Save session to history
    this.sessionHistory.push(this.currentSession)
    
    // Update user assessment
    this.updateUserAssessment()
    
    // Clear current session
    const completedSession = this.currentSession
    this.currentSession = null
    
    return this.userAssessment
  }

  // Update user assessment based on session performance
  private updateUserAssessment() {
    if (!this.currentSession) return

    const responses = this.currentSession.userResponses
    if (responses.length === 0) return

    // Calculate average performance metrics
    const avgAccuracy = responses.reduce((sum, r) => sum + r.accuracy, 0) / responses.length
    const avgPronunciation = responses.reduce((sum, r) => sum + r.pronunciation, 0) / responses.length
    const avgResponseTime = responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length
    const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length

    // Update assessment scores
    this.userAssessment.pronunciationAccuracy = (this.userAssessment.pronunciationAccuracy + avgPronunciation) / 2
    this.userAssessment.responseSpeed = Math.max(0, 100 - (avgResponseTime / 1000))
    this.userAssessment.speakingFluency = (this.userAssessment.speakingFluency + avgConfidence) / 2
    
    // Update overall progress
    this.userAssessment.overallProgress = Math.min(100, this.userAssessment.overallProgress + 2)
    
    // Update memory consolidation
    this.userAssessment.memoryConsolidation = this.calculateMemoryConsolidation()
    
    // Identify weak and strong areas
    this.identifyLearningAreas()
  }

  // Calculate memory consolidation score
  private calculateMemoryConsolidation(): number {
    let masteredPhrases = 0
    let totalPhrases = 0
    
    for (const phrase of Array.from(this.phraseDatabase.values())) {
      totalPhrases++
      if (phrase.memoryState.phase === 'mastered') {
        masteredPhrases++
      }
    }
    
    return totalPhrases > 0 ? (masteredPhrases / totalPhrases) * 100 : 0
  }

  // Identify weak and strong learning areas
  private identifyLearningAreas() {
    const weakAreas: string[] = []
    const strongAreas: string[] = []
    
    // Analyze performance by category
    const categoryPerformance = new Map<string, number[]>()
    
    for (const phrase of Array.from(this.phraseDatabase.values())) {
      if (!categoryPerformance.has(phrase.category)) {
        categoryPerformance.set(phrase.category, [])
      }
      categoryPerformance.get(phrase.category)!.push(phrase.retentionScore)
    }
    
    // Identify weak and strong categories
    for (const [category, scores] of Array.from(categoryPerformance.entries())) {
      const avgScore = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
      
      if (avgScore < 60) {
        weakAreas.push(category)
      } else if (avgScore > 80) {
        strongAreas.push(category)
      }
    }
    
    this.userAssessment.weakAreas = weakAreas
    this.userAssessment.strongAreas = strongAreas
  }

  // Get current session
  getCurrentSession(): AudioMemorySession | null {
    return this.currentSession
  }

  // Get user assessment
  getUserAssessment(): AudioMemoryAssessment {
    return this.userAssessment
  }

  // Get session history
  getSessionHistory(): AudioMemorySession[] {
    return this.sessionHistory
  }

  // Get phrases for specific level
  getPhrasesForLevel(level: string): AudioPhrase[] {
    const phrases: AudioPhrase[] = []
    
    for (const phrase of Array.from(this.phraseDatabase.values())) {
      if (phrase.category.includes(level.toLowerCase())) {
        phrases.push(phrase)
      }
    }
    
    return phrases
  }
} 