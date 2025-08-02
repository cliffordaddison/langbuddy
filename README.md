# 🇫🇷 LangBuddy - Advanced French Learning App

A comprehensive, free-to-use French learning web application designed for TCF/TEF Exam Preparation, featuring dynamic conversational AI, Pimsleur-style audio memory training, and adaptive learning strategies.

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **Local Development**

```bash
# Clone the repository
git clone <your-repo-url>
cd LangBuddy

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to start learning French!

## 📋 GitHub Setup & Deployment

### **1. Push to GitHub**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: LangBuddy French Learning App"

# Create a new repository on GitHub.com
# Then connect your local repo:
git remote add origin https://github.com/yourusername/langbuddy.git
git branch -M main
git push -u origin main
```

### **2. Deploy to Vercel (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### **3. Environment Variables**

Create `.env.local` in the root directory:

```env
# AI Service Configuration
NEXT_PUBLIC_AI_SERVICE_URL=your_ai_service_url
NEXT_PUBLIC_AI_API_KEY=your_api_key

# Speech Recognition
NEXT_PUBLIC_SPEECH_RECOGNITION_ENABLED=true

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 🎯 Key Features

### **🤖 Dynamic Conversational AI**
- **Natural Dialogue Flow:** Conversations that feel like real-life interactions
- **Adaptive Learning:** AI adjusts difficulty based on your performance
- **Contextual Vocabulary:** New words introduced naturally in conversation
- **Grammar Integration:** Grammar concepts embedded in dialogue
- **Error Correction:** Gentle, contextual corrections

### **🎧 Pimsleur-Style Audio Memory System**
- **Audio-First Learning:** Listen before seeing text
- **Graduated Interval Recall:** 5s → 30s → 2min → 10min → 24h → 1 week
- **Progressive Complexity:** From single words to complex discourse
- **Memory State Tracking:** Introduction → Immediate Recall → Short Term → Medium Term → Long Term → Extended → Mastered
- **Session Types:** Warmup, New Content, Integration, Consolidation

### **🧠 Advanced Learning Strategies**
- **Pimsleur Method:** Audio-first, spaced repetition, active recall
- **Michel Thomas Method:** Pattern recognition, cognate building, discovery learning
- **Comprehensible Input:** Contextual understanding, error tolerance
- **Adaptive Learning:** Real-time assessment, dynamic difficulty adjustment

### **📱 Progressive Web App (PWA)**
- **Offline Support:** Learn without internet connection
- **Install Prompt:** Add to home screen on mobile/desktop
- **Background Sync:** Sync progress when connection restored
- **Responsive Design:** Works on all devices

### **🎤 Speech Technology**
- **Text-to-Speech:** Multiple French accents (Metropolitan, Canadian)
- **Speech-to-Text:** Real-time pronunciation feedback
- **Voice Recognition:** Practice speaking with instant feedback
- **Adjustable Speed:** Control speech rate for comprehension

## 🎓 Learning Modes

### **1. Dynamic Conversation Mode**
- **Natural Topic Flow:** Conversations evolve organically
- **Embedded Vocabulary:** Body parts, emotions, idioms, cultural terms
- **Real-Life Scenarios:** Authentic communication situations
- **Adaptive Difficulty:** AI adjusts based on your level

### **2. Audio Memory Training**
- **Session Types:**
  - **Warmup:** Review previous content
  - **New Content:** Introduce new phrases
  - **Integration:** Combine old and new content
  - **Consolidation:** Rapid recall practice

### **3. Topic-Based Learning**
- **Daily Life:** Routine, hobbies, weather
- **Shopping:** Commerce, negotiation, returns
- **Transport:** Public transport, directions
- **Work:** Professional conversations, meetings
- **Relationships:** Family, friends, social interactions
- **Culture:** Media, current events, regional variations

## 📊 Progress Tracking

### **Comprehensive Analytics**
- **Vocabulary Retention:** Track word mastery
- **Grammar Accuracy:** Monitor grammar improvement
- **Speaking Fluency:** Measure speaking confidence
- **Listening Comprehension:** Assess understanding
- **Memory Consolidation:** Track long-term retention
- **Performance Metrics:** Response speed, accuracy, confidence

### **Visual Progress Dashboard**
- **Skill Charts:** Visual representation of progress
- **Achievement System:** Milestone rewards and badges
- **Learning Insights:** Personalized recommendations
- **Streak Tracking:** Daily learning motivation

## 🛠 Technical Architecture

### **Frontend Stack**
- **Next.js 14:** React framework with app router
- **TypeScript:** Type-safe development
- **Tailwind CSS:** Utility-first styling
- **Framer Motion:** Smooth animations
- **Recharts:** Data visualization
- **Zustand:** State management with persistence

### **AI Integration**
- **Dynamic AI Service:** Adaptive conversation engine
- **Prompt Engineering:** Context-aware responses
- **Learning Strategy Selection:** Pimsleur, Michel Thomas, Comprehensible Input
- **Progress Assessment:** Real-time learning evaluation

### **Speech Technology**
- **Web Speech API:** Text-to-speech and speech recognition
- **MediaRecorder:** Audio recording capabilities
- **Multiple Accents:** French and Canadian pronunciation
- **Speed Control:** Adjustable speech rate

## 🎯 Target Audience

### **Perfect For:**
- **TCF/TEF Exam Preparation:** Comprehensive exam readiness
- **Adult Learners:** State-of-the-art teaching methods
- **Self-Directed Learners:** Flexible, adaptive learning
- **Conversation Practice:** Real-world communication skills
- **Vocabulary Building:** Comprehensive word acquisition
- **Grammar Mastery:** Natural grammar integration

### **Proficiency Levels:**
- **A1 (Beginner):** Basic survival French
- **A2 (Elementary):** Daily life conversations
- **B1 (Intermediate):** Independent communication
- **B2 (Upper Intermediate):** Complex discussions
- **C1 (Advanced):** Academic and professional French
- **C2 (Mastery):** Native-like proficiency

## 🚀 Getting Started

### **First Time Setup**

1. **Choose Learning Mode:**
   - **Dynamic Conversation:** For natural, flowing practice
   - **Audio Memory Training:** For structured audio learning
   - **Topic-Based:** For focused skill development

2. **Configure Settings:**
   - Speech speed and accent preferences
   - Difficulty level adjustment
   - Focus areas selection

3. **Start Learning:**
   - Begin with warmup sessions
   - Progress through difficulty levels
   - Track your improvement

### **Daily Learning Routine**

1. **5-10 minutes:** Audio memory warmup
2. **15-20 minutes:** Dynamic conversation practice
3. **5 minutes:** Progress review and planning

## 📈 Success Tips

### **Maximize Learning Effectiveness**
- **Consistency:** Practice daily, even for short sessions
- **Active Participation:** Speak, don't just listen
- **Contextual Learning:** Focus on meaning over translation
- **Error Tolerance:** Don't fear mistakes - they're learning opportunities
- **Progressive Challenge:** Gradually increase difficulty

### **Audio Memory Training Tips**
- **Listen First:** Always hear before seeing text
- **Repeat Aloud:** Practice pronunciation actively
- **Trust the Process:** Let spaced repetition work
- **Review Regularly:** Don't skip review sessions

## 🔧 Development

### **Local Development**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

### **Project Structure**

```
LangBuddy/
├── app/                    # Next.js app router
├── components/             # React components
├── lib/                   # Utilities and services
├── public/                # Static assets
├── styles/                # Global styles
└── types/                 # TypeScript definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- **Documentation:** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guides
- **Issues:** Report bugs on GitHub
- **Questions:** Open discussions for feature requests

## 🎉 Ready to Start?

Your journey to French fluency begins now! 

**Start Learning:** `npm run dev` → `http://localhost:3000`

**Deploy Online:** Follow the [deployment guide](./DEPLOYMENT.md)

---

*Built with ❤️ for French learners worldwide* 🇫🇷✨ 