import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, FileText, Video, Link as LinkIcon, Code, GitBranch, Brain, Lightbulb, Award, Smartphone } from "lucide-react";

export default function StudyMaterialsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-2 md:px-0">
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
          <div className="bg-pink-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer">
            <Brain className="w-8 h-8 text-pink-500 mb-2" />
            <span className="font-semibold text-pink-700">ML Resources</span>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer">
            <Lightbulb className="w-8 h-8 text-yellow-500 mb-2" />
            <span className="font-semibold text-yellow-700">Free Project Ideas</span>
          </div>
          <div className="bg-cyan-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer">
            <Smartphone className="w-8 h-8 text-cyan-500 mb-2" />
            <span className="font-semibold text-cyan-700">Flutter Development Resources</span>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-12">
          <p>More study materials and categories coming soon!</p>
        </div>
      </div>
    </div>
  );
} 