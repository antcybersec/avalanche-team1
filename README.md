# 🤖 AI Company - Fully Automated Organization

A revolutionary AI-only company with hierarchical AI agents and token holder governance.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Claude API key from Anthropic

### Installation

1. **Clone and setup:**
```bash
cd team-zero
npm install
cd client && npm install && cd ..
```

2. **Configure environment:**
```bash
cp env.example .env
# Edit .env and add your Claude API key
```

3. **Initialize database:**
```bash
node database/setup.js
```

4. **Start the system:**
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
npm run client
```

5. **Access the dashboard:**
- Open http://localhost:3000
- You'll see the Token Holder Dashboard

## 🎯 How It Works

### Current Workflow
1. **Generate Ideas**: CEO Agent creates $1M business ideas
2. **Token Holder Vote**: Approve/reject ideas via dashboard
3. **Research Phase**: Research Agent analyzes approved ideas
4. **Product Development**: Product Agent creates detailed concepts
5. **Final Approval**: Token holders vote on final products

### Agent Hierarchy
```
CEO Agent
├── Research Agent
├── Product Agent
├── Frontend Agent (coming soon)
├── Backend Agent (coming soon)
└── Marketing Agent (coming soon)
```

## 🛠️ Features

### ✅ Implemented
- **CEO Agent**: Generates business ideas using Claude API
- **Research Agent**: Market research and competitive analysis
- **Product Agent**: Product concept development
- **Token Holder Dashboard**: Voting and approval interface
- **Database**: SQLite storage for all data
- **API Server**: RESTful API for agent communication

### 🚧 Coming Soon
- **Coding Agents**: Website development with Bolt integration
- **Marketing Agent**: Social media automation via n8n
- **Real-time Updates**: Live agent activity feed
- **Advanced UI**: Better user experience

## 📁 Project Structure

```
team-zero/
├── agents/                 # AI Agent implementations
│   ├── ClaudeAgent.js     # Base agent class
│   ├── CEOAgent.js        # CEO agent
│   ├── ResearchAgent.js   # Research agent
│   └── ProductAgent.js    # Product agent
├── routes/                # API routes
│   ├── agents.js          # Agent endpoints
│   ├── ideas.js           # Idea management
│   └── tokens.js          # Voting system
├── database/              # Database setup
│   └── setup.js           # SQLite initialization
├── client/                # React frontend
│   ├── src/
│   │   ├── App.js         # Main dashboard
│   │   └── App.css        # Styling
│   └── package.json
├── server.js              # Express server
├── package.json           # Backend dependencies
└── README.md              # This file
```

## 🔧 API Endpoints

### Agents
- `POST /api/agents/generate-ideas` - Generate new business ideas
- `POST /api/agents/research/:ideaId` - Research an idea
- `POST /api/agents/develop-product/:ideaId` - Develop product concept
- `GET /api/agents/activities` - Get agent activity log

### Ideas
- `GET /api/ideas` - Get all ideas
- `GET /api/ideas/:id` - Get specific idea with research/product
- `PUT /api/ideas/:id/status` - Update idea status

### Tokens
- `POST /api/tokens/vote` - Vote on ideas/products
- `GET /api/tokens/votes/:itemType/:itemId` - Get votes for item
- `GET /api/tokens/summary/:itemType/:itemId` - Get voting summary

## 🎮 Usage

1. **Start the system** (see Quick Start above)
2. **Generate idea**: Click "Generate New Idea" button (generates ONE idea)
3. **Approve idea**: Click "Approve & Start Research" to begin workflow
4. **Watch agents work**: See real-time agent activity in the dashboard
5. **Automatic workflow**: 
   - CEO generates idea → Token holder approves → Research Agent researches
   - Research completes → Product Agent develops concept → Token holder approves
6. **Monitor progress**: All agent activities are displayed in real-time

## 🔑 Environment Variables

```bash
# Required
CLAUDE_API_KEY=your_claude_api_key_here

# Optional
PORT=5000
NODE_ENV=development
DB_PATH=./database/ai_company.db
N8N_WEBHOOK_URL=your_n8n_webhook_url_here
```

## 🐛 Troubleshooting

### Common Issues

1. **Claude API Error**: Make sure your API key is correct and has credits
2. **Database Error**: Run `node database/setup.js` to initialize
3. **Port Conflicts**: Change PORT in .env file
4. **CORS Issues**: Make sure backend is running on port 5000

### Debug Mode
```bash
NODE_ENV=development npm start
```

## 🚀 Next Development Steps

1. **Add Coding Agents**: Frontend/Backend agents for website development
2. **Bolt Integration**: Connect agents to website building platform
3. **Marketing Agent**: Social media automation
4. **Real-time Updates**: WebSocket integration for live updates
5. **Advanced UI**: Better dashboard with real-time agent activity

## 📝 Development Notes

- All agent communication uses Claude API
- Database is SQLite for simplicity
- Frontend is React with basic styling
- API uses Express.js with CORS enabled
- Token holder system is basic voting mechanism

## 🤝 Contributing

This is a proof-of-concept implementation. Future improvements:
- Better error handling
- Agent coordination improvements
- Real-time updates
- Advanced UI/UX
- Production deployment

---

**Status**: Basic working version with CEO, Research, and Product agents
**Next**: Add coding and marketing agents with Bolt/n8n integration
