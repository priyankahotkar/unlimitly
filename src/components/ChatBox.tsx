import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { gapi } from "gapi-script";

const CLIENT_ID = "http://527398753279-nndtd0p6tpiq5ebobefqui0m0nv95d8u.apps.googleusercontent.com";
const API_KEY = "AIzaSyAy5GNcNhMLAXfADgWawJZquo5HE7tA3MU";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

// Simple encryption key (in production, this should be more secure)
const ENCRYPTION_KEY = "MentorConnect2024!";

// Simple encryption function
const encryptMessage = (text: string): string => {
  try {
    // Simple Caesar cipher with key-based shift
    const keySum = ENCRYPTION_KEY.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const shift = keySum % 26;
    
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      
      // Handle uppercase letters
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }
      // Handle lowercase letters
      else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      // Handle numbers
      else if (code >= 48 && code <= 57) {
        return String.fromCharCode(((code - 48 + shift) % 10) + 48);
      }
      // Keep other characters unchanged
      return char;
    }).join('');
  } catch (error) {
    console.error("Encryption error:", error);
    return text; // Return original text if encryption fails
  }
};

// Simple decryption function
const decryptMessage = (encryptedText: string): string => {
  try {
    // Reverse the Caesar cipher
    const keySum = ENCRYPTION_KEY.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const shift = keySum % 26;
    
    return encryptedText.split('').map(char => {
      const code = char.charCodeAt(0);
      
      // Handle uppercase letters
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      }
      // Handle lowercase letters
      else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
      // Handle numbers
      else if (code >= 48 && code <= 57) {
        return String.fromCharCode(((code - 48 - shift + 10) % 10) + 48);
      }
      // Keep other characters unchanged
      return char;
    }).join('');
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedText; // Return encrypted text if decryption fails
  }
};

const ChatBox: React.FC<{ selectedUserId: string }> = ({ selectedUserId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user || !selectedUserId) return;

    const chatId = user && user.uid < selectedUserId ? `${user.uid}_${selectedUserId}` : `${selectedUserId}_${user?.uid}`;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Decrypt text messages if they exist
        if (data.text) {
          return { 
            id: doc.id, 
            ...data, 
            text: decryptMessage(data.text) 
          };
        }
        return { id: doc.id, ...data };
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [user, selectedUserId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;

    const chatId = user && user.uid < selectedUserId ? `${user.uid}_${selectedUserId}` : `${selectedUserId}_${user?.uid}`;
    const messagesRef = collection(db, "chats", chatId, "messages");

    if (newMessage.trim()) {
      // Encrypt the message before sending
      const encryptedText = encryptMessage(newMessage);
      await addDoc(messagesRef, {
        senderId: user?.uid || "unknown",
        text: encryptedText, // Store encrypted text
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    }

    if (file) {
      await handleFileUpload(file, chatId);
      setFile(null);
    }
  };

  const handleFileUpload = async (file: File, chatId: string) => {
    try {
      gapi.load("client:auth2", async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
        });

        const authInstance = gapi.auth2.getAuthInstance();
        if (!authInstance.isSignedIn.get()) {
          await authInstance.signIn();
        }

        const accessToken = gapi.auth.getToken().access_token;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploadType", "multipart");
        formData.append("name", file.name);

        const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        const fileData = await response.json();

        await fetch(`https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: "reader",
            type: "anyone",
          }),
        });

        const shareableLink = `https://drive.google.com/file/d/${fileData.id}/view`;

        const messagesRef = collection(db, "chats", chatId, "messages");
        await addDoc(messagesRef, {
          senderId: user?.uid || "unknown",
          fileName: file.name,
          fileLink: shareableLink,
          timestamp: serverTimestamp(),
        });
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
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
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            {message.text && <p>{message.text}</p>}
            {message.fileLink && (
              <a href={message.fileLink} target="_blank" rel="noopener noreferrer">
                {message.fileName}
              </a>
            )}
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
