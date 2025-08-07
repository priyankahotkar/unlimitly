import React from "react";
import { Github, Linkedin, Mail, BookOpen, UserPlus, Settings, Link2, Users, KeyRound, FlaskConical, ChevronRight, Star, GitBranch, FolderGit2 } from "lucide-react";

const sections = [
  {
    icon: <BookOpen className="w-7 h-7 text-blue-600" />,
    title: "Getting Started with Git & GitHub",
    desc: "A beginner-friendly guide to understanding version control and managing your code like a pro.",
    link: null,
  },
  {
    icon: <FolderGit2 className="w-6 h-6 text-purple-600" />,
    title: "What Are Git & GitHub?",
    desc: (
      <>
        <b>Git</b> is a distributed version control system that tracks changes in your source code.<br />
        <b>GitHub</b> is a cloud platform that hosts your Git repositories, enabling collaboration, version history, and team workflows.<br /><br />
        <span className="italic text-gray-700">Think of Git as your <b>local change tracker</b> and GitHub as your <b>global code sharing & collaboration platform</b>.</span>
      </>
    ),
    link: { label: "Read more", url: "https://docs.github.com/en/get-started/start-your-journey/about-github-and-git" },
  },
  {
    icon: <UserPlus className="w-6 h-6 text-green-600" />,
    title: " Step 1: Create Your GitHub Account",
    desc: (
      <>
        To push code, collaborate, or showcase projects, you need a GitHub account.<br /><br />
        <span className="block italic text-gray-700">Tip: Use a professional username (like <code>firstname-dev</code> or <code>firstnamelastname</code>) for portfolio visibility.</span>
      </>
    ),
    link: { label: "Create your GitHub account", url: "https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github" },
  },
  {
    icon: <Settings className="w-6 h-6 text-pink-600" />,
    title: " Step 2: Set Up Your Git Environment",
    desc: (
      <>
        After installing Git, configure it with your GitHub account:
        <pre className="bg-gray-100 rounded-lg p-3 mt-2 text-sm overflow-x-auto"><code>git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"</code></pre>
        <span className="block mt-2">This ensures your commits are linked to your GitHub profile.</span>
      </>
    ),
    link: { label: "Install & Set up Git", url: "https://docs.github.com/en/get-started/git-basics/set-up-git" },
  },
  {
    icon: <Link2 className="w-6 h-6 text-blue-500" />,
    title: " Step 3: Link Your GitHub and Start Pushing Code",
    desc: (
      <>
        Basic workflow:
        <pre className="bg-gray-100 rounded-lg p-3 mt-2 text-sm overflow-x-auto"><code>git init
git remote add origin https://github.com/username/repo-name.git
git add .
git commit -m "Initial commit"
git push -u origin main</code></pre>
        <span className="block mt-2 italic text-gray-700">First time pushing? GitHub may prompt you for a token instead of a password. Use <a href="https://cli.github.com/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">GitHub CLI</a> or a Personal Access Token (PAT).</span>
      </>
    ),
    link: null,
  },
  {
    icon: <Users className="w-6 h-6 text-indigo-600" />,
    title: "Optional: Set Up a GitHub Team (For Collaboration)",
    desc: (
      <>
        If you're working in a team or startup, you can use GitHub Team:
        <ul className="list-disc ml-6 mt-2 text-gray-700">
          <li>Invite collaborators</li>
          <li>Use team-level access controls</li>
          <li>Manage code reviews and branches centrally</li>
        </ul>
      </>
    ),
    link: { label: "Set up GitHub Team", url: "https://docs.github.com/en/get-started/onboarding/getting-started-with-github-team" },
  },
  {
    icon: <KeyRound className="w-6 h-6 text-yellow-600" />,
    title: " Step 4: Explore Your GitHub Account",
    desc: (
      <>
        Once signed up and set up:
        <ul className="list-disc ml-6 mt-2 text-gray-700">
          <li>Create repositories (<b>public</b> for portfolio, <b>private</b> for internal)</li>
          <li><Star className="inline w-4 h-4 text-yellow-500" /> Star interesting projects</li>
          <li>Fork repos you want to experiment with</li>
          <li>Use <code>README.md</code> to describe your project</li>
          <li>Commit often and write meaningful messages</li>
        </ul>
      </>
    ),
    link: { label: "Getting Started with Your GitHub Account", url: "https://docs.github.com/en/get-started/onboarding/getting-started-with-your-github-account" },
  },
  {
    icon: <FlaskConical className="w-6 h-6 text-red-500" />,
    title: " Best Practices",
    desc: (
      <>
        <ul className="list-disc ml-6 mt-2 text-gray-700">
          <li>Use <code>.gitignore</code> to avoid pushing sensitive files (e.g., <code>node_modules</code>, <code>.env</code>)</li>
          <li>Use branches for features (<code>git checkout -b feature-x</code>)</li>
          <li>Merge with pull requests instead of pushing directly to <code>main</code></li>
          <li>Keep commit messages clear and concise</li>
        </ul>
      </>
    ),
    link: null,
  },
];

export default function GithubDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 px-2 md:px-0">
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center flex items-center justify-center gap-2 tracking-tight">
          <BookOpen className="w-8 h-8 text-blue-600" /> Git & GitHub Quickstart
        </h1>
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="mb-8 bg-white rounded-2xl shadow-lg p-7 border border-blue-100 hover:shadow-2xl transition-shadow duration-300 group"
          >
            <div className="flex items-center gap-3 mb-2">
              {section.icon}
              <h2 className="text-xl font-bold text-blue-800 group-hover:text-purple-700 transition-colors duration-200">
                {section.title}
              </h2>
            </div>
            <div className="text-gray-800 text-base mb-2">
              {section.desc}
            </div>
            {section.link && (
              <a
                href={section.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-purple-700 font-semibold underline transition-colors duration-200"
              >
                {section.link.label} <ChevronRight className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <img src="./logo2.png" alt="Unlimitly" className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xl font-bold">Unlimitly</span>
                  <p className="text-sm text-gray-400">Be Limitless</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Connect, learn, and grow with expert expertship. Our comprehensive platform provides everything you need for career development and professional networking.
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
                <li><a href="/users" className="hover:text-white transition-colors">Experts</a></li>
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
            <p>&copy; 2025 Unlimitly. All rights reserved. Built with ❤️ for the developer community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 