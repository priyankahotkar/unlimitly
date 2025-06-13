import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Mentor {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  domain: string;
  expertise: string;
  experience: string;
  ratings?: number[];
  [key: string]: any;
}

const MentorProfile: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentor = async () => {
      if (!mentorId) return;
      setLoading(true);
      try {
        const mentorRef = doc(db, "users", mentorId);
        const mentorSnap = await getDoc(mentorRef);
        if (mentorSnap.exists()) {
          const data = mentorSnap.data();
          // Support both root and nested 'details' fields
          setMentor({
            id: mentorSnap.id,
            name: data.name,
            email: data.email,
            photoURL: data.photoURL,
            domain: data.domain || data.details?.domain || '',
            expertise: data.expertise || data.details?.expertise || '',
            experience: data.experience || data.details?.experience || '',
            ratings: data.ratings || [],
          });
        }
      } catch (error) {
        console.error("Error fetching mentor details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [mentorId]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!mentor) return <div className="text-center py-20">Mentor not found.</div>;

  // Calculate most frequent rating
  const ratingFrequency = (mentor.ratings || []).reduce((acc: Record<number, number>, rating: number) => {
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});
  const highestFrequencyRating = Object.keys(ratingFrequency).reduce((a, b) => ratingFrequency[Number(a)] > ratingFrequency[Number(b)] ? a : b, "1");

  return (
    <div className="min-h-screen bg-[#f3f6fb] font-sans">
      <div className="max-w-2xl mx-auto py-12">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={mentor.photoURL} alt={mentor.name} />
            <AvatarFallback>{mentor.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-bold text-blue-900 mb-2">{mentor.name}</h2>
          <p className="text-gray-500 mb-2">{mentor.email}</p>
          <p className="text-gray-700 mb-2">Domain: <span className="font-semibold">{mentor.domain}</span></p>
          <p className="text-gray-700 mb-2">Expertise: <span className="font-semibold">{mentor.expertise}</span></p>
          <p className="text-gray-700 mb-2">Experience: <span className="font-semibold">{mentor.experience}</span></p>
          <p className="text-yellow-600 font-semibold mb-2">Most Frequent Rating: {highestFrequencyRating}</p>
          <div className="mt-4 w-full">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">All Ratings</h3>
            <div className="flex flex-wrap gap-2">
              {(mentor.ratings || []).length > 0 ? (
                mentor.ratings!.map((r, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{r}★</span>
                ))
              ) : (
                <span className="text-gray-400">No ratings yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
