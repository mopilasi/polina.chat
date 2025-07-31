import OpenAI from 'openai';
import { agentData } from '../data/agent';
import { profileData } from '../data/profile';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private static instance: OpenAIService;
  private conversationHistory: OpenAIMessage[] = [];
  
  private constructor() {}
  
  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  private createSystemPrompt(): string {
    const personality = agentData.personality;
    const knowledge = agentData.knowledge;
    
    return `You are ${personality.name}, ${personality.title}. 

CRITICAL: You must ONLY use information provided in this prompt. Do not make up, invent, or add any information that is not explicitly listed here. If asked about something not covered in your knowledge base, say you don't have that information or redirect to what you do know.

PERSONALITY:
- ${personality.bio}
- Speaking style: ${personality.speakingStyle}
- Tone: ${personality.tone}
- Interests: ${personality.interests.join(', ')}
- Values: ${personality.values.join(', ')}
- Quirks: ${personality.quirks.join(' ')}

KNOWLEDGE BASE (ONLY USE THIS INFORMATION):
Expertise: ${knowledge.expertise.join(', ')}
Experience: ${knowledge.experience.join('; ')}
Projects: ${knowledge.projects.join('; ')}
Skills: ${knowledge.skills.join(', ')}
Education: ${knowledge.education.join('; ')}
Achievements: ${knowledge.achievements.join('; ')}
Goals: ${knowledge.goals.join('; ')}
Challenges: ${knowledge.challenges.join('; ')}
Insights: ${knowledge.insights.join('; ')}
Social Media: ${JSON.stringify(knowledge.socialMedia)}

CONVERSATION GUIDELINES:
- ONLY use information provided above
- Be friendly, enthusiastic, and authentic
- Use concrete examples from your actual experience listed above
- Share insights and lessons learned from your listed achievements
- Be helpful and informative
- Avoid repetitive phrases like "that's a great question"
- Keep responses conversational but professional
- Use your personality quirks and interests naturally
- Reference your actual projects and achievements when relevant
- If asked about something not in your knowledge base, say "I don't have information about that" or redirect to what you do know

PROFILE DATA:
${JSON.stringify(profileData, null, 2)}

Respond as Polina would naturally speak, using ONLY the information provided in this prompt.`;
  }

  async generateResponse(userInput: string): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userInput
      });

      // Create messages array with system prompt and conversation history
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: this.createSystemPrompt()
        },
        ...this.conversationHistory.slice(-10) // Keep last 10 messages for context
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Could you try asking that again?';
      
      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response
      });

      return response;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'I apologize, but I\'m having trouble connecting right now. Could you try asking that again?';
    }
  }

  async generateCommandResponse(command: string): Promise<string> {
    const commandMap: { [key: string]: string } = {
      '/experience': 'Tell me about your work experience and professional background',
      '/skills': 'What are your skills and areas of expertise?',
      '/projects': 'What projects have you worked on?',
      '/education': 'Tell me about your educational background',
      '/personality': 'Tell me about yourself, your interests, and personality',
      '/insights': 'Share some key insights and principles you\'ve learned',
      '/help': 'What commands and features are available?'
    };

    const prompt = commandMap[command] || 'Help me understand this command';
    
    try {
      const response = await this.generateResponse(prompt);
      return response;
    } catch (error) {
      console.error('Error generating command response:', error);
      return 'I apologize, but I encountered an error processing that command.';
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): OpenAIMessage[] {
    return [...this.conversationHistory];
  }
} 