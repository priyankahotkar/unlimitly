import { createContext, useContext, useEffect, useState } from "react";
import { signInWithGoogle as signInWithGoogleService, signInWithEmail, registerWithEmail, logout } from "../services/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; // Ensure `auth` is imported from firebase.ts
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  role: string | null;
  signInWithGoogle: () => Promise<{ user: User | null; isNewUser: boolean }>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, role: "mentor" | "student") => Promise<void>;
  logout: () => Promise<void>;
  updateRole: (newRole: "mentor" | "student") => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user role from Firestore
  const fetchUserRole = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setRole(userData.role || null);
      } else {
        setRole(null); // Ensure role is null for new users
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        await fetchUserRole(currentUser.uid);
        setLoading(false);
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function handleSignIn() {
    try {
      const { user, isNewUser } = await signInWithGoogleService();
      setUser(user);

      if (isNewUser) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          role: null, // Role will be set after selection
          createdAt: new Date(),
        });
        setRole(null);
        navigate("/auth"); // Redirect to role selection
      } else {
        await fetchUserRole(user.uid);

        // Redirect based on role
        if (role === "mentor") {
          navigate("/mentor-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
      return { user, isNewUser };
    } catch (error) {
      console.error("Sign-in error:", error);
      return { user: null, isNewUser: false };
    }
  }

  async function handleSignInWithEmail(email: string, password: string) {
    try {
      const user = await signInWithEmail(email, password);
      setUser(user); // Ensure the user state is updated

      // Fetch the user's role from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (!userData?.role) {
        console.error("User role is not defined. Please contact support.");
        setRole(null); // Ensure role is null if undefined
        navigate("/auth");
        return;
      }

      setRole(userData.role); // Update the role in state

      // Redirect based on role
      if (userData.role === "mentor") {
        navigate("/mentor-dashboard");
      } else if (userData.role === "student") {
        navigate("/dashboard");
      } else {
        console.error("Invalid role. Please contact support.");
        navigate("/auth");
      }
    } catch (error) {
      console.error("Email sign-in error:", error);
      throw error;
    }
  }

  async function handleRegisterWithEmail(email: string, password: string, role: "mentor" | "student") {
    try {
      const user = await registerWithEmail(email, password, role);
      setUser(user);
      setRole(role); // Set the user's role in state

      // Redirect to the appropriate dashboard based on role
      if (role === "mentor") {
        navigate("/mentor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Email registration error:", error);
      throw error;
    }
  }

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      setRole(null);
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  async function updateRole(newRole: "mentor" | "student") {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { 
        role: newRole, 
        detailsCompleted: false, // Reset details completion status
        updatedAt: new Date() // Add a timestamp for updates
      }, { merge: true });
      setRole(newRole); // Update role in state

      // Redirect to the respective dashboard
      if (newRole === "mentor") {
        navigate("MentorDashboard");
      } else {
        navigate("Dashboard");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        signInWithGoogle: handleSignIn,
        signInWithEmail: handleSignInWithEmail,
        registerWithEmail: handleRegisterWithEmail, // Expose registerWithEmail
        logout: handleLogout,
        updateRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
