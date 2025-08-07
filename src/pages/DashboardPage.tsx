import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MessageSquare, Video, LogOut, Bell, Settings, Briefcase, Users, Clock, Star, MapPin, BookOpen, User, Edit3, Award, Compass, Github, Linkedin, Mail } from "lucide-react";
import { collection, query, where, getDocs, orderBy, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface UpcomingSession {
  id: string;
  title: string;
  date: string;
  mentor: {
    name: string;
    avatar: string;
  };
}

interface Mentor {
  id: string;
  name: string;
  photoURL: string;
  email: string;
  domain: string;
  experience: string;
  expertise: string;
  highestFrequencyRating: string;
}

export function DashboardPage() {
  const { user, logout, role, updateRole } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [experts, setExperts] = useState<Mentor[]>([]);
  const [badges, setBadges] = useState<string[]>([]);

  // Fetch real upcoming sessions from Firestore
  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      if (!user) return;

      try {
        const sessionsRef = collection(db, "bookings");
        const q = query(
          sessionsRef,
          where("studentId", "==", user.uid),
          orderBy("date", "asc")
        );
        const snapshot = await getDocs(q);

        const currentDate = new Date();
        const sessionsList = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            const date = new Date(data.date);
            
            return {
              id: doc.id,
              title: `Session with ${data.mentorName}`,
              date: date.toLocaleString(),
              mentor: {
                name: data.mentorName,
                avatar: data.mentorPhotoURL || "https://via.placeholder.com/100", // Default avatar if missing
              },
              originalDate: date, // Keep original date for comparison
            };
          })
          .filter((session) => {
            // Only include sessions that are greater than or equal to current time and date
            return session.originalDate >= currentDate;
          })
          .map(({ originalDate, ...session }) => session) as UpcomingSession[]; // Remove originalDate from final result

        setUpcomingSessions(sessionsList);
      } catch (error) {
        console.error("Error fetching upcoming sessions:", error);
      }
    };

    fetchUpcomingSessions();
  }, [user]);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const expertsRef = collection(db, "users");
        const snapshot = await getDocs(expertsRef);

        const fetchedExperts = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            const ratings = data.ratings || [];

            // Calculate the frequency of each rating (1-5)
            const ratingFrequency = ratings.reduce((acc: Record<number, number>, rating: number) => {
              acc[rating] = (acc[rating] || 0) + 1;
              return acc;
            }, {});

            // Find the rating with the highest frequency
            const highestFrequencyRating = Object.keys(ratingFrequency).reduce((a, b) => {
              return ratingFrequency[Number(a)] > ratingFrequency[Number(b)] ? a : b;
            }, "1");

            return {
              id: doc.id,
              name: data.name,
              email: data.email,
              photoURL: data.photoURL,
              domain: data.domain,
              expertise: data.expertise,
              experience: data.experience,
              highestFrequencyRating,
              role: data.role,
            };
          })
          .filter((mentor) => mentor.role === "mentor");

        setExperts(fetchedExperts);
      } catch (error) {
        console.error("Error fetching experts:", error);
      }
    };

    fetchExperts();
  }, []);

  // Fetch user badges from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchBadges = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.badges && Array.isArray(data.badges)) {
          setBadges(data.badges);
        }
      }
    };
    fetchBadges();
  }, [user]);

  const handleRoleChange = async (newRole: "mentor" | "student") => {
    if (!newRole || newRole === role || !user) return; // Prevent unnecessary updates and null user
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        role: newRole,
        detailsCompleted: false, // Reset details completion status
        updatedAt: new Date(), // Add a timestamp for updates
      }, { merge: true });
      await updateRole(newRole); // Call updateRole from AuthContext
      window.location.href = `/dashboard/${newRole}`; // Redirect to the correct dashboard
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="flex items-center space-x-3">
              <img src="./logo2.png" alt="Unlimitly" className="w-15 h-10" />
                <span className="text-xl font-bold text-gray-900 tracking-tight">Unlimitly</span>
              </Link>
              
              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-1">
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 text-blue-600 font-medium rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/booking" 
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  Book Session
                </Link>
                <Link 
                  to="/chat" 
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  Messages
                </Link>
                <Link 
                  to="/discussion-forum" 
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  Community
                </Link>
                <Link 
                  to="/study-materials" 
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  Study Materials
                </Link>
                <Link 
                  to="/users" 
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  Users
                </Link>
              </nav>
            </div>

            {/* Right Side - User Controls */}
            <div className="flex items-center space-x-4">
              {/* Notification Button (commented out) */}
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                {/* <Bell className="w-5 h-5" /> */}
              </button>
              
              {/* User Profile Section */}
              <div className="flex items-center space-x-3">
                {/* Avatar with Edit Button */}
                <div className="relative flex items-center">
                  <Link to="/view-profile">
                    <Avatar className="w-9 h-9 border-2 border-gray-200 cursor-pointer">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                        {user?.displayName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link 
                    to="/edit-profile" 
                    className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                  </Link>
                  
                  {/* Badges */}
                  {/* {badges.length > 0 && (
                    <div className="flex space-x-1 ml-3">
                      {badges.map((badge, i) => (
                        <span
                          key={i}
                          title={badge}
                          className="relative group"
                        >
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 border-2 border-yellow-700 shadow-lg ring-2 ring-yellow-200">
                            <Award className="w-3.5 h-3.5 text-white drop-shadow" />
                          </span>
                          <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 whitespace-nowrap">
                            {badge}
                          </span>
                        </span>
                      ))}
                    </div>
                  )} */}
                </div>
                
                {/* Role Selector */}
                {/* <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors"
                  value={role || ""}
                  onChange={(e) => handleRoleChange(e.target.value as "mentor" | "student")}
                >
                  <option value="">Select Role</option>
                  <option value="mentor">Mentor</option>
                  <option value="student">Student</option>
                </select> */}
                
                {/* Logout Button */}
                <div className="relative group">
                  <Button
                    onClick={logout}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-2 rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">Logout</span>
                  </Button>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 whitespace-nowrap">
                    Logout
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">Ready to continue your learning journey with our expert experts.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-4">
                <div className="relative inline-block">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-semibold">
                      {user?.displayName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Link to="/edit-profile" className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </Link>
                </div>
                <h3 className="font-semibold text-gray-900">{user?.displayName || "User"}</h3>
                <p className="text-sm text-gray-600">{role === "mentor" ? "Professional Mentor" : "Learning Student"}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{upcomingSessions.length} upcoming sessions</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{experts.length} available experts</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/booking">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                    <Calendar className="mr-3 h-4 w-4" />
                    Book Session
                  </Button>
                </Link>
                <Link to="/chat">
                  <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200" variant="outline">
                    <MessageSquare className="mr-3 h-4 w-4" />
                    Messages
                  </Button>
                </Link>
                <Link to="/groups">
                  <Button className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200" variant="outline">
                    <Users className="mr-3 h-4 w-4" />
                    Groups
                  </Button>
                </Link>
                <Link to="/discussion-forum">
                  <Button className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100 border-green-200" variant="outline">
                    <MessageSquare className="mr-3 h-4 w-4" />
                    Community
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200" variant="outline">
                    <BookOpen className="mr-3 h-4 w-4" />
                    FAQs
                  </Button>
                </Link>
                <Link to="/users">
                  <Button className="w-full justify-start bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200" variant="outline">
                    <Users className="mr-3 h-4 w-4" />
                    All Users
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{upcomingSessions.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Experts</p>
                    <p className="text-2xl font-bold text-gray-900">{experts.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Your Role</p>
                    <p className="text-2xl font-bold text-gray-900 capitalize">{role || "Not Set"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={session.mentor.avatar} alt={session.mentor.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {session.mentor.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{session.title}</p>
                          <p className="text-sm text-gray-600">{session.date}</p>
                        </div>
                      </div>
                      <Link to={`/video-call/${session.id}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Video className="mr-2 h-4 w-4" />
                          Join Session
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming sessions</p>
                  <p className="text-sm text-gray-400">Book a session with a mentor to get started</p>
                  <Link to="/booking" className="mt-4 inline-block">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Book Your First Session
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Experts Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Available Experts</h3>
              {experts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {experts.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => window.location.href = `/mentor/${mentor.id}`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={mentor.photoURL} alt={mentor.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {mentor.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{mentor.name}</p>
                          <p className="text-sm text-gray-600 truncate">{mentor.domain}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{mentor.highestFrequencyRating}</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                          {mentor.experience}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No experts available</p>
                  <p className="text-sm text-gray-400">Check back later for available experts</p>
                </div>
              )}
            </div>
          </div>
        </div>
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