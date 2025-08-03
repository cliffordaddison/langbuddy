# LangBuddy - AI-Powered French Learning App

LangBuddy is a sophisticated French learning application that mimics the dynamic, conversation-based approach of Natulang. Unlike traditional language apps that simply present static lessons, LangBuddy creates interactive, AI-driven conversations that adapt to your learning needs.

## 🚀 Features

### Dynamic Conversation System
- **Real-time AI Conversations**: Engage in natural French conversations with AI characters
- **Contextual Learning**: Practice in realistic scenarios (library, restaurant, travel)
- **Immediate Feedback**: Get instant pronunciation and grammar corrections
- **Personalized Learning**: AI adapts to your mistakes and focuses on your weak areas

### Advanced Learning Features
- **Grammar Integration**: Learn grammar naturally within conversations
- **Cultural Context**: Understand French culture and social norms
- **Pronunciation Analysis**: Real-time speech recognition and feedback
- **Progress Tracking**: Monitor your improvement across multiple metrics

### Interactive Scenarios
- **Library Conversations**: Practice asking for help and finding books
- **Restaurant Scenarios**: Order food, ask about dishes, handle dining situations
- **Travel Dialogues**: Navigate transportation, ask for directions, book accommodations

## 🎯 How It Works

### 1. Choose Your Scenario
Select from various conversation contexts based on your interests and skill level:
- **Beginner**: Basic greetings and introductions
- **Intermediate**: Everyday situations and practical conversations
- **Advanced**: Complex grammar and cultural nuances

### 2. Engage in Dynamic Conversations
- **AI Speaks**: Listen to natural French pronunciation
- **You Respond**: Practice speaking with real-time feedback
- **Get Corrected**: Receive immediate suggestions and explanations
- **Learn Grammar**: Understand rules through context, not memorization

### 3. Track Your Progress
- **Performance Metrics**: Pronunciation, grammar, vocabulary, and fluency scores
- **Weak Areas**: AI identifies what you need to practice
- **Strong Points**: Celebrate your improvements
- **Learning Path**: Personalized recommendations based on your performance

## 🛠️ Technical Architecture

### Conversation System
```typescript
// Dynamic conversation generation
const conversationSystem = new ConversationSystem()
const session = conversationSystem.startSession('library_conversation')

// Real-time response analysis
const analysis = conversationSystem.processUserResponse(spokenText)
```

### AI-Driven Learning
- **Speech Recognition**: Real-time French speech processing
- **Natural Language Processing**: Grammar and vocabulary analysis
- **Adaptive Feedback**: Personalized corrections and suggestions
- **Performance Tracking**: Comprehensive learning analytics

### User Experience
- **Mobile-First Design**: Optimized for mobile learning
- **Dark Mode Interface**: Easy on the eyes for extended study sessions
- **Smooth Animations**: Engaging visual feedback
- **Intuitive Navigation**: Simple, distraction-free interface

## 📱 Getting Started

### Prerequisites
- Node.js 18+ 
- Modern web browser with speech recognition support
- Microphone for voice interaction

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/langbuddy.git
cd langbuddy

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage
1. **Open the App**: Navigate to `http://localhost:3000`
2. **Select Conversations**: Choose from available conversation scenarios
3. **Start Speaking**: Allow microphone access and begin practicing
4. **Get Feedback**: Receive real-time corrections and suggestions
5. **Track Progress**: Monitor your improvement over time

## 🎓 Learning Methodology

### Conversation-Based Learning
Unlike traditional apps that present isolated phrases, LangBuddy creates complete conversations that:
- **Build Context**: Each conversation has a realistic scenario
- **Include Grammar**: Learn grammar rules through natural usage
- **Provide Feedback**: Get immediate corrections and explanations
- **Adapt Difficulty**: AI adjusts based on your performance

### Spaced Repetition
- **Smart Review**: AI brings back phrases you struggle with
- **Optimal Timing**: Review at the perfect moment for retention
- **Personalized**: Focus on your specific weak areas

### Cultural Integration
- **Real Scenarios**: Practice in authentic French situations
- **Cultural Notes**: Learn about French customs and etiquette
- **Social Context**: Understand formal vs. informal language

## 🔧 Customization

### Adding New Conversations
```typescript
// Create new conversation context
const newContext: ConversationContext = {
  id: 'custom_conversation',
  title: 'At the Bank',
  description: 'Practice banking vocabulary and formal language',
  scenario: 'You need to open a bank account in France',
  characters: [
    { name: 'Marie', role: 'Bank Clerk', personality: 'Professional' }
  ],
  difficulty: 'intermediate',
  grammarFocus: ['conditional tense', 'formal expressions'],
  vocabularyFocus: ['banking terms', 'financial vocabulary']
}
```

### Extending Grammar Analysis
```typescript
// Add custom grammar rules
const grammarRules = {
  'formal_vs_informal': (text: string) => {
    return text.includes('vous') ? 'formal' : 'informal'
  },
  'verb_conjugation': (text: string) => {
    // Custom conjugation analysis
  }
}
```

## 📊 Performance Metrics

### Learning Analytics
- **Pronunciation Score**: Real-time speech analysis
- **Grammar Accuracy**: Context-aware grammar checking
- **Vocabulary Mastery**: Word usage and retention tracking
- **Fluency Assessment**: Speaking speed and naturalness

### Progress Tracking
- **Session History**: Complete record of all conversations
- **Weak Areas**: AI-identified areas needing improvement
- **Strong Points**: Celebrated achievements and strengths
- **Learning Trends**: Long-term progress visualization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Natulang's innovative conversation-based approach
- Built with Next.js, React, and TypeScript
- Speech recognition powered by Web Speech API
- UI components from Lucide React

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/langbuddy/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/langbuddy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/langbuddy/discussions)

---

**Ready to start your French learning journey?** 🚀

Choose a conversation scenario and begin practicing with our AI-powered French tutor today! 