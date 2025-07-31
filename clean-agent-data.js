#!/usr/bin/env node

/**
 * Clean Agent Data Script
 * 
 * This script cleans and organizes the extracted agent data
 * by removing duplicates, improving formatting, and organizing content
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Polina.chat Agent Data Cleaner');
console.log('==================================\n');

function cleanAgentData() {
  const agentDataPath = path.join(__dirname, 'src', 'data', 'agent.ts');
  let agentDataContent = fs.readFileSync(agentDataPath, 'utf8');

  // Clean experience section
  const experienceSection = `experience: [
      "Closure – Co-founder, Prototyper & Product Lead",
      "Eat Sip Repeat – Founder, Builder of Fake-Real Things",
      "Paxful – Product Manager"
    ]`;

  // Clean skills section - organize by category
  const skillsSection = `skills: [
      "Product Strategy & Roadmap Development",
      "AI/ML Product Integration",
      "User Research & UX Design",
      "Agile & Lean Methodologies",
      "Data Analysis & Metrics",
      "Stakeholder Management",
      "Team Leadership & Mentoring",
      "Growth & Scaling Strategies",
      "Prototyping & UX",
      "SwiftUI",
      "Figma",
      "n8n",
      "Firebase",
      "REST/Webhooks",
      "Amplitude",
      "OpenAI APIs",
      "GPT-4 / Claude",
      "Prompt Engineering",
      "Python",
      "Function Calling",
      "Agent Workflows",
      "Slack Bots",
      "Notion Automations",
      "Design Feedback Loops",
      "UX Copy Tweaking",
      "Human-AI Interaction Experiments",
      "JavaScript/TypeScript",
      "Airtable"
    ]`;

  // Clean projects section
  const projectsSection = `projects: [
      "Eat Sip Repeat: AI menu planner with GPT tagging, prompt tuning, and data optimization",
      "Roadmap Whisperer: GPT + n8n prototype that pushes roadmap updates",
      "Multiple daily-life automations (LinkedIn comments generator, training plan builder, bedtime story generator)",
      "Agentic LLM flows that simulate emotional support conversations",
      "LLM-based safety checks to simulate model guardrails without full infrastructure",
      "Simple evaluation frameworks for self-harm and crisis detection",
      "Tagging pipeline with GPT + Python for structured metadata",
      "GPT + Slack bot that mimics internal communications",
      "Browser automations with n8n, Airtable, and LLMs for internal workflows",
      "NLP-based chatbots for telco, finance, and e-commerce clients with 95%+ accuracy",
      "SwiftUI, GPT-4 APIs, and Firebase MVP from scratch",
      "Production-grade CRUD using Firebase backend and SwiftUI front-end",
      "Prototyped and tested billing flows with engineers using lo-fi methods",
      "Partnered with design to rework UI using user feedback and NPS loops",
      "Collaborated with enterprise partners and engineering to collect feedback and refine bot"
    ]`;

  // Clean achievements section
  const achievementsSection = `achievements: [
      "Shipped full production-grade CRUD using Firebase backend and SwiftUI front-end",
      "Launched NLP-based chatbots for telco, finance, and e-commerce clients with 95%+ accuracy"
    ]`;

  // Update the sections in the file
  const sections = [
    { name: 'experience', content: experienceSection },
    { name: 'skills', content: skillsSection },
    { name: 'projects', content: projectsSection },
    { name: 'achievements', content: achievementsSection }
  ];

  sections.forEach(section => {
    const startMarker = `${section.name}: [`;
    const endMarker = '],';
    
    let startIndex = agentDataContent.indexOf(startMarker);
    if (startIndex !== -1) {
      startIndex += startMarker.length;
      const endIndex = agentDataContent.indexOf(endMarker, startIndex);
      
      if (endIndex !== -1) {
        const before = agentDataContent.substring(0, startIndex);
        const after = agentDataContent.substring(endIndex);
        agentDataContent = before + section.content.replace(`${section.name}: [`, '') + after;
      }
    }
  });

  // Write the cleaned file
  fs.writeFileSync(agentDataPath, agentDataContent);
  
  console.log('✅ Agent data cleaned and organized!');
  console.log('\n📋 Summary of cleaned data:');
  console.log('- Experience: 3 items');
  console.log('- Skills: 28 items (organized by category)');
  console.log('- Projects: 15 items (formatted descriptions)');
  console.log('- Achievements: 2 items');
  
  console.log('\n🎯 Your agent now has clean, organized data from your resume!');
}

cleanAgentData(); 