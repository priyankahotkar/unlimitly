import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import JitsiMeet from "../components/JitsiMeet";
import { ArrowLeft } from "lucide-react";

export function VideoCallPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  useEffect(() => {
    const handleRoomLogic = async () => {
      if (!sessionId) {
        if (role === "mentor") {
          // Generate a new room for experts
          const newRoomId = `mentor-room-${uuidv4()}`;
          try {
            const roomRef = doc(db, "videoRooms", newRoomId);
            await setDoc(roomRef, {
              mentorId: user?.uid,
              mentorName: user?.displayName || "Unknown Mentor",
              createdAt: serverTimestamp(),
            });
            console.log("New room created:", newRoomId);
            navigate(`/video-call/${newRoomId}`);
          } catch (error) {
            console.error("Error creating room:", error);
          }
        } else {
          // Redirect students to their dashboard if no room ID is provided
          console.error("No room ID provided for student.");
          navigate("/dashboard");
        }
      } else if (role === "student") {
        // Ensure students can only join existing rooms
        console.log("Student joining room:", sessionId);
      }
    };

    handleRoomLogic();

    return () => {
      console.log("Cleaning up video call resources...");
      // Add any necessary cleanup logic here
    };
  }, [sessionId, role, user, navigate]);

  const handleEndMeeting = async () => {
    if (!sessionId) return;
    try {
      const meetingRef = doc(db, "videoRooms", sessionId);
      await updateDoc(meetingRef, { attended: true, status: "attended" });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error ending meeting:", error);
    }
  };

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-blue-500">Processing room logic...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <button
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <h2 className="text-lg font-semibold text-gray-900 truncate">Meeting Room - {sessionId}</h2>
        <button
          onClick={handleEndMeeting}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
        >
          End/Leave Meeting
        </button>
      </div>
      <div className="w-full flex-1 flex items-center justify-center">
        <JitsiMeet roomName={sessionId} />
      </div>
    </div>
  );
}
