import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { AgentLogic } from './utils/agentLogic';
import { AgentResponse } from './utils/agentLogic';

export type Channel = 'welcome' | 'experience' | 'skills' | 'projects' | 'education';

function App() {
  const [currentChannel, setCurrentChannel] = useState<Channel>('welcome');
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'bot' | 'user';
    content: string | AgentResponse;
    timestamp: Date;
    channel: Channel;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const agent = AgentLogic.getInstance();

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeResponse = agent.getWelcomeMessage();
    setMessages([{
      id: 'welcome-1',
      type: 'bot',
      content: welcomeResponse, // Pass the entire response object
      timestamp: welcomeResponse.timestamp,
      channel: 'welcome'
    }]);
  }, []);

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      content: input,
      timestamp: new Date(),
      channel: currentChannel
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Process with agent
      const response = await agent.processInput(input);
      
      // Add agent response
      const agentMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot' as const,
        content: response,
        timestamp: response.timestamp,
        channel: currentChannel
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'bot' as const,
        content: {
          type: 'error' as const,
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        },
        timestamp: new Date(),
        channel: currentChannel
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChannelChange = (channel: Channel) => {
    setCurrentChannel(channel);
    
    // Check if we already have messages for this channel
    const existingMessages = messages.filter(m => m.channel === channel);
    
    // If no messages exist for this channel, add channel-specific messages
    if (existingMessages.length === 0) {
      if (channel === 'experience') {
        // Add individual experience messages with actual start dates as timestamps
        const experienceMessages = [
          {
            id: 'closure-2023',
            type: 'bot' as const,
            content: 'Just started as Co-founder, Prototyper & Product Lead at Closure! 🚀 Building innovative products and leading teams from concept to launch. Excited to prototype rapidly and ship products that make a real impact.',
            timestamp: new Date('2023-06-01T16:00:00.000Z'),
            channel: 'experience' as Channel
          },
          {
            id: 'eatsiprepeat-2022',
            type: 'bot' as const,
            content: 'Started my own company! 🍽️ Building Eat Sip Repeat - an AI-powered meal planning app with GPT integration and data optimization. Time to build something from scratch!',
            timestamp: new Date('2022-03-01T18:00:00.000Z'),
            channel: 'experience' as Channel
          },
          {
            id: 'paxful-2020',
            type: 'bot' as const,
            content: 'Joined Paxful as Product Manager! 💳 Leading product strategy and execution for a global fintech platform. Ready to scale products used by millions.',
            timestamp: new Date('2020-06-01T15:30:00.000Z'),
            channel: 'experience' as Channel
          },
          {
            id: 'parim-2019',
            type: 'bot' as const,
            content: 'Joined Parim as Product Manager! 🏢 Working on product strategy and user experience for enterprise solutions. Learning to build products that scale.',
            timestamp: new Date('2019-09-01T16:00:00.000Z'),
            channel: 'experience' as Channel
          },
          {
            id: 'google-2019',
            type: 'bot' as const,
            content: 'Summer internship at Google! 🔍 Working on product strategy and user research for Google Search. Learning from the best in the industry.',
            timestamp: new Date('2019-06-01T15:00:00.000Z'),
            channel: 'experience' as Channel
          },
          {
            id: 'stanford-2018',
            type: 'bot' as const,
            content: 'Research Assistant at Stanford! 🎓 Working on AI and Human-Computer Interaction research. Contributing to cutting-edge technology development.',
            timestamp: new Date('2018-09-01T16:00:00.000Z'),
            channel: 'experience' as Channel
          }
        ];
        setMessages(prev => [...prev, ...experienceMessages]);
      } else {
        // Add regular welcome message for other channels
        const channelWelcome = agent.getChannelWelcomeMessage(channel);
        const welcomeMessage = {
          id: `${channel}-welcome-${Date.now()}`,
          type: 'bot' as const,
          content: channelWelcome, // Pass the entire response object
          timestamp: channelWelcome.timestamp,
          channel: channel
        };
        setMessages(prev => [...prev, welcomeMessage]);
      }
    }
  };

  return (
    <div className="flex h-screen bg-slack-gray-50">
      <Sidebar 
        currentChannel={currentChannel} 
        onChannelChange={handleChannelChange} 
      />
      <ChatArea 
        messages={messages.filter(m => m.channel === currentChannel)}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        currentChannel={currentChannel}
      />
    </div>
  );
}

export default App; 