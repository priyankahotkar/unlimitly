import React, { useState, useEffect } from "react";
import { Github, Linkedin, Mail, CheckCircle, Award, Target, Link as LinkIcon, Brain, Hammer, PartyPopper } from "lucide-react";
import Confetti from "react-confetti";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

const DSA_LEVELS = [
  {
    level: 0,
    title: "Foundation Builder",
    badge: "Logic Initiate",
    emoji: "🧱",
    badgeEmoji: "🏅",
    goal: "Understand programming basics and how logic works.",
    topics: ["Time & Space Complexity", "Recursion & Iteration", "Basic Math, Prime Numbers, GCD"],
    resources: [
      { label: "Apna College - Recursion", url: "https://youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ" },
      { label: "Big O Notation – GFG", url: "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/" },
    ],
    practice: ["Fibonacci (with recursion)", "Factorial", "Check Prime, Count Digits"],
  },
  {
    level: 1,
    title: "Array Architect",
    badge: "Array Warrior",
    emoji: "📦",
    badgeEmoji: "🏅",
    topics: ["1D & 2D Arrays", "Prefix Sums", "Sliding Window", "Two Pointers"],
    resources: [
      { label: "Striver's Sheet - Arrays", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" },
      { label: "Love Babbar Sheet - Arrays", url: "https://docs.google.com/spreadsheets/d/1rDjF1t37zi2W23wNmNZtWy6oxuggl9t1/edit" },
    ],
    practice: ["Max Subarray Sum (Kadane's)", "Trapping Rain Water", "Rotate Array"],
  },
  {
    level: 2,
    title: "String Specialist",
    badge: "String Sorcerer",
    emoji: "🧵",
    badgeEmoji: "🏅",
    topics: ["String Reversal", "Substrings/Subsequences", "Frequency Count", "Palindromes", "Anagrams"],
    resources: [
      { label: "TakeUForward Strings Playlist", url: "https://youtube.com/playlist?list=PLgUwDviBIf0o5Xn2lyT2bInMn1jT1KqUF" },
      { label: "LeetCode – String Tag", url: "https://leetcode.com/tag/string/" },
    ],
    practice: ["Longest Palindrome Substring", "Valid Anagram", "Count and Say"],
  },
  {
    level: 3,
    title: "Hashing & Maps",
    badge: "Hash Knight",
    emoji: "📚",
    badgeEmoji: "🏅",
    topics: ["HashMap, HashSet", "Frequency Tables", "Count Distinct Elements"],
    resources: [
      { label: "GFG – Hashing", url: "https://www.geeksforgeeks.org/hashing-data-structure/" },
      { label: "Neetcode HashMap", url: "https://neetcode.io/" },
    ],
    practice: ["Two Sum", "Subarray Sum Equals K", "Group Anagrams"],
  },
  {
    level: 4,
    title: "Recursion & Backtracking",
    badge: "Backtrack Ninja",
    emoji: "🌲",
    badgeEmoji: "🏅",
    topics: ["Base & Recursive Cases", "Subsets, Permutations", "N-Queens", "Sudoku Solver"],
    resources: [
      { label: "TakeUForward – Recursion", url: "https://www.youtube.com/watch?v=QYzYvE5Gk9c" },
      { label: "Backtracking GFG", url: "https://www.geeksforgeeks.org/backtracking-introduction/" },
    ],
    practice: ["Subset Sum", "N-Queens", "Word Search"],
  },
  {
    level: 5,
    title: "Stack & Queue Mastery",
    badge: "Data Structure Dominator",
    emoji: "📑",
    badgeEmoji: "🏅",
    topics: ["Stack Using Array/Linked List", "Infix/Postfix", "Monotonic Stack", "Queue, Deque"],
    resources: [
      { label: "Stack + Queue – Luv", url: "https://www.youtube.com/watch?v=_6COl6V6mng" },
      { label: "Stack – LeetCode", url: "https://leetcode.com/tag/stack/" },
    ],
    practice: ["Next Greater Element", "Min Stack", "Sliding Window Maximum"],
  },
  {
    level: 6,
    title: "Linked List Legend",
    badge: "Pointer Prodigy",
    emoji: "🌐",
    badgeEmoji: "🏅",
    topics: ["Singly/Doubly LL", "Fast & Slow Pointers", "Reversal, Merge, Detect Cycles"],
    resources: [
      { label: "Striver's Linked List Series", url: "https://youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xT8a8cF" },
      { label: "Neetcode LL", url: "https://neetcode.io/" },
    ],
    practice: ["Merge Two Sorted Lists", "Reverse LL", "Detect Cycle"],
  },
  {
    level: 7,
    title: "Tree & Binary Tree Master",
    badge: "Tree Whisperer",
    emoji: "🧮",
    badgeEmoji: "🏅",
    topics: ["Inorder, Preorder, Postorder", "Height, Diameter, LCA", "Binary Search Tree Basics"],
    resources: [
      { label: "Striver – Trees", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0q6FY9v1XYvlzBlXkAaNJgF" },
      { label: "LeetCode – Trees", url: "https://leetcode.com/tag/tree/" },
    ],
    practice: ["Level Order Traversal", "Height of Binary Tree", "Balanced Tree Check"],
  },
  {
    level: 8,
    title: "Graph God Mode",
    badge: "Graph Gladiator",
    emoji: "🔗",
    badgeEmoji: "🏅",
    topics: ["BFS, DFS", "Topo Sort", "Dijkstra, Bellman-Ford", "DSU, MST (Kruskal, Prim)"],
    resources: [
      { label: "Striver – Graph Series", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0rGEWe64KWas0Nryn7SCRWw" },
      { label: "CP Algorithms - Graphs", url: "https://cp-algorithms.com/" },
    ],
    practice: ["Number of Islands", "Course Schedule", "Dijkstra's Algorithm"],
  },
  {
    level: 9,
    title: "Advanced DSA Concepts",
    badge: "Algorithm Ace",
    emoji: "🧠",
    badgeEmoji: "🏅",
    topics: ["Dynamic Programming (0/1 Knapsack, LIS, LCS)", "Tries", "Segment Trees", "Sliding Window Optimizations"],
    resources: [
      { label: "Aditya Verma – DP Playlist", url: "https://youtube.com/playlist?list=PL_z_8CaSLPWeT1ffjiImo0sYTcnLzo-wY" },
      { label: "Striver – DP Series", url: "https://takeuforward.org/dynamic-programming/" },
    ],
    practice: ["0/1 Knapsack", "Longest Increasing Subsequence", "Edit Distance"],
  },
];

const FINAL_BADGE = {
  emoji: "🎖",
  title: "DSA Conqueror",
  desc: "Awarded when the learner clears all checkpoints",
};

export default function FreeResources() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(Array(DSA_LEVELS.length).fill(false));
  const [showVerify, setShowVerify] = useState(-1);
  const [badges, setBadges] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState<{ idx: number; badge: string } | null>(null);

  // Load badges from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchBadges = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.badges && Array.isArray(data.badges)) {
          setBadges(data.badges);
          // Mark completed for already earned badges
          setCompleted(DSA_LEVELS.map(l => data.badges.includes(l.badge)));
        }
      }
    };
    fetchBadges();
  }, [user]);

  const handleComplete = (idx: number) => {
    setShowVerify(idx);
  };

  const confirmComplete = async (idx: number) => {
    const badge = DSA_LEVELS[idx].badge;
    if (!badges.includes(badge) && user) {
      // Update Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        badges: [...badges, badge],
      });
    }
    const newCompleted = [...completed];
    newCompleted[idx] = true;
    setCompleted(newCompleted);
    setShowVerify(-1);
    if (!badges.includes(badge)) {
      setBadges([...badges, badge]);
      setShowCelebration({ idx, badge });
    }
  };

  const closeCelebration = () => setShowCelebration(null);

  // Progress calculation
  const progress = Math.round((badges.length / DSA_LEVELS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f6fb] to-white px-2 md:px-0 font-sans">
      {/* Confetti and Celebration Modal */}
      {showCelebration && (
        <>
          <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={350} recycle={false} />
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center border-2 border-blue-200 animate-pop">
              <PartyPopper className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-3xl font-extrabold text-blue-700 mb-2">Congratulations!</h2>
              <p className="text-lg text-gray-700 mb-4">You've earned the <span className="font-bold text-blue-600">{showCelebration.badge}</span> badge!</p>
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-6 py-3 rounded-2xl font-bold text-xl shadow mb-4">
                <Award className="w-7 h-7 text-blue-500" /> {showCelebration.badge}
              </span>
              <div>
                <button onClick={closeCelebration} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full font-bold text-lg shadow transition-all">Awesome!</button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="max-w-3xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-8 border border-blue-100">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-700">Roadmap Progress</span>
            <span className="text-xs font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-blue-500 to-purple-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-blue-800 mb-2 text-center flex items-center justify-center gap-2 tracking-tight">
          <Award className="w-8 h-8 text-blue-500" /> Free DSA Roadmap
        </h1>
        <p className="text-center text-lg text-gray-600 mb-8">From Zero to Algorithm Hero</p>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {badges.length > 0 && badges.map((badge, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 px-3 py-1 rounded-full font-semibold text-sm shadow border border-blue-300">
              <Award className="w-4 h-4 text-blue-500" /> {badge}
            </span>
          ))}
          {badges.length === DSA_LEVELS.length && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-100 to-green-200 text-green-900 px-3 py-1 rounded-full font-bold text-base shadow border border-green-300 animate-bounce">
              {FINAL_BADGE.emoji} {FINAL_BADGE.title}
            </span>
          )}
        </div>
        {DSA_LEVELS.map((level, idx) => (
          <div
            key={level.level}
            className="mb-10 bg-white rounded-2xl shadow-lg p-8 relative border-l-4 border-blue-400 hover:shadow-2xl transition-shadow duration-300 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <h2 style={{ fontFamily: 'Times New Roman, Times, serif' }}
              className="text-2xl font-bold text-blue-900 group-hover:text-purple-700 transition-colors duration-200">Level {level.level}: {level.title}</h2>
              <span className="ml-2 inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full font-semibold text-xs border border-blue-200">
                {level.badgeEmoji} {level.badge}
              </span>
              {completed[idx] && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
            </div>
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium"><Target className="w-3 h-3" /> Goal</span>
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium"><Brain className="w-3 h-3" /> Key Topics</span>
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium"><LinkIcon className="w-3 h-3" /> Free Resources</span>
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium"><Hammer className="w-3 h-3" /> Practice</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-blue-700">Goal:</span> <span className="text-gray-700">{level.goal || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-blue-700">Topics:</span> {level.topics.map((t, i) => <span key={i} className="inline-block bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full text-xs mx-1 border border-blue-100">{t}</span>)}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-blue-700">Resources:</span> {level.resources.map((r, i) => <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="inline-block underline text-blue-600 hover:text-purple-700 mx-1 font-medium transition-colors duration-200">{r.label}</a>)}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-blue-700">Practice:</span> {level.practice.map((p, i) => <span key={i} className="inline-block bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full text-xs mx-1 border border-blue-100">{p}</span>)}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id={`complete-${idx}`} checked={completed[idx]} disabled={completed[idx]} onChange={() => handleComplete(idx)} className="w-5 h-5 accent-blue-600" />
              <label htmlFor={`complete-${idx}`} className="text-blue-700 font-semibold cursor-pointer select-none">Mark as Completed</label>
              {completed[idx] && <span className="text-green-600 font-bold ml-2">Badge Earned!</span>}
            </div>
            {/* Verification Modal */}
            {showVerify === idx && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center border border-blue-200">
                  <h3 className="text-xl font-bold mb-4 text-blue-700">Verify Completion</h3>
                  <p className="mb-4">Are you sure you have completed all the topics and practice for <span className="font-semibold">Level {level.level}: {level.title}</span>?</p>
                  <button onClick={() => confirmComplete(idx)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold mr-2 shadow transition-all">Yes, I did!</button>
                  <button onClick={() => setShowVerify(-1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-bold shadow">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Final Badge */}
        {badges.length === DSA_LEVELS.length && (
          <div className="text-center mt-10">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-200 to-green-300 text-green-900 px-6 py-3 rounded-2xl font-bold text-xl shadow-lg border border-green-300 animate-bounce">
              {FINAL_BADGE.emoji} {FINAL_BADGE.title}
            </span>
            <p className="text-green-700 mt-2 font-semibold">{FINAL_BADGE.desc}</p>
          </div>
        )}
      </div>
      
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