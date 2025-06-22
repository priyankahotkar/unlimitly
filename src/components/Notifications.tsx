import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: any;
}

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;

    const notificationsRef = collection(db, "notifications");
    const q = query(notificationsRef, where("mentorId", "==", user.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      const notificationsList: Notification[] = [];
      const notificationsToDelete: string[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt);
        const isOlderThanFiveDays = createdAt < fiveDaysAgo;

        if (!isOlderThanFiveDays || (isOlderThanFiveDays && !data.read)) {
          // Keep notifications from the past 5 days or unread notifications
          notificationsList.push({
            id: doc.id,
            message: data.message,
            read: data.read || false,
            createdAt,
          });
        } else if (isOlderThanFiveDays && data.read) {
          // Mark read notifications older than 5 days for deletion
          notificationsToDelete.push(doc.id);
        }
      });

      // Delete read notifications older than 5 days
      for (const notificationId of notificationsToDelete) {
        const notificationRef = doc(db, "notifications", notificationId);
        await deleteDoc(notificationRef);
      }

      setNotifications(notificationsList);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-2 rounded-lg ${
                notification.read ? "bg-gray-100" : "bg-blue-100"
              }`}
            >
              <p>{notification.message}</p>
              {!notification.read && (
                <button
                  className="text-blue-500 hover:underline mt-2"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;