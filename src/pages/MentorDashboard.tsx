import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Video, LogOut, PlusCircle, Sun, Moon, Calendar, Users, Bell, Settings, Briefcase, Clock, MapPin, BookOpen, User, Edit3, Github, Linkedin, Mail } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, collection, query, where, orderBy, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Notifications from "@/components/Notifications";

interface Student {
  id: string;
  name: string;
  avatar: string;
  domain: string;
}

interface Session {
  id: string;
  studentName: string;
  date: string;
  timeSlot: string;
}

export function MentorDashboardPage() {
  const { user, logout } = useAuth();
  const [jitsiRoom, setJitsiRoom] = useState<string | null>(null);
  const [bookedSessions, setBookedSessions] = useState<Session[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const navigate = useNavigate();

  // Refs for smooth scrolling
  const studentsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const sessionsRef = useRef<HTMLDivElement>(null);
  const timeSlotsRef = useRef<HTMLDivElement>(null);

  // Fetch booked sessions for the mentor
  useEffect(() => {
    const fetchBookedSessions = async () => {
      if (!user) return;

      try {
        const sessionsRef = collection(db, "bookings");
        const q = query(
          sessionsRef,
          where("mentorId", "==", user.uid),
          orderBy("date", "asc")
        );
        const snapshot = await getDocs(q);

        const currentDate = new Date();
        const sessionsList = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            const date =
              data.date?.toDate?.() || // If it's a Firestore Timestamp, convert to Date
              new Date(data.date); // If it's a string, convert to Date

            return {
              id: doc.id,
              studentName: data.studentName,
              date: date.toLocaleString(), // Convert Date to readable string
              timeSlot: data.timeSlot,
              originalDate: date, // Keep original date for comparison
            };
          })
          .filter((session) => {
            // Only include sessions that are greater than or equal to current time and date
            return session.originalDate >= currentDate;
          })
          .map(({ originalDate, ...session }) => session) as Session[]; // Remove originalDate from final result

        setBookedSessions(sessionsList);
      } catch (error) {
        console.error("Error fetching booked sessions for mentor:", error);
      }
    };

    fetchBookedSessions();
  }, [user]);

  // Fetch real students associated with the mentor
  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return;

      try {
        const sessionsRef = collection(db, "bookings");
        const q = query(sessionsRef, where("mentorId", "==", user.uid));
        const snapshot = await getDocs(q);

        const studentsList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.studentId,
            name: data.studentName,
            avatar: data.studentPhotoURL || "https://via.placeholder.com/100", // Default avatar if missing
            domain: data.studentDomain || "Not Specified", // Optional student domain
          };
        });

        // Remove duplicates based on student ID
        const uniqueStudents = Array.from(
          new Map(studentsList.map((student) => [student.id, student])).values()
        );

        setStudents(uniqueStudents);
      } catch (error) {
        console.error("Error fetching students for mentor:", error);
      }
    };

    fetchStudents();
  }, [user]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setTimeSlots(userSnap.data().availableTimeSlots || []);
        }
      } catch (error) {
        console.error("Error fetching time slots:", error);
      }
    };

    fetchTimeSlots();
  }, [user]);

  const handleTimeSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setTimeSlots([...timeSlots, value]);
    } else {
      setTimeSlots(timeSlots.filter((slot) => slot !== value));
    }
  };

  const updateTimeSlots = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { availableTimeSlots: timeSlots }, { merge: true }); // Save updated time slots
      alert("Time slots updated successfully!");
    } catch (error) {
      console.error("Error updating time slots:", error);
      alert("Failed to update time slots. Please try again.");
    }
  };

  const generateJitsiRoom = async () => {
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }
  
    const newRoom = `mentor-room-${uuidv4()}`;
    setJitsiRoom(newRoom);
  
    // Save the room to Firestore for students to join
    try {
      const roomRef = doc(db, "videoRooms", newRoom);
      await setDoc(roomRef, {
        mentorId: user.uid,
        mentorName: user.displayName || "Unknown Mentor",
        createdAt: new Date(),
      });
      console.log("Room created:", newRoom);

      // Navigate to the VideoCallPage with the room ID
      navigate(`/video-call/${newRoom}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const scrollToStudents = () => {
    studentsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToNotifications = () => {
    notificationsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSessions = () => {
    sessionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTimeSlots = () => {
    timeSlotsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/mentor-dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Unlimitly</span>
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link to="/mentor-dashboard" className="text-blue-600 font-medium">Dashboard</Link>
                <Link to="/chat" className="text-gray-600 hover:text-gray-900 font-medium">Messages</Link>
                <Link to="/discussion-forum" className="text-gray-600 hover:text-gray-900 font-medium">Community</Link>
                <Link to="/users" className="text-gray-600 hover:text-gray-900 font-medium">Users</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={scrollToNotifications}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
              </button>
              {/* <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button> */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Link to="/view-profile">
                    <Avatar className="w-8 h-8 cursor-pointer">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {user?.displayName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link to="/edit-profile" className="absolute -bottom-0.5 -right-0.5 bg-blue-600 text-white p-0.5 rounded-full hover:bg-blue-700 transition-colors">
                    <Edit3 className="w-2.5 h-2.5" />
                  </Link>
                </div>
                {/* <Button variant="ghost" onClick={logout} className="text-gray-600 hover:text-gray-900">
                  <LogOut className="h-4 w-4" />
                </Button> */}
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
            Welcome back, {user?.displayName?.split(' ')[0] || 'Mentor'}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your expertship program today.</p>
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
                <h3 className="font-semibold text-gray-900">{user?.displayName || "Mentor"}</h3>
                <p className="text-sm text-gray-600">Professional Mentor</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{students.length} students</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{bookedSessions.length} sessions</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
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
                <Button 
                  onClick={generateJitsiRoom} 
                  className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Video className="mr-3 h-4 w-4" />
                  Start Video Call
                </Button>
              </div>
            </div>

            {/* Time Slots */}
            <div ref={timeSlotsRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Available Times</h3>
              <div className="space-y-2 mb-4">
                {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].map((slot) => (
                  <label key={slot} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value={slot}
                      checked={timeSlots.includes(slot)}
                      onChange={handleTimeSlotChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{slot}</span>
                  </label>
                ))}
              </div>
              <Button onClick={updateTimeSlots} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Update Schedule
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={scrollToStudents}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                    <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                  </div>
                </div>
              </div>
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={scrollToSessions}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{bookedSessions.length}</p>
                  </div>
                </div>
              </div>
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={scrollToTimeSlots}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Slots</p>
                    <p className="text-2xl font-bold text-gray-900">{timeSlots.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div ref={notificationsRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <Notifications />
            </div>

            {/* Upcoming Sessions */}
            <div ref={sessionsRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
              {bookedSessions.length > 0 ? (
                <div className="space-y-4">
                  {bookedSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{session.studentName}</p>
                          <p className="text-sm text-gray-600">{session.date} • {session.timeSlot}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        Join Session
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming sessions</p>
                  <p className="text-sm text-gray-400">Your scheduled sessions will appear here</p>
                </div>
              )}
            </div>

            {/* Students List */}
            <div ref={studentsRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Students</h3>
              {students.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={student.avatar} alt={student.name || "Unknown"} />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {student.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{student.name || "Unknown"}</p>
                        <p className="text-sm text-gray-600 truncate">{student.domain || "Not Specified"}</p>
                      </div>
                      <Link to="/chat">
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No students yet</p>
                  <p className="text-sm text-gray-400">Students will appear here once they book sessions</p>
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
