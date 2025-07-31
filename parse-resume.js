#!/usr/bin/env node

/**
 * Resume Parser for Polina.chat Agent
 * 
 * This script extracts information from PDF resumes and updates the agent data
 * 
 * Usage: node parse-resume.js [resume1.pdf] [resume2.pdf] ...
 */

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

console.log('📄 Polina.chat Resume Parser');
console.log('==============================\n');

// Function to extract information from resume text
function extractResumeInfo(text) {
  const info = {
    name: '',
    title: '',
    experience: [],
    skills: [],
    education: [],
    projects: [],
    achievements: []
  };

  // Clean and normalize text
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Extract name (usually at the top, first line with proper name format)
  const nameMatch = cleanText.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
  if (nameMatch) {
    info.name = nameMatch[1];
  }

  // Extract title/role (look for common patterns)
  const titlePatterns = [
    /(?:title|role|position|current)[:\s]+([^\n]+)/i,
    /([A-Z][a-z]+ (?:Manager|Engineer|Developer|Designer|Lead|Founder|Co-founder))/,
    /(?:AI|Product|Software|Data|UX|UI) [A-Z][a-z]+/
  ];

  for (const pattern of titlePatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      info.title = match[1] || match[0];
      break;
    }
  }

  // Extract experience with better pattern matching
  const experiencePatterns = [
    /(?:experience|work|employment|professional)[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][A-Z\s]+:|$)/gi,
    /([A-Z][a-z]+ [A-Z][a-z]+ – [A-Z][a-z]+)/g,
    /([A-Z][a-z]+ – [A-Z][a-z]+)/g
  ];

  experiencePatterns.forEach(pattern => {
    const matches = cleanText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const lines = match.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.match(/(?:senior|junior|lead|principal|staff|product|engineer|manager|director|ceo|cto|founder|co-founder|prototyper|designer)/i)) {
            info.experience.push(line.trim());
          }
        });
      });
    }
  });

  // Extract skills with multiple approaches
  const skillsPatterns = [
    /(?:skills|technologies|tools|competencies)[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][A-Z\s]+:|$)/gi,
    /(?:●|•|▪|▫|○|◦|‣|⁃|⁌|⁍|⁎|⁏|⁐|⁑|⁒|⁓|⁔|⁕|⁖|⁗|⁘|⁙|⁚|⁛|⁜|⁝|⁞)[\s]*([^\n]+)/g,
    /([A-Z][a-z]+(?: [A-Z][a-z]+)*)/g
  ];

  skillsPatterns.forEach(pattern => {
    const matches = cleanText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const skills = match.replace(/(?:skills|technologies|tools|competencies)[:\s]*\n/i, '').split(/[,•\n]/);
        skills.forEach(skill => {
          const cleanSkill = skill.trim();
          if (cleanSkill && cleanSkill.length > 2 && !cleanSkill.match(/^(●|•|▪|▫|○|◦|‣|⁃|⁌|⁍|⁎|⁏|⁐|⁑|⁒|⁓|⁔|⁕|⁖|⁗|⁘|⁙|⁚|⁛|⁜|⁝|⁞)/)) {
            info.skills.push(cleanSkill);
          }
        });
      });
    }
  });

  // Extract education
  const educationPatterns = [
    /(?:education|academic|degree)[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][A-Z\s]+:|$)/gi,
    /([A-Z][a-z]+ (?:University|College|School|Institute))/g,
    /((?:Bachelor|Master|PhD|BSc|MSc|MBA|MS|MA|BA|BS) [A-Z][a-z]+)/g
  ];

  educationPatterns.forEach(pattern => {
    const matches = cleanText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const lines = match.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.match(/(?:university|college|school|bachelor|master|phd|degree|institute)/i)) {
            info.education.push(line.trim());
          }
        });
      });
    }
  });

  // Extract projects with better detection
  const projectPatterns = [
    /(?:projects|portfolio|work)[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][A-Z\s]+:|$)/gi,
    /([A-Z][a-z]+(?: [A-Z][a-z]+)*: [A-Z][a-z]+)/g,
    /(?:developed|built|created|launched|designed|implemented)[\s]*([^\n]+)/gi
  ];

  projectPatterns.forEach(pattern => {
    const matches = cleanText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const lines = match.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.match(/(?:developed|built|created|launched|designed|implemented|prototyped|co-founded)/i)) {
            info.projects.push(line.trim());
          }
        });
      });
    }
  });

  // Extract achievements
  const achievementPatterns = [
    /(?:achievements|accomplishments|awards|highlights)[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][A-Z\s]+:|$)/gi,
    /(?:increased|improved|achieved|won|awarded|featured|reduced|grew|scaled)[\s]*([^\n]+)/gi
  ];

  achievementPatterns.forEach(pattern => {
    const matches = cleanText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const lines = match.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          if (line.match(/(?:increased|improved|achieved|won|awarded|featured|reduced|grew|scaled|launched|built)/i)) {
            info.achievements.push(line.trim());
          }
        });
      });
    }
  });

  // Additional processing for bullet points and structured content
  lines.forEach((line, index) => {
    // Look for bullet points with experience
    if (line.match(/^[●•▪▫○◦‣⁃⁌⁍⁎⁏⁐⁑⁒⁓⁔⁕⁖⁗⁘⁙⁚⁛⁜⁝⁞]/)) {
      const content = line.replace(/^[●•▪▫○◦‣⁃⁌⁍⁎⁏⁐⁑⁒⁓⁔⁕⁖⁗⁘⁙⁚⁛⁜⁝⁞]\s*/, '');
      if (content.match(/(?:product|engineer|manager|design|develop|build|create|launch)/i)) {
        info.projects.push(content);
      } else if (content.match(/(?:increased|improved|achieved|grew|reduced)/i)) {
        info.achievements.push(content);
      } else if (content.length > 10) {
        info.skills.push(content);
      }
    }
  });

  return info;
}

// Function to update agent data
function updateAgentData(resumeInfo) {
  const agentDataPath = path.join(__dirname, 'src', 'data', 'agent.ts');
  let agentDataContent = fs.readFileSync(agentDataPath, 'utf8');

  // Update name
  if (resumeInfo.name) {
    agentDataContent = agentDataContent.replace(
      /name: "Polina Kirillova"/,
      `name: "${resumeInfo.name}"`
    );
  }

  // Update title
  if (resumeInfo.title) {
    agentDataContent = agentDataContent.replace(
      /title: "Product Manager & AI Enthusiast"/,
      `title: "${resumeInfo.title}"`
    );
  }

  // Update experience
  if (resumeInfo.experience.length > 0) {
    const experienceSection = resumeInfo.experience.map(exp => `"${exp}"`).join(',\n      ');
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
  }

  // Update skills
  if (resumeInfo.skills.length > 0) {
    const skillsSection = resumeInfo.skills.map(skill => `"${skill}"`).join(',\n      ');
    const startMarker = 'skills: [';
    const endMarker = '],';
    
    let startIndex = agentDataContent.indexOf(startMarker);
    if (startIndex !== -1) {
      startIndex += startMarker.length;
      const endIndex = agentDataContent.indexOf(endMarker, startIndex);
      
      if (endIndex !== -1) {
        const before = agentDataContent.substring(0, startIndex);
        const after = agentDataContent.substring(endIndex);
        agentDataContent = before + skillsSection + after;
      }
    }
  }

  // Update education
  if (resumeInfo.education.length > 0) {
    const educationSection = resumeInfo.education.map(edu => `"${edu}"`).join(',\n      ');
    const startMarker = 'education: [';
    const endMarker = '],';
    
    let startIndex = agentDataContent.indexOf(startMarker);
    if (startIndex !== -1) {
      startIndex += startMarker.length;
      const endIndex = agentDataContent.indexOf(endMarker, startIndex);
      
      if (endIndex !== -1) {
        const before = agentDataContent.substring(0, startIndex);
        const after = agentDataContent.substring(endIndex);
        agentDataContent = before + educationSection + after;
      }
    }
  }

  // Update projects
  if (resumeInfo.projects.length > 0) {
    const projectsSection = resumeInfo.projects.map(proj => `"${proj}"`).join(',\n      ');
    const startMarker = 'projects: [';
    const endMarker = '],';
    
    let startIndex = agentDataContent.indexOf(startMarker);
    if (startIndex !== -1) {
      startIndex += startMarker.length;
      const endIndex = agentDataContent.indexOf(endMarker, startIndex);
      
      if (endIndex !== -1) {
        const before = agentDataContent.substring(0, startIndex);
        const after = agentDataContent.substring(endIndex);
        agentDataContent = before + projectsSection + after;
      }
    }
  }

  // Update achievements
  if (resumeInfo.achievements.length > 0) {
    const achievementsSection = resumeInfo.achievements.map(ach => `"${ach}"`).join(',\n      ');
    const startMarker = 'achievements: [';
    const endMarker = '],';
    
    let startIndex = agentDataContent.indexOf(startMarker);
    if (startIndex !== -1) {
      startIndex += startMarker.length;
      const endIndex = agentDataContent.indexOf(endMarker, startIndex);
      
      if (endIndex !== -1) {
        const before = agentDataContent.substring(0, startIndex);
        const after = agentDataContent.substring(endIndex);
        agentDataContent = before + achievementsSection + after;
      }
    }
  }

  // Write the updated file
  fs.writeFileSync(agentDataPath, agentDataContent);
  
  console.log('✅ Agent data updated with resume information!');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node parse-resume.js [resume1.pdf] [resume2.pdf] ...');
    console.log('\nExample: node parse-resume.js resume.pdf linkedin-resume.pdf');
    process.exit(1);
  }

  let allResumeInfo = {
    name: '',
    title: '',
    experience: [],
    skills: [],
    education: [],
    projects: [],
    achievements: []
  };

  for (const pdfFile of args) {
    if (!fs.existsSync(pdfFile)) {
      console.log(`❌ File not found: ${pdfFile}`);
      continue;
    }

    console.log(`📄 Processing: ${pdfFile}`);
    
    try {
      const dataBuffer = fs.readFileSync(pdfFile);
      const data = await pdfParse(dataBuffer);
      
      console.log(`📊 Extracted ${data.text.length} characters from ${pdfFile}`);
      
      const resumeInfo = extractResumeInfo(data.text);
      
      // Merge information from multiple resumes
      if (resumeInfo.name && !allResumeInfo.name) allResumeInfo.name = resumeInfo.name;
      if (resumeInfo.title && !allResumeInfo.title) allResumeInfo.title = resumeInfo.title;
      allResumeInfo.experience = [...new Set([...allResumeInfo.experience, ...resumeInfo.experience])];
      allResumeInfo.skills = [...new Set([...allResumeInfo.skills, ...resumeInfo.skills])];
      allResumeInfo.education = [...new Set([...allResumeInfo.education, ...resumeInfo.education])];
      allResumeInfo.projects = [...new Set([...allResumeInfo.projects, ...resumeInfo.projects])];
      allResumeInfo.achievements = [...new Set([...allResumeInfo.achievements, ...resumeInfo.achievements])];
      
      console.log(`✅ Processed: ${pdfFile}`);
      
    } catch (error) {
      console.log(`❌ Error processing ${pdfFile}: ${error.message}`);
    }
  }

  if (allResumeInfo.experience.length > 0 || allResumeInfo.skills.length > 0) {
    console.log('\n📝 Updating agent data...');
    updateAgentData(allResumeInfo);
    
    console.log('\n📋 Summary of extracted information:');
    if (allResumeInfo.name) console.log(`Name: ${allResumeInfo.name}`);
    if (allResumeInfo.title) console.log(`Title: ${allResumeInfo.title}`);
    console.log(`Experience items: ${allResumeInfo.experience.length}`);
    console.log(`Skills: ${allResumeInfo.skills.length}`);
    console.log(`Education: ${allResumeInfo.education.length}`);
    console.log(`Projects: ${allResumeInfo.projects.length}`);
    console.log(`Achievements: ${allResumeInfo.achievements.length}`);
    
    console.log('\n🎯 Your agent is now configured with your actual resume information!');
    console.log('Next steps:');
    console.log('1. Review the updated agent data in src/data/agent.ts');
    console.log('2. Add any missing information manually if needed');
    console.log('3. Test your agent with: npm run dev');
  } else {
    console.log('\n❌ No information could be extracted from the provided PDFs.');
    console.log('Please check that the PDFs contain readable text and try again.');
  }
}

main().catch(console.error); 