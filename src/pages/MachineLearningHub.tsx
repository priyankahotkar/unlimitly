import React, { useState, useEffect } from "react";
import { Linkedin, Mail, CheckCircle, Award, Youtube, Github, Lightbulb, BookOpen, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const PHASES = [
  {
    key: "python",
    title: "Fundamentals of Python",
    goal: "Learn the language used to build ML models.",
    topics: [
      "Variables, loops, conditions",
      "Functions, lists, dictionaries",
      "File handling, OOPs basics",
    ],
    resources: [
      { label: "freeCodeCamp Python Course", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
      { label: "Python for ML – Krish Naik", url: "https://www.youtube.com/playlist?list=PLZoTAELRMXVPGU70ZGsckrMdr0FteeRUi", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
    ],
    projects: ["Calculator", "Dice simulator", "File encryptor/decryptor"],
    badge: "Python Learner",
  },
  {
    key: "math",
    title: "Math for Machine Learning",
    goal: "Understand the math behind the algorithms.",
    topics: [
      "Linear algebra (vectors, matrices)",
      "Probability and statistics",
      "Calculus basics (derivatives, gradients)",
    ],
    resources: [
      { label: "Essence of Linear Algebra – 3Blue1Brown", url: "https://www.youtube.com/watch?v=fNk_zzaMoSs&list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
      { label: "StatQuest – Josh Starmer", url: "https://www.youtube.com/user/joshstarmer", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
      { label: "Khan Academy – Statistics & Probability", url: "https://www.khanacademy.org/math/statistics-probability", icon: <BookOpen className="w-4 h-4 text-blue-500 inline" /> },
    ],
    projects: [],
    badge: null,
  },
  {
    key: "ml-intro",
    title: "Introduction to Machine Learning",
    goal: "Learn basic ML concepts and algorithms.",
    topics: [
      "Supervised & Unsupervised Learning",
      "Classification vs Regression",
      "Overfitting, underfitting, train/test split",
      "Common models: Linear Regression, KNN, Decision Trees",
    ],
    resources: [
      { label: "Siddhardhan ML Course (YouTube)", url: "https://www.youtube.com/playlist?list=PLfFghEzKVmjvuSA67LszN1dZ-Dd_pkus6", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
      { label: "Machine Learning – Andrew Ng (Coursera)", url: "https://www.coursera.org/learn/machine-learning", icon: <BookOpen className="w-4 h-4 text-blue-500 inline" /> },
      { label: "Scikit-learn Documentation", url: "https://scikit-learn.org/stable/", icon: <BookOpen className="w-4 h-4 text-blue-500 inline" /> },
    ],
    projects: ["Predict house prices", "Classify Iris flowers", "Customer churn predictor"],
    badge: null,
  },
  {
    key: "libs",
    title: "Hands-on with Libraries",
    goal: "Implement real ML models.",
    topics: [
      "NumPy (numerical operations)",
      "Pandas (dataframes & manipulation)",
      "Matplotlib/Seaborn (visualization)",
      "Scikit-learn (ML models)",
    ],
    resources: [
      { label: "NumPy Crash Course – FreeCodeCamp", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
      { label: "Pandas – Corey Schafer", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
      { label: "Scikit-learn Projects – Krish Naik", url: "https://www.youtube.com/playlist?list=PLZoTAELRMXVNUL99R4bDlVYsncUNvwUBB", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
    ],
    projects: ["YouTube trending video predictor", "Student performance prediction", "Credit card fraud detection"],
    badge: null,
  },
  {
    key: "eval",
    title: "Model Evaluation & Tuning",
    goal: "Optimize and validate models.",
    topics: [
      "Confusion matrix, ROC-AUC, F1 score",
      "Cross-validation",
      "Hyperparameter tuning (GridSearchCV, RandomizedSearchCV)",
    ],
    resources: [
      { label: "Model Evaluation – StatQuest", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUIxGDQs4LFFD--41Vzf-ME1", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
      { label: "ML Tips & Tricks – Krish Naik", url: "https://www.youtube.com/playlist?list=PLZoTAELRMXVPkl7oRvzyNnyj1HS4wt2K_", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
    ],
    projects: [],
    badge: "Model Tuner",
  },
  {
    key: "advanced",
    title: "Advanced ML Concepts",
    goal: null,
    topics: [
      "Ensemble learning (Bagging, Boosting)",
      "XGBoost, LightGBM, CatBoost",
      "Dimensionality reduction (PCA, t-SNE)",
      "Time series forecasting (ARIMA, LSTM)",
      "Imbalanced datasets (SMOTE)",
    ],
    resources: [
      { label: "Advanced ML – Krish Naik", url: "https://www.youtube.com/playlist?list=PLZoTAELRMXVMdJ5sqbCK2LiM0HhQVWNzm", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
      { label: "ML Interview Prep – Codebasics", url: "https://www.youtube.com/playlist?list=PLeo1K3hjS3uu_n_a__MI_KktGTLYopZ12", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
    ],
    projects: ["Stock price prediction", "Heart disease diagnosis system", "Sentiment analysis on Twitter data"],
    badge: null,
  },
  {
    key: "projects",
    title: "Machine Learning Projects",
    goal: "Apply everything you've learned to real-world use cases.",
    topics: [],
    resources: [
      { label: "Kaggle Datasets", url: "https://www.kaggle.com/datasets", icon: <Github className="w-4 h-4 text-gray-700 inline" /> },
      { label: "UCI ML Repository", url: "https://archive.ics.uci.edu/ml/index.php", icon: <BookOpen className="w-4 h-4 text-blue-500 inline" /> },
    ],
    projects: [
      "Resume classifier",
      "Handwritten digit recognition",
      "Loan approval prediction",
      "NLP-based chatbot",
      "Medical diagnosis predictor",
    ],
    badge: "ML Project Pro",
  },
  {
    key: "deploy",
    title: "Bonus: Deployment & Portfolio",
    goal: "Learn how to deploy and share your models.",
    topics: [
      "Flask or FastAPI (backend)",
      "Streamlit or Gradio (ML UI)",
      "Heroku / Render / HuggingFace Spaces (free hosting)",
    ],
    resources: [
      { label: "Streamlit Crash Course – Siddhardhan", url: "https://www.youtube.com/watch?v=JwSS70SZdyM", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
      { label: "Gradio Tutorial – Abhishek Thakur", url: "https://www.youtube.com/watch?v=z3Oaz9y9AEo", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
      { label: "Flask API ML Deployment – Krish Naik", url: "https://www.youtube.com/watch?v=UbC5yM0AVnA", icon: <Youtube className="w-4 h-4 text-red-500 inline" /> },
    ],
    projects: [],
    badge: null,
  },
];

const BADGES = [
  { key: "Python Learner", icon: <Award className="w-5 h-5 text-yellow-500" />, desc: "Mastered Python basics for ML" },
  { key: "Model Tuner", icon: <Award className="w-5 h-5 text-blue-500" />, desc: "Understands model evaluation & tuning" },
  { key: "ML Project Pro", icon: <Award className="w-5 h-5 text-green-600" />, desc: "Completed real ML projects" },
];

const SIDEPANEL_LINKS = [
  {
    title: "YouTube Playlists",
    links: [
      { label: "freeCodeCamp Python", url: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
      { label: "Krish Naik ML", url: "https://www.youtube.com/playlist?list=PLZoTAELRMXVPGU70ZGsckrMdr0FteeRUi" },
      { label: "StatQuest", url: "https://www.youtube.com/user/joshstarmer" },
      { label: "3Blue1Brown Linear Algebra", url: "https://www.youtube.com/watch?v=fNk_zzaMoSs&list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" },
      { label: "Siddhardhan ML", url: "https://www.youtube.com/playlist?list=PLfFghEzKVmjvuSA67LszN1dZ-Dd_pkus6" },
    ],
    icon: <Youtube className="w-4 h-4 text-red-500" />,
  },
  {
    title: "GitHub & Docs",
    links: [
      { label: "Scikit-learn Docs", url: "https://scikit-learn.org/stable/" },
      { label: "Kaggle Datasets", url: "https://www.kaggle.com/datasets" },
      { label: "UCI ML Repository", url: "https://archive.ics.uci.edu/ml/index.php" },
    ],
    icon: <Github className="w-4 h-4 text-gray-700" />,
  },
  {
    title: "Mini-Project Prompts",
    links: [
      { label: "Predict house prices" },
      { label: "Classify Iris flowers" },
      { label: "Credit card fraud detection" },
      { label: "Handwritten digit recognition" },
      { label: "NLP-based chatbot" },
    ],
    icon: <Lightbulb className="w-4 h-4 text-yellow-500" />,
  },
];

export default function MachineLearningHub() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(Array(PHASES.length).fill(false));
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load progress and badges from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.mlProgress && Array.isArray(data.mlProgress)) {
          setCompleted(data.mlProgress);
        }
        if (data.mlBadges && Array.isArray(data.mlBadges)) {
          setBadges(data.mlBadges);
        }
      }
      setLoading(false);
    };
    fetchProgress();
  }, [user]);

  // Save progress and badges to Firestore
  useEffect(() => {
    if (!user || loading) return;
    const saveProgress = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          mlProgress: completed,
          mlBadges: badges,
        }, { merge: true });
      } catch (error) {
        console.error('Error saving ML progress:', error);
      }
    };
    saveProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, badges, user, loading]);

  const handleCheck = (idx: number) => {
    const newCompleted = [...completed];
    newCompleted[idx] = !newCompleted[idx];
    setCompleted(newCompleted);
    // Award badges
    const phase = PHASES[idx];
    if (phase.badge && !badges.includes(phase.badge) && newCompleted[idx]) {
      setBadges([...badges, phase.badge]);
    } else if (phase.badge && badges.includes(phase.badge) && !newCompleted[idx]) {
      setBadges(badges.filter(b => b !== phase.badge));
    }
  };

  const progress = Math.round((completed.filter(Boolean).length / PHASES.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f6fb] to-white px-2 md:px-0 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 py-10">
        {/* Main Path */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-blue-800 mb-2 tracking-tight flex items-center gap-2">
              <Award className="w-8 h-8 text-blue-500" /> Machine Learning Learning Path
            </h1>
            <p className="text-lg text-gray-600 mb-4">Zero to Advanced — Free, Structured, and Project-Focused</p>
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-blue-700">Progress</span>
                <span className="text-xs font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-500 to-purple-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {BADGES.map(badge => (
                <span key={badge.key} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-sm shadow border transition-all ${badges.includes(badge.key) ? 'bg-gradient-to-r from-blue-100 to-green-100 text-green-900 border-green-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                  {badge.icon} {badge.key}
                </span>
              ))}
            </div>
          </div>
          {/* Timeline */}
          <div className="flex flex-col gap-8 relative">
            {PHASES.map((phase, idx) => (
              <div key={phase.key} className="relative group">
                {/* Timeline Dot */}
                <div className={`absolute -left-7 top-6 w-5 h-5 rounded-full border-4 z-10 ${completed[idx] ? 'bg-green-500 border-green-200' : 'bg-white border-blue-200'} shadow-lg`}></div>
                {/* Vertical Line */}
                {idx !== PHASES.length - 1 && (
                  <div className="absolute -left-4 top-10 h-full w-1 bg-gradient-to-b from-blue-200 to-purple-200 z-0"></div>
                )}
                <div className="ml-4 bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-400 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <input type="checkbox" checked={completed[idx]} onChange={() => handleCheck(idx)} className="w-5 h-5 accent-blue-600" />
                    <h2 className="text-2xl font-bold text-blue-900 group-hover:text-purple-700 transition-colors duration-200" style={{ fontFamily: 'Times New Roman, Times, serif' }}>{phase.title}</h2>
                    {phase.badge && badges.includes(phase.badge) && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
                  </div>
                  {phase.goal && <div className="mb-2 text-blue-700 font-semibold flex items-center gap-2"><ChevronRight className="w-4 h-4" />{phase.goal}</div>}
                  {phase.topics.length > 0 && (
                    <div className="mb-2">
                      <span className="font-semibold text-blue-700">Topics:</span> {phase.topics.map((t, i) => <span key={i} className="inline-block bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full text-xs mx-1 border border-blue-100">{t}</span>)}
                    </div>
                  )}
                  {phase.resources.length > 0 && (
                    <div className="mb-2">
                      <span className="font-semibold text-blue-700">Resources:</span> {phase.resources.map((r, i) => <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="inline-block underline text-blue-600 hover:text-purple-700 mx-1 font-medium transition-colors duration-200">{r.icon} {r.label}</a>)}
                    </div>
                  )}
                  {phase.projects.length > 0 && (
                    <div className="mb-2">
                      <span className="font-semibold text-blue-700">Project Ideas:</span> {phase.projects.map((p, i) => <span key={i} className="inline-block bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full text-xs mx-1 border border-blue-100">{p}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Side Panel */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="sticky top-10 flex flex-col gap-6">
            {SIDEPANEL_LINKS.map((section, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-400">
                <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold">
                  {section.icon} {section.title}
                </div>
                <ul className="list-disc ml-6">
                  {section.links.map((l, i) => (
                    <li key={i} className="mb-1">
                      {'url' in l && l.url ? (
                        <a href={l.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-purple-700 font-medium transition-colors duration-200">{l.label}</a>
                      ) : (
                        <span className="text-gray-700">{l.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
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