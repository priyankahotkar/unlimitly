import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  topic: string;
  menteeId: string;
  mentorId: string;
  createdAt: any;
}

interface Topic {
  id: string;
  name: string;
}

export function FAQPage() {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [search, setSearch] = useState("");

  // Fetch topics from Firestore
  useEffect(() => {
    const topicsRef = collection(db, "forumTopics");
    const unsubscribe = onSnapshot(topicsRef, (snapshot) => {
      const fetchedTopics = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      })) as Topic[];

      // Merge with existing FAQ topics
      const faqTopicsRef = collection(db, "faqs");
      getDocs(faqTopicsRef).then((faqSnapshot) => {
        const faqTopics = Array.from(
          new Set(faqSnapshot.docs.map((doc) => doc.data().topic))
        ).map((topic) => ({ id: topic, name: topic }));

        // Combine and filter unique topics
        const uniqueTopics = Array.from(
          new Map(
            [...fetchedTopics, ...faqTopics].map((topic) => [topic.name, topic])
          ).values()
        );

        setTopics(uniqueTopics);
      });
    });

    return () => unsubscribe();
  }, []);

  // Fetch FAQs from Firestore with real-time updates
  useEffect(() => {
    const faqsRef = collection(db, "faqs");
    const q = selectedTopic
      ? query(faqsRef, where("topic", "==", selectedTopic))
      : query(faqsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedFaqs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FAQ[];
      setFaqs(fetchedFaqs);
      setFilteredFaqs(fetchedFaqs);
    });

    return () => unsubscribe();
  }, [selectedTopic]);

  // Filter FAQs based on search input
  useEffect(() => {
    if (!search) {
      setFilteredFaqs(faqs);
    } else {
      setFilteredFaqs(
        faqs.filter((faq) =>
          faq.question.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, faqs]);

  // Handle adding a new FAQ
  const handleAddFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim() || !newTopic.trim() || !user)
      return;

    const faqsRef = collection(db, "faqs");
    const topicsRef = collection(db, "forumTopics");

    try {
      // Add the FAQ to the database
      await addDoc(faqsRef, {
        question: newQuestion,
        answer: newAnswer,
        topic: newTopic,
        menteeId: user.uid,
        mentorId: "",
        createdAt: serverTimestamp(),
      });

      // Check if the topic already exists in the database
      const existingTopic = topics.find((topic) => topic.name === newTopic);
      if (!existingTopic) {
        const docRef = await addDoc(topicsRef, { name: newTopic });
        setTopics((prev) => [...prev, { id: docRef.id, name: newTopic }]);
      }

      setNewQuestion("");
      setNewAnswer("");
      setNewTopic("");
    } catch (error) {
      console.error("Error adding FAQ:", error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <div className="p-6 bg-blue-800 text-white shadow-md">
        <h1 className="text-2xl font-semibold text-center">
          Frequently Asked Questions (FAQs)
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6 space-y-6">
        {/* Topic Selection and Search */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="p-3 border border-blue-300 rounded-md flex-1 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-gray-800"
            >
              <option value="">All Topics</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.name}>
                  {topic.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a question..."
              className="p-3 border border-blue-300 rounded-md flex-1 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-gray-800"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="flex-1 space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="p-6 bg-white rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-blue-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
                <p className="mt-3 text-sm text-blue-600">Topic: {faq.topic}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 py-8 bg-white rounded-lg shadow-md border border-blue-100">
              No FAQs available for this topic
            </div>
          )}
        </div>

        {/* Add FAQ Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">
            Add a New FAQ
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Topic"
              className="p-3 border border-blue-300 rounded-md w-full focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-gray-800"
            />
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Question"
              className="p-3 border border-blue-300 rounded-md w-full focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-gray-800"
            />
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Answer"
              className="p-3 border border-blue-300 rounded-md w-full h-32 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-gray-800 resize-none"
              rows={4}
            />
            <Button
              onClick={handleAddFaq}
              disabled={
                !newQuestion.trim() || !newAnswer.trim() || !newTopic.trim()
              }
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Add FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}