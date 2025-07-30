import React from 'react';
import { Bot, User, Star, Rocket, TrendingUp, ExternalLink, Github } from 'lucide-react';
import { BotResponse } from '../utils/botLogic';
import { Project, Skill, Experience, Education } from '../data/profile';

interface MessageProps {
  message: {
    id: string;
    type: 'bot' | 'user';
    content: string | BotResponse;
    timestamp: Date;
    channel: string;
  };
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isBot = message.type === 'bot';
  const timestamp = message.timestamp.toLocaleTimeString();

  const renderContent = () => {
    if (typeof message.content === 'string') {
      return (
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      );
    }

    const response = message.content as BotResponse;
    
    switch (response.type) {
      case 'message':
        return (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {response.content as string}
          </div>
        );
      
      case 'error':
        return (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {response.content as string}
          </div>
        );
      
      case 'project-card':
        return <ProjectCard project={response.content as Project} />;
      
      case 'skill-list':
        return <SkillList skills={response.content as Skill[]} />;
      
      case 'experience-list':
        return <ExperienceList experiences={response.content as Experience[]} />;
      
      case 'education-list':
        return <EducationList education={response.content as Education[]} />;
      
      default:
        return (
          <div className="text-sm text-gray-600">
            {JSON.stringify(response.content)}
          </div>
        );
    }
  };

  return (
    <div className="slack-message">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isBot ? 'bg-slack-accent' : 'bg-slack-gray-300'
      }`}>
        {isBot ? (
          <Bot size={16} className="text-white" />
        ) : (
          <User size={16} className="text-white" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {isBot ? "Polina's Bot" : "You"}
          </span>
          <span className="text-xs text-slack-gray-500">
            {timestamp}
          </span>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="slack-card max-w-2xl">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-slack-gray-900">{project.name}</h3>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-slack-gray-100 rounded">
            <Star size={16} className="text-slack-gray-500" />
          </button>
          <button className="p-1 hover:bg-slack-gray-100 rounded">
            <Rocket size={16} className="text-slack-gray-500" />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-slack-gray-700 mb-4">{project.summary}</p>
      
      <div className="space-y-3">
        <div>
          <span className="text-xs font-medium text-slack-gray-500 uppercase">Role</span>
          <p className="text-sm font-medium">{project.role}</p>
        </div>
        
        <div>
          <span className="text-xs font-medium text-slack-gray-500 uppercase">Tech Stack</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {project.techStack.map((tech, index) => (
              <span key={index} className="px-2 py-1 bg-slack-gray-100 text-xs rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        {project.metrics && (
          <div>
            <span className="text-xs font-medium text-slack-gray-500 uppercase">Key Metrics</span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {project.metrics.map((metric, index) => (
                <div key={index} className="bg-slack-success/10 p-2 rounded">
                  <div className="text-sm font-bold text-slack-success">{metric.value}</div>
                  <div className="text-xs text-slack-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {project.outcomes && (
          <div>
            <span className="text-xs font-medium text-slack-gray-500 uppercase">Outcomes</span>
            <ul className="text-sm text-slack-gray-700 mt-1 space-y-1">
              {project.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-2">
                  <TrendingUp size={12} className="text-slack-success mt-0.5 flex-shrink-0" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {project.links && (
          <div className="flex gap-2 pt-2 border-t border-slack-gray-200">
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-1 text-sm text-slack-accent hover:underline">
                <Github size={14} />
                GitHub
              </a>
            )}
            {project.links.demo && (
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 text-sm text-slack-accent hover:underline">
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            {project.links.article && (
              <a href={project.links.article} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 text-sm text-slack-accent hover:underline">
                <ExternalLink size={14} />
                Article
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Skill List Component
const SkillList: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  const categories = ['PM', 'AI', 'Design', 'Development', 'Leadership'] as const;
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-slack-gray-700">Here are my skills organized by category:</p>
      
      {categories.map(category => {
        const categorySkills = skills.filter(skill => skill.category === category);
        if (categorySkills.length === 0) return null;
        
        return (
          <div key={category} className="slack-card">
            <h4 className="font-semibold text-sm mb-2">{category}</h4>
            <div className="space-y-2">
              {categorySkills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{skill.name}</span>
                    <p className="text-xs text-slack-gray-600">{skill.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    skill.level === 'Expert' ? 'bg-green-100 text-green-800' :
                    skill.level === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                    skill.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Experience List Component
const ExperienceList: React.FC<{ experiences: Experience[] }> = ({ experiences }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slack-gray-700">Here's my professional experience:</p>
      
      {experiences.map(experience => (
        <div key={experience.id} className="slack-card">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-sm">{experience.role}</h4>
              <p className="text-sm text-slack-accent">{experience.company}</p>
            </div>
            <span className="text-xs text-slack-gray-500">{experience.duration}</span>
          </div>
          
          <p className="text-sm text-slack-gray-700 mb-3">{experience.description}</p>
          
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-slack-gray-500 uppercase">Key Achievements</span>
              <ul className="text-sm text-slack-gray-700 mt-1 space-y-1">
                {experience.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <TrendingUp size={12} className="text-slack-success mt-0.5 flex-shrink-0" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <span className="text-xs font-medium text-slack-gray-500 uppercase">Skills Used</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {experience.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-slack-gray-100 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Education List Component
const EducationList: React.FC<{ education: Education[] }> = ({ education }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slack-gray-700">Here's my educational background:</p>
      
      {education.map(edu => (
        <div key={edu.id} className="slack-card">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-sm">{edu.degree} in {edu.field}</h4>
              <p className="text-sm text-slack-accent">{edu.institution}</p>
            </div>
            <span className="text-xs text-slack-gray-500">{edu.duration}</span>
          </div>
          
          <p className="text-sm text-slack-gray-700">{edu.description}</p>
        </div>
      ))}
    </div>
  );
}; 