#!/usr/bin/env node

/**
 * Update Agent Data Script
 * 
 * This script helps you update the agent data with your actual information
 * from your resume, LinkedIn, Twitter, and Instagram.
 * 
 * Usage: node update-agent.js
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 Polina.chat Agent Data Updater');
console.log('=====================================\n');

console.log('This script will help you update your agent data with your actual information.');
console.log('Please provide the following information:\n');

// Read the current agent data
const agentDataPath = path.join(__dirname, 'src', 'data', 'agent.ts');
let agentDataContent = fs.readFileSync(agentDataPath, 'utf8');

// Function to update specific sections
function updateSection(sectionName, newData, type = 'array') {
  const startMarker = `${sectionName}: [`;
  const endMarker = '],';
  
  let startIndex = agentDataContent.indexOf(startMarker);
  if (startIndex === -1) {
    console.log(`❌ Could not find ${sectionName} section`);
    return false;
  }
  
  startIndex += startMarker.length;
  const endIndex = agentDataContent.indexOf(endMarker, startIndex);
  
  if (endIndex === -1) {
    console.log(`❌ Could not find end of ${sectionName} section`);
    return false;
  }
  
  const before = agentDataContent.substring(0, startIndex);
  const after = agentDataContent.substring(endIndex);
  
  if (type === 'array') {
    agentDataContent = before + newData + after;
  } else {
    agentDataContent = before + newData + after;
  }
  
  console.log(`✅ Updated ${sectionName}`);
  return true;
}

// Function to update social media links
function updateSocialMedia(linkedin, twitter, instagram) {
  const socialMediaSection = `    socialMedia: {
      linkedin: "${linkedin || 'https://linkedin.com/in/polinakirillova'}",
      twitter: "${twitter || 'https://twitter.com/polinakirillova'}",
      instagram: "${instagram || 'https://instagram.com/polinakirillova'}"
    }`;
  
  const startMarker = '    socialMedia: {';
  const endMarker = '    }';
  
  let startIndex = agentDataContent.indexOf(startMarker);
  if (startIndex === -1) {
    console.log('❌ Could not find socialMedia section');
    return false;
  }
  
  const endIndex = agentDataContent.indexOf(endMarker, startIndex) + endMarker.length;
  
  const before = agentDataContent.substring(0, startIndex);
  const after = agentDataContent.substring(endIndex);
  
  agentDataContent = before + socialMediaSection + after;
  
  console.log('✅ Updated social media links');
  return true;
}

// Interactive prompts
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('📝 Let\'s update your agent data with your actual information!\n');
  
  // Get basic info
  const name = await askQuestion('Your name (default: Polina Kirillova): ') || 'Polina Kirillova';
  const title = await askQuestion('Your professional title (default: Product Manager & AI Enthusiast): ') || 'Product Manager & AI Enthusiast';
  const bio = await askQuestion('Your bio (default: I\'m passionate about building products...): ') || 'I\'m passionate about building products that make a real difference in people\'s lives. I love combining product strategy with AI innovation to create meaningful user experiences.';
  
  // Get social media links
  console.log('\n🔗 Social Media Links:');
  const linkedin = await askQuestion('LinkedIn URL (optional): ');
  const twitter = await askQuestion('Twitter URL (optional): ');
  const instagram = await askQuestion('Instagram URL (optional): ');
  
  // Get experience
  console.log('\n💼 Work Experience:');
  console.log('Enter your work experience (one per line, press Enter twice when done):');
  const experience = [];
  let exp = await askQuestion('Experience 1: ');
  while (exp) {
    experience.push(`"${exp}"`);
    exp = await askQuestion(`Experience ${experience.length + 1}: `);
  }
  
  // Get projects
  console.log('\n🚀 Projects:');
  console.log('Enter your projects (one per line, press Enter twice when done):');
  const projects = [];
  let proj = await askQuestion('Project 1: ');
  while (proj) {
    projects.push(`"${proj}"`);
    proj = await askQuestion(`Project ${projects.length + 1}: `);
  }
  
  // Get skills
  console.log('\n🛠️ Skills:');
  console.log('Enter your skills (one per line, press Enter twice when done):');
  const skills = [];
  let skill = await askQuestion('Skill 1: ');
  while (skill) {
    skills.push(`"${skill}"`);
    skill = await askQuestion(`Skill ${skills.length + 1}: `);
  }
  
  // Get education
  console.log('\n🎓 Education:');
  console.log('Enter your education (one per line, press Enter twice when done):');
  const education = [];
  let edu = await askQuestion('Education 1: ');
  while (edu) {
    education.push(`"${edu}"`);
    edu = await askQuestion(`Education ${education.length + 1}: `);
  }
  
  // Get achievements
  console.log('\n🏆 Achievements:');
  console.log('Enter your achievements (one per line, press Enter twice when done):');
  const achievements = [];
  let achievement = await askQuestion('Achievement 1: ');
  while (achievement) {
    achievements.push(`"${achievement}"`);
    achievement = await askQuestion(`Achievement ${achievements.length + 1}: `);
  }
  
  rl.close();
  
  // Update the agent data
  console.log('\n📝 Updating agent data...\n');
  
  // Update basic info
  agentDataContent = agentDataContent.replace(
    /name: "Polina Kirillova"/,
    `name: "${name}"`
  );
  
  agentDataContent = agentDataContent.replace(
    /title: "Product Manager & AI Enthusiast"/,
    `title: "${title}"`
  );
  
  agentDataContent = agentDataContent.replace(
    /bio: "I'm passionate about building products that make a real difference in people's lives\. I love combining product strategy with AI innovation to create meaningful user experiences\."/,
    `bio: "${bio}"`
  );
  
  // Update sections
  if (experience.length > 0) {
    updateSection('experience', experience.join(',\n      '));
  }
  
  if (projects.length > 0) {
    updateSection('projects', projects.join(',\n      '));
  }
  
  if (skills.length > 0) {
    updateSection('skills', skills.join(',\n      '));
  }
  
  if (education.length > 0) {
    updateSection('education', education.join(',\n      '));
  }
  
  if (achievements.length > 0) {
    updateSection('achievements', achievements.join(',\n      '));
  }
  
  // Update social media
  updateSocialMedia(linkedin, twitter, instagram);
  
  // Write the updated file
  fs.writeFileSync(agentDataPath, agentDataContent);
  
  console.log('\n✅ Agent data updated successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Review the updated agent data in src/data/agent.ts');
  console.log('2. Add any additional information manually if needed');
  console.log('3. Test your agent with: npm run dev');
  console.log('4. The agent will now only use your actual information');
  
  console.log('\n🎯 Your agent is now configured to work exclusively with your real experience!');
}

main().catch(console.error); 