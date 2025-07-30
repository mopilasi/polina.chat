import { profileData, Project, Skill, Experience, Education } from '../data/profile';

export interface BotResponse {
  type: 'message' | 'project-card' | 'skill-list' | 'experience-list' | 'education-list' | 'error';
  content: string | Project | Skill[] | Experience[] | Education[];
  timestamp: Date;
}

export interface BotMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  reactions?: { emoji: string; count: number }[];
  threadId?: string;
}

export class BotLogic {
  private static instance: BotLogic;
  
  private constructor() {}
  
  static getInstance(): BotLogic {
    if (!BotLogic.instance) {
      BotLogic.instance = new BotLogic();
    }
    return BotLogic.instance;
  }

  parseCommand(input: string): { command: string; args: string[] } {
    const trimmed = input.trim();
    
    if (trimmed.startsWith('/')) {
      const parts = trimmed.slice(1).split(' ');
      return {
        command: parts[0].toLowerCase(),
        args: parts.slice(1)
      };
    }
    
    return { command: 'natural', args: [trimmed] };
  }

  async processInput(input: string): Promise<BotResponse> {
    const { command, args } = this.parseCommand(input);
    
    switch (command) {
      case 'experience':
        return this.handleExperience();
      case 'skills':
        return this.handleSkills();
      case 'projects':
        return this.handleProjects();
      case 'project':
        return this.handleProject(args[0]);
      case 'education':
        return this.handleEducation();
      case 'help':
        return this.handleHelp();
      case 'natural':
        return this.handleNaturalLanguage(args[0]);
      default:
        return this.handleUnknownCommand(command);
    }
  }

  private handleExperience(): BotResponse {
    return {
      type: 'experience-list',
      content: profileData.experience,
      timestamp: new Date()
    };
  }

  private handleSkills(): BotResponse {
    return {
      type: 'skill-list',
      content: profileData.skills,
      timestamp: new Date()
    };
  }

  private handleProjects(): BotResponse {
    const projectNames = profileData.projects.map(p => p.name).join(', ');
    return {
      type: 'message',
      content: `Here are my projects: ${projectNames}. Use /project [name] to get details about a specific project.`,
      timestamp: new Date()
    };
  }

  private handleProject(projectName?: string): BotResponse {
    if (!projectName) {
      return {
        type: 'error',
        content: 'Please specify a project name. Available projects: EatSipRepeat, SmartBudget, TeamSync',
        timestamp: new Date()
      };
    }

    const project = profileData.projects.find(
      p => p.name.toLowerCase().includes(projectName.toLowerCase())
    );

    if (!project) {
      return {
        type: 'error',
        content: `Project "${projectName}" not found. Available projects: EatSipRepeat, SmartBudget, TeamSync`,
        timestamp: new Date()
      };
    }

    return {
      type: 'project-card',
      content: project,
      timestamp: new Date()
    };
  }

  private handleEducation(): BotResponse {
    return {
      type: 'education-list',
      content: profileData.education,
      timestamp: new Date()
    };
  }

  private handleHelp(): BotResponse {
    return {
      type: 'message',
      content: `Here are the available commands:
• /experience - View my work history
• /skills - See my skills and expertise
• /projects - List all projects
• /project [name] - Get details about a specific project
• /education - View my education background
• /help - Show this help message

You can also ask me natural questions like "What projects have you worked on?" or "Tell me about your AI experience."`,
      timestamp: new Date()
    };
  }

  private handleNaturalLanguage(question: string): BotResponse {
    const lowerQuestion = question.toLowerCase();
    
    // Project-related questions
    if (lowerQuestion.includes('project') || lowerQuestion.includes('work on')) {
      return this.handleProjects();
    }
    
    // Experience-related questions
    if (lowerQuestion.includes('experience') || lowerQuestion.includes('work history') || lowerQuestion.includes('job')) {
      return this.handleExperience();
    }
    
    // Skills-related questions
    if (lowerQuestion.includes('skill') || lowerQuestion.includes('expertise') || lowerQuestion.includes('know')) {
      return this.handleSkills();
    }
    
    // Education-related questions
    if (lowerQuestion.includes('education') || lowerQuestion.includes('degree') || lowerQuestion.includes('university')) {
      return this.handleEducation();
    }
    
    // AI-related questions
    if (lowerQuestion.includes('ai') || lowerQuestion.includes('machine learning') || lowerQuestion.includes('artificial intelligence')) {
      const aiSkills = profileData.skills.filter(s => s.category === 'AI');
      return {
        type: 'skill-list',
        content: aiSkills,
        timestamp: new Date()
      };
    }
    
    // Default response
    return {
      type: 'message',
      content: `I'm not sure I understand. Try asking about my projects, experience, skills, or education. You can also use commands like /help to see what I can do!`,
      timestamp: new Date()
    };
  }

  private handleUnknownCommand(command: string): BotResponse {
    return {
      type: 'error',
      content: `Unknown command: /${command}. Type /help to see available commands.`,
      timestamp: new Date()
    };
  }

  getWelcomeMessage(): BotResponse {
    return {
      type: 'message',
      content: `Hey there! I'm Polina's skills bot. Ask me anything about her work, and I'll fetch details.

Try these commands:
• /experience - View work history
• /skills - See skills and expertise  
• /projects - List all projects
• /project [name] - Get project details
• /education - View education background

Or just ask me natural questions!`,
      timestamp: new Date()
    };
  }
} 