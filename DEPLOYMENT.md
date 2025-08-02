# 🚀 LangBuddy Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/) installed
- A GitHub account
- (Optional) A hosting platform account (Vercel, Netlify, etc.)

## 🎯 Quick Start

### 1. **Local Development Setup**

```bash
# Clone the repository
git clone <your-repo-url>
cd LangBuddy

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. **Environment Setup**

Create a `.env.local` file in the root directory:

```env
# AI Service Configuration
NEXT_PUBLIC_AI_SERVICE_URL=your_ai_service_url
NEXT_PUBLIC_AI_API_KEY=your_api_key

# Speech Recognition (Optional)
NEXT_PUBLIC_SPEECH_RECOGNITION_ENABLED=true

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended)**

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Automatic Deployments:**
   - Connect your GitHub repository to Vercel
   - Every push to `main` branch will auto-deploy

### **Option 2: Netlify**

1. **Build Command:**
   ```bash
   npm run build
   ```

2. **Publish Directory:**
   ```
   .next
   ```

3. **Environment Variables:**
   - Add your environment variables in Netlify dashboard

### **Option 3: Railway**

1. **Connect Repository:**
   - Connect your GitHub repo to Railway
   - Railway will auto-detect Next.js

2. **Environment Variables:**
   - Add environment variables in Railway dashboard

### **Option 4: Self-Hosting**

1. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

2. **Docker (Optional):**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

## 🔧 Configuration

### **AI Service Integration**

The app currently uses a mock AI service. To integrate with real AI:

1. **Update `lib/ai-service.ts`:**
   ```typescript
   // Replace mock service with real API calls
   const response = await fetch('/api/ai', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ message, context })
   })
   ```

2. **Create API Route:**
   ```typescript
   // app/api/ai/route.ts
   export async function POST(request: Request) {
     // Implement your AI service integration
   }
   ```

### **Speech Recognition Setup**

1. **Enable HTTPS** (required for speech recognition)
2. **Update speech settings** in the app
3. **Test microphone permissions**

## 📱 PWA Features

The app includes Progressive Web App features:

- **Offline Support:** Service worker caches essential resources
- **Install Prompt:** Users can install the app on their devices
- **Background Sync:** Syncs data when connection is restored

### **PWA Configuration**

Update `public/manifest.json`:
```json
{
  "name": "LangBuddy - French Learning",
  "short_name": "LangBuddy",
  "description": "Advanced French Learning with AI",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "background_color": "#ffffff"
}
```

## 🔒 Security Considerations

1. **Environment Variables:** Never commit sensitive data
2. **API Keys:** Use environment variables for all API keys
3. **CORS:** Configure CORS for your AI service
4. **HTTPS:** Always use HTTPS in production

## 📊 Monitoring & Analytics

### **Performance Monitoring**

1. **Vercel Analytics** (if using Vercel)
2. **Google Analytics** (optional)
3. **Error Tracking** (Sentry, LogRocket)

### **User Analytics**

Track learning progress:
- Session duration
- Vocabulary retention
- Grammar accuracy
- User engagement

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] AI service integrated
- [ ] HTTPS enabled
- [ ] PWA features tested
- [ ] Performance optimized
- [ ] Error tracking set up
- [ ] Analytics configured
- [ ] SEO meta tags added
- [ ] Social media cards added

## 🆘 Troubleshooting

### **Common Issues:**

1. **Build Errors:**
   ```bash
   npm run build
   # Check for TypeScript errors
   npx tsc --noEmit
   ```

2. **Runtime Errors:**
   - Check browser console
   - Verify environment variables
   - Test API endpoints

3. **PWA Issues:**
   - Clear browser cache
   - Check service worker
   - Verify manifest.json

### **Support:**

- Check the [README.md](./README.md) for detailed documentation
- Review [QUICK_START.md](./QUICK_START.md) for setup instructions
- Open an issue on GitHub for bugs

## 🎉 Success!

Your LangBuddy app is now deployed and ready for French learners worldwide! 🇫🇷✨ 