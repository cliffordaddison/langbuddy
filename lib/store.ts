import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProgress {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  experience: number
  streak: number
  totalSessions: number
  vocabularyLearned: number
  grammarPoints: number
  conversationMinutes: number
  lastSessionDate: string | null
}

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  corrections?: string[]
  grammarNotes?: string[]
  vocabularyNotes?: string[]
}

export interface LearningSession {
  id: string
  date: string
  duration: number
  topics: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  performance: number
  newVocabulary: string[]
  grammarPoints: string[]
}

export interface SpacedRepetitionItem {
  id: string
  content: string
  type: 'vocabulary' | 'grammar' | 'dialogue'
  difficulty: number
  nextReview: Date
  interval: number
  repetitions: number
  easeFactor: number
}

interface LearningStore {
  // User Progress
  userProgress: UserProgress
  updateProgress: (updates: Partial<UserProgress>) => void
  
  // Conversation
  conversationHistory: ConversationMessage[]
  addMessage: (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => void
  clearConversation: () => void
  
  // Learning Sessions
  sessions: LearningSession[]
  addSession: (session: Omit<LearningSession, 'id'>) => void
  
  // Spaced Repetition
  srsItems: SpacedRepetitionItem[]
  addSRSItem: (item: Omit<SpacedRepetitionItem, 'id'>) => void
  updateSRSItem: (id: string, updates: Partial<SpacedRepetitionItem>) => void
  getDueItems: () => SpacedRepetitionItem[]
  
  // Settings
  settings: {
    speechSpeed: number
    accent: 'french' | 'quebec'
    autoSpeak: boolean
    autoListen: boolean
    difficulty: 'easy' | 'medium' | 'hard'
    focusAreas: string[]
  }
  updateSettings: (updates: Partial<LearningStore['settings']>) => void
  
  // Current Session
  currentSession: {
    isActive: boolean
    startTime: Date | null
    topic: string | null
    difficulty: 'easy' | 'medium' | 'hard'
  }
  startSession: (topic: string, difficulty: 'easy' | 'medium' | 'hard') => void
  endSession: () => void
}

const initialProgress: UserProgress = {
  level: 'A1',
  experience: 0,
  streak: 0,
  totalSessions: 0,
  vocabularyLearned: 0,
  grammarPoints: 0,
  conversationMinutes: 0,
  lastSessionDate: null,
}

const initialSettings = {
  speechSpeed: 1.0,
  accent: 'french' as const,
  autoSpeak: true,
  autoListen: false,
  difficulty: 'medium' as const,
  focusAreas: ['vocabulary', 'grammar', 'pronunciation'],
}

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      // User Progress
      userProgress: initialProgress,
      updateProgress: (updates) =>
        set((state) => ({
          userProgress: { ...state.userProgress, ...updates },
        })),

      // Conversation
      conversationHistory: [],
      addMessage: (message) =>
        set((state) => ({
          conversationHistory: [
            ...state.conversationHistory,
            {
              ...message,
              id: Date.now().toString(),
              timestamp: new Date(),
            },
          ],
        })),
      clearConversation: () => set({ conversationHistory: [] }),

      // Learning Sessions
      sessions: [],
      addSession: (session) =>
        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              ...session,
              id: Date.now().toString(),
            },
          ],
        })),

      // Spaced Repetition
      srsItems: [],
      addSRSItem: (item) =>
        set((state) => ({
          srsItems: [
            ...state.srsItems,
            {
              ...item,
              id: Date.now().toString(),
            },
          ],
        })),
      updateSRSItem: (id, updates) =>
        set((state) => ({
          srsItems: state.srsItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      getDueItems: () => {
        const { srsItems } = get()
        const now = new Date()
        return srsItems.filter((item) => item.nextReview <= now)
      },

      // Settings
      settings: initialSettings,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      // Current Session
      currentSession: {
        isActive: false,
        startTime: null,
        topic: null,
        difficulty: 'medium',
      },
      startSession: (topic, difficulty) =>
        set({
          currentSession: {
            isActive: true,
            startTime: new Date(),
            topic,
            difficulty,
          },
        }),
      endSession: () =>
        set({
          currentSession: {
            isActive: false,
            startTime: null,
            topic: null,
            difficulty: 'medium',
          },
        }),
    }),
    {
      name: 'langbuddy-store',
      partialize: (state) => ({
        userProgress: state.userProgress,
        sessions: state.sessions,
        srsItems: state.srsItems,
        settings: state.settings,
      }),
    }
  )
) 