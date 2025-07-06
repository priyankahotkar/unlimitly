import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Compass, 
  Users, 
  Calendar, 
  MessageSquare, 
  Video, 
  BookOpen, 
  Award, 
  Globe, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Briefcase,
  Clock,
  Target,
  TrendingUp,
  Heart,
  Users2,
  MessageCircle,
  FileText,
  Code,
  Brain,
  Rocket,
  Lightbulb
} from 'lucide-react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Mentor {
  id: string;
  name: string;
  photoURL: string;
  domain: string;
  expertise: string;
  highestFrequencyRating: string;
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMentors: 0,
    totalSessions: 0,
    successRate: 95
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        const fetchedMentors = snapshot.docs.map((doc) => {
          const data = doc.data();
          const ratings = data.ratings || [];

          const ratingFrequency = ratings.reduce((acc: Record<number, number>, rating: number) => {
            acc[rating] = (acc[rating] || 0) + 1;
            return acc;
          }, {});

          const highestFrequencyRating = Object.keys(ratingFrequency).reduce((a, b) => {
            return ratingFrequency[Number(a)] > ratingFrequency[Number(b)] ? a : b;
          }, "1");

          return {
            id: doc.id,
            name: data.name,
            photoURL: data.photoURL,
            domain: data.domain,
            expertise: data.expertise,
            highestFrequencyRating,
            role: data.role,
          };
        }).filter((mentor) => mentor.role === "mentor");

        setMentors(fetchedMentors.slice(0, 6)); // Show top 6 mentors
        setStats({
          totalUsers: snapshot.docs.length,
          totalMentors: fetchedMentors.length,
          totalSessions: Math.floor(snapshot.docs.length * 2.5), // Estimated sessions
          successRate: 95
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Mentorship",
      description: "Connect with industry professionals and experienced mentors across various domains.",
      color: "text-blue-600"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Smart Scheduling",
      description: "Automated scheduling with Google Calendar integration for seamless session booking.",
      color: "text-green-600"
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Built-in Video Calls",
      description: "High-quality video conferencing powered by Jitsi Meet with no external dependencies.",
      color: "text-purple-600"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Real-time Chat",
      description: "Instant messaging with file sharing and persistent chat history.",
      color: "text-orange-600"
    },
    {
      icon: <Users2 className="h-8 w-8" />,
      title: "Group Sessions",
      description: "Join group mentoring sessions and collaborative learning communities.",
      color: "text-indigo-600"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Study Resources",
      description: "Access curated study materials, roadmaps, and learning resources.",
      color: "text-red-600"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Discussion Forums",
      description: "Engage in community discussions and get answers to your questions.",
      color: "text-teal-600"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Smart FAQs",
      description: "Topic-specific FAQ system with filtered answers for quick problem resolution.",
      color: "text-pink-600"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "DSA Practice",
      description: "Comprehensive Data Structures and Algorithms practice platform.",
      color: "text-cyan-600"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI & ML Hub",
      description: "Specialized resources and mentorship for Machine Learning and AI.",
      color: "text-emerald-600"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Project Ideas",
      description: "Curated project ideas and implementation guidance for portfolio building.",
      color: "text-amber-600"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Achievement Badges",
      description: "Gamified learning with badges and achievements to track progress.",
      color: "text-yellow-600"
    }
  ];

  const benefits = [
    "100% Free Platform - No hidden costs",
    "No third-party dependencies",
    "Secure authentication with Firebase",
    "Real-time notifications",
    "Mobile-responsive design",
    "Professional networking opportunities",
    "Career guidance and skill development",
    "Industry-specific mentorship",
    "Flexible learning schedules",
    "Community-driven learning"
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Professional Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">MentorConnect</span>
                <p className="text-xs text-gray-500 -mt-1">Professional Mentorship Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium" onClick={() => navigate('/features')}>
                Features
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium" onClick={() => navigate('/about')}>
                About
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium" onClick={() => navigate('/testimonials')}>
                Testimonials
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <Zap className="h-4 w-4 mr-2" />
                  Free Professional Mentorship Platform
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Accelerate Your Career with
                  <span className="text-blue-600"> Expert Mentorship</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with industry professionals, access comprehensive learning resources, and build your network through our all-in-one mentorship platform. Everything you need for career growth in one place.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate('/auth')}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-lg text-lg font-medium"
                  onClick={() => navigate('/features')}
                >
                  {/* <Play className="mr-2 h-5 w-5" /> */}
                  View Features
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Setup in 2 minutes
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Free forever
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">John Doe</h3>
                      <p className="text-sm text-gray-500">Senior Software Engineer</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Full Stack Development</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-green-500" />
                      <span>Available: Mon, Wed, Fri</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>4.9/5 (127 reviews)</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Book Session
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">10+</div>
              <div className="text-gray-600">Expert Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">20+</div>
              <div className="text-gray-600">Sessions Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.successRate}%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Career Growth
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines mentorship, learning resources, and networking tools to accelerate your professional development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Mentors Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Mentors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with industry professionals who have helped thousands of mentees accelerate their careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/mentor/${mentor.id}`)}
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mentor.photoURL} alt={mentor.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {mentor.name?.charAt(0) || 'M'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {mentor.name || 'Mentor Name'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {mentor.expertise || 'Expertise Area'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < parseInt(mentor.highestFrequencyRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {mentor.highestFrequencyRating}.0
                      </span>
                    </div>
                    {mentor.domain && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {mentor.domain}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium"
              onClick={() => navigate('/users')}
            >
              View All Mentors
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose MentorConnect?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We've built the most comprehensive mentorship platform that combines professional networking, skill development, and career guidance in one seamless experience.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-8 w-8" />
                    <h3 className="text-2xl font-bold">Secure & Reliable</h3>
                  </div>
                  <p className="text-blue-100 leading-relaxed">
                    Your data is protected with enterprise-grade security. We use Firebase authentication and secure cloud infrastructure to ensure your privacy and data safety.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">99.9%</div>
                      <div className="text-sm text-blue-200">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">256-bit</div>
                      <div className="text-sm text-blue-200">Encryption</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of professionals who have accelerated their careers through expert mentorship. Start your journey today - it's completely free!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg text-lg font-medium shadow-lg"
              onClick={() => navigate('/auth')}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-medium"
              onClick={() => navigate('/features')}
            >
              Explore Features
            </Button>
          </div>

          <div className="mt-8 text-blue-200 text-sm">
            <p>No credit card required • Setup in 2 minutes • Free forever</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
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
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Study Materials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
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
};