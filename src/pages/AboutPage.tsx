import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Target, Heart, Shield, Lightbulb, Award, Globe, Mail, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Priyanka Hotkar",
    role: "Team Leader, Full-Stack Developer",
    image: "./priyanka.png",
    linkedin: "www.linkedin.com/in/priyanka-hotkar-3a667a259",
    github: "https://github.com/priyankahotkar"
  },
  {
    name: "Arpita Baraskar",
    role: "Backend & Database Specialist",
    image: "./arpita.png",
    linkedin: "#",
    github: "#"
  },
  {
    name: "Nayan Fulambarkar",
    role: "UI/UX Designer & Frontend Developer",
    image: "./nayan.jpg",
    linkedin: "#",
    github: "#"
  },
  {
    name: "Aditya Binjagermath",
    role: "Content Support & Designing",
    image: "./pragati.jpg",
    linkedin: "#",
    github: "#"
  }
];

const values = [
  {
    icon: <Heart className="w-6 h-6 text-red-600" />,
    title: "Empathy",
    description: "Because we've all been learners"
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-600" />,
    title: "Integrity",
    description: "Transparent, honest, and value-driven connections"
  },
  {
    icon: <Users className="w-6 h-6 text-green-600" />,
    title: "Inclusivity",
    description: "Everyone deserves access to guidance"
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
    title: "Curiosity",
    description: "We never stop learning, and neither should you"
  }
];

const visionPoints = [
  "Accessible to Everyone – across regions, languages, and disciplines",
  "Community-Driven – powered by peers, alumni, and professionals",
  "Sustainable & Scalable – a continuous relationship, not just a one-time consultation"
];

export function AboutPage() {
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
            <h1 className="text-xl font-bold text-gray-900">About Us</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Building the Future of Mentorship</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're a team of passionate students who believe that meaningful mentorship should be accessible to everyone, everywhere.
          </p>
          <div className="mt-8 flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">4</div>
              <div className="text-blue-100">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-blue-100">Student-Led</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-100">Dedication</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
                <Target className="w-5 h-5" />
                <span className="font-medium">🧭 Our Mission</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Connecting Learners with Leaders</h3>
            </div>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At MentorConnect, our mission is simple yet powerful: To connect learners with the right mentors who can guide, inspire, and empower them at every step of their journey.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We aim to create a space where mentorship is not just occasional advice but a long-term, trusted relationship that helps unlock true potential.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
                <Award className="w-5 h-5" />
                <span className="font-medium">🌱 Our Story</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Born from Student Experience</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  MentorConnect was born from a shared realization among four students: meaningful mentorship is hard to find, yet crucial for growth. Whether you're a beginner navigating career paths or a student seeking domain-specific guidance, having someone who's "been there, done that" can make all the difference.
                </p>
                <p>
                  As students ourselves, we experienced this gap firsthand. That's why we built MentorConnect — a dynamic, student-centric platform designed to break barriers, connect generations, and foster genuine learning through personalized mentorship.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Student-Led Innovation</h4>
                <p className="text-gray-600">
                  Built by students, for students, with the understanding that mentorship should be accessible, meaningful, and transformative.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5" />
              <span className="font-medium">👩‍💻 Meet the Team</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">The Minds Behind MentorConnect</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A diverse team of passionate students working together to revolutionize mentorship
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-100"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{member.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{member.role}</p>
                <div className="flex justify-center space-x-2">
                  <a href={member.linkedin} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href={member.github} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-4">
                <Target className="w-5 h-5" />
                <span className="font-medium">🚀 Our Vision</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Envisioning the Future of Mentorship</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We envision a future where mentorship is accessible, community-driven, and sustainable for everyone.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visionPoints.map((point, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <p className="text-gray-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">💡 Our Core Values</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at MentorConnect
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">💬 Join the Movement</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Whether you're here to learn or to lead, there's a place for you at MentorConnect. Ready to grow? Ready to guide? We're just getting started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?role=mentee">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  Become a Mentee
                </Button>
              </Link>
              <Link to="/auth?role=mentor">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                  Join as a Mentor
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
