import { SiteProfile, PhilosophyPillar, Project, ExperienceRecord } from '../context/SiteDataContext';

export const INITIAL_PROFILE: SiteProfile = {
  "name": "Vincent Yuan",
  "headline": "Crafting thoughtful digital experiences with algorithmic clarity.",
  "tagline": "Specializing in robust distributed web architecture.",
  "email": "vincentyuan1020@gmail.com",
  "github": "https://github.com/VincentYuann",
  "linkedin": "www.linkedin.com/in/yuanvincent",
  "role": "Software & Generative AI Engineer",
  "capability_pillars": [
    {
      "label": "SYSTEMS & TOOLS",
      "tags": [
        "Docker",
        "Supabase"
      ],
      "items": "Docker · Supabase"
    },
    {
      "label": "LANGUAGES",
      "tags": [
        "TypeScript",
        "Java",
        "JavaScript",
        "Python",
        "C"
      ],
      "items": "TypeScript · Java · JavaScript · Python · C"
    }
  ],
  "hanko_card": {
    "lines": [
      {
        "text": "簡潔な構造美",
        "label": "CLEAN ARCH",
        "tooltip": "Clean and intentional system structure"
      },
      {
        "text": "確固たる論理",
        "label": "SOLID LOGIC",
        "tooltip": "Disciplined and reliable full-stack logic"
      },
      {
        "text": "不断の研鑽",
        "label": "SHOKUNIN",
        "tooltip": "Continuous refinement and craftsmanship"
      }
    ],
    "headerLabel": "Drexel University, CS + MATH",
    "statusBadge": "OPEN TO ROLES · FULL-STACK",
    "stampCharacter": "原",
    "locationArchive": "PHILADELPHIA, PA"
  },
  "origin_story": {
    "badge": "ORIGIN & TRAJECTORY",
    "headline": "From Simple Code to Full-Stack Systems",
    "milestones": [
      {
        "era": "PHASE 01",
        "tag": "WEB ROOTS",
        "title": "First Code",
        "subtitle": "High School HTML & JS",
        "description": "Discovered coding in high school. Watching a few lines of JavaScript turn static pages into interactive ones sparked a lasting curiosity."
      },
      {
        "era": "PHASE 02",
        "tag": "SYSTEM MECHANICS",
        "title": "Game Loops",
        "subtitle": "Python & Pygame",
        "description": "Studied computer science in college and built 2D games with Python. Wrestling with game loops and physics built my core engineering intuition."
      },
      {
        "era": "PHASE 03",
        "tag": "DATA & APIS",
        "title": "Full-Stack Systems",
        "subtitle": "APIs & Databases",
        "description": "Real-world projects revealed what happens behind the screen: managing relational data, connecting APIs, and designing reliable data flows."
      },
      {
        "era": "PHASE 04",
        "tag": "USER FOCUS",
        "title": "Hospitality & Empathy",
        "subtitle": "Service to Software",
        "description": "Years in customer service taught me patience, clear communication, and how to anticipate user needs under pressure."
      }
    ],
    "leadParagraph": "My path into engineering started with simple curiosity: learning how code brings screens to life, building game mechanics from scratch, and carrying the lessons of customer service into software design."
  },
  "hobbies": [
    {
      "id": "anime-storytelling",
      "kanji": "鑑賞",
      "title": "Anime & Visual Storytelling",
      "images": [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBNUbl-6saHrZBnNOQEft_44ErmBzcNf2_3GgN4Xh2hxYnrVyHmx0Kz7DBGAQU30hv1C56hMzEkMbUvzMsgiiQJO5-JOSAYbf_MTlCsxqsG6oYp2JOG6zBceu8-bSXRVljpncu6N9vfbZ1ELq___5JJUl5KKRHtAYdMHHOco-rVkrLgjawbqtRYqfqTWnnGG7IsPoXWB1Y7Rep0IHev5pbIs2-M31bmqSw0CJhNHoyX_8cvun5BWnCorQ"
      ],
      "category": "Storytelling",
      "metadata": [
        {
          "label": "Favorite Genres",
          "value": "Shonen, Psychological, Sci-Fi"
        },
        {
          "label": "Focus",
          "value": "Narrative Depth & Sakuga"
        }
      ],
      "subtitle": "Character Arcs, World-Building & Sakuga Animation",
      "displayOrder": 1,
      "whyDescription": "Watching anime is a study in creative world-building, intricate lore structures, and emotional character arcs. Deconstructing how complex narratives resolve across hundreds of episodes inspires the intentionality and structural cohesion I bring to software architectures."
    },
    {
      "id": "gaming-mechanics",
      "kanji": "遊戯",
      "title": "Gaming & System Mechanics",
      "images": [
        "https://pqowefuwzxcrfzmnubvo.supabase.co/storage/v1/object/public/portfolio-assets/hobbies/1790050810397-win_20220904_20_11_17_pro.jpg",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA1W78vnIMUOZKe7hIAoZsWy9lJceC1GpqMkqCmJ0zjjhiQRCMfeO5ejXeEFDH10cv9VQ-v34kBBbp7myZGbKDV_4cTYbwZkD7my_EJIz0AaigAKuxHxLaqbPY3rz0uyQRh3VXovKJ0q8mi47qszpp4XFdiWdzRtPHfxCANH_mlPFejUqNlRNslttdcVZcNUKICTpcQjiwuDY__vaTUy4XZJu7pWzO6fZFAOcVs98n4WD37JYOW7sBiRA"
      ],
      "category": "Interactive",
      "metadata": [
        {
          "label": "Interests",
          "value": "Competitive RPGs & Strategy"
        },
        {
          "label": "Core Fascination",
          "value": "State Machines & Latency"
        }
      ],
      "subtitle": "Real-Time State, Tick Rates & Competitive Play",
      "displayOrder": 2,
      "whyDescription": "Games are the ultimate intersection of real-time mathematics, state synchronization, and low-latency feedback loops. Exploring game loops, hitbox collisions, and client-server prediction models keeps my understanding of distributed systems and interactive frontend performance razor-sharp."
    },
    {
      "id": "fitness-gym",
      "kanji": "鍛錬",
      "title": "Fitness & Gym Discipline",
      "images": [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBIQr3bTk3yvKCBXiAYi_kPdrzrSDIS4QJkYLWaCRKFOh_Iyvqgn2IkCe1PeeRqs_ScybEjUyNSBVPfSoqCDoXz-iTNgSOXxxNxKheHSrcnFQZE-bhBwH5mmkRJxXWbCWlus4MxGuYXevVL7oTqwrTcvbKPWwGtZj2VEYvaUrcisA4rRI0jgNhTBKtJgVQFJ86vzJ-h43U6tuThqzyw2TBz0s1ypULVS2GnMSJ5B4Q19cWnTVqag0yRHw"
      ],
      "category": "Physicality",
      "metadata": [
        {
          "label": "Routine",
          "value": "Hypertrophy & Strength Splits"
        },
        {
          "label": "Philosophy",
          "value": "Progressive Overload"
        }
      ],
      "subtitle": "Progressive Overload & Daily Physical Training",
      "displayOrder": 3,
      "whyDescription": "Engineering is intensely cognitive; the gym provides essential physical grounding. Progressive overload teaches that meaningful growth is cumulative, demanding daily discipline, proper form, and recovery. It provides the stamina and mental endurance required for deep focus."
    },
    {
      "id": "nasdaq-day-trading",
      "kanji": "相場",
      "title": "Nasdaq Day Trading & Market Flow",
      "images": [
        "https://pqowefuwzxcrfzmnubvo.supabase.co/storage/v1/object/public/portfolio-assets/hobbies/1789879932755-1000025280.jpg"
      ],
      "category": "Quantitative",
      "metadata": [
        {
          "label": "Markets",
          "value": "Nasdaq (QQQ / NQ)"
        },
        {
          "label": "Focus",
          "value": "Price Action & Risk Control"
        }
      ],
      "subtitle": "Order Flow, Volatility & Systematic Execution",
      "displayOrder": 4,
      "whyDescription": "Day trading the Nasdaq demands strict risk management, probability modeling, and unwavering psychological discipline under high volatility. It sharpens my ability to stay objective, manage downside risks, and execute deterministic strategies without hesitation."
    },
    {
      "id": "food-friends",
      "kanji": "美食",
      "title": "Food & Dining with Friends",
      "images": [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA2pdPd8CnVOnZYPBQsr47gzJPGBsD3Umny072KbSji2j8ByvSS5A2-4M5CKznNCanIim2LRBVzRaf_28DBhgqM1X1_fbkE3X7dghJAIkJb9tX9tr00QGf-THZVPfzovWMXnTtc0KxqMwgS1VytvsKGr5i21bjMvHx3rCqyCMRxI6qYe6EoxHRSKV8H68eVRi3jxO07zcRfBfovYmvVzqiFCBWzOxspiFqqJeStUOjb7KmxZ8gfXabqaA"
      ],
      "category": "Social",
      "metadata": [
        {
          "label": "Cuisines",
          "value": "Japanese, Ramen, Dim Sum"
        },
        {
          "label": "Ritual",
          "value": "Weekend Dinners with Friends"
        }
      ],
      "subtitle": "Shared Meals, Hospitality & Authentic Connection",
      "displayOrder": 5,
      "whyDescription": "Breaking bread with friends is where hospitality and genuine human connection flourish. Drawing from my background in the service industry, sharing great food and rich conversations grounds me in why we build software in the first place: to serve people and create shared joy."
    }
  ]
};

export const INITIAL_PILLARS: PhilosophyPillar[] = [
  {
    "position": 1,
    "kanji": "簡",
    "romaji": "KAN",
    "title": "Radical Simplicity",
    "tag": "PRAGMATIC DESIGN",
    "description": "Eliminate unnecessary abstraction. Write direct, maintainable code that solves problems clearly without over-engineering."
  },
  {
    "position": 2,
    "kanji": "利",
    "romaji": "RI",
    "title": "Smart Leverage & Tooling",
    "tag": "NO REINVENTED WHEELS",
    "description": "Use proven libraries, frameworks, and tools efficiently. Focus engineering effort on core product logic rather than writing custom implementations for commodity features."
  },
  {
    "position": 3,
    "kanji": "実",
    "romaji": "JITSU",
    "title": "Real-World Utility",
    "tag": "PRACTICAL IMPACT",
    "description": "Focus on building features that work dependably under real production constraints and genuinely serve the user's needs."
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    "id": "personal-portfolio",
    "title": "Personal Portfolio",
    "kanji": "創",
    "category": "React",
    "badge": "React",
    "subtitle": "Full stack",
    "description": "My digital home on the web, crafted with Japanese minimalism and powered by an AI copilot.",
    "image": "./images/sumi-os-workspace.webp",
    "tags": [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "FastAPI"
    ],
    "metrics": [],
    "overview": "My digital home on the web, crafted with Japanese minimalism and powered by an AI copilot.",
    "bullets": [
      "Engineered full-stack personal portfolio with React, TypeScript, and Tailwind CSS incorporating Japanese minimalist design aesthetics.",
      "Integrated Supabase backend for dynamic project, experience, and profile data management.",
      "Implemented interactive AI assistant copilot capable of answering portfolio queries and executing database updates."
    ],
    "startDate": "January 2025",
    "endDate": "Present",
    "isActive": true,
    "statusLabel": "ACTIVE / 稼働中",
    "links": {
      "github": "https://github.com/VincentYuann/portfolio",
      "live": "https://vincentyuan.dev",
      "caseStudyText": ""
    },
    "isFeatured": true,
    "displayOrder": 0
  },
  {
    "id": "anim-y",
    "title": "AnimY",
    "kanji": "智",
    "category": "React",
    "badge": "React",
    "subtitle": "Full stack",
    "description": "Anime discovery and tracking web app with advanced filter synchronization and caching.",
    "image": "https://pqowefuwzxcrfzmnubvo.supabase.co/storage/v1/object/public/portfolio-assets/projects/1790376122209-screenshot_2026-09-25_184142.png",
    "tags": [
      "React",
      "Express.js",
      "Supabase",
      "TanStack Query",
      "Vercel",
      "Render"
    ],
    "metrics": [],
    "overview": "Anime discovery and tracking web app with advanced filter synchronization and caching.",
    "bullets": [
      "Synced search-filter UI state with URL parameters as a single source of truth, enabling persistent, shareable filters and consistent data fetching across sessions.",
      "Engineered an Express.js cache-refresh layer that synchronized stale Supabase records with the Jikan API, reducing redundant external API calls by over 50% while respecting rate limits.",
      "Used TanStack Query for server-state caching to reduce unnecessary refetches and repeat navigation latency by approximately 300 ms.",
      "Implemented Supabase Auth and Row-Level Security (RLS) to secure user data and maintain persistent, personalized dashboard sessions."
    ],
    "startDate": "November 2025",
    "endDate": "April 2026",
    "isActive": false,
    "statusLabel": "COMPLETED / 完了",
    "links": {
      "github": "",
      "live": "",
      "caseStudyText": ""
    },
    "isFeatured": true,
    "displayOrder": 1
  },
  {
    "id": "food-finder",
    "title": "Food Finder",
    "kanji": "創",
    "category": "TypeScript",
    "badge": "TypeScript",
    "subtitle": "Full Stack",
    "description": "Created out of the real life struggle of deciding where to eat with friends, keeping group voting and chat frictionless.",
    "image": "https://pqowefuwzxcrfzmnubvo.supabase.co/storage/v1/object/public/portfolio-assets/projects/1790377460069-screenshot_2026-09-25_184439.png",
    "tags": [
      "TypeScript",
      "Prisma",
      "Socket.IO",
      "PostgreSQL",
      "Google Cloud Run",
      "Render"
    ],
    "metrics": [],
    "overview": "Created out of the real life struggle of deciding where to eat with friends, keeping group voting and chat frictionless.",
    "bullets": [
      "Built real-time lobby chat and restaurant voting with Socket.IO, synchronizing group decisions without page refreshes.",
      "Designed a relational PostgreSQL schema and RESTful API with Prisma to model users, lobbies, votes, and restaurant decisions.",
      "Implemented JWT-based authentication and bcrypt password hashing to secure user sessions and protect private user, lobby, and restaurant voting routes."
    ],
    "startDate": "July 2025",
    "endDate": "Present",
    "isActive": true,
    "statusLabel": "ACTIVE / 稼働中",
    "links": {
      "github": "",
      "live": "",
      "caseStudyText": ""
    },
    "isFeatured": true,
    "displayOrder": 2
  },
  {
    "id": "ascension",
    "title": "Ascension",
    "kanji": "昇",
    "category": "Python",
    "badge": "Python",
    "subtitle": "Game Development",
    "description": "A collaborative 2D platformer where my team and I poured heart into physics, animations, and custom collision loops.",
    "image": "https://pqowefuwzxcrfzmnubvo.supabase.co/storage/v1/object/public/portfolio-assets/projects/1790375975058-ending.jpg",
    "tags": [
      "Python",
      "Pygame",
      "Git",
      "GitLab",
      "Thonny"
    ],
    "metrics": [],
    "overview": "A collaborative 2D platformer where my team and I poured heart into physics, animations, and custom collision loops.",
    "bullets": [
      "Contributed to level design, gameplay mechanics, character animations, and sound integration for 2D platformer app.",
      "Applied object-oriented programming principles in Python and Pygame for modular code structure.",
      "Practiced Agile development with weekly sprint goals and Kanban task management.",
      "Utilized GitLab version control and maintained team documentation wiki."
    ],
    "startDate": "January 2025",
    "endDate": "June 2025",
    "isActive": false,
    "statusLabel": "COMPLETED / 完了",
    "links": {
      "github": "",
      "live": "",
      "caseStudyText": ""
    },
    "isFeatured": false,
    "displayOrder": 3
  },
  {
    "id": "bank-system",
    "title": "Bank System",
    "kanji": "基",
    "category": "Java",
    "badge": "Java",
    "subtitle": "OOP & QA testing",
    "description": "Put through the wringer with rigorous JUnit tests and mutation testing to ensure bulletproof financial logic.",
    "image": "https://pqowefuwzxcrfzmnubvo.supabase.co/storage/v1/object/public/portfolio-assets/projects/1790396148579-screenshot_2026-09-26_001536.png",
    "tags": [
      "Java",
      "JUnit",
      "Gradle",
      "GitLab CI",
      "PIT Mutation Testing"
    ],
    "metrics": [],
    "overview": "Put through the wringer with rigorous JUnit tests and mutation testing to ensure bulletproof financial logic.",
    "bullets": [
      "Developed a Java banking system through test-driven development, writing 150+ JUnit tests for account, validation, and command-processing logic.",
      "Achieved a 95% mutation-testing score with PIT, killing nearly all injected code mutants."
    ],
    "startDate": "June 2026",
    "endDate": "August 2026",
    "isActive": false,
    "statusLabel": "COMPLETED / 完了",
    "links": {
      "github": "",
      "live": "",
      "caseStudyText": ""
    },
    "isFeatured": false,
    "displayOrder": 4
  },
  {
    "id": "virtual-pet-machine",
    "title": "Virtual Pet Machine",
    "kanji": "智",
    "category": "HTML",
    "badge": "HTML",
    "subtitle": "Tranquility, HTML, CSS, Linux",
    "description": "An exploratory project connecting directly to university Linux servers via SSH to run finite state machine logic.",
    "image": "https://pqowefuwzxcrfzmnubvo.supabase.co/storage/v1/object/public/portfolio-assets/projects/1790375219587-screenshot_2026-09-25_182630.png",
    "tags": [
      "Tranquility",
      "HTML",
      "CSS",
      "Linux"
    ],
    "metrics": [],
    "overview": "An exploratory project connecting directly to university Linux servers via SSH to run finite state machine logic.",
    "bullets": [
      "Developed web-based virtual pet using finite state machine model responding to user interactions.",
      "Connected to university server via SSH for direct Linux terminal file management.",
      "Programmed nested and timed logic structures in Tranquility language for state transitions."
    ],
    "startDate": "December 2024",
    "endDate": "December 2024",
    "isActive": false,
    "statusLabel": "COMPLETED / 完了",
    "links": {
      "github": "",
      "live": "",
      "caseStudyText": ""
    },
    "isFeatured": false,
    "displayOrder": 5
  },
  {
    "id": "johns-farmer-market",
    "title": "John's Farmer Market",
    "kanji": "商",
    "category": "ENGINEERING ARCHIVE",
    "badge": "ENGINEERING ARCHIVE",
    "subtitle": "JavaScript, HTML, CSS, Replit",
    "description": "A fun team experiment simulating an online food market with user authentication and checkout flows.",
    "image": "https://pqowefuwzxcrfzmnubvo.supabase.co/storage/v1/object/public/portfolio-assets/projects/1790375483641-screenshot_2026-09-25_183111.png",
    "tags": [
      "JavaScript",
      "HTML",
      "CSS",
      "Replit"
    ],
    "metrics": [],
    "overview": "A fun team experiment simulating an online food market with user authentication and checkout flows.",
    "bullets": [
      "Built simulated online food market app on Replit with team members.",
      "Implemented JavaScript logic for static authentication and coupon validation.",
      "Designed frontend views using HTML and CSS."
    ],
    "startDate": "March 2023",
    "endDate": "April 2023",
    "isActive": false,
    "statusLabel": "COMPLETED / 完了",
    "links": {
      "github": "",
      "live": "",
      "caseStudyText": ""
    },
    "isFeatured": false,
    "displayOrder": 6
  }
];

export const INITIAL_EXPERIENCES: ExperienceRecord[] = [
  {
    "id": "1e28690a-1876-49d6-8d82-7bdb945116ff",
    "title": "Software Engineer",
    "company": "Dakdan Worldwide",
    "location": "Remote",
    "startDate": "September 2025",
    "endDate": "March 2026",
    "description": "Built a RAG-based website assistant using LlamaIndex, Qdrant, and Perplexity to classify user intent and route qualified inquiries to a lead-tracking dashboard. Developed Flask middleware for the Fanz backend to validate incoming request data, checking required fields, converting types, and rejecting malformed requests before they reached the database. Built a Jenkins CI pipeline triggered by GitHub push and pull-request webhooks, configuring the Jenkinsfile to automate dependency installation, linting, unit testing, and Docker image builds. Automated HR email prioritization and routing through n8n, reducing administrative bottlenecks by 40% and accelerating onboarding-related communication handling.",
    "overview": "Engineered RAG-based assistants, Flask middleware, CI/CD pipelines, and automated HR workflows.",
    "bullets": [
      "Built a RAG-based website assistant using LlamaIndex, Qdrant, and Perplexity to classify user intent and route qualified inquiries to a lead-tracking dashboard.",
      "Developed Flask middleware for the Fanz backend to validate incoming request data, checking required fields, converting types, and rejecting malformed requests before they reached the database.",
      "Built a Jenkins CI pipeline triggered by GitHub push and pull-request webhooks, configuring the Jenkinsfile to automate dependency installation, linting, unit testing, and Docker image builds.",
      "Automated HR email prioritization and routing through n8n, reducing administrative bottlenecks by 40% and accelerating onboarding-related communication handling."
    ],
    "tags": [
      "Python",
      "LlamaIndex",
      "Qdrant",
      "Flask",
      "Jenkins",
      "Docker",
      "n8n"
    ],
    "isActive": false,
    "statusLabel": "歴任 / COMPLETED",
    "logoUrl": "https://pqowefuwzxcrfzmnubvo.supabase.co/storage/v1/object/public/portfolio-assets/experience/1790619551411-1000025310.jpg",
    "kanji": "墨",
    "kanjiSubtitle": "ENG",
    "displayOrder": 0
  },
  {
    "id": "7ec6a4c7-c61c-44d5-966c-d87f9e59c80f",
    "title": "Server & Busser",
    "company": "Terakawa Ramen",
    "location": "Philadelphia, PA",
    "startDate": "Sep 2025",
    "endDate": "Dec 2025",
    "description": "Delivered attentive table service and managed concurrent seating for 7+ tables during peak dining hours, ensuring seamless order execution and guest satisfaction. Executed rapid bussing and table reset operations in a high-volume Kumamoto-style ramen environment, maximizing guest turnover and maintaining dining room cleanliness standards. Managed accurate point-of-sale cash and digital payment processing while coordinating floor logistics with kitchen and front-of-house staff.",
    "overview": "Delivered high-volume hospitality and floor management at Terakawa Ramen, a premier Philadelphia noodle house renowned for authentic Kumamoto Kyushu-style tonkotsu broth. Managed simultaneous table sections, coordinated rapid guest turnover, and executed bussing operations during peak service rushes.",
    "bullets": [
      "Delivered attentive table service and managed concurrent seating for 7+ tables during peak dining hours, ensuring seamless order execution and guest satisfaction.",
      "Executed rapid bussing and table reset operations in a high-volume Kumamoto-style ramen environment, maximizing guest turnover and maintaining dining room cleanliness standards.",
      "Managed accurate point-of-sale cash and digital payment processing while coordinating floor logistics with kitchen and front-of-house staff."
    ],
    "tags": [
      "Table Service",
      "Bussing & Floor Operations",
      "POS Management",
      "Customer Hospitality",
      "High-Volume Retail"
    ],
    "isActive": false,
    "statusLabel": "歴任 / COMPLETED",
    "logoUrl": "",
    "kanji": "麺",
    "kanjiSubtitle": "RAMEN",
    "displayOrder": 1
  },
  {
    "id": "0a191d1b-0849-4b25-b7e0-5c69febe9ca6",
    "title": "Barista & Cashier",
    "company": "Kung Fu Tea",
    "location": "Philadelphia, PA",
    "startDate": "August 2022",
    "endDate": "Present",
    "description": "Prepare and customize beverages ensuring quality standards Handle cash and card transactions using POS system Provide exceptional customer service and support inquiries",
    "overview": "Prepare handcrafted beverages, operate POS terminals, and uphold exceptional hospitality in a fast-paced retail environment.",
    "bullets": [
      "Prepare and customize beverages ensuring quality standards",
      "Handle cash and card transactions using POS system",
      "Provide exceptional customer service and support inquiries"
    ],
    "tags": [
      "Customer Service",
      "POS Operations",
      "Cash Handling",
      "Team Collaboration"
    ],
    "isActive": true,
    "statusLabel": "ACTIVE / 現職",
    "logoUrl": "",
    "kanji": "茶",
    "kanjiSubtitle": "TEA",
    "displayOrder": 2
  },
  {
    "id": "129d108c-5c3b-4c1e-b42f-3b856f92711f",
    "title": "Stocker",
    "company": "Hung Vuong Supermarket",
    "location": "Philadelphia, PA",
    "startDate": "June 2020",
    "endDate": "September 2020",
    "description": "Restocked products across shelves ensuring availability Assisted in warehouse operations including transport and organization Maintained clean, safe shopping environment adhering to safety standards",
    "overview": "Restocked products, assisted in warehouse inventory operations, and ensured a clean, safe shopping environment.",
    "bullets": [
      "Restocked products across shelves ensuring availability",
      "Assisted in warehouse operations including transport and organization",
      "Maintained clean, safe shopping environment adhering to safety standards"
    ],
    "tags": [
      "Inventory Management",
      "Logistics",
      "Safety Standards"
    ],
    "isActive": false,
    "statusLabel": "歴任 / COMPLETED",
    "logoUrl": "",
    "kanji": "庫",
    "kanjiSubtitle": "WHS",
    "displayOrder": 3
  }
];
