import React, { useState, useEffect } from "react";
import { Compass, Github, Linkedin, Mail, Award, CheckCircle, PartyPopper } from "lucide-react";
import Confetti from "react-confetti";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const DSA_TOPICS = [
  {
    key: "arrays",
    title: "Arrays & Two Pointers",
    badge: "Array Ace",
    problems: {
      Easy: [
        { label: "Two Sum – LeetCode", url: "https://leetcode.com/problems/two-sum/" },
        { label: "Max Subarray Sum (Kadane) – GfG", url: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/" },
      ],
      Medium: [
        { label: "3Sum – LeetCode", url: "https://leetcode.com/problems/3sum/" },
        { label: "Trapping Rain Water – LeetCode", url: "https://leetcode.com/problems/trapping-rain-water/" },
      ],
    },
  },
  {
    key: "strings",
    title: "Strings",
    badge: "String Star",
    problems: {
      Easy: [
        { label: "Valid Anagram – LeetCode", url: "https://leetcode.com/problems/valid-anagram/" },
        { label: "Lowest Common Prefix – LeetCode", url: "https://leetcode.com/problems/longest-common-prefix/" },
      ],
      Medium: [
        { label: "Longest Substring Without Repeating Characters – LeetCode", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { label: "Smallest Window Containing All Characters – GfG", url: "https://www.geeksforgeeks.org/find-the-smallest-window-in-a-string-containing-all-characters-of-another-string/" },
      ],
    },
  },
  {
    key: "hashing",
    title: "Hashing / Maps",
    badge: "Hash Hero",
    problems: {
      Easy: [
        { label: "Two Sum – LeetCode", url: "https://leetcode.com/problems/two-sum/" },
        { label: "Count Distinct Elements in Window – GfG", url: "https://www.geeksforgeeks.org/count-distinct-elements-in-every-window-of-size-k/" },
      ],
      Medium: [
        { label: "Group Anagrams – LeetCode", url: "https://leetcode.com/problems/group-anagrams/" },
        { label: "Subarray Sum Equals K – LeetCode", url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
      ],
    },
  },
  {
    key: "linkedlists",
    title: "Linked Lists",
    badge: "List Legend",
    problems: {
      Easy: [
        { label: "Reverse Linked List – LeetCode", url: "https://leetcode.com/problems/reverse-linked-list/" },
        { label: "Middle of the Linked List – LeetCode", url: "https://leetcode.com/problems/middle-of-the-linked-list/" },
      ],
      Medium: [
        { label: "Merge Two Sorted Lists – LeetCode", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
        { label: "Detect Cycle in Linked List – LeetCode", url: "https://leetcode.com/problems/linked-list-cycle/" },
      ],
    },
  },
  {
    key: "stacksqueues",
    title: "Stacks & Queues",
    badge: "Stack Savant",
    problems: {
      Easy: [
        { label: "Valid Parentheses – LeetCode", url: "https://leetcode.com/problems/valid-parentheses/" },
        { label: "Min Stack – LeetCode", url: "https://leetcode.com/problems/min-stack/" },
      ],
      Medium: [
        { label: "Next Greater Element – LeetCode", url: "https://leetcode.com/problems/next-greater-element-i/" },
        { label: "Sliding Window Maximum – LeetCode", url: "https://leetcode.com/problems/sliding-window-maximum/" },
      ],
    },
  },
  {
    key: "trees",
    title: "Trees & BST",
    badge: "Tree Titan",
    problems: {
      Easy: [
        { label: "Maximum Depth of Binary Tree – LeetCode", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
        { label: "Invert Binary Tree – LeetCode", url: "https://leetcode.com/problems/invert-binary-tree/" },
      ],
      Medium: [
        { label: "Binary Tree Level Order Traversal – LeetCode", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
        { label: "Validate Binary Search Tree – LeetCode", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
      ],
    },
  },
  {
    key: "graphs",
    title: "Graphs",
    badge: "Graph Guru",
    problems: {
      Medium: [
        { label: "Number of Islands – LeetCode", url: "https://leetcode.com/problems/number-of-islands/" },
        { label: "Course Schedule (Detect Cycle) – LeetCode", url: "https://leetcode.com/problems/course-schedule/" },
      ],
      Hard: [
        { label: "Clone Graph – LeetCode", url: "https://leetcode.com/problems/clone-graph/" },
      ],
    },
  },
  {
    key: "dp",
    title: "Dynamic Programming",
    badge: "DP Dynamo",
    problems: {
      Easy: [
        { label: "Climbing Stairs – LeetCode", url: "https://leetcode.com/problems/climbing-stairs/" },
        { label: "Coin Change (min coins) – LeetCode", url: "https://leetcode.com/problems/coin-change/" },
      ],
      Medium: [
        { label: "Longest Increasing Subsequence – LeetCode", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
        { label: "Word Break – LeetCode", url: "https://leetcode.com/problems/word-break/" },
      ],
      Hard: [
        { label: "Edit Distance – LeetCode", url: "https://leetcode.com/problems/edit-distance/" },
        { label: "0/1 Knapsack – GfG", url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/" },
      ],
    },
  },
];

const ADDITIONAL_PRACTICE = [
  { label: "CodeForces Problemset", url: "https://codeforces.com/problemset" },
  { label: "CodeChef Long Challenges", url: "https://www.codechef.com/contests" },
  { label: "HackerRank Data Structures Practice", url: "https://www.hackerrank.com/domains/data-structures" },
];

const FINAL_BADGE = {
  emoji: "🏆",
  title: "DSA Practice Master",
  desc: "Awarded for practicing all core DSA topics!",
};

export default function DSAPractice() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(Array(DSA_TOPICS.length).fill(false));
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
        if (data.dsaBadges && Array.isArray(data.dsaBadges)) {
          setBadges(data.dsaBadges);
          setCompleted(DSA_TOPICS.map(l => data.dsaBadges.includes(l.badge)));
        }
      }
    };
    fetchBadges();
  }, [user]);

  const handleComplete = (idx: number) => {
    setShowVerify(idx);
  };

  const confirmComplete = async (idx: number) => {
    const badge = DSA_TOPICS[idx].badge;
    if (!badges.includes(badge) && user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        dsaBadges: [...badges, badge],
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f6fb] to-white px-2 md:px-0 font-sans">
      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto mb-8 py-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-blue-700">Practice Progress</span>
          <span className="text-xs font-bold text-blue-600">{Math.round((badges.length / DSA_TOPICS.length) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-400 rounded-full transition-all duration-500"
            style={{ width: `${(badges.length / DSA_TOPICS.length) * 100}%` }}
          ></div>
        </div>
      </div>
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
        <h1 className="text-4xl font-extrabold text-blue-800 mb-2 text-center flex items-center justify-center gap-2 tracking-tight">
          <Award className="w-8 h-8 text-blue-500" /> DSA Practice Problems
        </h1>
        <p className="text-center text-lg text-gray-600 mb-8">Top DSA problems by topic & difficulty, with direct links to LeetCode, GfG, CodeChef, CodeForces, and HackerRank.</p>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {badges.length > 0 && badges.map((badge, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 px-3 py-1 rounded-full font-semibold text-sm shadow border border-blue-300">
              <Award className="w-4 h-4 text-blue-500" /> {badge}
            </span>
          ))}
          {badges.length === DSA_TOPICS.length && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-100 to-green-200 text-green-900 px-3 py-1 rounded-full font-bold text-base shadow border border-green-300 animate-bounce">
              {FINAL_BADGE.emoji} {FINAL_BADGE.title}
            </span>
          )}
        </div>
        {DSA_TOPICS.map((topic, idx) => (
          <div key={topic.key} className="mb-10 bg-white rounded-2xl shadow-lg p-8 relative border-l-4 border-blue-400 hover:shadow-2xl transition-shadow duration-300 group">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-blue-900 group-hover:text-purple-700 transition-colors duration-200" style={{ fontFamily: 'Times New Roman, Times, serif' }}>{topic.title}</h2>
              <span className="ml-2 inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full font-semibold text-xs border border-blue-200">
                🏅 {topic.badge}
              </span>
              {completed[idx] && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
            </div>
            {Object.entries(topic.problems).map(([difficulty, problems]) => (
              <div key={difficulty} className="mb-2">
                <span className="font-semibold text-blue-700">{difficulty}:</span>
                <ul className="list-disc ml-6 mt-1">
                  {problems.map((p: { url: string | undefined; label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => (
                    <li key={i}>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-purple-700 font-medium transition-colors duration-200">
                        {p.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id={`complete-${idx}`} checked={completed[idx]} disabled={completed[idx]} onChange={() => handleComplete(idx)} className="w-5 h-5 accent-blue-600" />
              <label htmlFor={`complete-${idx}`} className="text-blue-700 font-semibold cursor-pointer select-none">Mark as Practiced</label>
              {completed[idx] && <span className="text-green-600 font-bold ml-2">Badge Earned!</span>}
            </div>
            {/* Verification Modal */}
            {showVerify === idx && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center border border-blue-200">
                  <h3 className="text-xl font-bold mb-4 text-blue-700">Verify Practice</h3>
                  <p className="mb-4">Are you sure you have practiced all the problems for <span className="font-semibold">{topic.title}</span>?</p>
                  <button onClick={() => confirmComplete(idx)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold mr-2 shadow transition-all">Yes, I did!</button>
                  <button onClick={() => setShowVerify(-1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-bold shadow">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Additional Practice Section */}
        <div className="mb-10 bg-white rounded-2xl shadow p-6 border-l-4 border-purple-300 border border-blue-100">
          <h2 className="text-xl font-bold text-purple-800 mb-2">🧩 Additional Practice (Competitive Focus)</h2>
          <ul className="list-disc ml-6">
            {ADDITIONAL_PRACTICE.map(function(p: { label: string; url: string }, i: number) {
              return (
                <li key={i}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-purple-700 font-medium transition-colors duration-200">
                    {p.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        {/* Final Badge */}
        {badges.length === DSA_TOPICS.length && (
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
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">MentorConnect</span>
                  <p className="text-sm text-gray-400">Professional Mentorship Platform</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Connect, learn, and grow with expert mentorship. Our comprehensive platform provides everything you need for career development and professional networking.
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
                <li><a href="/users" className="hover:text-white transition-colors">Mentors</a></li>
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
            <p>&copy; 2025 MentorConnect. All rights reserved. Built with ❤️ for the developer community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 