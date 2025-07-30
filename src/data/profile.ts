export interface Project {
  id: string;
  name: string;
  summary: string;
  role: string;
  techStack: string[];
  outcomes: string[];
  links?: {
    github?: string;
    demo?: string;
    article?: string;
  };
  metrics?: {
    label: string;
    value: string;
    description: string;
  }[];
  media?: {
    type: 'video' | 'image';
    url: string;
    thumbnail?: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  category: 'PM' | 'AI' | 'Design' | 'Development' | 'Leadership';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  description: string;
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  education: Education[];
}

export const profileData: ProfileData = {
  name: "Polina Kirillova",
  title: "Product Manager & AI Enthusiast",
  bio: "Passionate about building products that make a difference. Combining product strategy with AI innovation to create meaningful user experiences.",
  avatar: "/avatar.jpg",
  
  experience: [
    {
      id: "exp-1",
      company: "TechCorp",
      role: "Senior Product Manager",
      duration: "2022 - Present",
      description: "Leading product strategy and execution for AI-powered features used by millions of users.",
      achievements: [
        "Increased user engagement by 40% through AI-driven personalization",
        "Launched 3 major features with 95% user satisfaction",
        "Managed a team of 8 engineers and designers"
      ],
      skills: ["Product Strategy", "AI/ML", "User Research", "Agile", "Data Analysis"]
    },
    {
      id: "exp-2",
      company: "StartupXYZ",
      role: "Product Manager",
      duration: "2020 - 2022",
      description: "Built and scaled products from 0 to 100K users in the fintech space.",
      achievements: [
        "Grew user base from 0 to 100K in 18 months",
        "Reduced customer churn by 25% through UX improvements",
        "Established product analytics framework"
      ],
      skills: ["Growth", "UX Design", "Analytics", "Stakeholder Management"]
    }
  ],
  
  skills: [
    {
      id: "skill-1",
      name: "Product Strategy",
      category: "PM",
      level: "Expert",
      description: "Defining product vision, roadmap, and go-to-market strategies"
    },
    {
      id: "skill-2",
      name: "User Research",
      category: "PM",
      level: "Advanced",
      description: "Conducting user interviews, surveys, and usability testing"
    },
    {
      id: "skill-3",
      name: "Machine Learning",
      category: "AI",
      level: "Intermediate",
      description: "Understanding ML models, data pipelines, and AI product integration"
    },
    {
      id: "skill-4",
      name: "UI/UX Design",
      category: "Design",
      level: "Advanced",
      description: "Creating user-centered designs and prototypes"
    },
    {
      id: "skill-5",
      name: "Data Analysis",
      category: "PM",
      level: "Advanced",
      description: "SQL, Python, and analytics tools for product insights"
    },
    {
      id: "skill-6",
      name: "Agile Leadership",
      category: "Leadership",
      level: "Expert",
      description: "Leading cross-functional teams using Agile methodologies"
    }
  ],
  
  projects: [
    {
      id: "project-1",
      name: "EatSipRepeat",
      summary: "AI-powered meal planning app that personalizes recipes based on dietary preferences and available ingredients.",
      role: "Product Manager & Co-founder",
      techStack: ["React", "Node.js", "OpenAI API", "PostgreSQL", "AWS"],
      outcomes: [
        "10K+ active users within 6 months",
        "40% increase in user engagement",
        "Featured in TechCrunch and Product Hunt"
      ],
      links: {
        github: "https://github.com/polina/eatsiprepeat",
        demo: "https://eatsiprepeat.com",
        article: "https://medium.com/@polina/building-an-ai-meal-planner"
      },
      metrics: [
        {
          label: "User Growth",
          value: "10K+",
          description: "Active users in 6 months"
        },
        {
          label: "Engagement",
          value: "40%",
          description: "Increase in daily active users"
        }
      ]
    },
    {
      id: "project-2",
      name: "SmartBudget",
      summary: "Intelligent expense tracking app that categorizes transactions and provides personalized financial insights.",
      role: "Product Manager",
      techStack: ["React Native", "Python", "TensorFlow", "Firebase", "Stripe"],
      outcomes: [
        "50K+ downloads on App Store",
        "4.8/5 star rating",
        "Partnership with major banks"
      ],
      links: {
        demo: "https://smartbudget.app"
      },
      metrics: [
        {
          label: "Downloads",
          value: "50K+",
          description: "App Store downloads"
        },
        {
          label: "Rating",
          value: "4.8/5",
          description: "App Store rating"
        }
      ]
    },
    {
      id: "project-3",
      name: "TeamSync",
      summary: "Collaboration platform that uses AI to optimize team workflows and communication patterns.",
      role: "Lead Product Manager",
      techStack: ["Vue.js", "Django", "NLP", "Redis", "Docker"],
      outcomes: [
        "Used by 500+ teams",
        "30% improvement in team productivity",
        "Acquired by larger tech company"
      ],
      links: {
        github: "https://github.com/polina/teamsync"
      },
      metrics: [
        {
          label: "Teams",
          value: "500+",
          description: "Active teams using platform"
        },
        {
          label: "Productivity",
          value: "30%",
          description: "Improvement in team efficiency"
        }
      ]
    }
  ],
  
  education: [
    {
      id: "edu-1",
      institution: "Stanford University",
      degree: "Master of Science",
      field: "Computer Science",
      duration: "2018 - 2020",
      description: "Specialized in Artificial Intelligence and Human-Computer Interaction. Thesis on AI-powered product design."
    },
    {
      id: "edu-2",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Business Administration",
      duration: "2014 - 2018",
      description: "Double major in Business and Computer Science. Graduated with honors."
    }
  ]
}; 