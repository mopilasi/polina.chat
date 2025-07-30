import React from 'react';
import { Hash, User, Briefcase, Code, GraduationCap } from 'lucide-react';
import { Channel } from '../App';

interface SidebarProps {
  currentChannel: Channel;
  onChannelChange: (channel: Channel) => void;
}

const channels = [
  { id: 'welcome' as Channel, name: 'welcome', icon: User },
  { id: 'experience' as Channel, name: 'experience', icon: Briefcase },
  { id: 'skills' as Channel, name: 'skills', icon: Code },
  { id: 'projects' as Channel, name: 'projects', icon: Hash },
  { id: 'education' as Channel, name: 'education', icon: GraduationCap },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentChannel, onChannelChange }) => {
  return (
    <div className="slack-sidebar">
      {/* Header */}
      <div className="p-4 border-b border-slack-secondary">
        <h1 className="text-xl font-bold">Polina.chat</h1>
        <p className="text-sm text-slack-gray-300 mt-1">Interactive Profile Bot</p>
      </div>

      {/* Channels */}
      <div className="flex-1 p-2">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slack-gray-300 uppercase tracking-wider px-2 mb-2">
            Channels
          </h2>
          <div className="space-y-1">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <button
                  key={channel.id}
                  onClick={() => onChannelChange(channel.id)}
                  className={`slack-channel w-full text-left flex items-center gap-2 ${
                    currentChannel === channel.id ? 'active' : ''
                  }`}
                >
                  <Icon size={16} />
                  <span>#{channel.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slack-secondary">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slack-accent rounded-full flex items-center justify-center">
            <User size={12} className="text-white" />
          </div>
          <div className="text-sm">
            <div className="font-medium">Polina's Bot</div>
            <div className="text-slack-gray-300 text-xs">Online</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 