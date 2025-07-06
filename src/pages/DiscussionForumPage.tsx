import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDocs,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";

interface ForumMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: any;
}

interface ForumTopic {
  id: string;
  name: string;
}

export function DiscussionForumPage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newTopic, setNewTopic] = useState("");

  // Fetch topics from Firestore
  useEffect(() => {
    const fetchTopics = async () => {
      const topicsRef = collection(db, "forumTopics");
      const snapshot = await getDocs(topicsRef);
      const fetchedTopics = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      })) as ForumTopic[];
      setTopics(fetchedTopics);
    };

    fetchTopics();
  }, []);

  // Fetch messages for the selected topic in real-time
  useEffect(() => {
    if (!selectedTopic) return;

    const messagesRef = collection(db, "forumMessages", selectedTopic.id, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ForumMessage[];
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Cleanup function
  }, [selectedTopic]);

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedTopic) return;

    const messagesRef = collection(db, "forumMessages", selectedTopic.id, "messages");

    try {
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || "Anonymous",
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle creating a new topic
  const handleCreateTopic = async () => {
    if (!newTopic.trim()) return;

    const topicsRef = collection(db, "forumTopics");

    try {
      const docRef = await addDoc(topicsRef, { name: newTopic });
      setTopics((prev) => [...prev, { id: docRef.id, name: newTopic }]);
      setNewTopic("");
    } catch (error) {
      console.error("Error creating topic:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Discussion Forum</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user?.displayName?.charAt(0) || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Topics Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Topics</h2>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Create new topic..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button 
                    onClick={handleCreateTopic} 
                    disabled={!newTopic.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-md transition-colors"
                  >
                    Create Topic
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-1">
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedTopic?.id === topic.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
              {selectedTopic ? (
                <>
                  {/* Topic Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedTopic.name}</h3>
                    <p className="text-sm text-gray-600">{messages.length} messages</p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === user?.uid ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${
                            message.senderId === user?.uid ? "order-2" : "order-1"
                          }`}>
                            {message.senderId !== user?.uid && (
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-600">
                                    {message.senderName.charAt(0)}
                                  </span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {message.senderName}
                                </span>
                              </div>
                            )}
                            <div
                              className={`p-3 rounded-lg ${
                                message.senderId === user?.uid
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.text}</p>
                              <p className={`text-xs mt-2 ${
                                message.senderId === user?.uid 
                                  ? "text-blue-100" 
                                  : "text-gray-500"
                              }`}>
                                {message.timestamp?.toDate?.()?.toLocaleTimeString?.() || "Just now"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Topic</h3>
                    <p className="text-gray-500 text-sm">Choose a topic from the sidebar to start participating in discussions</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
