import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Video, MessageSquare, Star, FileText, Lock, Globe, HelpCircle, Layers } from "lucide-react";

const features = [
  {
    icon: <Users className="h-10 w-10 text-blue-700" />,
    title: "Seamless Mentor-Mentee Matching",
    desc: "Connect with the right mentor based on your interests, domain, goals, and availability. Our smart search and profile-based filters help mentees find the best-fit mentor in just a few clicks.",
  },
  {
    icon: <Calendar className="h-10 w-10 text-blue-700" />,
    title: "Smart Session Booking",
    desc: "Book sessions effortlessly with real-time mentor availability. Integrated with Google Calendar, the platform ensures hassle-free scheduling and automatic reminders.",
  },
  {
    icon: <Video className="h-10 w-10 text-blue-700" />,
    title: "Built-in Video Meetings",
    desc: "No need for third-party apps! MentorConnect provides secure, in-platform video sessions powered by Jitsi Meet, so you can interact face-to-face—right from your dashboard.",
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-blue-700" />,
    title: "Real-Time Chat with File Sharing",
    desc: "Chat with your mentor instantly using Firebase-powered messaging. Share documents, links, and files seamlessly before, during, or after your session.",
  },
  {
    icon: <Layers className="h-10 w-10 text-blue-700" />,
    title: "Role-Based Dashboards",
    desc: "Personalized dashboards for mentors and mentees. Mentors can manage bookings and feedback; mentees can track sessions, post doubts, and explore guidance opportunities.",
  },
  {
    icon: <Star className="h-10 w-10 text-blue-700" />,
    title: "Feedback & Ratings System",
    desc: "Rate your sessions and share your feedback to help mentors grow and mentees choose the right guide. The platform evolves with your input.",
  },
  {
    icon: <HelpCircle className="h-10 w-10 text-blue-700" />,
    title: "Evolving FAQ Section",
    desc: "Get instant answers from a curated FAQ section—and even contribute! Mentees and mentors can submit session-based Q&As to help future users.",
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-blue-700" />,
    title: "Community Discussion Forum",
    desc: "Engage in group discussions, post queries, and share insights beyond one-on-one sessions. A space for collaborative learning and networking.",
  },
  {
    icon: <Lock className="h-10 w-10 text-blue-700" />,
    title: "Secure Authentication",
    desc: "Powered by Firebase, our Google Sign-In ensures a safe and smooth login experience for every user.",
  },
  {
    icon: <Globe className="h-10 w-10 text-blue-700" />,
    title: "100% Free & Scalable",
    desc: "MentorConnect is built using open-source, cost-free technologies—making it accessible for everyone, anywhere.",
  },
];

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f3f6fb] font-sans">
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-800 tracking-tight cursor-pointer" onClick={() => navigate('/')}>MentorConnect</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <button className="hover:bg-blue-50 px-4 py-2 rounded" onClick={() => navigate('/')}>Home</button>
            <button className="hover:bg-blue-50 px-4 py-2 rounded" onClick={() => navigate('/about')}>About</button>
          </div>
        </div>
      </nav>
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">🚀 Key Features of MentorConnect</h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">Your journey deserves guidance. With MentorConnect, mentorship is just one click away.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center hover:shadow-xl transition-all">
              {feature.icon}
              <h3 className="text-xl font-bold text-blue-900 mt-4 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" alt="Mentorship" className="mx-auto rounded-2xl shadow-lg w-full max-w-2xl" />
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
