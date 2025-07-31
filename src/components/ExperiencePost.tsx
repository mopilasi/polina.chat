import React from 'react';
import { Calendar, MapPin, ExternalLink, Award, Code, Users } from 'lucide-react';
import { ExperiencePost } from '../utils/agentLogic';

interface ExperiencePostProps {
  post: ExperiencePost;
}

export const ExperiencePostComponent: React.FC<ExperiencePostProps> = ({ post }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const getDuration = () => {
    if (post.endDate) {
      const start = post.startDate;
      const end = post.endDate;
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      if (months < 12) {
        return `${months} months`;
      } else {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
      }
    }
    return 'Present';
  };

  return (
    <div className="bg-white border border-slack-gray-200 rounded-lg p-6 mb-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-slack-gray-900">{post.role}</h3>
            <span className="text-sm text-slack-accent font-medium">at {post.company}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slack-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(post.startDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{getDuration()}</span>
            </div>
          </div>
        </div>

        {/* Links */}
        {post.links && (
          <div className="flex gap-2">
            {post.links.company && (
              <a 
                href={post.links.company} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slack-accent hover:text-blue-600 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
            {post.links.linkedin && (
              <a 
                href={post.links.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slack-accent hover:text-blue-600 transition-colors"
              >
                <Users size={16} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-slack-gray-700 mb-4 leading-relaxed">
        {post.description}
      </p>

      {/* Achievements */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-slack-success" />
          <h4 className="font-medium text-slack-gray-900">Key Achievements</h4>
        </div>
        <ul className="space-y-2">
          {post.achievements.map((achievement, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-slack-gray-700">
              <span className="text-slack-success mt-1">•</span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Skills */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Code size={16} className="text-slack-accent" />
          <h4 className="font-medium text-slack-gray-900">Skills & Technologies</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.skills.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-slack-gray-100 text-slack-gray-700 text-sm rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}; 