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
5. **CEO Validation**: CEO Agent evaluates product concept for market viability
6. **Token Holder Vote**: Approve/reject product concepts via dashboard
7. **Marketing Strategy**: CMO Agent develops marketing plans
8. **Technical Strategy**: CTO Agent creates technical architecture
9. **Marketing Agent**: Receives strategy from CMO and executes campaigns
10. **Head of Engineering**: Receives technical strategy from CTO and creates Bolt prompts
11. **Developer Agent**: Receives prompts and opens Bolt.diy for website development

## 🔧 Recent Updates & Fixes

### Agent Flow Fixes (September 2025)
- ✅ **Fixed 404 Error**: Resolved server endpoint issues causing agent communication failures
- ✅ **Complete Agent Flow**: Fixed workflow to properly trigger all agents in sequence:
  - Research Agent → Product Agent → CMO Agent → CTO Agent → Head of Engineering
- ✅ **Backend Stability**: Fixed CMO and CTO agents to handle missing research data gracefully
- ✅ **Frontend Integration**: Updated frontend to properly trigger subsequent agents after each step

### What Was Fixed
1. **Server Restart Required**: The main issue was a server process that needed restarting
2. **Agent Flow Logic**: Updated `developProduct()` function to call `triggerCMOAndCTO()` instead of stopping
3. **Error Handling**: Fixed agents to handle empty research data without crashing
4. **Route Parameters**: Corrected agent method calls to pass proper parameters
5. **React State Timing Issue**: Fixed critical issue where agents weren't triggering due to React state update timing - now passes data directly between functions

### Current Status
- ✅ All agent endpoints working correctly
- ✅ Complete workflow from idea generation to bolt prompt creation
- ✅ Proper error handling and fallback data
- ✅ Real-time agent activity tracking in UI

### Agent Hierarchy
```
CEO Agent (Idea Generation & Product Validation)
├── Research Agent (Market Analysis)
├── Product Agent (Product Development)
├── CMO Agent (Marketing Strategy)
│   └── Marketing Agent (Campaign Execution)
└── CTO Agent (Technical Strategy)
    └── Head of Engineering Agent (Bolt Prompt Creation)
        └── Developer Agent (Bolt.diy Integration)
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

## 🎨 UI Redesign (Latest Update)

### Design Philosophy
- **Minimalist Aesthetic**: Clean, professional interface inspired by modern design systems
- **Terminal Theme**: Agent activity section uses black/red color scheme for autonomous/degen vibe
- **Neutral Color Palette**: Replaced colorful gradients with sophisticated grays, whites, and blacks
- **Typography**: Clean, readable fonts with proper hierarchy and spacing

### Key Changes
1. **Background**: Changed from colorful gradient to clean white/light gray (`#f8f9fa`)
2. **Cards**: White backgrounds with subtle borders instead of translucent glass effects
3. **Buttons**: Minimalist design with neutral colors and subtle hover effects
4. **Agent Activity**: Terminal-style section with black background and red accent colors
5. **Typography**: Improved font weights, sizes, and spacing for better readability
6. **Color Scheme**: Consistent use of grays (#374151, #4a5568, #6b7280) and blacks (#000000, #1a202c)

### Technical Implementation
- Updated `client/src/App.css` with complete redesign
- Maintained all functionality while improving visual hierarchy
- Added terminal-style monospace fonts for agent activity
- Improved responsive design and accessibility

## 🛠️ Bolt.diy Integration & Customization

### Recent Customizations
- **Streamlined AI Models**: Removed all AI providers except Anthropic for focused development experience
- **Claude 3.7 Sonnet Integration**: Updated to use the latest Claude 3.7 Sonnet (claude-3-7-sonnet-20250219) with hybrid reasoning capabilities
- **Simplified Provider UI**: Updated settings interface to only show Anthropic with clear model description
- **Enhanced Performance**: Disabled dynamic model loading to ensure consistent Claude 3.7 Sonnet usage
- **Cleaned UI Interface**: Removed Import Chat, Import Folder, and Clone a repo buttons for streamlined developer agent experience
- **Updated Welcome Text**: Changed main heading to "Developer Agent" and description to focus on development assistance
- **Custom Branding**: Replaced Bolt.diy logo with "team zero" in stylized gradient design
- **Removed Sidebar**: Eliminated left sidebar with chat history, user info, and navigation for cleaner, focused interface
- **Agent-Only Interface**: Removed input box and export functionality - designed for programmatic AI agent interaction only
- **Simplified Toolbar**: Removed Sync button, replaced Toggle Terminal with Deploy button for streamlined workflow

### Modified Files
- `bolt.diy-main/app/lib/modules/llm/registry.ts` - Removed all providers except Anthropic
- `bolt.diy-main/app/lib/modules/llm/providers/anthropic.ts` - Updated to Claude 3.7 Sonnet only
- `bolt.diy-main/app/components/@settings/tabs/providers/cloud/CloudProvidersTab.tsx` - Simplified UI
- `bolt.diy-main/app/components/chat/BaseChat.tsx` - Updated welcome text and removed import buttons
- `bolt.diy-main/app/components/header/Header.tsx` - Replaced logo with "team zero" branding

### Developer Agent Integration
When the Head of Engineering creates a development prompt, the Developer Agent becomes clickable and opens Bolt.diy with the generated prompt, now powered exclusively by Claude 3.7 Sonnet for consistent, high-quality code generation.

## 📝 Development Notes

- All agent communication uses Claude API
- Database is SQLite for simplicity
- Frontend is React with minimalist, professional styling
- API uses Express.js with CORS enabled
- Token holder system is basic voting mechanism
- UI follows modern design principles with terminal-inspired agent activity section
- Bolt.diy integration uses Claude 3.7 Sonnet for website development

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
