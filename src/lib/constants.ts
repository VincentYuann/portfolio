import React from 'react';
import type { AboutMenuItem } from '../context/SiteDataContext';

/**
 * Global fallback and asset paths
 */
export const DEFAULT_FALLBACK_IMAGES = {
  projectWorkspace: './images/sumi-os-workspace.webp',
  komorebiSpatial: './images/komorebi-spatial.webp',
  akariCommerce: './images/akari-commerce.webp',
  bambooArtDay: './images/bamboo-art-day.png',
  bambooArtNight: './images/bamboo-art-night.png',
  verticalBamboo: './images/sumie-tall-vertical-bamboo.webp',
} as const;

/**
 * Standard image onError handler to safely set fallback without infinite loop
 */
export function handleImageError(
  fallbackOrEvent?: string | React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = DEFAULT_FALLBACK_IMAGES.projectWorkspace
) {
  if (fallbackOrEvent && typeof fallbackOrEvent === 'object' && 'currentTarget' in fallbackOrEvent) {
    // Used directly as onError={handleImageError}
    const target = (fallbackOrEvent as React.SyntheticEvent<HTMLImageElement, Event>).currentTarget;
    if (target.src !== fallbackSrc && !target.src.endsWith(fallbackSrc.replace(/^\.\//, ''))) {
      target.src = fallbackSrc;
    }
    return;
  }
  const customFallback = typeof fallbackOrEvent === 'string' ? fallbackOrEvent : fallbackSrc;
  return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src !== customFallback && !target.src.endsWith(customFallback.replace(/^\.\//, ''))) {
      target.src = customFallback;
    }
  };
}

/**
 * Centralized Editorial About Menu Default Configuration
 */
export const DEFAULT_ABOUT_MENU: AboutMenuItem[] = [
  {
    id: 'education',
    title: 'Education',
    items: [
      'Drexel University · Math and Computer Science',
      'GPA: 3.52',
    ],
  },
  {
    id: 'about',
    title: 'About',
    items: [
      "Hi, my name is Vincent Yuan. I find coding interesting and fun, which is why I'm studying Computer Science. Coding expands into 2 industries I'm deeply passionate about:",
      'First is Software Engineering: when we code, we need to think about the product for customers and what problems it can solve. Being a SWE also means I build programs to solve everyday problems around me, from idea to implementation, and I find genuine enjoyment in that.',
      'Secondly, I want to get into game development.',
    ],
  },
  {
    id: 'achievement',
    title: "One Achievement I'm Proud Of",
    items: [
      "When I started stepping outside of tutorials, that's when I learned more. Copying tutorials step-by-step only brings me so far. Ever since I had my own idea, I could no longer follow along and had to complete the rest myself. With the help of AI as a personal mentor, I'm able to achieve far more than I was before.",
    ],
  },
  {
    id: 'vision',
    title: '5 Years From Now...',
    items: [
      'I want to be a full-stack engineer working on enterprise projects and solving problems that interact directly with customers. I see myself becoming a person who is really good at designing, connecting application components, and building robust distributed systems.',
    ],
  },
];

/**
 * Centralized LaTeX Curriculum Vitae Template
 */
export const DEFAULT_RESUME_LATEX = `%-------------------------
% Vincent Yuan - Professional Curriculum Vitae
% Full-Stack Software Engineering & Systems Architecture
%-------------------------

\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Vincent Yuan} \\\\ \\vspace{1pt}
    \\small Full-Stack Software Engineer $\\cdot$ Systems Architecture \\& AI $\\cdot$ Philadelphia, PA \\\\ \\vspace{1pt}
    \\href{mailto:vincentyuan1020@gmail.com}{\\underline{vincentyuan1020@gmail.com}} $|$ 
    \\href{https://github.com/VincentYuann}{\\underline{github.com/VincentYuann}} $|$
    \\href{https://linkedin.com}{\\underline{linkedin.com}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubheading
      {Drexel University -- College of Computing \\& Informatics}{Philadelphia, PA}
      {Bachelor of Science in Computer Science $|$ GPA: 3.69/4.0}{Anticipated Graduation: June 2029}
      \\resumeItemListStart
        \\resumeItem{Relevant Coursework: Computing \\& Informatics Design I--III, Computer Programming I \\& II, Calculus I--IV, Linear Algebra, Physics I \\& II}
      \\resumeItemListEnd

%-----------PROJECTS-----------
\\section{Projects}
  \\resumeProjectHeading
      {\\textbf{Ascension} $|$ \\emph{Python, Pygame, Git, GitLab, Thonny}}{Jan 2025 -- June 2025}
      \\resumeItemListStart
        \\resumeItem{Contribute to level design, gameplay mechanics, character animations, and sound integration for a 2D Foddian-style platformer developed by a team of four.}
        \\resumeItem{Apply object-oriented programming in Python and Pygame to encapsulate complex functionality, improve readability, and create reusable blueprints in the code design.}
        \\resumeItem{Practice Agile development by setting weekly goals, conducting team meetings to review progress, resolve challenges, and plan upcoming iterations.}
        \\resumeItem{Use GitLab for version control and collaboration, maintain a Kanban board for task management and a wiki page to document team progress.}
      \\resumeItemListEnd

  \\resumeProjectHeading
      {\\textbf{Virtual Pet Machine} $|$ \\emph{Tranquility, HTML, CSS, Linux}}{Dec 2024}
      \\resumeItemListStart
        \\resumeItem{Developed a web-based virtual pet using a finite state machine model that responds to user clicks with varied behaviors.}
        \\resumeItem{Used SSH to connect to Drexel's Tux server, performing file management and editing directly in the Linux terminal.}
        \\resumeItem{Programmed nested and timed logic structures in Tranquility to simulate complex pet state transitions.}
      \\resumeItemListEnd

  \\resumeProjectHeading
      {\\textbf{John's Farmer Market} $|$ \\emph{JavaScript, HTML, CSS, Replit}}{Mar 2023 -- Apr 2023}
      \\resumeItemListStart
        \\resumeItem{Developed a simulated online food market on Replit in a team of three, contributing to user login, checkout functionality, and coupon-based discounts.}
        \\resumeItem{Coded JavaScript logic for a static login system with preset credentials and limited coupon validation, triggering a UI transition upon successful authentication.}
        \\resumeItem{Structured and styled a visually appealing login interface using HTML and CSS.}
      \\resumeItemListEnd

  \\resumeProjectHeading
      {\\textbf{Card Game} $|$ \\emph{JavaScript, HTML, CSS, Replit}}{Dec 2022 -- Jan 2023}
      \\resumeItemListStart
        \\resumeItem{Created a narrative card game with branching story paths driven by player choices and conditional logic.}
        \\resumeItem{Programmed dynamic stat tracking (e.g., health, currency) and game-over conditions using JavaScript.}
        \\resumeItem{Designed intuitive UI elements to present story, cards, and decisions using HTML and CSS.}
      \\resumeItemListEnd

%-----------EXPERIENCE-----------
\\section{Work Experiences}
  \\resumeSubheading
      {Kung Fu Tea}{Philadelphia, PA}
      {Barista \\& Cashier}{Aug 2022 -- Present}
      \\resumeItemListStart
        \\resumeItem{Prepare and customize a variety of beverages while ensuring consistent and high-quality standards.}
        \\resumeItem{Handle cash and card transactions using POS system, managing high volume sales with accuracy.}
        \\resumeItem{Provide exceptional customer service by addressing inquiries and assisting with orders.}
      \\resumeItemListEnd

  \\resumeSubheading
      {Hung Vuong Supermarket}{Philadelphia, PA}
      {Stocker}{June 2020 -- Dec 2020}
      \\resumeItemListStart
        \\resumeItem{Maintained optimal on-shelf product availability across high-traffic aisles, rapidly replenishing stock during peak shopping periods with meticulous attention to detail.}
        \\resumeItem{Streamlined warehouse staging and backroom inventory operations by unloading incoming freight shipments, organizing pallet storage, and practicing strict FIFO rotation.}
        \\resumeItem{Upheld rigorous store safety, hazard prevention, and sanitation standards to maintain an organized, clean, and accessible shopping environment for hundreds of daily customers.}
      \\resumeItemListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Programming}{: Python, JavaScript, HTML, CSS, Tranquility (custom language)} \\\\
     \\textbf{Tools \\& Platforms}{: Git, GitLab, Pygame, Visual Studio Code, Replit, Thonny, Codio, CLI, Windows, Linux} \\\\
     \\textbf{Languages}{: Chinese (native), English (fluent)}
    }}
 \\end{itemize}

\\end{document}
`;
