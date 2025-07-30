import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { BotLogic } from './utils/botLogic';
import { BotResponse } from './utils/botLogic';

export type Channel = 'welcome' | 'experience' | 'skills' | 'projects' | 'education';

function App() {
  const [currentChannel, setCurrentChannel] = useState<Channel>('welcome');
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'bot' | 'user';
    content: string | BotResponse;
    timestamp: Date;
    channel: Channel;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const bot = BotLogic.getInstance();

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeResponse = bot.getWelcomeMessage();
    setMessages([{
      id: 'welcome-1',
      type: 'bot',
      content: welcomeResponse.content as string,
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
      // Process with bot
      const response = await bot.processInput(input);
      
      // Add bot response
      const botMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot' as const,
        content: response,
        timestamp: response.timestamp,
        channel: currentChannel
      };

      setMessages(prev => [...prev, botMessage]);
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