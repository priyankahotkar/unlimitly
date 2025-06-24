import React from "react";

const PHASES = [
  {
    title: "Phase 1: Prerequisites – Core Web Foundations",
    steps: [
      {
        subtitle: "1. Learn HTML, CSS, JavaScript (Vanilla)",
        resources: [
          { label: "HTML/CSS Crash Course – freeCodeCamp", url: "https://www.freecodecamp.org/learn/" },
          { label: "JavaScript Basics – JavaScript.info", url: "https://javascript.info/" },
          { label: "Web Dev Bootcamp – freeCodeCamp Full Course", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg" },
        ],
        projects: [
          "Build a personal portfolio site",
          "Create a to-do list using localStorage",
          "Make a calculator app",
        ],
      },
    ],
  },
  {
    title: "Phase 2: Git & GitHub",
    steps: [
      {
        subtitle: "2. Learn Git Version Control",
        resources: [
          { label: "Git Handbook – GitHub Docs", url: "https://docs.github.com/en/get-started/using-git" },
          { label: "Git & GitHub Tutorial – freeCodeCamp YouTube", url: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
        ],
        downloads: [
          { label: "Git Official Download", url: "https://git-scm.com/downloads" },
        ],
        projects: [
          "Create a GitHub repository for your to-do list",
          "Use branches to manage features",
        ],
      },
    ],
  },
  {
    title: "Phase 3: JavaScript Deep Dive (ES6+)",
    steps: [
      {
        subtitle: "3. Learn Modern JavaScript Concepts",
        concepts: [
          "Arrow functions",
          "Destructuring",
          "Promises & async/await",
          "Closures, scopes, hoisting",
        ],
        resources: [
          { label: "Modern JavaScript – JavaScript.info", url: "https://javascript.info/" },
          { label: "ES6 Guide – MDN Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
        ],
        projects: [
          "Create a weather app using any public API (like OpenWeatherMap)",
        ],
      },
    ],
  },
  {
    title: "Phase 4: Frontend – React.js",
    steps: [
      {
        subtitle: "4. Learn React (Functional Components + Hooks)",
        concepts: [
          "JSX, Props, State",
          "useEffect, useState, useContext",
          "React Router",
        ],
        resources: [
          { label: "React Docs – react.dev", url: "https://react.dev/learn" },
          { label: "React Course (2023) – freeCodeCamp", url: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
          { label: "React Router – reactrouter.com", url: "https://reactrouter.com/en/main" },
        ],
        projects: [
          "Build a multi-page website with React Router",
          "Create a movie search app using TMDB API",
        ],
      },
    ],
  },
  {
    title: "Phase 5: Backend – Node.js & Express.js",
    steps: [
      {
        subtitle: "5. Learn Node.js & Express Basics",
        concepts: [
          "HTTP module, REST APIs",
          "Middleware, Routing, CRUD",
          "Error Handling",
        ],
        resources: [
          { label: "Node.js + Express – MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs" },
          { label: "Backend Dev Crash Course – freeCodeCamp YouTube", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
        ],
        downloads: [
          { label: "Node.js Official Download", url: "https://nodejs.org/" },
        ],
        projects: [
          "Create an API for a notes app",
          "Build a simple blog backend with Express",
        ],
      },
    ],
  },
  {
    title: "Phase 6: Database – MongoDB",
    steps: [
      {
        subtitle: "6. Learn MongoDB Basics",
        concepts: [
          "Collections, Documents",
          "CRUD operations",
          "Mongo Shell & Compass",
        ],
        resources: [
          { label: "MongoDB Basics – MongoDB University (Free)", url: "https://learn.mongodb.com/" },
          { label: "MongoDB Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=-56x56UppqQ" },
        ],
        downloads: [
          { label: "MongoDB Community Server", url: "https://www.mongodb.com/try/download/community" },
          { label: "MongoDB Compass GUI", url: "https://www.mongodb.com/products/compass" },
        ],
        projects: [
          "Extend your blog or notes app with MongoDB",
          "Build a book inventory backend",
        ],
      },
    ],
  },
  {
    title: "Phase 7: Full MERN Integration",
    steps: [
      {
        subtitle: "7. Connect Frontend to Backend",
        concepts: [
          "Axios / Fetch API for requests",
          "Connect React frontend with Express backend",
          "Use CORS properly",
          "Use .env for environment variables",
        ],
        resources: [
          { label: "MERN Stack Crash Course – freeCodeCamp YouTube", url: "https://www.youtube.com/watch?v=7CqJlxBYj-M" },
          { label: "Full MERN Setup Guide – freeCodeCamp Guide", url: "https://www.freecodecamp.org/news/mern-stack-tutorial/" },
        ],
        projects: [
          "Build a contact manager",
          "Create a blog where users can add/edit/delete posts",
        ],
      },
    ],
  },
  {
    title: "Phase 8: Authentication & Authorization",
    steps: [
      {
        subtitle: "8. Add User Auth (JWT + bcrypt + Role-based access)",
        concepts: [
          "Registration/Login APIs",
          "Store token in localStorage",
          "Protect frontend routes",
        ],
        resources: [
          { label: "JWT Auth with MERN – freeCodeCamp YouTube", url: "https://www.youtube.com/watch?v=mbsmsi7l3r4" },
          { label: "Auth Guide – Traversy Media", url: "https://www.youtube.com/watch?v=2jqok-WgelI" },
        ],
        projects: [
          "Create a user dashboard app",
          "Add login/signup to your blog",
        ],
      },
    ],
  },
  {
    title: "Phase 9: Advanced Topics",
    steps: [
      {
        subtitle: "9. Learn:",
        concepts: [
          "React Context API / Redux Toolkit",
          "MongoDB Aggregation",
          "MVC Folder Structure",
          "File Uploads with Multer",
          "Email Sending via NodeMailer",
        ],
        resources: [
          { label: "Redux Toolkit – Redux Docs", url: "https://redux-toolkit.js.org/" },
          { label: "NodeMailer – Official Docs", url: "https://nodemailer.com/about/" },
          { label: "File Upload Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=GGo3MVBFr1A" },
        ],
        projects: [
          "Admin dashboard with analytics",
          "Portfolio builder app",
        ],
      },
    ],
  },
  {
    title: "Phase 10: Deployment",
    steps: [
      {
        subtitle: "10. Host on Cloud Platforms",
        concepts: [
          "Host backend on Render or Railway",
          "Host frontend on Netlify or Vercel",
          "Use MongoDB Atlas for cloud DB",
        ],
        resources: [
          { label: "MongoDB Atlas – atlas.mongodb.com", url: "https://www.mongodb.com/cloud/atlas" },
          { label: "Deploy MERN App – freeCodeCamp Guide", url: "https://www.freecodecamp.org/news/deploy-a-mern-app-on-heroku/" },
        ],
        projects: [
          "Deploy your blog with login",
          "Create a resume generator and share live link",
        ],
      },
    ],
  },
  {
    title: "Bonus: GitHub Workflow & Resume Booster",
    steps: [
      {
        subtitle: "11. Learn:",
        concepts: [
          "GitHub README formatting",
          "Contribution graph optimization",
          "Creating GitHub Pages",
          "Writing clean commits & branching strategy",
        ],
        resources: [
          { label: "GitHub README Guide – Markdown Cheatsheet", url: "https://www.markdownguide.org/cheat-sheet/" },
          { label: "Contributing to Open Source – First Contributions", url: "https://firstcontributions.github.io/" },
        ],
      },
    ],
  },
];

export default function FullStackRoadmap() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f6fb] to-white py-10 px-2 md:px-0 font-sans">
      <div className="max-w-4xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-8 border border-blue-100">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800 tracking-tight" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
          MERN Stack Developer Roadmap (Beginner to Job-Ready)
        </h1>
        <div className="flex flex-col gap-10">
          {PHASES.map((phase, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-6 top-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
              {/* Vertical Line */}
              {idx !== PHASES.length - 1 && (
                <div className="absolute -left-4 top-10 h-full w-1 bg-gradient-to-b from-blue-200 to-purple-200 z-0"></div>
              )}
              <div className="mb-2 bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-400 hover:shadow-2xl transition-shadow duration-300">
                <h2 className="text-2xl font-bold mb-2 text-blue-900 group-hover:text-purple-700 transition-colors duration-200" style={{ fontFamily: 'Times New Roman, Times, serif' }}>{phase.title}</h2>
                {phase.steps.map((step, sidx) => (
                  <div key={sidx} className="mb-4">
                    <h3 className="text-lg font-semibold mb-1 text-blue-800" style={{ fontFamily: 'Times New Roman, Times, serif' }}>{step.subtitle}</h3>
                    {'concepts' in step && Array.isArray((step as any).concepts) && (
                      <ul className="list-disc ml-6 mb-2 text-gray-700">
                        {(step as any).concepts.map((c: string, i: number) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    )}
                    {'resources' in step && Array.isArray((step as any).resources) && (
                      <div className="mb-2">
                        <span className="font-semibold text-blue-700">Best Free Resources:</span>
                        <ul className="list-disc ml-6">
                          {(step as any).resources.map((r: { label: string; url: string }, i: number) => (
                            <li key={i}>
                              <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-purple-700 font-medium transition-colors duration-200">{r.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {'downloads' in step && Array.isArray((step as any).downloads) && (
                      <div className="mb-2">
                        <span className="font-semibold text-blue-700">Official Download Links:</span>
                        <ul className="list-disc ml-6">
                          {(step as any).downloads.map((d: { label: string; url: string }, i: number) => (
                            <li key={i}>
                              <a href={d.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-purple-700 font-medium transition-colors duration-200">{d.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {'projects' in step && Array.isArray((step as any).projects) && (
                      <div className="mb-2">
                        <span className="font-semibold text-blue-700">Project Ideas:</span>
                        <ul className="list-disc ml-6">
                          {(step as any).projects.map((p: string, i: number) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 