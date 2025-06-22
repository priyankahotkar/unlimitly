import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, Video, MessageSquare, Star, FileText, Lock, Globe, HelpCircle, Layers, ArrowLeft, CheckCircle, Zap, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Seamless Mentor-Mentee Matching",
    desc: "Connect with the right mentor based on your interests, domain, goals, and availability. Our smart search and profile-based filters help mentees find the best-fit mentor in just a few clicks.",
    category: "Core Feature"
  },
  {
    icon: <Calendar className="h-8 w-8 text-green-600" />,
    title: "Smart Session Booking",
    desc: "Book sessions effortlessly with real-time mentor availability. Integrated with Google Calendar, the platform ensures hassle-free scheduling and automatic reminders.",
    category: "Scheduling"
  },
  {
    icon: <Video className="h-8 w-8 text-purple-600" />,
    title: "Built-in Video Meetings",
    desc: "No need for third-party apps! MentorConnect provides secure, in-platform video sessions powered by Jitsi Meet, so you can interact face-to-face—right from your dashboard.",
    category: "Communication"
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-orange-600" />,
    title: "Real-Time Chat with File Sharing",
    desc: "Chat with your mentor instantly using Firebase-powered messaging. Share documents, links, and files seamlessly before, during, or after your session.",
    category: "Communication"
  },
  {
    icon: <Layers className="h-8 w-8 text-indigo-600" />,
    title: "Role-Based Dashboards",
    desc: "Personalized dashboards for mentors and mentees. Mentors can manage bookings and feedback; mentees can track sessions, post doubts, and explore guidance opportunities.",
    category: "Core Feature"
  },
  {
    icon: <Star className="h-8 w-8 text-yellow-600" />,
    title: "Feedback & Ratings System",
    desc: "Rate your sessions and share your feedback to help mentors grow and mentees choose the right guide. The platform evolves with your input.",
    category: "Quality"
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-teal-600" />,
    title: "Evolving FAQ Section",
    desc: "Get instant answers from a curated FAQ section—and even contribute! Mentees and mentors can submit session-based Q&As to help future users.",
    category: "Support"
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-pink-600" />,
    title: "Community Discussion Forum",
    desc: "Engage in group discussions, post queries, and share insights beyond one-on-one sessions. A space for collaborative learning and networking.",
    category: "Community"
  },
  {
    icon: <Lock className="h-8 w-8 text-red-600" />,
    title: "Secure Authentication",
    desc: "Powered by Firebase, our Google Sign-In ensures a safe and smooth login experience for every user.",
    category: "Security"
  },
  {
    icon: <Globe className="h-8 w-8 text-emerald-600" />,
    title: "100% Free & Scalable",
    desc: "MentorConnect is built using open-source, cost-free technologies—making it accessible for everyone, anywhere.",
    category: "Accessibility"
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
          <h2 className="text-4xl font-bold mb-4">🚀 Powerful Features for Seamless Mentorship</h2>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose MentorConnect?</h3>
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
              Join thousands of users who are already benefiting from MentorConnect's comprehensive feature set.
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
    </div>
  );
};

export default FeaturesPage;
