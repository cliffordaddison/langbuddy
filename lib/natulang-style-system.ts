// NatuLang-Style French Learning System
// Hands-free, speaking-first approach with real-time AI feedback

export interface SpeechAnalysis {
  isCorrect: boolean
  pronunciationScore: number // 0-100
  grammarScore: number // 0-100
  confidence: number // 0-100
  errors: SpeechError[]
  suggestions: string[]
}

export interface SpeechError {
  type: 'pronunciation' | 'grammar' | 'vocabulary' | 'structure'
  word: string
  expected: string
  actual: string
  position: number
  severity: 'minor' | 'major' | 'critical'
}

export interface LessonPrompt {
  id: string
  type: 'word' | 'phrase' | 'dialogue' | 'question'
  targetText: string
  audioUrl?: string
  context: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  expectedResponse?: string
  hints?: string[]
}

export interface UserResponse {
  id: string
  promptId: string
  spokenText: string
  audioData: string // base64
  timestamp: number
  analysis: SpeechAnalysis
  sessionId: string
}

export interface LearningSession {
  id: string
  userId: string
  startTime: number
  endTime?: number
  currentPromptIndex: number
  prompts: LessonPrompt[]
  responses: UserResponse[]
  performance: SessionPerformance
  status: 'active' | 'paused' | 'completed'
}

export interface SessionPerformance {
  totalPrompts: number
  correctResponses: number
  averagePronunciationScore: number
  averageGrammarScore: number
  weakAreas: string[]
  strongAreas: string[]
  timeSpent: number // in seconds
}

export interface SpacedRepetitionItem {
  id: string
  promptId: string
  userId: string
  nextReview: number
  interval: number // in seconds
  repetitions: number
  easeFactor: number
  lastPerformance: number // 0-100
  errorPatterns: string[]
}

export class NatuLangStyleSystem {
  private currentSession: LearningSession | null = null
  private speechRecognition: any = null
  private speechSynthesis: SpeechSynthesis | null = null
  private isListening = false
  private isSpeaking = false

  constructor() {
    this.initializeSpeechRecognition()
    this.initializeSpeechSynthesis()
  }

  // Initialize speech recognition for hands-free operation
  private initializeSpeechRecognition() {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      this.speechRecognition = new SpeechRecognition()
      this.speechRecognition.continuous = false
      this.speechRecognition.interimResults = false
      this.speechRecognition.lang = 'fr-FR'
      this.speechRecognition.maxAlternatives = 1

      this.speechRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        this.handleUserResponse(transcript)
      }

      this.speechRecognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        this.isListening = false
      }

      this.speechRecognition.onend = () => {
        this.isListening = false
      }
    }
  }

  // Initialize speech synthesis for high-quality audio prompts
  private initializeSpeechSynthesis() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis
    }
  }

  // Start a new learning session
  async startSession(userId: string, lessonType: 'beginner' | 'intermediate' | 'advanced' = 'beginner'): Promise<LearningSession> {
    const prompts = await this.generateLessonPrompts(lessonType)
    
    this.currentSession = {
      id: `session_${Date.now()}`,
      userId,
      startTime: Date.now(),
      currentPromptIndex: 0,
      prompts,
      responses: [],
      performance: {
        totalPrompts: prompts.length,
        correctResponses: 0,
        averagePronunciationScore: 0,
        averageGrammarScore: 0,
        weakAreas: [],
        strongAreas: [],
        timeSpent: 0
      },
      status: 'active'
    }

    return this.currentSession
  }

  // Generate lesson prompts based on NatuLang style
  private async generateLessonPrompts(level: string): Promise<LessonPrompt[]> {
    const prompts: LessonPrompt[] = []

    // Beginner level - Basic greetings and introductions
    if (level === 'beginner') {
      prompts.push(
        {
          id: 'greeting_1',
          type: 'phrase',
          targetText: 'Bonjour, comment allez-vous ?',
          context: 'Meeting someone for the first time',
          difficulty: 'easy',
          category: 'greetings',
          expectedResponse: 'Bonjour, comment allez-vous ?',
          hints: ['Say "hello, how are you?"']
        },
        {
          id: 'greeting_2',
          type: 'phrase',
          targetText: 'Je vais bien, merci',
          context: 'Responding to "how are you?"',
          difficulty: 'easy',
          category: 'greetings',
          expectedResponse: 'Je vais bien, merci',
          hints: ['Say "I am well, thank you"']
        },
        {
          id: 'introduction_1',
          type: 'phrase',
          targetText: 'Je m\'appelle Pierre',
          context: 'Introducing yourself',
          difficulty: 'easy',
          category: 'introductions',
          expectedResponse: 'Je m\'appelle Pierre',
          hints: ['Say "My name is Pierre"']
        },
        {
          id: 'question_1',
          type: 'question',
          targetText: 'Qu\'est-ce que vous faites ?',
          context: 'Asking about someone\'s work',
          difficulty: 'medium',
          category: 'questions',
          expectedResponse: 'Qu\'est-ce que vous faites ?',
          hints: ['Ask "What do you do?"']
        }
      )
    }

    return prompts
  }

  // Play audio prompt using speech synthesis
  async playPrompt(prompt: LessonPrompt): Promise<void> {
    if (!this.speechSynthesis) return

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(prompt.targetText)
      utterance.lang = 'fr-FR'
      utterance.rate = 0.8 // Slightly slower for learning
      utterance.pitch = 1.0
      
      // Try to use a French voice
      const voices = this.speechSynthesis.getVoices()
      const frenchVoice = voices.find(voice => 
        voice.lang.includes('fr') || voice.lang.includes('FR')
      )
      if (frenchVoice) {
        utterance.voice = frenchVoice
      }

      utterance.onstart = () => {
        this.isSpeaking = true
      }

      utterance.onend = () => {
        this.isSpeaking = false
        // Start listening for user response
        setTimeout(() => {
          this.startListening()
        }, 500)
        resolve()
      }

      utterance.onerror = () => {
        this.isSpeaking = false
        resolve()
      }

      this.speechSynthesis.speak(utterance)
    })
  }

  // Start listening for user response
  private startListening(): void {
    if (!this.speechRecognition || this.isListening) return

    this.isListening = true
    this.speechRecognition.start()
  }

  // Handle user's spoken response
  private async handleUserResponse(spokenText: string): Promise<void> {
    if (!this.currentSession) return

    const currentPrompt = this.currentSession.prompts[this.currentSession.currentPromptIndex]
    const analysis = await this.analyzeSpeech(spokenText, currentPrompt.targetText)

    const response: UserResponse = {
      id: `response_${Date.now()}`,
      promptId: currentPrompt.id,
      spokenText,
      audioData: '', // Would capture actual audio in real implementation
      timestamp: Date.now(),
      analysis,
      sessionId: this.currentSession.id
    }

    this.currentSession.responses.push(response)
    this.updateSessionPerformance(response)

    // Provide immediate feedback
    await this.provideFeedback(analysis, currentPrompt)

    // Move to next prompt or repeat if needed
    if (analysis.isCorrect) {
      this.advanceToNextPrompt()
    } else {
      // Repeat the same prompt with correction
      await this.repeatPromptWithCorrection(currentPrompt, analysis)
    }
  }

  // Analyze user's speech against target
  private async analyzeSpeech(spokenText: string, targetText: string): Promise<SpeechAnalysis> {
    // This is a simplified analysis - in a real implementation, you'd use
    // advanced speech recognition and pronunciation analysis APIs
    
    const normalizedSpoken = this.normalizeFrenchText(spokenText)
    const normalizedTarget = this.normalizeFrenchText(targetText)
    
    const isCorrect = normalizedSpoken.toLowerCase() === normalizedTarget.toLowerCase()
    
    // Calculate scores based on similarity
    const pronunciationScore = this.calculatePronunciationScore(normalizedSpoken, normalizedTarget)
    const grammarScore = this.calculateGrammarScore(normalizedSpoken, normalizedTarget)
    const confidence = this.calculateConfidence(normalizedSpoken, normalizedTarget)

    const errors: SpeechError[] = []
    if (!isCorrect) {
      errors.push({
        type: 'pronunciation',
        word: 'general',
        expected: targetText,
        actual: spokenText,
        position: 0,
        severity: 'major'
      })
    }

    return {
      isCorrect,
      pronunciationScore,
      grammarScore,
      confidence,
      errors,
      suggestions: this.generateSuggestions(normalizedSpoken, normalizedTarget)
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

  // Calculate pronunciation score
  private calculatePronunciationScore(spoken: string, target: string): number {
    const similarity = this.calculateSimilarity(spoken, target)
    return Math.round(similarity * 100)
  }

  // Calculate grammar score
  private calculateGrammarScore(spoken: string, target: string): number {
    // Simplified grammar checking
    const spokenWords = spoken.split(' ')
    const targetWords = target.split(' ')
    
    let correctWords = 0
    for (let i = 0; i < Math.min(spokenWords.length, targetWords.length); i++) {
      if (spokenWords[i] === targetWords[i]) {
        correctWords++
      }
    }
    
    return Math.round((correctWords / targetWords.length) * 100)
  }

  // Calculate confidence score
  private calculateConfidence(spoken: string, target: string): number {
    const similarity = this.calculateSimilarity(spoken, target)
    return Math.round(similarity * 100)
  }

  // Calculate similarity between two strings
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  // Levenshtein distance for similarity calculation
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

  // Generate suggestions for improvement
  private generateSuggestions(spoken: string, target: string): string[] {
    const suggestions: string[] = []
    
    if (spoken.length < target.length * 0.8) {
      suggestions.push('Try speaking more slowly and clearly')
    }
    
    if (spoken.length > target.length * 1.2) {
      suggestions.push('Try to be more concise')
    }
    
    if (!spoken.includes('bonjour') && target.includes('bonjour')) {
      suggestions.push('Remember to say "bonjour" (hello)')
    }
    
    return suggestions
  }

  // Provide immediate feedback to user
  private async provideFeedback(analysis: SpeechAnalysis, prompt: LessonPrompt): Promise<void> {
    if (analysis.isCorrect) {
      await this.speakFeedback('Excellent! Très bien!')
    } else {
      await this.speakFeedback('Pas exactement. Essayez encore.')
      // Speak the correct pronunciation
      await this.playPrompt(prompt)
    }
  }

  // Repeat prompt with correction
  private async repeatPromptWithCorrection(prompt: LessonPrompt, analysis: SpeechAnalysis): Promise<void> {
    await this.speakFeedback('Écoutez attentivement et répétez.')
    await this.playPrompt(prompt)
  }

  // Speak feedback to user
  private async speakFeedback(text: string): Promise<void> {
    if (!this.speechSynthesis) return

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'fr-FR'
      utterance.rate = 0.9
      
      utterance.onend = () => resolve()
      utterance.onerror = () => resolve()
      
      this.speechSynthesis.speak(utterance)
    })
  }

  // Advance to next prompt
  private advanceToNextPrompt(): void {
    if (!this.currentSession) return

    this.currentSession.currentPromptIndex++
    
    if (this.currentSession.currentPromptIndex >= this.currentSession.prompts.length) {
      this.completeSession()
    } else {
      // Play next prompt
      const nextPrompt = this.currentSession.prompts[this.currentSession.currentPromptIndex]
      this.playPrompt(nextPrompt)
    }
  }

  // Update session performance
  private updateSessionPerformance(response: UserResponse): void {
    if (!this.currentSession) return

    const { performance } = this.currentSession
    
    if (response.analysis.isCorrect) {
      performance.correctResponses++
    }
    
    performance.averagePronunciationScore = 
      (performance.averagePronunciationScore + response.analysis.pronunciationScore) / 2
    
    performance.averageGrammarScore = 
      (performance.averageGrammarScore + response.analysis.grammarScore) / 2
    
    performance.timeSpent = Date.now() - this.currentSession.startTime
  }

  // Complete the session
  private completeSession(): void {
    if (!this.currentSession) return

    this.currentSession.endTime = Date.now()
    this.currentSession.status = 'completed'
    
    this.speakFeedback('Session terminée. Bon travail!')
  }

  // Get current session
  getCurrentSession(): LearningSession | null {
    return this.currentSession
  }

  // Pause session
  pauseSession(): void {
    if (this.currentSession) {
      this.currentSession.status = 'paused'
    }
  }

  // Resume session
  resumeSession(): void {
    if (this.currentSession) {
      this.currentSession.status = 'active'
      const currentPrompt = this.currentSession.prompts[this.currentSession.currentPromptIndex]
      this.playPrompt(currentPrompt)
    }
  }

  // Check if currently listening
  isCurrentlyListening(): boolean {
    return this.isListening
  }

  // Check if currently speaking
  isCurrentlySpeaking(): boolean {
    return this.isSpeaking
  }
} 