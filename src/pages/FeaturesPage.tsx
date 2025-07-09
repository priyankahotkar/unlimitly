import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Calendar, Users, Video, MessageSquare, Star, FileText, Lock, Globe, HelpCircle, Layers, ArrowLeft, CheckCircle, Zap, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  // Mentee Experience
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Find Your Perfect Mentor",
    desc: "Search and match with mentors who fit your goals, interests, and schedule.",
    category: "For Mentees"
  },
  {
    icon: <Calendar className="h-8 w-8 text-green-600" />,
    title: "Book Sessions Instantly",
    desc: "See real-time mentor availability and book sessions in just a few clicks.",
    category: "For Mentees"
  },
  {
    icon: <Video className="h-8 w-8 text-purple-600" />,
    title: "Join Video or Voice Calls",
    desc: "Attend 1:1 or group mentoring sessions with built-in video and voice chat.",
    category: "For Mentees"
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-orange-600" />,
    title: "Chat in Real Time",
    desc: "Message your mentor, share files, and get instant feedback before, during, or after sessions.",
    category: "For Mentees"
  },
  {
    icon: <Layers className="h-8 w-8 text-indigo-600" />,
    title: "Track Your Progress",
    desc: "Earn badges, see your learning streak, and visualize your activity with a LeetCode-style grid.",
    category: "For Mentees"
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-teal-600" />,
    title: "Get Instant Answers",
    desc: "Access a smart FAQ and discussion forum to clear doubts and learn from the community.",
    category: "For Mentees"
  },
  {
    icon: <Star className="h-8 w-8 text-yellow-600" />,
    title: "Give Feedback & Rate Sessions",
    desc: "Help mentors improve and guide other mentees by sharing your experience.",
    category: "For Mentees"
  },

  // Mentor Experience
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Showcase Your Expertise",
    desc: "Create a profile, highlight your skills, and attract mentees who need your guidance.",
    category: "For Mentors"
  },
  {
    icon: <Calendar className="h-8 w-8 text-green-600" />,
    title: "Set Your Own Schedule",
    desc: "Choose your available time slots and manage bookings with ease.",
    category: "For Mentors"
  },
  {
    icon: <Video className="h-8 w-8 text-purple-600" />,
    title: "Host Group Sessions & Webinars",
    desc: "Lead group mentoring, webinars, and Q&A sessions to impact more students at once.",
    category: "For Mentors"
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-orange-600" />,
    title: "Support Mentees in Real Time",
    desc: "Answer questions, provide resources, and offer feedback instantly via chat.",
    category: "For Mentors"
  },
  {
    icon: <Layers className="h-8 w-8 text-indigo-600" />,
    title: "Manage Groups & Channels",
    desc: "Create and moderate topic-specific groups for focused mentoring.",
    category: "For Mentors"
  },
  {
    icon: <Star className="h-8 w-8 text-yellow-600" />,
    title: "Build Your Reputation",
    desc: "Receive ratings and testimonials from mentees to grow your profile.",
    category: "For Mentors"
  },

  // Platform/General User Experience
  {
    icon: <Lock className="h-8 w-8 text-red-600" />,
    title: "Enjoy Secure, Private Access",
    desc: "Sign in with Google and access protected routes with peace of mind.",
    category: "Platform"
  },
  {
    icon: <Globe className="h-8 w-8 text-emerald-600" />,
    title: "Access Everything for Free",
    desc: "No hidden costs, no third-party dependencies—just pure learning and growth.",
    category: "Platform"
  },
  {
    icon: <Heart className="h-8 w-8 text-pink-600" />,
    title: "Experience a Modern, Friendly UI",
    desc: "Enjoy a beautiful, mobile-responsive design with intuitive navigation and helpful tooltips.",
    category: "Platform"
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-teal-600" />,
    title: "Get 24/7 Community Support",
    desc: "Join a vibrant community, ask questions, and get help anytime.",
    category: "Platform"
  },
];

const benefits = [
  "No external tools required",
  "Real-time communication",
  "Secure and private",
  "Mobile responsive",
  "24/7 availability",
  "Community-driven learning"
];

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Features</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Powerful Features for Seamless Mentorship</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Everything you need for effective mentorship in one integrated platform. No external tools, no complexity, just pure learning.
          </p>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">10+</div>
              <div className="text-blue-100">Core Features</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-blue-100">Free Access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-100">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Features Grid */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Feature Set</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From smart matching to secure video calls, every feature is designed to make mentorship effortless and effective.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {feature.category}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Unlimitly?</h3>
            <p className="text-gray-600">The advantages that set us apart from traditional mentorship platforms</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Built with Modern Technology</h3>
            <p className="text-gray-600">Powered by cutting-edge tools for reliability and performance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">React & TypeScript</h4>
              <p className="text-gray-600 text-sm">Modern frontend for smooth user experience</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Firebase</h4>
              <p className="text-gray-600 text-sm">Secure authentication and real-time database</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Jitsi Meet</h4>
              <p className="text-gray-600 text-sm">High-quality video conferencing</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Open Source</h4>
              <p className="text-gray-600 text-sm">Free and accessible to everyone</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Experience These Features?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who are already benefiting from Unlimitly's comprehensive feature set.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/testimonials">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                  See Testimonials
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

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
};

export default FeaturesPage;
