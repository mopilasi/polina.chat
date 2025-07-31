import { agentData } from '../data/agent';
import { profileData } from '../data/profile';
import { OpenAIService } from './openaiService';
import { BotResponse } from './botLogic';

export interface AgentResponse {
  type: 'message' | 'project-card' | 'skill-list' | 'experience-list' | 'education-list' | 'error' | 'personality' | 'insight' | 'experience-post';
  content: string | any;
  timestamp: Date;
  personality?: {
    tone: string;
    enthusiasm: number;
    humor?: string;
  };
}

export interface ExperiencePost {
  id: string;
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  achievements: string[];
  skills: string[];
  links?: {
    company?: string;
    linkedin?: string;
    project?: string;
  };
  photos?: string[];
}

export class AgentLogic {
  private static instance: AgentLogic;
  private conversationHistory: string[] = [];
  private openaiService: OpenAIService;
  private useOpenAI: boolean = false;
  
  private constructor() {
    this.openaiService = OpenAIService.getInstance();
    // Check if OpenAI API key is available
    this.useOpenAI = !!import.meta.env.VITE_OPENAI_API_KEY;
  }
  
  static getInstance(): AgentLogic {
    if (!AgentLogic.instance) {
      AgentLogic.instance = new AgentLogic();
    }
    return AgentLogic.instance;
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private addPersonalityToResponse(response: string): string {
    const personality = agentData.personality;
    const conversation = agentData.conversation;
    
    // Add encouragement
    if (Math.random() < 0.3) {
      response = this.getRandomItem(conversation.encouragements) + " " + response;
    }
    
    // Add humor occasionally
    if (Math.random() < 0.2) {
      response += " " + this.getRandomItem(conversation.humor);
    }
    
    return response;
  }

  private findRelevantKnowledge(query: string): string[] {
    const lowerQuery = query.toLowerCase();
    const relevant: string[] = [];
    
    // Search through different knowledge categories
    Object.entries(agentData.knowledge).forEach(([, items]) => {
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (typeof item === 'string' && item.toLowerCase().includes(lowerQuery)) {
            relevant.push(item);
          }
        });
      }
    });
    
    return relevant;
  }

  private generatePersonalizedResponse(query: string): string {
    const lowerQuery = query.toLowerCase();
    const personality = agentData.personality;
    const knowledge = agentData.knowledge;
    
    // Handle different types of questions
    if (lowerQuery.includes('who are you') || lowerQuery.includes('tell me about yourself')) {
      return `I'm ${personality.name}, ${personality.title}. ${personality.bio} I'm particularly passionate about ${personality.interests[0]} and ${personality.interests[1]}.`;
    }
    
    if (lowerQuery.includes('what do you do') || lowerQuery.includes('your work')) {
      return `I work as a ${personality.title}, focusing on ${knowledge.expertise[0]} and ${knowledge.expertise[1]}. I love combining product strategy with AI innovation to create meaningful user experiences.`;
    }
    
    if (lowerQuery.includes('your experience') || lowerQuery.includes('background')) {
      return `I have experience in ${knowledge.experience[0]} and ${knowledge.experience[1]}. I've worked on projects ranging from AI-powered apps to enterprise solutions.`;
    }
    
    if (lowerQuery.includes('your skills') || lowerQuery.includes('expertise')) {
      const topSkills = knowledge.skills.slice(0, 3).join(', ');
      return `My core skills include ${topSkills}. I'm particularly strong in product strategy and user research, with growing expertise in AI/ML integration.`;
    }
    
    if (lowerQuery.includes('your projects') || lowerQuery.includes('what have you built')) {
      return `I've worked on several exciting projects! ${knowledge.projects[0]}, ${knowledge.projects[1]}, and ${knowledge.projects[2]}. Each one taught me something unique about building products that users love.`;
    }
    
    if (lowerQuery.includes('your goals') || lowerQuery.includes('what do you want to achieve')) {
      return `My main goals are ${knowledge.goals[0]} and ${knowledge.goals[1]}. I'm passionate about building products that make a real difference in people's lives.`;
    }
    
    if (lowerQuery.includes('challenges') || lowerQuery.includes('difficulties')) {
      return `Some of the biggest challenges I've faced include ${knowledge.challenges[0]} and ${knowledge.challenges[1]}. But these challenges have taught me valuable lessons about ${knowledge.insights[0]}.`;
    }
    
    if (lowerQuery.includes('your values') || lowerQuery.includes('what matters to you')) {
      return `I value ${personality.values[0]}, ${personality.values[1]}, and ${personality.values[2]}. I believe that ${knowledge.insights[0]} and ${knowledge.insights[1]}.`;
    }
    
    if (lowerQuery.includes('advice') || lowerQuery.includes('tips') || lowerQuery.includes('insights')) {
      return `Here's what I've learned: ${knowledge.insights[0]}. Also, ${knowledge.insights[1]}. And remember, ${knowledge.insights[2]}.`;
    }
    
    if (lowerQuery.includes('ai') || lowerQuery.includes('machine learning')) {
      return `I'm really excited about AI! I have ${knowledge.skills[2]} and I believe ${knowledge.insights[2]}. I love exploring how AI can enhance human capabilities rather than replace them.`;
    }
    
    if (lowerQuery.includes('product management') || lowerQuery.includes('pm')) {
      return `Product management is my passion! I specialize in ${knowledge.expertise[0]} and ${knowledge.expertise[1]}. I believe ${knowledge.insights[0]} and ${knowledge.insights[3]}.`;
    }
    
    // Default response with personality
    return this.getRandomItem(agentData.conversation.defaultResponses);
  }

  async processInput(input: string): Promise<AgentResponse> {
    this.conversationHistory.push(input);
    const lowerInput = input.toLowerCase();
    
    // Handle greetings
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return {
        type: 'message',
        content: this.getRandomItem(agentData.conversation.greetings),
        timestamp: new Date(),
        personality: {
          tone: agentData.personality.tone,
          enthusiasm: 0.8
        }
      };
    }
    
    // Handle farewells
    if (lowerInput.includes('bye') || lowerInput.includes('goodbye') || lowerInput.includes('thanks')) {
      return {
        type: 'message',
        content: this.getRandomItem(agentData.conversation.farewells),
        timestamp: new Date(),
        personality: {
          tone: agentData.personality.tone,
          enthusiasm: 0.6
        }
      };
    }
    
    // Handle specific commands
    if (input.startsWith('/')) {
      return this.handleCommand(input);
    }
    
    // Use OpenAI if available, otherwise fall back to rule-based responses
    if (this.useOpenAI) {
      try {
        const openaiResponse = await this.openaiService.generateResponse(input);
        return {
          type: 'message',
          content: openaiResponse,
          timestamp: new Date(),
          personality: {
            tone: agentData.personality.tone,
            enthusiasm: 0.8
          }
        };
      } catch (error) {
        console.error('OpenAI error, falling back to rule-based:', error);
        // Fall back to rule-based response
      }
    }
    
    // Handle natural language questions with rule-based responses
    const personalizedResponse = this.generatePersonalizedResponse(input);
    const responseWithPersonality = this.addPersonalityToResponse(personalizedResponse);
    
    return {
      type: 'message',
      content: responseWithPersonality,
      timestamp: new Date(),
      personality: {
        tone: agentData.personality.tone,
        enthusiasm: 0.7,
        humor: Math.random() < 0.3 ? this.getRandomItem(agentData.conversation.humor) : undefined
      }
    };
  }

  private async handleCommand(input: string): Promise<AgentResponse> {
    const command = input.toLowerCase();
    
    // Use OpenAI for command responses if available
    if (this.useOpenAI) {
      try {
        const openaiResponse = await this.openaiService.generateCommandResponse(input);
        return {
          type: 'message',
          content: openaiResponse,
          timestamp: new Date(),
          personality: {
            tone: agentData.personality.tone,
            enthusiasm: 0.8
          }
        };
      } catch (error) {
        console.error('OpenAI command error, falling back to rule-based:', error);
        // Fall back to rule-based response
      }
    }
    
    // Rule-based command handling
    if (command.includes('/experience')) {
      return {
        type: 'experience-list',
        content: profileData.experience,
        timestamp: new Date(),
        personality: {
          tone: agentData.personality.tone,
          enthusiasm: 0.8
        }
      };
    }
    
    if (command.includes('/skills')) {
      return {
        type: 'skill-list',
        content: profileData.skills,
        timestamp: new Date(),
        personality: {
          tone: agentData.personality.tone,
          enthusiasm: 0.7
        }
      };
    }
    
    if (command.includes('/projects')) {
      const projectNames = profileData.projects.map(p => p.name).join(', ');
      return {
        type: 'message',
        content: `Here are my projects: ${projectNames}. Use /project [name] to get details about a specific project. I'm particularly proud of how each one turned out!`,
        timestamp: new Date(),
        personality: {
          tone: agentData.personality.tone,
          enthusiasm: 0.9
        }
      };
    }
    
    if (command.includes('/project')) {
      const projectName = input.split(' ').slice(1).join(' ');
      const project = profileData.projects.find(
        p => p.name.toLowerCase().includes(projectName.toLowerCase())
      );
      
      if (!project) {
        return {
          type: 'error',
          content: `I don't have a project called "${projectName}". My projects are: ${profileData.projects.map(p => p.name).join(', ')}.`,
          timestamp: new Date(),
          personality: {
            tone: agentData.personality.tone,
            enthusiasm: 0.5
          }
        };
      }
      
      return {
        type: 'project-card',
        content: project,
        timestamp: new Date(),
        personality: {
          tone: agentData.personality.tone,
          enthusiasm: 0.9
        }
      };
    }
    
    if (command.includes('/education')) {
      return {
        type: 'education-list',
        content: profileData.education,
        timestamp: new Date(),
        personality: {
          tone: agentData.personality.tone,
          enthusiasm: 0.7
        }
      };
    }
    
    if (command.includes('/personality') || command.includes('/about me')) {
      const personality = agentData.personality;
      const response = `I'm ${personality.name}, ${personality.title}. ${personality.bio}

My interests include ${personality.interests.slice(0, 3).join(', ')}.

I value ${personality.values.slice(0, 3).join(', ')}.

Some fun facts about me: ${personality.quirks.slice(0, 2).join(' ')}`;
      
      return {
        type: 'message',
        content: response,
        timestamp: new Date(),
        personality: {
          tone: agentData.personality.tone,
          enthusiasm: 0.8
        }
      };
    }
    
    if (command.includes('/insights')) {
      const insights = agentData.knowledge.insights.slice(0, 3);
      const response = `Here are some key insights I've learned:

• ${insights[0]}
• ${insights[1]}
• ${insights[2]}

These principles guide my approach to product development and team leadership.`;
      
      return {
        type: 'message',
        content: response,
        timestamp: new Date(),
        personality: {
          tone: agentData.personality.tone,
          enthusiasm: 0.8
        }
      };
    }
    
    if (command.includes('/help')) {
      return {
        type: 'message',
        content: `Here are the available commands:

• /experience - View my work history
• /skills - See my skills and expertise
• /projects - List all projects
• /project [name] - Get details about a specific project
• /education - View my education background
• /personality - Learn about my personality and interests
• /insights - Get my key insights and principles
• /help - Show this help message

You can also ask me natural questions like "What projects have you worked on?" or "Tell me about your AI experience." I love sharing my story!`,
        timestamp: new Date(),
        personality: {
          tone: agentData.personality.tone,
          enthusiasm: 0.7
        }
      };
    }
    
    return {
      type: 'error',
      content: `I don't recognize that command. Try /help to see what I can do!`,
      timestamp: new Date(),
      personality: {
        tone: agentData.personality.tone,
        enthusiasm: 0.5
      }
    };
  }

  getWelcomeMessage(): AgentResponse {
    return {
      type: 'message',
      content: `Hey there! I'm Polina's AI assistant. I'm excited to chat with you about my background, experience, and insights!

You can ask me about:
• My work experience and projects
• My skills and expertise
• My personality and interests
• My insights and principles
• My education and background

Try commands like /experience, /skills, /projects, or just ask me natural questions!`,
      timestamp: new Date(),
      personality: {
        tone: agentData.personality.tone,
        enthusiasm: 0.9
      }
    };
  }

  getChannelWelcomeMessage(channel: string): AgentResponse {
    const knowledge = agentData.knowledge;
    
    switch (channel) {
      case 'experience':
        return {
          type: 'message',
          content: `💼 **My Work Experience**

Here are my career announcements - each one represents a new role I started:

**Closure** – Co-founder, Prototyper & Product Lead
**Eat Sip Repeat** – Founder, Builder of Fake-Real Things  
**Paxful** – Product Manager

Click on any experience to see the thread with achievements, skills, and details!`,
          timestamp: new Date(),
          personality: {
            tone: agentData.personality.tone,
            enthusiasm: 0.8
          }
        };

      case 'skills':
        return {
          type: 'message',
          content: `🛠️ **My Skills & Expertise**

**Product & Strategy:**
• Product Strategy & Roadmap Development
• User Research & UX Design
• Agile & Lean Methodologies
• Data Analysis & Metrics
• Stakeholder Management

**AI & Technology:**
• AI/ML Product Integration
• OpenAI APIs, GPT-4 / Claude
• Prompt Engineering
• Function Calling
• Agent Workflows

**Development & Tools:**
• SwiftUI, JavaScript/TypeScript
• Firebase, REST/Webhooks
• Figma, n8n, Airtable
• Amplitude, Python

**Leadership:**
• Team Leadership & Mentoring
• Growth & Scaling Strategies
• Design Feedback Loops
• Human-AI Interaction Experiments

I'm always learning and expanding my skill set! Ask me about any specific area or how I apply these skills in practice.`,
          timestamp: new Date(),
          personality: {
            tone: agentData.personality.tone,
            enthusiasm: 0.8
          }
        };

      case 'projects':
        return {
          type: 'message',
          content: `🚀 **My Projects**

Here are some key projects I've worked on:

**Eat Sip Repeat**
AI menu planner with GPT tagging, prompt tuning, and data optimization

**Roadmap Whisperer**
GPT + n8n prototype that pushes roadmap updates automatically

**Daily-Life Automations**
LinkedIn comments generator, training plan builder, bedtime story generator

**AI Safety & Evaluation**
LLM-based safety checks and evaluation frameworks for crisis detection

**Enterprise Solutions**
NLP-based chatbots for telco, finance, and e-commerce clients with 95%+ accuracy

**Technical Builds**
Production-grade CRUD using Firebase backend and SwiftUI front-end

Each project taught me something unique about building products that solve real problems. Ask me about any specific project or what I learned!`,
          timestamp: new Date(),
          personality: {
            tone: agentData.personality.tone,
            enthusiasm: 0.8
          }
        };

      case 'education':
        return {
          type: 'message',
          content: `🎓 **My Education**

**MS in Computer Science** from Stanford (2018-2020)
Specialized in AI and HCI - my thesis focused on AI-powered product design

**BS in Business Administration** from UC Berkeley (2014-2018)
Double major with Computer Science, graduated with honors

**Continuous Learning**
Various certifications in product management and AI, plus ongoing self-study in emerging technologies

My education gave me a strong foundation in both business and technology, which I use every day in my product work. Ask me about my academic journey or how my education influences my approach to product development!`,
          timestamp: new Date(),
          personality: {
            tone: agentData.personality.tone,
            enthusiasm: 0.8
          }
        };

      default:
        return this.getWelcomeMessage();
    }
  }
} 