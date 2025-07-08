import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Award, Calendar, MapPin, BookOpen, Clock, User, Mail, Briefcase, Globe, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UserProfile {
  name: string;
  email: string;
  photoURL: string;
  domain: string;
  expertise: string;
  experience: string;
  bio: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  role: string;
  availableTimeSlots: string[];
  badges?: string[];
  organization?: string; // Added for mentor details
  details?: { // Added for mentor details
    domain: string;
    expertise: string;
    experience: string;
    organization: string;
  };
}

interface ActivityDay {
  date: string; // YYYY-MM-DD
  count: number;
}

function getPastNDates(n: number) {
  const dates = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function getActivityColor(count: number) {
  // LeetCode-like green gradient for light background
  if (count === 0) return 'bg-gray-200 border-gray-300';
  if (count === 1) return 'bg-green-100 border-green-200';
  if (count === 2) return 'bg-green-300 border-green-400';
  if (count === 3) return 'bg-green-500 border-green-500';
  if (count >= 4) return 'bg-green-700 border-green-700';
  return 'bg-gray-200 border-gray-300';
}

export default function ViewProfile() {
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [badgesDSA, setBadgesDSA] = useState<string[]>([]);
  const [badgesDSAAlt, setBadgesDSAAlt] = useState<string[]>([]); // from 'badges'
  const [badgesML, setBadgesML] = useState<string[]>([]);
  const [activity, setActivity] = useState<ActivityDay[]>([]);
  const [dsaProgress, setDsaProgress] = useState(0);
  const [mlProgress, setMlProgress] = useState(0);

  // Full badge lists for progress (from FreeResources, DSAPractice, MachineLearningHub)
  const DSA_BADGE_LIST = [
    // FreeResources badges
    "Logic Initiate", "Array Warrior", "String Sorcerer", "Hash Knight", "Backtrack Ninja", "Data Structure Dominator", "Pointer Prodigy", "Tree Whisperer", "Graph Gladiator", "Algorithm Ace",
    // DSAPractice badges
    "Array Ace", "String Star", "Hash Hero", "List Legend", "Stack Savant", "Tree Titan", "Graph Guru", "DP Dynamo"
  ];
  const ML_BADGE_LIST = [
    "Python Learner", "Model Tuner", "ML Project Pro"
  ];

  // Fetch user profile and badges
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setProfile({
          name: data.name || user.displayName || '',
          email: data.email || user.email || '',
          photoURL: data.photoURL || user.photoURL || '',
          domain: data.domain || data.details?.domain || '',
          expertise: data.expertise || data.details?.expertise || '',
          experience: data.experience || data.details?.experience || '',
          organization: data.organization || data.details?.organization || '',
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          role: data.role || role || '',
          availableTimeSlots: data.availableTimeSlots || [],
          badges: data.badges || [],
        });
        // DSA badges from both fields
        setBadgesDSA(Array.isArray(data.dsaBadges) ? data.dsaBadges : []);
        setBadgesDSAAlt(Array.isArray(data.badges) ? data.badges : []);
        // ML badges
        setBadgesML(Array.isArray(data.mlBadges) ? data.mlBadges : []);
        // Progress
        const dsaUserBadges = new Set([...(data.dsaBadges || []), ...(data.badges || [])]);
        setDsaProgress(Math.round((Array.from(dsaUserBadges).filter(b => DSA_BADGE_LIST.includes(b)).length / DSA_BADGE_LIST.length) * 100));
        setMlProgress(Math.round(((data.mlBadges || []).filter((b:string) => ML_BADGE_LIST.includes(b)).length / ML_BADGE_LIST.length) * 100));
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user, role]);

  // Save activity for today
  useEffect(() => {
    if (!user) return;
    const saveActivity = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const activityRef = doc(db, 'users', user.uid, 'user_activity', today);
      await setDoc(activityRef, { date: today, count: 1, updatedAt: serverTimestamp() }, { merge: true });
    };
    saveActivity();
  }, [user]);

  // Fetch activity for the last 180 days
  useEffect(() => {
    if (!user) return;
    const fetchActivity = async () => {
      const days = getPastNDates(180);
      const activityCol = collection(db, 'users', user.uid, 'user_activity');
      const snapshot = await getDocs(activityCol);
      const map: Record<string, number> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.date) map[data.date] = data.count || 1;
      });
      setActivity(days.map(date => ({ date, count: map[date] || 0 })));
    };
    fetchActivity();
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to={role === 'mentor' ? '/mentor-dashboard' : '/dashboard'} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <User className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Your Profile</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={profile.photoURL} alt={profile.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-semibold">
                  {profile.name[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <Link to="/edit-profile" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Edit3 className="w-4 h-4" />
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
            <p className="text-gray-600 capitalize">{profile.role} • {profile.domain}</p>
            <div className="flex justify-center mt-2 space-x-2">
              <span className="flex items-center text-gray-500 text-sm"><Mail className="w-4 h-4 mr-1" />{profile.email}</span>
              {profile.location && <span className="flex items-center text-gray-500 text-sm"><MapPin className="w-4 h-4 mr-1" />{profile.location}</span>}
            </div>
          </div>

          {/* Mentor Details Only */}
          {profile.role === 'mentor' ? (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Mentor Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-2 flex items-center text-gray-700"><Briefcase className="w-4 h-4 mr-2" /> <span>{profile.domain}</span></div>
                  <div className="mb-2 flex items-center text-gray-700"><BookOpen className="w-4 h-4 mr-2" /> <span>{profile.expertise}</span></div>
                  <div className="mb-2 flex items-center text-gray-700"><Clock className="w-4 h-4 mr-2" /> <span>{profile.experience}</span></div>
                  <div className="mb-2 flex items-center text-gray-700"><Briefcase className="w-4 h-4 mr-2" /> <span>{profile.organization}</span></div>
                  <div className="mb-2 flex items-center text-gray-700"><Globe className="w-4 h-4 mr-2" /> <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.website}</a></div>
                </div>
                <div>
                  <div className="mb-2 flex items-center text-gray-700"><User className="w-4 h-4 mr-2" /> <span>{profile.bio}</span></div>
                  <div className="mb-2 flex items-center text-gray-700"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a></div>
                  <div className="mb-2 flex items-center text-gray-700"><a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a></div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Available Time Slots</h4>
                {profile.availableTimeSlots && profile.availableTimeSlots.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.availableTimeSlots.map((slot, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                        <Clock className="w-4 h-4 mr-1 text-blue-500" /> {slot}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-gray-400 text-sm">No time slots set.</p>}
              </div>
            </div>
          ) : (
            <>
              {/* Badges */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">DSA Badges (from FreeResources)</h3>
                {badgesDSAAlt.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {badgesDSAAlt.map((badge, i) => (
                      <span key={i} title={badge} className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                        <Award className="w-4 h-4 mr-1 text-yellow-500" /> {badge}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-gray-400 text-sm mb-2">No FreeResources DSA badges yet.</p>}
                <h3 className="font-semibold text-gray-900 mb-2">DSA Badges (from DSAPractice)</h3>
                {badgesDSA.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {badgesDSA.map((badge, i) => (
                      <span key={i} title={badge} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                        <Award className="w-4 h-4 mr-1 text-blue-500" /> {badge}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-gray-400 text-sm mb-2">No DSAPractice badges yet.</p>}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-blue-700">DSA Progress</span>
                    <span className="text-xs font-bold text-blue-600">{dsaProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-blue-500 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${dsaProgress}%` }}
                    ></div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ML Badges</h3>
                {badgesML.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {badgesML.map((badge, i) => (
                      <span key={i} title={badge} className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-300">
                        <Award className="w-4 h-4 mr-1 text-green-500" /> {badge}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-gray-400 text-sm mb-2">No ML badges yet.</p>}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-green-700">ML Progress</span>
                    <span className="text-xs font-bold text-green-600">{mlProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${mlProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Activity Grid */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">Activity (last 6 months)</h3>
                {/* LeetCode-style activity grid with month separation and labels */}
                <ActivityGrid activity={activity} />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{activity[0]?.date}</span>
                  <span>{activity[activity.length-1]?.date}</span>
                </div>
              </div>
            </>
          )}

          {/* Profile Details (always show) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-2 flex items-center text-gray-700"><Briefcase className="w-4 h-4 mr-2" /> <span>{profile.domain}</span></div>
              <div className="mb-2 flex items-center text-gray-700"><BookOpen className="w-4 h-4 mr-2" /> <span>{profile.expertise}</span></div>
              <div className="mb-2 flex items-center text-gray-700"><Clock className="w-4 h-4 mr-2" /> <span>{profile.experience}</span></div>
              <div className="mb-2 flex items-center text-gray-700"><Globe className="w-4 h-4 mr-2" /> <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.website}</a></div>
            </div>
            <div>
              <div className="mb-2 flex items-center text-gray-700"><User className="w-4 h-4 mr-2" /> <span>{profile.bio}</span></div>
              <div className="mb-2 flex items-center text-gray-700"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a></div>
              <div className="mb-2 flex items-center text-gray-700"><a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ActivityGrid({ activity }: { activity: { date: string; count: number }[] }) {
  // LeetCode-style: columns = weeks, rows = days (Sun-Sat)
  // Group activity by week (each week is a column)
  const weeks: { date: string; count: number }[][] = [];
  let week: { date: string; count: number }[] = [];
  activity.forEach((day, i) => {
    const dateObj = new Date(day.date);
    if (week.length === 0 && dateObj.getDay() !== 0) {
      // Fill empty days at the start of the first week
      for (let d = 0; d < dateObj.getDay(); d++) week.push({ date: '', count: 0 });
    }
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) {
    // Fill empty days at the end
    while (week.length < 7) week.push({ date: '', count: 0 });
    weeks.push(week);
  }

  // Month labels: find the first week where a new month starts
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = '';
  weeks.forEach((w, i) => {
    for (let d = 0; d < 7; d++) {
      const day = w[d];
      if (day.date) {
        const dateObj = new Date(day.date);
        const month = dateObj.toLocaleString('default', { month: 'short' });
        if (month !== lastMonth) {
          monthLabels.push({ label: month, col: i });
          lastMonth = month;
        }
        break;
      }
    }
  });

  return (
    <div className="overflow-x-auto rounded-2xl p-4" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
      {/* Month labels */}
      <div className="flex ml-8 mb-1">
        {weeks.map((_, i) => {
          const label = monthLabels.find(m => m.col === i)?.label;
          return (
            <div key={i} className="flex-shrink-0" style={{ width: 22, textAlign: 'center' }}>
              {label ? <span className="text-xs text-gray-500 font-semibold">{label}</span> : ''}
            </div>
          );
        })}
      </div>
      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col mr-2 mt-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
            <span key={i} className="text-xs text-gray-400 h-5 mb-0.5" style={{ fontSize: 11 }}>{i % 2 === 0 ? d[0] : ''}</span>
          ))}
        </div>
        {/* Activity grid */}
        <div className="flex">
          {weeks.map((week, i) => {
            // Add a vertical separator if this week is the start of a new month
            const isMonthStart = monthLabels.some(m => m.col === i && i !== 0);
            return (
              <div key={i} className="flex flex-col relative" style={{ marginRight: 2 }}>
                {isMonthStart && <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-gray-300 rounded-full" style={{ zIndex: 1 }} />}
                {week.map((day, j) => (
                  <div
                    key={j}
                    title={day.date + (day.count ? `: ${day.count} activity` : '')}
                    className={`w-5 h-5 mb-1 rounded ${getActivityColor(day.count)} transition-colors`}
                    style={{ marginLeft: 0, marginRight: 0 }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 