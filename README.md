# Polina.chat - Interactive Personal Profile Bot

A public, web-based, Slack-style profile page that showcases Polina's professional background in an interactive, conversational format. Visitors can explore channels, threads, and use a friendly bot to ask questions, view projects, and discover Polina's skills—all in a familiar, chat-driven interface.

## 🚀 Features

### Core Functionality
- **Slack-style Interface**: Familiar chat-based UI with sidebar channels and main chat area
- **Interactive Bot**: Ask questions and get instant responses about Polina's background
- **Slash Commands**: Use commands like `/experience`, `/skills`, `/project EatSipRepeat`
- **Rich Content Cards**: Project details with metrics, tech stack, and outcomes
- **Channel Navigation**: Explore different aspects via #welcome, #experience, #skills, #projects, #education

### User Experience
- **No Login Required**: Instant access for all visitors
- **Natural Language**: Ask questions in plain English
- **Visual Feedback**: Loading states, reactions, and smooth animations
- **Responsive Design**: Works on desktop and tablet devices

### Content Types
- **Project Cards**: Detailed project information with metrics and links
- **Skill Lists**: Organized by category (PM, AI, Design, Development, Leadership)
- **Experience Timeline**: Professional history with achievements
- **Education Background**: Academic credentials and specializations

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom Slack-inspired design system
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: React hooks for local state
- **Bot Logic**: Custom command parser and response system

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd polina-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### For Visitors
1. **Land on the page** and see the welcome message
2. **Explore channels** by clicking on sidebar items
3. **Ask questions** using natural language or slash commands
4. **View project details** with `/project [name]`
5. **React to content** with emoji reactions

### Available Commands
- `/experience` - View work history
- `/skills` - See skills and expertise
- `/projects` - List all projects
- `/project [name]` - Get details about a specific project
- `/education` - View education background
- `/help` - Show available commands

### Example Questions
- "What projects have you worked on?"
- "Tell me about your AI experience"
- "What's your background in product management?"
- "Show me your education"

## 🎨 Customization

### Profile Data
Edit `src/data/profile.ts` to customize:
- Personal information and bio
- Work experience and achievements
- Skills and expertise levels
- Project details and metrics
- Education background

### Styling
Modify `src/index.css` and `tailwind.config.js` to:
- Change color scheme
- Adjust Slack-style theming
- Customize animations and transitions

### Bot Logic
Update `src/utils/botLogic.ts` to:
- Add new commands
- Enhance natural language processing
- Modify response formats

## 📊 Analytics & Tracking

The application is designed to track:
- Page views per channel
- Command usage patterns
- Project card interactions
- User engagement metrics

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for deployment
- **Custom Server**: Serve the `dist` folder with any web server

## 🎯 Success Metrics

### User-Centric Metrics
- Daily/weekly active users
- Average session duration
- Number of unique commands per session
- User satisfaction scores

### Business Metrics
- Increase in inbound opportunities
- Growth in personal brand reach
- Content optimization insights

### Technical Metrics
- Page load time (<2 seconds)
- Bot response latency (<500ms)
- Uptime (99%+)
- Error rate tracking

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Sidebar.tsx     # Channel navigation
│   ├── ChatArea.tsx    # Main chat interface
│   └── Message.tsx     # Message rendering
├── data/
│   └── profile.ts      # Profile data and types
├── utils/
│   └── botLogic.ts     # Bot command processing
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

### Key Components
- **App.tsx**: Main application state and routing
- **Sidebar.tsx**: Channel navigation with Slack-style design
- **ChatArea.tsx**: Message display and input handling
- **Message.tsx**: Rich message rendering with cards
- **botLogic.ts**: Command parsing and response generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Slack's intuitive chat interface
- Built with modern React patterns and TypeScript
- Styled with Tailwind CSS for rapid development
- Icons provided by Lucide React

---

**Polina.chat** - Making professional profiles interactive and engaging since 2024. 