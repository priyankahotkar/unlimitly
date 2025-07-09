import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage for Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyD-hJk3YA9hCL8L71VeTfFtDu7JQxwrwc4",
  authDomain: "unlimitly-c1506.firebaseapp.com",
  projectId: "unlimitly-c1506",
  storageBucket: "unlimitly-c1506.firebasestorage.app",
  messagingSenderId: "383481102582",
  appId: "1:383481102582:web:b950ea0ebb340cf84dacd7",
  measurementId: "G-PMN7Y9EVSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User Info:", result.user);
    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Function to sign out
const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// Function to send a message to Firestore
const sendMessage = async (message: string, userId: string, username: string) => {
  if (!message.trim()) return;
  
  try {
    await addDoc(collection(db, "messages"), {
      text: message,
      userId,
      username,
      timestamp: serverTimestamp(),
    });
    console.log("Message sent:", message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Function to listen for new messages in real-time
const listenForMessages = (callback: (messages: any[]) => void) => {
  const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

// Function to create a video call room
const createVideoRoom = async (roomId: string, mentorId: string, mentorName: string) => {
  try {
    const roomRef = doc(db, "videoRooms", roomId);
    await setDoc(roomRef, {
      mentorId,
      mentorName,
      createdAt: serverTimestamp(),
    });
    console.log("Video room created:", roomId);
  } catch (error) {
    console.error("Error creating video room:", error);
  }
};

// Explicitly export everything
export { auth, provider, db, storage, signInWithGoogle, logout, sendMessage, listenForMessages, createVideoRoom };
