import React from "react";
import { Compass, Linkedin, Mail, ExternalLink, ArrowUpRight, Laptop, Terminal, Github, Zap, Code, Download, MonitorSmartphone } from "lucide-react";

const AITOOLS = [
  {
    name: "Bolt",
    url: "https://www.bolt.new",
    desc: "Generates frontend interfaces from natural language prompts and connects to backend of Supabase",
    badge: "Frontend",
    style: "dark",
    button: { label: "Try Bolt", url: "https://www.bolt.new" },
    font: "font-mono",
  },
  {
    name: "Lovable",
    url: "https://lovable.dev",
    desc: "Generates frontend interfaces from natural language prompts.",
    badge: "Branding",
    style: "pastel",
    button: { label: "Try Lovable", url: "https://lovable.dev" },
    font: "font-sans",
  },
  {
    name: "same.new",
    url: "https://same.new",
    desc: "Rapid UI copying and functional app cloning via prompt-based interface.",
    badge: "UI Clone",
    style: "minimal",
    button: { label: "Live Demo", url: "https://same.new" },
    font: "font-sans",
  },
  {
    name: "Cursor",
    url: "https://www.cursor.so",
    desc: "AI-powered VSCode-like editor with contextual suggestions and inline chat.",
    badge: "Editor",
    style: "editor",
    button: { label: "Install Cursor", url: "https://www.cursor.so/download" },
    font: "font-mono",
    // screenshot: "/public/cursor-editor-mockup.png", // Placeholder, replace with actual asset if available
  },
  {
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    desc: "Autocompletes code in real-time inside your IDE.",
    badge: "AI Code",
    style: "copilot",
    button: { label: "Copilot for VSCode", url: "https://marketplace.visualstudio.com/items?itemName=GitHub.copilot" },
    font: "font-mono",
  },
  {
    name: "Windsurf",
    url: "https://windsurf.ai",
    desc: "AI to generate TailwindCSS UI components from natural language.",
    badge: "Tailwind",
    style: "twocol",
    button: null,
    font: "font-mono",
  },
];

const DEPLOY = [
  {
    name: "Vercel",
    url: "https://vercel.com",
    desc: "Frontend Hosting (React, Next.js, HTML/CSS projects)",
    features: ["CI/CD from GitHub", "Free SSL", "Preview deployments"],
    badge: "Frontend",
    style: "light",
    logo: "./vercel-logo.png", // Placeholder, replace with actual asset if available
    button: { label: "Deploy", url: "https://vercel.com" },
  },
  {
    name: "Render",
    url: "https://render.com",
    desc: "Backend & Full-stack deployments (Node.js, Python, PostgreSQL)",
    features: ["Cron jobs", "Auto redeploy", "Free database tiers"],
    badge: "Backend",
    style: "terminal",
    logo: "./render-logo.png", // Placeholder
    button: { label: "Go to Render", url: "https://render.com" },
  },
  {
    name: "Firebase",
    url: "https://firebase.google.com",
    desc: "Backend-as-a-Service (BaaS) for full apps",
    features: ["Authentication", "Hosting", "Cloud functions", "Firestore/Realtime DB"],
    badge: "BaaS",
    style: "grid",
    logo: "./firebase-logo.png", // Placeholder
    button: { label: "Visit Firebase", url: "https://firebase.google.com" },
  },
];

const badgeClass =
  "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mr-2 mb-2 border border-blue-100";

export default function AIAndDeployment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white px-2 md:px-0 font-sans">
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">AI Tools + Free Deployment Platforms</h1>
        <p className="text-lg text-slate-600 mb-8">A curated list of AI-powered developer tools and free hosting platforms for modern web projects.</p>

        {/* Section 1: AI Tools */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-500" /> AI Tools for Developers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AITOOLS.map((tool, i) => (
              <div
                key={tool.name}
                className={
                  `rounded-xl shadow-lg border border-slate-100 p-6 flex flex-col justify-between transition hover:shadow-2xl group ` +
                  (tool.style === "dark"
                    ? "bg-slate-900 text-white "
                    : tool.style === "pastel"
                    ? "bg-gradient-to-br from-pink-100 to-blue-50 text-slate-800 "
                    : tool.style === "minimal"
                    ? "bg-white text-slate-900 "
                    : tool.style === "editor"
                    ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white "
                    : tool.style === "copilot"
                    ? "bg-white text-slate-900 border-2 border-blue-100 "
                    : tool.style === "twocol"
                    ? "bg-gradient-to-r from-slate-50 to-blue-50 text-slate-900 flex-row"
                    : "bg-white text-slate-900 ")
                }
                style={tool.style === "twocol" ? { display: 'flex', alignItems: 'stretch' } : {}}
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={badgeClass}>{tool.badge}</span>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium">
                      {tool.name} <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                  <h3 className={`text-xl font-bold mb-1 ${tool.font}`}>{tool.name}</h3>
                  <p className="mb-3 text-sm text-slate-500 group-hover:text-slate-700 transition-colors">{tool.desc}</p>
                  {tool.name === "Cursor" && (
                    <div className="my-3 flex justify-center">
                      <div className="bg-slate-700 rounded-lg p-2 shadow-lg w-64 h-36 flex items-center justify-center">
                        <Laptop className="w-16 h-16 text-slate-300" />
                        {/* Replace with screenshot if available */}
                      </div>
                    </div>
                  )}
                  {tool.name === "Windsurf" && (
                    <div className="flex flex-col md:flex-row gap-4 mt-3">
                      <div className="flex-1 bg-slate-100 rounded-lg p-3 text-xs font-mono">Prompt: <span className="text-blue-700">"Generate a login form with TailwindCSS"</span></div>
                      <div className="flex-1 bg-white rounded-lg p-3 text-xs font-mono border border-slate-200">&lt;form className="..."&gt;...&lt;/form&gt;</div>
                    </div>
                  )}
                  {tool.name === "same.new" && (
                    <div className="flex flex-col items-center my-3">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-3 w-full text-center">
                        <span className="text-sm font-semibold text-blue-700">Copy any UI instantly!</span>
                        <div className="mt-2 text-xs text-slate-600">Paste a URL or describe a UI, and get a working clone in seconds.</div>
                      </div>
                    </div>
                  )}
                </div>
                {tool.button && (
                  <a
                    href={tool.button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      "mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow bg-blue-600 text-white hover:bg-blue-700 transition " +
                      (tool.style === "dark" || tool.style === "editor" ? "bg-blue-500 hover:bg-blue-600" : "")
                    }
                  >
                    {tool.button.label} <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Free Deployment Platforms */}
        <section>
          <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
            <MonitorSmartphone className="w-6 h-6 text-purple-500" /> Free Deployment Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DEPLOY.map((platform) => (
              <div
                key={platform.name}
                className={
                  "rounded-xl shadow-lg border border-slate-100 p-6 flex flex-col justify-between transition hover:shadow-2xl group " +
                  (platform.style === "light"
                    ? "bg-white text-slate-900 "
                    : platform.style === "terminal"
                    ? "bg-slate-900 text-green-200 font-mono "
                    : platform.style === "grid"
                    ? "bg-gradient-to-br from-yellow-50 to-white text-slate-900 "
                    : "bg-white text-slate-900 ")
                }
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={badgeClass}>{platform.badge}</span>
                  <a href={platform.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium">
                    {platform.name} <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  {platform.logo && <img src={platform.logo} alt={platform.name + " logo"} className="w-6 h-6 inline" />} {platform.name}
                </h3>
                <p className="mb-2 text-sm text-slate-500 group-hover:text-slate-700 transition-colors">{platform.desc}</p>
                <ul className="mb-3 text-xs text-slate-700 list-disc ml-5">
                  {platform.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                {platform.button && (
                  <a
                    href={platform.button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow bg-purple-600 text-white hover:bg-purple-700 transition"
                  >
                    {platform.button.label} <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">MentorConnect</span>
                  <p className="text-sm text-gray-400">Professional Mentorship Platform</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Connect, learn, and grow with expert mentorship. Our comprehensive platform provides everything you need for career development and professional networking.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/priyankahotkar" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="http://www.linkedin.com/in/priyanka-hotkar-3a667a259" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="mailto:priyankahotkar4@gmail.com?subject=Hello%20Priyanka&body=I%20saw%20your%20website..." className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/users" className="hover:text-white transition-colors">Mentors</a></li>
                <li><a href="/study-materials" className="hover:text-white transition-colors">Study Materials</a></li>
                <li><a href="/discussion-forum" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact-us" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MentorConnect. All rights reserved. Built with ❤️ for the developer community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 