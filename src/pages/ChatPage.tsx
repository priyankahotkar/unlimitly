import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth, db, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { serverTimestamp as firestoreServerTimestamp } from "firebase/firestore";

interface Message {
  id: string;
  text?: string;
  senderId: string;
  timestamp: any;
  fileName?: string;
  fileURL?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  lastMessageTimestamp?: string | number | Date;
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [user] = useAuthState(auth);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Replace users fetching logic with real-time listener
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    });
    return () => unsubscribe();
  }, []);

  // Fetch previous messages and listen for new messages in real-time
  useEffect(() => {
    if (!user || !selectedUser) return;

    const chatId =
      user.uid < selectedUser.id
        ? `${user.uid}_${selectedUser.id}`
        : `${selectedUser.id}_${user.uid}`;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    // Fetch previous messages
    const fetchMessages = async () => {
      const snapshot = await getDocs(q);
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
    };

    fetchMessages();

    // Listen for new messages in real-time
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Cleanup function
  }, [selectedUser, user]); // Runs when `selectedUser` or `user` changes

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedUser) return;

    const chatId =
      user.uid < selectedUser.id
        ? `${user.uid}_${selectedUser.id}`
        : `${selectedUser.id}_${user.uid}`;

    const messagesRef = collection(db, "chats", chatId, "messages");

    await addDoc(messagesRef, {
      text: newMessage,
      senderId: user.uid,
      participants: [user.uid, selectedUser.id], // Add participants to the message
      timestamp: serverTimestamp(),
    });

    // Update lastMessageTimestamp for both users in Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      [`chats.${selectedUser.id}.lastMessageTimestamp`]: serverTimestamp(),
    });
    await updateDoc(doc(db, 'users', selectedUser.id), {
      [`chats.${user.uid}.lastMessageTimestamp`]: serverTimestamp(),
    });

    setNewMessage("");
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !user || !selectedUser) return;

    const chatId =
      user.uid < selectedUser.id
        ? `${user.uid}_${selectedUser.id}`
        : `${selectedUser.id}_${user.uid}`;

    const fileRef = ref(storage, `chats/${chatId}/${file.name}`);

    try {
      // Upload file to Firebase Storage
      await uploadBytes(fileRef, file);

      // Get the download URL
      const fileURL = await getDownloadURL(fileRef);

      // Save the file message in Firestore
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        senderId: user.uid,
        fileName: file.name,
        fileURL,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleUserSelect = (userId: string) => {
    const selected = users.find((u) => u.id === userId) || null;
    setSelectedUser(selected);
  };

  // When fetching users, get lastMessageTimestamp from Firestore and sort:
  const sortedUsers = [...users].sort((a, b) => {
    const aTime = a.chats && a.chats[user?.uid]?.lastMessageTimestamp ? new Date(a.chats[user?.uid].lastMessageTimestamp.seconds * 1000).getTime() : 0;
    const bTime = b.chats && b.chats[user?.uid]?.lastMessageTimestamp ? new Date(b.chats[user?.uid].lastMessageTimestamp.seconds * 1000).getTime() : 0;
    return bTime - aTime;
  });

  return (
    <div className="flex h-screen w-full bg-[#f3f6fb] font-sans">
      {/* Users List - Scrollable */}
      <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto h-[90vh] p-4 shadow-md rounded-l-2xl flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-blue-900 text-center">Available Users</h2>
        <div className="flex-1 space-y-1">
          {sortedUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center space-x-3 cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-all ${selectedUser?.id === user.id ? 'bg-blue-100' : ''}`}
              onClick={() => handleUserSelect(user.id)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || undefined} alt={user.name} />
                <AvatarFallback>{user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-blue-900">{user.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 w-full min-w-0 flex flex-col bg-[#f3f6fb]">
        {/* Chat header */}
        <div className="bg-blue-700 text-white px-8 py-4 rounded-tr-2xl flex items-center shadow-md">
          <span className="text-lg font-semibold">
            {selectedUser ? `Chat with ${selectedUser.name}` : 'Select a user to start chatting'}
          </span>
        </div>
        {/* End-to-end encryption indicator */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-600 text-sm">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">End-to-end encrypted</span>
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-xs text-gray-500 mt-1">Messages and calls are secured with end-to-end encryption</p>
      </div>

      {/* Messages container */}
        {/* Messages - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-xl ${msg.senderId === user?.uid ? 'ml-auto' : ''}`}
            >
              <div className={`rounded-2xl px-5 py-3 shadow ${msg.senderId === user?.uid ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}
          {/* Invisible div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
        {/* Message input and send button - always visible */}
        <div className="p-6 bg-white border-t border-gray-200 flex items-center gap-4 rounded-b-2xl shadow-md">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-[#f7fafd]"
            placeholder="Type your message..."
            onKeyDown={e => e.key === 'Enter' && handleSendMessage(e)}
          />
          <Button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full shadow" onClick={handleSendMessage}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
function serverTimestamp(): any {
  return firestoreServerTimestamp();
}

// Utility function to format timestamps
function formatTime(timestamp: any) {
  if (!timestamp) return '';
  let dateObj;
  if (typeof timestamp === 'object' && timestamp.seconds) {
    dateObj = new Date(timestamp.seconds * 1000);
  } else {
    dateObj = new Date(timestamp);
  }
  return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

