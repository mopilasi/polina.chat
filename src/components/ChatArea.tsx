import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Hash } from 'lucide-react';
import { Message } from './Message';
import { BotResponse } from '../utils/botLogic';
import { Channel } from '../App';

interface ChatAreaProps {
  messages: Array<{
    id: string;
    type: 'bot' | 'user';
    content: string | BotResponse;
    timestamp: Date;
    channel: Channel;
  }>;
  onSendMessage: (input: string) => void;
  isLoading: boolean;
  currentChannel: Channel;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  currentChannel 
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slack-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Hash size={20} className="text-slack-gray-500" />
          <h2 className="text-lg font-semibold">#{currentChannel}</h2>
        </div>
        <p className="text-sm text-slack-gray-500 mt-1">
          {currentChannel === 'welcome' && 'Welcome to Polina.chat! Start exploring.'}
          {currentChannel === 'experience' && 'Professional experience and work history.'}
          {currentChannel === 'skills' && 'Technical skills and expertise.'}
          {currentChannel === 'projects' && 'Projects and portfolio work.'}
          {currentChannel === 'education' && 'Educational background and degrees.'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="slack-message">
            <div className="w-8 h-8 bg-slack-accent rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">Polina's Bot</span>
                <span className="text-xs text-slack-gray-500">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slack-accent rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slack-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slack-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slack-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message or command (e.g., /help)..."
            className="slack-input flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="slack-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={16} />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}; 