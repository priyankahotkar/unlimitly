import React, { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { collection, getDocs, query, where, orderBy, doc, addDoc, serverTimestamp, getDoc, updateDoc, Timestamp, onSnapshot, limit, arrayUnion } from "firebase/firestore";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, Clock, Star, MapPin, Users, MessageSquare, Video, ArrowLeft, Compass, Github, Linkedin, Mail } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface Mentor {
  highRatingFrequency: ReactNode;
  highestFrequencyRating: ReactNode;
  id: string;
  name: string;
  email: string;
  photoURL: string;
  role: string;
  domain: string;
  experience: string;
  expertise: string;
  availableTimeSlots?: string[]; // Add availableTimeSlots to Mentor interface
  rating?: number; // Add rating to Mentor interface
}

interface Session {
  id: string;
  mentorName: string;
  date: string;
  timeSlot: string;
}

interface Meeting {
  id: string;
  roomId: string;
  mentorName: string;
  createdAt: Timestamp;
  attended? : boolean;
  status?: string; // Add status field to Meeting interface
}

const timeSlots = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
];

const RateMentor: React.FC<{ mentorId: string; mentorName: string }> = ({ mentorId, mentorName }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingSubmit = async () => {
    if (!rating) return;

    try {
      const mentorRef = doc(db, "users", mentorId);
      const mentorSnap = await getDoc(mentorRef);

      if (mentorSnap.exists()) {
        const mentorData = mentorSnap.data();
        const currentRatings = mentorData.ratings || [];
        const updatedRatings = [...currentRatings, rating];
        const averageRating =
          updatedRatings.reduce((sum, r) => sum + r, 0) / updatedRatings.length;

        await updateDoc(mentorRef, {
          ratings: arrayUnion(rating),
          averageRating,
        });

        setSubmitted(true);
        alert(`Rating submitted successfully for ${mentorName}!`);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Rate {mentorName}</h3>
      <div className="flex space-x-2 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`p-2 rounded-full transition-colors ${
              rating && star <= rating
                ? 'bg-yellow-400 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setRating(star)}
          >
            <Star className="w-4 h-4" />
          </button>
        ))}
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        onClick={handleRatingSubmit}
        disabled={submitted || !rating}
      >
        {submitted ? "Rating Submitted ✓" : "Submit Rating"}
      </button>
    </div>
  );
};

export function BookingPage() {
  const { user } = useAuth();
  const [experts, setExperts] = useState<Mentor[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [bookedSessions, setBookedSessions] = useState<Session[]>([]);
  const [ongoingMeetings, setOngoingMeetings] = useState<Meeting[]>([]);
  const [mentorTimeSlots, setMentorTimeSlots] = useState<string[]>([]); // Add state for mentor's time slots
  const [attendedMeetings, setAttendedMeetings] = useState<Meeting[]>([]); // Add state for attended meetings

  // Fetch experts from Firestore
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        // Log fetched data for debugging
        console.log("Fetched users:", snapshot.docs.map((doc) => doc.data()));

        // Ensure the role and domain fields are properly fetched
        const expertsList = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || "Unknown",
              email: data.email || "No Email",
              photoURL: data.photoURL || "",
              role: data.role || "",
              domain: data.details?.domain || "Not Specified", // Fetch domain from details
              experience: data.details?.experience || "Not Specified",
              expertise: data.details?.expertise || "Not Specified",
              availableTimeSlots: data.details?.availableTimeSlots || [], // Fetch availableTimeSlots from details
              rating: data.details?.rating || 0, // Fetch rating from details
            } as Mentor;
          })
          .filter((u) => u.role === "mentor"); // Filter only experts

        console.log("Filtered experts:", expertsList); // Log filtered experts
        setExperts(expertsList);
        setFilteredExperts(expertsList); // Initialize filtered experts
      } catch (error) {
        console.error("Error fetching experts:", error);
      }
    };

    fetchExperts();
  }, []);

  // Fetch booked sessions for the student
  useEffect(() => {
    const fetchBookedSessions = async () => {
      if (!user) return;

      try {
        const sessionsRef = collection(db, "bookings");
        const q = query(
          sessionsRef,
          where("studentId", "==", user.uid),
          orderBy("date", "asc")
        );
        const snapshot = await getDocs(q);

        const sessionsList = snapshot.docs.map((doc) => {
          const data = doc.data();
          const date =
            data.date?.toDate?.() || // If it's a Firestore Timestamp, convert to Date
            new Date(data.date); // If it's a string, convert to Date

          return {
            id: doc.id,
            mentorName: data.mentorName,
            date: date.toLocaleString(), // Convert Date to readable string
            timeSlot: data.timeSlot,
          };
        }) as Session[];

        console.log("Fetched booked sessions for student:", sessionsList);
        setBookedSessions(sessionsList);
      } catch (error) {
        console.error("Error fetching booked sessions for student:", error);
      }
    };

    fetchBookedSessions();
  }, [user]);

  // Fetch ongoing meetings
  useEffect(() => {
    const fetchOngoingMeetings = async () => {
      try {
        const meetingsRef = collection(db, "videoRooms");
        const snapshot = await getDocs(meetingsRef);

        const meetingsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          roomId: doc.id,
          mentorName: doc.data().mentorName,
          createdAt: doc.data().createdAt?.toDate()?.toLocaleString() || "Unknown",
        })) as Meeting[];

        setOngoingMeetings(meetingsList);
      } catch (error) {
        console.error("Error fetching ongoing meetings:", error);
      }
    };

    fetchOngoingMeetings();
  }, []);

  // Fetch attended meetings from Firestore
  useEffect(() => {
    const fetchAttendedMeetings = async () => {
      try {
        const meetingsRef = collection(db, "videoRooms");
        const q = query(meetingsRef, where("status", "==", "attended"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedMeetings = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Meeting[];
          setAttendedMeetings(fetchedMeetings);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching attended meetings:", error);
      }
    };

    fetchAttendedMeetings();
  }, []);

  // Filter experts based on search query
  useEffect(() => {
    const filtered = experts.filter((mentor) =>
      mentor.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExperts(filtered);
  }, [searchQuery, experts]);

  useEffect(() => {
    if (selectedMentor) {
      setMentorTimeSlots(selectedMentor.availableTimeSlots || []); // Fetch mentor's time slots
    }
  }, [selectedMentor]);

  useEffect(() => {
    const fetchMentorTimeSlots = async () => {
      if (!selectedMentor) return;

      try {
        const mentorRef = doc(db, "users", selectedMentor.id);
        const mentorSnap = await getDoc(mentorRef);

        if (mentorSnap.exists()) {
          const mentorData = mentorSnap.data();
          setMentorTimeSlots(mentorData.availableTimeSlots || []); // Fetch and set available time slots
        } else {
          console.error("Mentor data not found in Firestore.");
          setMentorTimeSlots([]); // Reset time slots if mentor data is not found
        }
      } catch (error) {
        console.error("Error fetching mentor time slots:", error);
        setMentorTimeSlots([]); // Reset time slots on error
      }
    };

    fetchMentorTimeSlots();
  }, [selectedMentor]);

  const handleBooking = async () => {
    if (!selectedMentor || !selectedDate || !selectedTime || !user) return;

    setLoading(true);

    try {
      // Save booking details to Firestore
      const bookingRef = collection(db, "bookings");
      await addDoc(bookingRef, {
        studentId: user.uid,
        studentName: user.displayName,
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        mentorPhotoURL: selectedMentor.photoURL, // Add this line
        date: selectedDate.toISOString(), // Fixed syntax error
        timeSlot: selectedTime,
        createdAt: serverTimestamp(),
      });

      // Send a message to the mentor
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        text: `You have a new mentoring session booked by ${user.displayName} on ${format(
          selectedDate,
          "yyyy-MM-dd"
        )} at ${selectedTime}.`,
        userId: selectedMentor.id,
        username: selectedMentor.name,
        timestamp: serverTimestamp(),
      });

      // Send a notification to the mentor
      const notificationsRef = collection(db, "notifications");
      await addDoc(notificationsRef, {
        mentorId: selectedMentor.id,
        studentName: user.displayName,
        date: selectedDate.toISOString(), // Fixed syntax error
        timeSlot: selectedTime,
        message: `You have a new session booked by ${user.displayName} on ${format(
          selectedDate,
          "yyyy-MM-dd"
        )} at ${selectedTime}.`,
        read: false, // Mark notification as unread
        createdAt: serverTimestamp(),
      });

      alert("Session booked successfully!");
      setSelectedMentor(null);
      setSelectedDate(undefined);
      setSelectedTime("");
    } catch (error) {
      console.error("Error booking session:", error);
      alert("Failed to book session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter meetings into attended, ongoing, and missed categories
  const today = new Date();
  const attendedMeetingsFiltered = ongoingMeetings.filter((meeting) => {
    const meetingDate = meeting.createdAt instanceof Timestamp
      ? meeting.createdAt.toDate()
      : new Date(meeting.createdAt);
    return meeting.attended; // Show all attended meetings
  });
  const ongoingMeetingsFiltered = ongoingMeetings.filter((meeting) => {
    const meetingDate = meeting.createdAt instanceof Timestamp
      ? meeting.createdAt.toDate()
      : new Date(meeting.createdAt);
    return !meeting.attended && meetingDate.toDateString() === today.toDateString();
  });
  const missedMeetings = ongoingMeetings.filter((meeting) => {
    const meetingDate = meeting.createdAt instanceof Timestamp
      ? meeting.createdAt.toDate()
      : new Date(meeting.createdAt);
    return !meeting.attended && meetingDate < today;
  });

  // Ensure proper type annotations and error handling for updateMeetingStatus
  const updateMeetingStatus = async (meetingId: string, status: string) => {
    try {
      const meetingRef = doc(db, "videoRooms", meetingId);
      await updateDoc(meetingRef, { status });
      console.log(`Meeting ${meetingId} status updated to ${status}`);
    } catch (error) {
      console.error(`Error updating meeting ${meetingId} status to ${status}:`, error);
    }
  };

  // Categorize meetings and update their status in Firestore
  useEffect(() => {
    const categorizeMeetings = async () => {
      const today = new Date();

      ongoingMeetings.forEach(async (meeting) => {
        const meetingDate = new Date(meeting.createdAt.toString());

        if (meetingDate.toDateString() === today.toDateString() && !meeting.attended) {
          await updateMeetingStatus(meeting.id, "ongoing");
        } else if (meetingDate <= today && meeting.attended) {
          await updateMeetingStatus(meeting.id, "attended");
        } else if (meetingDate < today && !meeting.attended) {
          await updateMeetingStatus(meeting.id, "missed");
        }
      });
    };

    categorizeMeetings();
  }, [ongoingMeetings]);

  // Ensure meeting status is updated only once and persists in the database
  useEffect(() => {
    const categorizeMeetings = async () => {
      const today = new Date();

      ongoingMeetings.forEach(async (meeting) => {
        const meetingDate = meeting.createdAt instanceof Timestamp
          ? meeting.createdAt.toDate()
          : new Date(meeting.createdAt);

        if (meetingDate.toDateString() === today.toDateString() && meeting.status !== "ongoing") {
          await updateMeetingStatus(meeting.id, "ongoing");
        } else if (meetingDate <= today && meeting.attended && meeting.status !== "attended") {
          await updateMeetingStatus(meeting.id, "attended");
        } else if (meetingDate < today && !meeting.attended && meeting.status !== "missed") {
          await updateMeetingStatus(meeting.id, "missed");
        }
      });
    };

    categorizeMeetings();
  }, [ongoingMeetings]);

  // Ensure meeting status is updated only when necessary
  useEffect(() => {
    const categorizeMeetings = async () => {
      const today = new Date();

      ongoingMeetings.forEach(async (meeting) => {
        const meetingDate = meeting.createdAt instanceof Timestamp
          ? meeting.createdAt.toDate()
          : new Date(meeting.createdAt);

        if (meeting.status === "attended" || meeting.status === "missed") {
          // Skip updating if the status is already attended or missed
          return;
        }

        if (meetingDate.toDateString() === today.toDateString() && meeting.status !== "ongoing") {
          await updateMeetingStatus(meeting.id, "ongoing");
        } else if (meetingDate < today && meeting.attended && meeting.status !== "attended") {
          await updateMeetingStatus(meeting.id, "attended");
        } else if (meetingDate < today && !meeting.attended && meeting.status !== "missed") {
          await updateMeetingStatus(meeting.id, "missed");
        }
      });
    };

    categorizeMeetings();
  }, [ongoingMeetings]);

  const handleJoinMeeting = async (meetingId: string) => {
    try {
      const meetingRef = doc(db, "videoRooms", meetingId);
      await updateDoc(meetingRef, { attended: true }); // Update attended status
      await updateDoc(meetingRef, { status: "attended" });
      console.log("Meeting status updated to attended");
    } catch (error) {
      console.error("Error updating meeting status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <Link to="/booking" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Unlimitly</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
              <Link to="/chat" className="text-gray-600 hover:text-gray-900 font-medium">Messages</Link>
              <Link to="/faq" className="text-gray-600 hover:text-gray-900 font-medium">FAQs</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book a Mentoring Session
          </h1>
          <p className="text-gray-600">Connect with expert experts to accelerate your learning journey.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search experts by domain (e.g., React, Python, Data Science)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Meeting Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Ongoing Meetings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="ml-3 font-semibold text-gray-900">Ongoing Meetings</h3>
            </div>
            {ongoingMeetingsFiltered.length > 0 ? (
              <div className="space-y-3">
                {ongoingMeetingsFiltered.slice(0, 3).map((meeting) => (
                  <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-medium text-gray-900 text-sm">{meeting.mentorName}</p>
                    <p className="text-xs text-gray-600">Room: {meeting.roomId}</p>
                    <a
                      href={`https://meet.jit.si/${meeting.roomId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm mt-2"
                      onClick={() => handleJoinMeeting(meeting.id)}
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Join Meeting
                    </a>
                    
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No ongoing meetings</p>
            )}
          </div>

          {/* Attended Meetings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="ml-3 font-semibold text-gray-900">Attended Meetings</h3>
            </div>
            {attendedMeetingsFiltered.length > 0 ? (
              <div className="space-y-3">
                {attendedMeetingsFiltered.slice(0, 3).map((meeting) => (
                  <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-medium text-gray-900 text-sm">{meeting.mentorName}</p>
                    <p className="text-xs text-gray-600">Room: {meeting.roomId}</p>
                    <p className="text-xs text-green-600">✓ Completed</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No attended meetings</p>
            )}
          </div>

          {/* Missed Meetings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="ml-3 font-semibold text-gray-900">Missed Meetings</h3>
            </div>
            {missedMeetings.length > 0 ? (
              <div className="space-y-3">
                {missedMeetings.slice(0, 3).map((meeting) => (
                  <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-medium text-gray-900 text-sm">{meeting.mentorName}</p>
                    <p className="text-xs text-gray-600">Room: {meeting.roomId}</p>
                    <p className="text-xs text-red-600">✗ Missed</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No missed meetings</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mentor Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Choose a Mentor</h2>
              <div className="space-y-4">
                {filteredExperts.map((mentor) => (
                  <div
                    key={mentor.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMentor?.id === mentor.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedMentor(mentor)}
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={mentor.photoURL} alt={mentor.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {mentor.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">{mentor.email}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            <MapPin className="w-3 h-3 mr-1" />
                            {mentor.domain}
                          </span>
                          <span className="text-xs text-gray-500">{mentor.experience} years exp.</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{mentor.expertise}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900">4.5</span>
                      </div>
                    </div>
                    {selectedMentor?.id === mentor.id && (
                      <RateMentor mentorId={mentor.id} mentorName={mentor.name} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar and Time Selection */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Date</h2>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-lg p-4"
                modifiersClassNames={{
                  selected: 'custom-selected-day',
                }}
              />
            </div>

            {selectedDate && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Time</h2>
                {mentorTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {mentorTimeSlots.map((time) => (
                      <button
                        key={time}
                        className={`p-3 text-sm rounded-lg border transition-all ${
                          selectedTime === time
                            ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No available time slots</p>
                    <p className="text-xs text-gray-400">This mentor hasn't set their availability yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Booking Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedDate || !selectedMentor || !selectedTime || loading}
                onClick={handleBooking}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {loading ? "Booking Session..." : "Book Session"}
              </Button>
              {selectedMentor && selectedDate && selectedTime && (
                <p className="text-sm text-gray-600 mt-3 text-center">
                  Session with {selectedMentor.name} on {selectedDate.toLocaleDateString()} at {selectedTime}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Experts */}
        {searchQuery && <RecommendedExperts domain={searchQuery} />}

        {/* Top Experts Section */}
        <TopExperts />
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

const RecommendedExperts: React.FC<{ domain: string }> = ({ domain }) => {
  const [experts, setExperts] = useState<Mentor[]>([]);

  useEffect(() => {
    const fetchTopExperts = async () => {
      if (!domain) return;

      try {
        const expertsRef = collection(db, "users");
        const q = query(
          expertsRef,
          where("role", "==", "mentor"),
          where("domain", "==", domain)
        );

        const snapshot = await getDocs(q);
        const fetchedExperts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const ratings = data.ratings || [];
          const highRatingFrequency = ratings.filter((r: number) => r >= 4).length; // Count ratings >= 4

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
            name: data.name || "Unknown",
            email: data.email || "No Email",
            photoURL: data.photoURL || "",
            role: data.role || "",
            domain: data.domain || "Not Specified",
            experience: data.experience || "Not Specified",
            expertise: data.expertise || "Not Specified",
            highRatingFrequency,
            highestFrequencyRating,
          } as Mentor;
        });

        // Sort experts by the frequency of high ratings (descending)
        const sortedExperts = fetchedExperts.sort(
          (a, b) => 
            (Number(b.highRatingFrequency ?? 0)) - (Number(a.highRatingFrequency ?? 0))
        );

        setExperts(sortedExperts.slice(0, 5)); // Limit to top 5 experts
      } catch (error) {
        console.error("Error fetching top experts:", error);
      }
    };

    fetchTopExperts();
  }, [domain]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Top Experts for {domain}</h2>
      {experts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={mentor.photoURL} alt={mentor.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                    {mentor.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-600">{mentor.expertise}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{mentor.highestFrequencyRating}</span>
                    <span className="text-xs text-gray-500">({mentor.highRatingFrequency} high ratings)</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                View Profile
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No top experts found for this domain.</p>
        </div>
      )}
    </div>
  );
};

const TopExperts: React.FC = () => {
  const [experts, setExperts] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopExperts = async () => {
      try {
        const expertsRef = collection(db, "users");
        const snapshot = await getDocs(expertsRef);
        const fetchedExperts = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            const ratings = data.ratings || [];
            const ratingFrequency = ratings.reduce((acc: Record<number, number>, rating: number) => {
              acc[rating] = (acc[rating] || 0) + 1;
              return acc;
            }, {});
            const highestFrequencyRating = Object.keys(ratingFrequency).reduce((a, b) => ratingFrequency[Number(a)] > ratingFrequency[Number(b)] ? a : b, "1");
            return {
              id: doc.id,
              name: data.name,
              highestFrequencyRating,
              role: data.role,
            };
          })
          .filter((mentor) => mentor.role === "mentor");
        setExperts(fetchedExperts);
      } catch (error) {
        console.error("Error fetching top experts:", error);
      }
    };
    fetchTopExperts();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Top Rated Experts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = `/mentor/${mentor.id}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 text-lg">{mentor.name}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-yellow-600 font-semibold">{mentor.highestFrequencyRating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedExperts;