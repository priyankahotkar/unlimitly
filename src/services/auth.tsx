import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";

const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore();

// Google Sign-In Function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Store user profile photo URL in Firestore
    if (user) {
      await setDoc(
        doc(db, "users", user.uid),
        {
          photoURL: user.photoURL || "",
          // ...existing user fields...
        },
        { merge: true }
      );
    }

    // Check if user exists in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user entry
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        role: "", // Role will be set after FillDetails
        createdAt: new Date(),
      });

      return { user, isNewUser: true }; // Indicate that the user is new
    }

    return { user, isNewUser: false };
  } catch (error: any) {
    console.error("Error signing in:", error.message || error);
    throw new Error("Failed to sign in with Google.");
  }
}

// Email Sign-In Function
async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
}

// Email Registration Function
async function registerWithEmail(email: string, password: string, role: "mentor" | "student") {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Create a new user entry in Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      role, // Store the user's role
      detailsCompleted: false, // Mark details as incomplete
      availableTimeSlots: role === "mentor" ? [] : [], // Initialize time slots for experts
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Error registering with email:", error);
    throw error;
  }
}

// Logout Function
async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

// Export all functions and constants
export { auth, signInWithEmail, registerWithEmail, logout };
