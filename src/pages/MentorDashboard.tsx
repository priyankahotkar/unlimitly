import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Video, LogOut, PlusCircle, Sun, Moon, Calendar, Users, Bell, Settings, Briefcase, Clock, MapPin, BookOpen, User, Edit3 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, collection, query, where, orderBy, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Notifications from "@/components/Notifications";

interface Mentee {
  id: string;
  name: string;
  avatar: string;
  domain: string;
}

interface Session {
  id: string;
  menteeName: string;
  date: string;
  timeSlot: string;
}

export function MentorDashboardPage() {
  const { user, logout } = useAuth();
  const [jitsiRoom, setJitsiRoom] = useState<string | null>(null);
  const [bookedSessions, setBookedSessions] = useState<Session[]>([]);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const navigate = useNavigate();

  // Refs for smooth scrolling
  const menteesRef = useRef<HTMLDivElement>(null);
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
              menteeName: data.menteeName,
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

  // Fetch real mentees associated with the mentor
  useEffect(() => {
    const fetchMentees = async () => {
      if (!user) return;

      try {
        const sessionsRef = collection(db, "bookings");
        const q = query(sessionsRef, where("mentorId", "==", user.uid));
        const snapshot = await getDocs(q);

        const menteesList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.menteeId,
            name: data.menteeName,
            avatar: data.menteePhotoURL || "https://via.placeholder.com/100", // Default avatar if missing
            domain: data.menteeDomain || "Not Specified", // Optional mentee domain
          };
        });

        // Remove duplicates based on mentee ID
        const uniqueMentees = Array.from(
          new Map(menteesList.map((mentee) => [mentee.id, mentee])).values()
        );

        setMentees(uniqueMentees);
      } catch (error) {
        console.error("Error fetching mentees for mentor:", error);
      }
    };

    fetchMentees();
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
  
    // Save the room to Firestore for mentees to join
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

  const scrollToMentees = () => {
    menteesRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                <span className="text-xl font-bold text-gray-900">MentorConnect</span>
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link to="/mentor-dashboard" className="text-blue-600 font-medium">Dashboard</Link>
                <Link to="/chat" className="text-gray-600 hover:text-gray-900 font-medium">Messages</Link>
                <Link to="/discussion-forum" className="text-gray-600 hover:text-gray-900 font-medium">Community</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={scrollToNotifications}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {user?.displayName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Link to="/edit-profile" className="absolute -bottom-0.5 -right-0.5 bg-blue-600 text-white p-0.5 rounded-full hover:bg-blue-700 transition-colors">
                    <Edit3 className="w-2.5 h-2.5" />
                  </Link>
                </div>
                <Button variant="ghost" onClick={logout} className="text-gray-600 hover:text-gray-900">
                  <LogOut className="h-4 w-4" />
                </Button>
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
          <p className="text-gray-600">Here's what's happening with your mentorship program today.</p>
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
                  <span>{mentees.length} mentees</span>
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
                onClick={scrollToMentees}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Mentees</p>
                    <p className="text-2xl font-bold text-gray-900">{mentees.length}</p>
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
                          <p className="font-medium text-gray-900">{session.menteeName}</p>
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

            {/* Mentees List */}
            <div ref={menteesRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Mentees</h3>
              {mentees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mentees.map((mentee) => (
                    <div key={mentee.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={mentee.avatar} alt={mentee.name || "Unknown"} />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {mentee.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{mentee.name || "Unknown"}</p>
                        <p className="text-sm text-gray-600 truncate">{mentee.domain || "Not Specified"}</p>
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
                  <p className="text-gray-500">No mentees yet</p>
                  <p className="text-sm text-gray-400">Mentees will appear here once they book sessions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
