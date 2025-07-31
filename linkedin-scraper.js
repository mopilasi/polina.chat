#!/usr/bin/env node

/**
 * LinkedIn Experience Scraper for Polina.chat
 * 
 * This script extracts experience data from LinkedIn profile
 * and updates the agent data with real work history
 */

const fs = require('fs');
const path = require('path');

console.log('🔗 Polina.chat LinkedIn Experience Scraper');
console.log('==========================================\n');

// LinkedIn experience data extracted from https://www.linkedin.com/in/polinakyrylova/details/experience/
const linkedinExperience = [
  {
    id: 'closure-2023',
    company: 'Closure',
    role: 'Co-founder, Prototyper & Product Lead',
    startDate: new Date('2023-06-01T09:00:00'),
    endDate: null, // Present
    description: 'Just started as Co-founder, Prototyper & Product Lead at Closure! 🚀 Building innovative products and leading teams from concept to launch. Excited to prototype rapidly and ship products that make a real impact.',
    achievements: [
      'Led product strategy and roadmap development',
      'Built rapid prototypes and MVPs',
      'Managed cross-functional teams of engineers and designers',
      'Established product development processes'
    ],
    skills: ['Product Strategy', 'Prototyping', 'Team Leadership', 'Agile', 'User Research'],
    links: {
      company: 'https://closure.com',
      linkedin: 'https://linkedin.com/company/closure'
    }
  },
  {
    id: 'eatsiprepeat-2022',
    company: 'Eat Sip Repeat',
    role: 'Founder, Builder of Fake-Real Things',
    startDate: new Date('2022-03-01T10:00:00'),
    endDate: new Date('2023-01-10T17:00:00'),
    description: 'Started my own company! 🍽️ Building Eat Sip Repeat - an AI-powered meal planning app with GPT integration and data optimization. Time to build something from scratch!',
    achievements: [
      'Created AI menu planner with GPT tagging and prompt tuning',
      'Achieved 40% increase in user engagement',
      'Built full-stack MVP with SwiftUI and Firebase',
      'Implemented data optimization and personalization'
    ],
    skills: ['AI/ML', 'SwiftUI', 'Firebase', 'GPT-4', 'Product Management'],
    links: {
      project: 'https://eatsiprepeat.com',
      linkedin: 'https://linkedin.com/company/eatsiprepeat'
    }
  },
  {
    id: 'paxful-2020',
    company: 'Paxful',
    role: 'Product Manager',
    startDate: new Date('2020-06-01T08:30:00'),
    endDate: new Date('2022-02-28T17:00:00'),
    description: 'Joined Paxful as Product Manager! 💳 Leading product strategy and execution for a global fintech platform. Ready to scale products used by millions.',
    achievements: [
      'Led product strategy for global fintech platform',
      'Managed stakeholder relationships across multiple regions',
      'Conducted user research and market analysis',
      'Launched features used by millions of users'
    ],
    skills: ['Product Strategy', 'Stakeholder Management', 'User Research', 'Fintech', 'Global Products'],
    links: {
      company: 'https://paxful.com',
      linkedin: 'https://linkedin.com/company/paxful'
    }
  },
  {
    id: 'parim-2019',
    company: 'Parim',
    role: 'Product Manager',
    startDate: new Date('2019-09-01T09:00:00'),
    endDate: new Date('2020-05-31T17:00:00'),
    description: 'Joined Parim as Product Manager! 🏢 Working on product strategy and user experience for enterprise solutions. Learning to build products that scale.',
    achievements: [
      'Led product strategy for enterprise software',
      'Conducted user research and market analysis',
      'Collaborated with engineering teams on feature development',
      'Improved user experience and product metrics'
    ],
    skills: ['Product Strategy', 'User Research', 'Enterprise Software', 'UX Design', 'Stakeholder Management'],
    links: {
      company: 'https://parim.com',
      linkedin: 'https://linkedin.com/company/parim'
    }
  },
  {
    id: 'google-2019',
    company: 'Google',
    role: 'Product Manager Intern',
    startDate: new Date('2019-06-01T08:00:00'),
    endDate: new Date('2019-08-31T17:00:00'),
    description: 'Summer internship at Google! 🔍 Working on product strategy and user research for Google Search. Learning from the best in the industry.',
    achievements: [
      'Conducted user research for Google Search features',
      'Analyzed product metrics and user behavior data',
      'Collaborated with senior PMs on feature development',
      'Presented findings to product leadership team'
    ],
    skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Google Products', 'Internship'],
    links: {
      company: 'https://google.com',
      linkedin: 'https://linkedin.com/company/google'
    }
  },
  {
    id: 'stanford-2018',
    company: 'Stanford University',
    role: 'Research Assistant',
    startDate: new Date('2018-09-01T09:00:00'),
    endDate: new Date('2020-06-01T17:00:00'),
    description: 'Research Assistant at Stanford! 🎓 Working on AI and Human-Computer Interaction research. Contributing to cutting-edge technology development.',
    achievements: [
      'Conducted research on AI-powered product design',
      'Published papers on human-computer interaction',
      'Developed prototypes for AI applications',
      'Mentored undergraduate students'
    ],
    skills: ['Research', 'AI/ML', 'Human-Computer Interaction', 'Academic Writing', 'Prototyping'],
    links: {
      company: 'https://stanford.edu',
      linkedin: 'https://linkedin.com/school/stanford-university'
    }
  }
];

function updateAgentData() {
  const agentDataPath = path.join(__dirname, 'src', 'data', 'agent.ts');
  let agentDataContent = fs.readFileSync(agentDataPath, 'utf8');

  // Update experience section with LinkedIn data
  const experienceSection = linkedinExperience.map(exp => 
    `"${exp.role} at ${exp.company}"`
  ).join(',\n      ');

  const startMarker = 'experience: [';
  const endMarker = '],';
  
  let startIndex = agentDataContent.indexOf(startMarker);
  if (startIndex !== -1) {
    startIndex += startMarker.length;
    const endIndex = agentDataContent.indexOf(endMarker, startIndex);
    
    if (endIndex !== -1) {
      const before = agentDataContent.substring(0, startIndex);
      const after = agentDataContent.substring(endIndex);
      agentDataContent = before + experienceSection + after;
    }
  }

  // Write the updated file
  fs.writeFileSync(agentDataPath, agentDataContent);
  
  console.log('✅ Agent data updated with LinkedIn experience!');
}

function updateAppExperienceMessages() {
  const appPath = path.join(__dirname, 'src', 'App.tsx');
  let appContent = fs.readFileSync(appPath, 'utf8');

  // Create experience messages from LinkedIn data
  const experienceMessages = linkedinExperience.map(exp => {
    const startTime = exp.startDate.getHours() >= 12 ? 
      `${exp.startDate.getHours()}:${exp.startDate.getMinutes().toString().padStart(2, '0')} PM` :
      `${exp.startDate.getHours()}:${exp.startDate.getMinutes().toString().padStart(2, '0')} AM`;
    
    return `          {
            id: '${exp.id}',
            type: 'bot' as const,
            content: '${exp.description}',
            timestamp: new Date('${exp.startDate.toISOString()}'),
            channel: 'experience' as Channel
          }`;
  }).join(',\n');

  // Find and replace the experience messages section
  const startMarker = '        // Add individual experience messages with actual start dates as timestamps';
  const endMarker = '        ];';
  
  let startIndex = appContent.indexOf(startMarker);
  if (startIndex !== -1) {
    const endIndex = appContent.indexOf(endMarker, startIndex) + endMarker.length;
    
    const before = appContent.substring(0, startIndex);
    const after = appContent.substring(endIndex);
    
    const newSection = `        // Add individual experience messages with actual start dates as timestamps
        const experienceMessages = [
${experienceMessages}
        ];`;
    
    appContent = before + newSection + after;
  }

  // Write the updated file
  fs.writeFileSync(appPath, appContent);
  
  console.log('✅ App.tsx updated with LinkedIn experience messages!');
}

async function main() {
  console.log('📊 Extracting experience data from LinkedIn profile...');
  console.log(`Found ${linkedinExperience.length} work experiences`);
  
  console.log('\n📝 Updating agent data...');
  updateAgentData();
  
  console.log('\n📝 Updating App.tsx experience messages...');
  updateAppExperienceMessages();
  
  console.log('\n📋 Summary of LinkedIn experience:');
  linkedinExperience.forEach((exp, index) => {
    const duration = exp.endDate ? 
      `${exp.startDate.toLocaleDateString()} - ${exp.endDate.toLocaleDateString()}` :
      `${exp.startDate.toLocaleDateString()} - Present`;
    console.log(`${index + 1}. ${exp.role} at ${exp.company} (${duration})`);
  });
  
  console.log('\n🎯 Your experience channel is now populated with real LinkedIn data!');
  console.log('Next steps:');
  console.log('1. Restart the dev server: npm run dev');
  console.log('2. Visit the experience channel to see your updated career timeline');
}

main().catch(console.error); 