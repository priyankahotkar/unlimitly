import React, { useEffect, useState } from "react";
import { Send, Users, Plus, Video, ArrowLeft, Search, UserPlus, MessageSquare, Bell, Phone, Mic } from "lucide-react";
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
  arrayUnion,
  arrayRemove,
  serverTimestamp as firestoreServerTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import JitsiMeet from "../components/JitsiMeet";
import VoiceJitsi from "../components/VoiceJitsi";

interface Message {
  id: string;
  text?: string;
  senderId: string;
  senderName: string;
  timestamp: any;
  fileName?: string;
  fileURL?: string;
  videoCallId?: string;
  roomName?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  lastMessageTimestamp?: string | number | Date;
}

interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  memberDetails: User[];
  createdAt: any;
  lastMessageTimestamp?: any;
}

interface GroupVideoCall {
  id: string;
  groupId: string;
  groupName: string;
  roomName: string;
  startedBy: string;
  startedByName: string;
  participants: string[];
  startedAt: any;
  status: string;
  endedAt?: any;
}

export function GroupPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupVideo, setShowGroupVideo] = useState(false);
  const [groupVideoRoom, setGroupVideoRoom] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ongoingVideoCalls, setOngoingVideoCalls] = useState<GroupVideoCall[]>([]);
  const [showGroupVoice, setShowGroupVoice] = useState(false);
  const [groupVoiceRoom, setGroupVoiceRoom] = useState("");
  const [ongoingVoiceCalls, setOngoingVoiceCalls] = useState<any[]>([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Fetch all users
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as User[];
      setUsers(usersList);
    });
    return () => unsubscribe();
  }, []);

  // Fetch groups where current user is a member
  // useEffect(() => {
  //   if (!user) return;

  //   const groupsRef = collection(db, 'groups');
  //   const q = query(groupsRef, where('members', 'array-contains', user.uid));
    
  //   const unsubscribe = onSnapshot(q, async (snapshot) => {
  //     const groupsList = await Promise.all(
  //       snapshot.docs.map(async (doc) => {
  //         const groupData = doc.data();
  //         // Fetch member details
  //         const memberDetails = await Promise.all(
  //           groupData.members.map(async (memberId: string) => {
  //             const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', memberId)));
  //             return userDoc.docs[0]?.data() as User;
  //           })
  //         );
          
  //         return {
  //           id: doc.id,
  //           ...groupData,
  //           memberDetails: memberDetails.filter(Boolean),
  //         } as Group;
  //       })
  //     );
      
  //     // Sort by last message timestamp
  //     const sortedGroups = groupsList.sort((a, b) => {
  //       const aTime = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp.seconds * 1000).getTime() : 0;
  //       const bTime = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp.seconds * 1000).getTime() : 0;
  //       return bTime - aTime;
  //     });
      
  //     setGroups(sortedGroups);
  //   });
    
  //   return () => unsubscribe();
  // }, [user]);

  // Fetch all groups (not just user's groups)
  useEffect(() => {
    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, orderBy('lastMessageTimestamp', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const groupsList = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const groupData = doc.data();
          // Fetch member details
          const memberDetails = await Promise.all(
            groupData.members.map(async (memberId: string) => {
              const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', memberId)));
              return userDoc.docs[0]?.data() as User;
            })
          );
          return {
            id: doc.id,
            ...groupData,
            memberDetails: memberDetails.filter(Boolean),
          } as Group;
        })
      );
      // Sort by last message timestamp
      const sortedGroups = groupsList.sort((a, b) => {
        const aTime = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp.seconds * 1000).getTime() : 0;
        const bTime = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp.seconds * 1000).getTime() : 0;
        return bTime - aTime;
      });
      setGroups(sortedGroups);
    });
    return () => unsubscribe();
  }, [user]);

  // Fetch ongoing video calls for groups where user is a member
  useEffect(() => {
    if (!user) return;

    const videoCallsRef = collection(db, 'groupVideoCalls');
    const q = query(videoCallsRef, orderBy('startedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoCalls: GroupVideoCall[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          groupId: data.groupId,
          groupName: data.groupName,
          roomName: data.roomName,
          startedBy: data.startedBy,
          startedByName: data.startedByName,
          participants: data.participants || [],
          startedAt: data.startedAt,
          status: data.status,
          endedAt: data.endedAt,
        } as GroupVideoCall;
      });
      
      // Filter video calls for groups where current user is a member
      const userGroups = groups.map(group => group.id);
      const relevantVideoCalls = videoCalls.filter(call => 
        userGroups.includes(call.groupId) && call.participants.includes(user.uid)
      );
      
      setOngoingVideoCalls(relevantVideoCalls);
    });
    
    return () => unsubscribe();
  }, [user, groups]);

  // Fetch ongoing voice calls for groups where user is a member
  useEffect(() => {
    if (!user) return;
    const voiceCallsRef = collection(db, 'groupVoiceCalls');
    const q = query(voiceCallsRef, orderBy('startedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const voiceCalls = snapshot.docs.map((doc) => ({
        id: doc.id,
        groupId: doc.data().groupId, // Ensure groupId is present
        ...doc.data(),
      }));
      // Filter voice calls for groups where current user is a member
      const userGroups = groups.map(group => group.id);
      const relevantVoiceCalls = voiceCalls.filter(call => 
        userGroups.includes(call.groupId) && (call as unknown as { participants: string[] }).participants.includes(user.uid)
      );
      setOngoingVoiceCalls(relevantVoiceCalls);
    });
    return () => unsubscribe();
  }, [user, groups]);

  // Fetch messages for selected group
  useEffect(() => {
    if (!user || !selectedGroup) return;

    const messagesRef = collection(db, "groups", selectedGroup.id, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [selectedGroup, user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create new group
  const handleCreateGroup = async () => {
    if (!user || !newGroupName.trim() || selectedUsers.length === 0) return;

    try {
      const groupData = {
        name: newGroupName,
        description: newGroupDescription,
        createdBy: user.uid,
        members: [user.uid, ...selectedUsers],
        createdAt: firestoreServerTimestamp(),
        lastMessageTimestamp: firestoreServerTimestamp(),
      };

      const groupRef = await addDoc(collection(db, 'groups'), groupData);
      
      // Add initial message
      const messagesRef = collection(db, "groups", groupRef.id, "messages");
      await addDoc(messagesRef, {
        text: `${user.displayName || 'User'} created this group`,
        senderId: user.uid,
        senderName: user.displayName || 'User',
        timestamp: firestoreServerTimestamp(),
      });

      setNewGroupName("");
      setNewGroupDescription("");
      setSelectedUsers([]);
      setShowCreateGroup(false);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  // Send message to group
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedGroup) return;

    const messagesRef = collection(db, "groups", selectedGroup.id, "messages");

    await addDoc(messagesRef, {
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName || 'User',
      timestamp: firestoreServerTimestamp(),
    });

    // Update last message timestamp
    await updateDoc(doc(db, 'groups', selectedGroup.id), {
      lastMessageTimestamp: firestoreServerTimestamp(),
    });

    setNewMessage("");
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file || !user || !selectedGroup) return;

    const fileRef = ref(storage, `groups/${selectedGroup.id}/${file.name}`);

    try {
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      const messagesRef = collection(db, "groups", selectedGroup.id, "messages");
      await addDoc(messagesRef, {
        senderId: user.uid,
        senderName: user.displayName || 'User',
        fileName: file.name,
        fileURL,
        timestamp: firestoreServerTimestamp(),
      });

      await updateDoc(doc(db, 'groups', selectedGroup.id), {
        lastMessageTimestamp: firestoreServerTimestamp(),
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Start group video call
  const handleStartVideoCall = async () => {
    if (!selectedGroup) return;

    const roomName = `group-${selectedGroup.id}-${Date.now()}`;
    setGroupVideoRoom(roomName);
    setShowGroupVideo(true);

    // Save video call session
    const videoCallRef = await addDoc(collection(db, "groupVideoCalls"), {
      groupId: selectedGroup.id,
      groupName: selectedGroup.name,
      roomName,
      startedBy: user?.uid,
      startedByName: user?.displayName,
      participants: selectedGroup.members,
      startedAt: firestoreServerTimestamp(),
      status: 'active',
    });

    // Send notification message to group
    const messagesRef = collection(db, "groups", selectedGroup.id, "messages");
    await addDoc(messagesRef, {
      text: `🎥 ${user?.displayName || 'User'} started a video call`,
      senderId: 'system',
      senderName: 'System',
      timestamp: firestoreServerTimestamp(),
      videoCallId: videoCallRef.id,
      roomName: roomName,
    });

    // Update last message timestamp
    await updateDoc(doc(db, 'groups', selectedGroup.id), {
      lastMessageTimestamp: firestoreServerTimestamp(),
    });

    // Send notifications to all group members
    selectedGroup.members.forEach(async (memberId) => {
      if (memberId !== user?.uid) {
        await addDoc(collection(db, "notifications"), {
          userId: memberId,
          title: "Group Video Call Started",
          message: `${user?.displayName || 'User'} started a video call in ${selectedGroup.name}`,
          type: "video_call",
          groupId: selectedGroup.id,
          roomName: roomName,
          read: false,
          createdAt: firestoreServerTimestamp(),
        });
      }
    });
  };

  // Join existing video call
  const handleJoinVideoCall = (videoCall: GroupVideoCall) => {
    setGroupVideoRoom(videoCall.roomName);
    setShowGroupVideo(true);
  };

  // End video call
  const handleEndVideoCall = async () => {
    if (!selectedGroup) return;

    // Find the active video call for this group
    const activeCall = ongoingVideoCalls.find(call => call.groupId === selectedGroup.id);
    if (activeCall) {
      await updateDoc(doc(db, 'groupVideoCalls', activeCall.id), {
        status: 'ended',
        endedAt: firestoreServerTimestamp(),
      });

      // Send notification message to group
      const messagesRef = collection(db, "groups", selectedGroup.id, "messages");
      await addDoc(messagesRef, {
        text: `📞 Video call ended`,
        senderId: 'system',
        senderName: 'System',
        timestamp: firestoreServerTimestamp(),
      });

      // Update last message timestamp
      await updateDoc(doc(db, 'groups', selectedGroup.id), {
        lastMessageTimestamp: firestoreServerTimestamp(),
      });
    }

    setShowGroupVideo(false);
  };

  // Start group voice call
  const handleStartVoiceCall = async () => {
    if (!selectedGroup) return;
    const roomName = `voice-group-${selectedGroup.id}-${Date.now()}`;
    setGroupVoiceRoom(roomName);
    setShowGroupVoice(true);
    // Save voice call session
    const voiceCallRef = await addDoc(collection(db, "groupVoiceCalls"), {
      groupId: selectedGroup.id,
      groupName: selectedGroup.name,
      roomName,
      startedBy: user?.uid,
      startedByName: user?.displayName,
      participants: selectedGroup.members,
      startedAt: firestoreServerTimestamp(),
      status: 'active',
    });
    // Send notification message to group
    const messagesRef = collection(db, "groups", selectedGroup.id, "messages");
    await addDoc(messagesRef, {
      text: `🔊 ${user?.displayName || 'User'} started a voice chat`,
      senderId: 'system',
      senderName: 'System',
      timestamp: firestoreServerTimestamp(),
      voiceCallId: voiceCallRef.id,
      roomName: roomName,
    });
    // Update last message timestamp
    await updateDoc(doc(db, 'groups', selectedGroup.id), {
      lastMessageTimestamp: firestoreServerTimestamp(),
    });
    // Send notifications to all group members
    selectedGroup.members.forEach(async (memberId) => {
      if (memberId !== user?.uid) {
        await addDoc(collection(db, "notifications"), {
          userId: memberId,
          title: "Group Voice Chat Started",
          message: `${user?.displayName || 'User'} started a voice chat in ${selectedGroup.name}`,
          type: "voice_call",
          groupId: selectedGroup.id,
          roomName: roomName,
          read: false,
          createdAt: firestoreServerTimestamp(),
        });
      }
    });
  };

  // Join existing voice call
  const handleJoinVoiceCall = (voiceCall: any) => {
    setGroupVoiceRoom(voiceCall.roomName);
    setShowGroupVoice(true);
  };

  // End voice call
  const handleEndVoiceCall = async () => {
    if (!selectedGroup) return;
    // Find the active voice call for this group
    const activeCall = ongoingVoiceCalls.find(call => call.groupId === selectedGroup.id);
    if (activeCall) {
      await updateDoc(doc(db, 'groupVoiceCalls', activeCall.id), {
        status: 'ended',
        endedAt: firestoreServerTimestamp(),
      });
      // Send notification message to group
      const messagesRef = collection(db, "groups", selectedGroup.id, "messages");
      await addDoc(messagesRef, {
        text: `🔇 Voice chat ended`,
        senderId: 'system',
        senderName: 'System',
        timestamp: firestoreServerTimestamp(),
      });
      // Update last message timestamp
      await updateDoc(doc(db, 'groups', selectedGroup.id), {
        lastMessageTimestamp: firestoreServerTimestamp(),
      });
    }
    setShowGroupVoice(false);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedUsers.includes(user.id)
  );

  // Get ongoing video call for selected group
  const getOngoingVideoCall = () => {
    return ongoingVideoCalls.find(call => call.groupId === selectedGroup?.id && call.status === 'active');
  };

  // Get ended video call for selected group
  const getEndedVideoCall = () => {
    return ongoingVideoCalls.find(call => call.groupId === selectedGroup?.id && call.status === 'ended');
  };

  // Get ongoing voice call for selected group
  const getOngoingVoiceCall = () => {
    return ongoingVoiceCalls.find(call => call.groupId === selectedGroup?.id && call.status === 'active');
  };

  // Get ended voice call for selected group
  const getEndedVoiceCall = () => {
    return ongoingVoiceCalls.find(call => call.groupId === selectedGroup?.id && call.status === 'ended');
  };

  // Format timestamp
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    let dateObj;
    if (typeof timestamp === 'object' && timestamp.seconds) {
      dateObj = new Date(timestamp.seconds * 1000);
    } else {
      dateObj = new Date(timestamp);
    }
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (showGroupVideo) {
    return (
      <div className="h-screen">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowGroupVideo(false)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Group</span>
            </Button>
            <h2 className="text-lg font-semibold">Group Video Call - {selectedGroup?.name}</h2>
          </div>
          <Button
            onClick={handleEndVideoCall}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            End Call
          </Button>
        </div>
        <JitsiMeet roomName={groupVideoRoom} />
      </div>
    );
  }

  if (showGroupVoice) {
    return (
      <div className="h-screen">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowGroupVoice(false)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Group</span>
            </Button>
            <h2 className="text-lg font-semibold">Group Voice Chat - {selectedGroup?.name}</h2>
          </div>
          <Button
            onClick={handleEndVoiceCall}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            End Voice Chat
          </Button>
        </div>
        <VoiceJitsi roomName={groupVoiceRoom} />
      </div>
    );
  }

  // Helper to check if current user is a member of a group
  const isMember = (group: Group) => !!user?.uid && group.members.includes(user.uid);

  // Handler to join a group
  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;
    try {
      const groupDocRef = doc(db, 'groups', groupId);
      await updateDoc(groupDocRef, {
        members: arrayUnion(user.uid),
      });
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Groups List */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto h-full p-4 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <Button 
            onClick={() => setShowCreateGroup(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Group
          </Button>
        </div>

        <h2 className="text-xl font-bold mb-4 text-gray-900">Groups</h2>
        
        {showCreateGroup ? (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-3">Create New Group</h3>
            <input
              type="text"
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Group description (optional)"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="max-h-32 overflow-y-auto space-y-1">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => setSelectedUsers([...selectedUsers, user.id])}
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user.photoURL} alt={user.name} />
                      <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-2">Selected Members:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedUsers.map((userId) => {
                    const user = users.find(u => u.id === userId);
                    return (
                      <div
                        key={userId}
                        className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                      >
                        <span>{user?.name}</span>
                        <button
                          onClick={() => setSelectedUsers(selectedUsers.filter(id => id !== userId))}
                          className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || selectedUsers.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Group
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateGroup(false);
                  setNewGroupName("");
                  setNewGroupDescription("");
                  setSelectedUsers([]);
                  setSearchQuery("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          {groups.map((group) => {
            const hasOngoingCall = ongoingVideoCalls.some(call => call.groupId === group.id && call.status === 'active');
            const hasEndedCall = ongoingVideoCalls.some(call => call.groupId === group.id && call.status === 'ended');
            const member = isMember(group);

            return (
              <div
                key={group.id}
                className={`flex items-center space-x-3 rounded-lg p-3 transition-all ${
                  member
                    ? `cursor-pointer hover:bg-gray-50 ${selectedGroup?.id === group.id ? 'bg-blue-50 border border-blue-200' : ''}`
                    : 'bg-gray-100 opacity-70'
                }`}
                onClick={member ? () => setSelectedGroup(group) : undefined}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {group.members.length}
                  </span>
                  {hasOngoingCall && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      <Phone className="w-3 h-3" />
                    </div>
                  )}
                  {hasEndedCall && !hasOngoingCall && (
                    <div className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      <Video className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{group.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{group.description}</p>
                  {group.lastMessageTimestamp && (
                    <p className="text-xs text-gray-400">
                      {formatTime(group.lastMessageTimestamp)}
                    </p>
                  )}
                  {hasOngoingCall && (
                    <p className="text-xs text-red-600 font-medium">🎥 Live call</p>
                  )}
                  {hasEndedCall && !hasOngoingCall && (
                    <p className="text-xs text-gray-600 font-medium">📞 Call ended</p>
                  )}
                  {!member && (
                    <Button
                      size="sm"
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Join Group
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedGroup ? (
          <>
            {/* Group Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedGroup.members.length}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedGroup.name}</h2>
                  <p className="text-sm text-gray-500">{selectedGroup.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getOngoingVideoCall() ? (
                  <Button
                    onClick={() => handleJoinVideoCall(getOngoingVideoCall()!)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Call
                  </Button>
                ) : (
                  <Button
                    onClick={handleStartVideoCall}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Start Video Call
                  </Button>
                )}
                {/* Voice Chat Button */}
                {getOngoingVoiceCall() ? (
                  <Button
                    onClick={() => handleJoinVoiceCall(getOngoingVoiceCall()!)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Join Voice Chat
                  </Button>
                ) : (
                  <Button
                    onClick={handleStartVoiceCall}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Start Voice Chat
                  </Button>
                )}
              </div>
            </div>

            {/* Ongoing Video Call Alert */}
            {getOngoingVideoCall() && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Video className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Video call in progress
                      </p>
                      <p className="text-sm text-green-700">
                        Started by {getOngoingVideoCall()?.startedByName} at {formatTime(getOngoingVideoCall()?.startedAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleJoinVideoCall(getOngoingVideoCall()!)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    Join Now
                  </Button>
                </div>
              </div>
            )}

            {/* Ended Video Call Alert */}
            {getEndedVideoCall() && (
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Video className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Video call ended
                    </p>
                    <p className="text-sm text-gray-700">
                      Started by {getEndedVideoCall()?.startedByName} • Ended at {formatTime(getEndedVideoCall()?.endedAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Ongoing Voice Call Alert */}
            {getOngoingVoiceCall() && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Mic className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Voice chat in progress
                      </p>
                      <p className="text-sm text-blue-700">
                        Started by {getOngoingVoiceCall()?.startedByName} at {formatTime(getOngoingVoiceCall()?.startedAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleJoinVoiceCall(getOngoingVoiceCall()!)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Join Now
                  </Button>
                </div>
              </div>
            )}

            {/* Ended Voice Call Alert */}
            {getEndedVoiceCall() && (
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Mic className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Voice chat ended
                    </p>
                    <p className="text-sm text-gray-700">
                      Started by {getEndedVoiceCall()?.startedByName} • Ended at {formatTime(getEndedVoiceCall()?.endedAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Members List */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Members:</span>
                <div className="flex -space-x-2">
                  {selectedGroup.memberDetails.slice(0, 5).map((member) => (
                    <Avatar key={member.id} className="w-6 h-6 border-2 border-white">
                      <AvatarImage src={member.photoURL} alt={member.name} />
                      <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {selectedGroup.memberDetails.length > 5 && (
                    <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{selectedGroup.memberDetails.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-xl ${msg.senderId === user?.uid ? 'ml-auto' : ''}`}
                >
                  <div className={`rounded-2xl px-5 py-3 shadow-sm ${
                    msg.senderId === user?.uid 
                      ? 'bg-blue-500 text-white' 
                      : msg.senderId === 'system'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.senderId !== user?.uid && msg.senderId !== 'system' && (
                      <p className="text-xs font-medium mb-1 opacity-75">{msg.senderName}</p>
                    )}
                    <div className="whitespace-pre-line">{msg.text}</div>
                    {msg.fileURL && (
                      <a 
                        href={msg.fileURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        📎 {msg.fileName}
                      </a>
                    )}
                    {msg.videoCallId && (
                      <Button
                        onClick={() => {
                          const videoCall = ongoingVideoCalls.find(call => call.id === msg.videoCallId);
                          if (videoCall && videoCall.status === 'active') {
                            handleJoinVideoCall(videoCall);
                          }
                        }}
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                        disabled={ongoingVideoCalls.find(call => call.id === msg.videoCallId)?.status !== 'active'}
                      >
                        <Video className="w-3 h-3 mr-1" />
                        {ongoingVideoCalls.find(call => call.id === msg.videoCallId)?.status === 'active' 
                          ? 'Join Video Call' 
                          : 'Call Ended'}
                      </Button>
                    )}
                    <div className="text-xs opacity-75 mt-1 text-right">
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {/* Invisible div for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 bg-white border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                />
                <input
                  type="file"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" className="p-2">
                    📎
                  </Button>
                </label>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Group</h3>
              <p className="text-gray-500">Choose a group from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}