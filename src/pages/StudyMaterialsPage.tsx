import React from "react";
import { useNavigate } from "react-router-dom";
import { Github, Linkedin, Mail, BookOpen, FileText, Video, Link as LinkIcon, Code, GitBranch, Brain, Lightbulb, Award, Smartphone } from "lucide-react";

export default function StudyMaterialsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-2 md:px-0">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-10 h-10 text-blue-700" />
          <h1 className="text-3xl font-extrabold text-blue-800">Study Materials</h1>
        </div>
        <p className="text-gray-600 mb-8 text-lg">Explore curated resources and roadmaps to boost your learning journey. Select a category to get started!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            className="bg-blue-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer hover:bg-blue-100"
            onClick={() => navigate("/free-resources")}
          >
            <FileText className="w-8 h-8 text-blue-500 mb-2" />
            <span className="font-semibold text-blue-700">DSA Resources</span>
          </div>
          <div
            className="bg-yellow-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer hover:bg-yellow-100"
            onClick={() => navigate("/dsa-practice")}
          >
            <Award className="w-8 h-8 text-yellow-500 mb-2" />
            <span className="font-semibold text-yellow-700">DSA Practice</span>
          </div>
          <div
            className="bg-purple-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer hover:bg-purple-100"
            onClick={() => navigate("/fullstack-roadmap")}
          >
            <Code className="w-8 h-8 text-purple-500 mb-2" />
            <span className="font-semibold text-purple-700">Full Stack Roadmap</span>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/getting-started-with-github")}
          >
            <GitBranch className="w-8 h-8 text-green-500 mb-2" />
            <span className="font-semibold text-green-700">Getting Started with GitHub</span>
          </div>
          <div className="bg-pink-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/machine-learning-hub")}
          >
            <Brain className="w-8 h-8 text-pink-500 mb-2" />
            <span className="font-semibold text-pink-700">Machine Learning Hub</span>
          </div>
          <div className="bg-indigo-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/ai-and-deployment")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-semibold text-indigo-700">AI Tools & Deployment Platforms</span>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/project-ideas")}
          >
            <Lightbulb className="w-8 h-8 text-yellow-500 mb-2" />
            <span className="font-semibold text-yellow-700">Free Project Ideas</span>
          </div>
          <div className="bg-cyan-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate("/flutter-resources")}
          >
            <Smartphone className="w-8 h-8 text-cyan-500 mb-2" />
            <span className="font-semibold text-cyan-700">Flutter Development Resources</span>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-12">
          <p>More study materials and categories coming soon!</p>
        </div>
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
            <p>&copy; 2025 Unlimitly. All rights reserved. Built with ❤️ for the developer community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 