# Housr Platform - Student Living Reimagined

A comprehensive Next.js platform featuring a public-facing student housing website and an AI-powered admin dashboard with three intelligent features.

## 🏗️ Project Structure

```
housr-platform/
├── app/
│   ├── page.tsx                      # Public landing page
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles
│   └── dashboard/
│       ├── layout.tsx                # Dashboard sidebar layout
│       ├── page.tsx                  # Dashboard overview
│       ├── call-hub/
│       │   └── page.tsx              # Call Intelligence Hub
│       ├── reply-engine/
│       │   └── page.tsx              # AI Housing Match Reply Engine
│       └── voice-coach/
│           └── page.tsx              # HR Voice Training Coach
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── next.config.js                    # Next.js configuration
```

## 🚀 Features

### Public Website
- **Modern Landing Page**: Student-centric design matching Housr's aesthetic
- **Hero Section**: Eye-catching hero with search functionality
- **Features Grid**: Showcasing key benefits (All Bills Included, Student Perks, Roomie Match)
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Admin Dashboard
1. **Call Intelligence Hub** 📞
   - AI-driven analysis of support & sales calls
   - Sentiment scoring and keyword tracking
   - Real-time transcription monitoring
   - Critical alert system

2. **AI Housing Match Reply Engine** 💬
   - RAG-powered housing recommendations
   - Automated email response generation
   - Property inventory integration
   - One-click approval system

3. **HR Voice Training Coach** 🎤
   - Real-time voice analysis
   - Empathy, pace, and clarity metrics
   - Interactive training sessions
   - Animated audio visualizations

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Git (optional)

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### Navigation
- **Public Site**: Visit `http://localhost:3000` for the student-facing landing page
- **Admin Dashboard**: Click "Admin Login" or visit `http://localhost:3000/dashboard`

### Testing Features

#### Call Intelligence Hub
1. Navigate to Dashboard → Call Intel Hub
2. View analyzed calls with sentiment scores
3. Click "View Transcript" to see detailed analysis

#### AI Housing Match Reply Engine
1. Navigate to Dashboard → Housing Match AI
2. Paste a student inquiry in the left panel (e.g., "Looking for a 1-bedroom near Manchester University")
3. Click "Generate Match" to see AI-generated response
4. Use "Regenerate" or "Approve & Send" buttons

#### HR Voice Training Coach
1. Navigate to Dashboard → HR Voice Coach
2. Click the microphone button to start recording simulation
3. Watch real-time metrics update (Empathy, Pace, Clarity)
4. Click the stop button to end the session

## 🔧 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts (ready for integration)
- **Animations**: Framer Motion + CSS Animations

## 🎨 Design Philosophy

- **Modern & Clean**: Minimalist design with bold typography
- **Green Accent**: Using #10b981 (green-500) as the primary brand color
- **Dark Mode Dashboard**: Professional dark sidebar with light content area
- **Smooth Transitions**: Hover effects and animations for better UX

## 🔮 Future Enhancements (Production-Ready)

To make this fully functional in production, connect to:

1. **Call Hub**: 
   - AssemblyAI or Deepgram API for speech-to-text
   - Custom sentiment analysis pipeline
   - Database for call storage (PostgreSQL/MongoDB)

2. **Reply Engine**:
   - OpenAI GPT-4 API for response generation
   - Pinecone or Weaviate for vector database (RAG)
   - Property listings database integration

3. **Voice Coach**:
   - WebRTC for real-time audio capture
   - WebSocket connection to Python backend
   - Prosody analysis using Parselmouth or similar

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔊 Backend (ElevenLabs TTS)

- Copy `backend/.env.example` to `backend/.env` and paste your ElevenLabs key as `ELEVEN_API_KEY` (the server also falls back to `backend/venv/.env` if you already stored it there).
- If you only have `ELEVENLABS_API_KEY` set, it will be picked up automatically and mapped to `ELEVEN_API_KEY`.
- Start the FastAPI server from the repo root:
  - `source backend/venv/bin/activate`
  - `uvicorn backend.main:app --reload --port 8001`
- Test locally: `curl -X POST http://localhost:8001/tts -H "Content-Type: application/json" -d '{"text":"Hello from Realty Voice"}' --output sample.mp3`
- Health check: `curl http://localhost:8001/health` (returns `has_elevenlabs_key: true` when the key is loaded).
- Frontend expects `NEXT_PUBLIC_BACKEND_URL` (e.g., `http://localhost:8001`) to call `/tts`. To relax CORS for other origins, set `CORS_ALLOW_ORIGINS` (comma-separated) in `backend/.env`.
- Frontend local env sample: copy `.env.local.example` to `.env.local` and adjust the backend URL.
- To use a specific ElevenLabs Agent, set `ELEVEN_AGENT_ID` (backend) and `NEXT_PUBLIC_ELEVEN_AGENT_ID` (frontend). Default agent used: `agent_6301kb88z22ee3cr98333t8vyw7g`.

## 🤝 Contributing

This is a hackathon project demonstrating the frontend architecture and UX for Housr's AI-powered platform.

## 📄 License

Proprietary - Created for Housr Hackathon

---

**Built with ❤️ for Housr - Reimagining Student Living**
