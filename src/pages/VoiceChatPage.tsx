import React, { useState } from "react";
import VoiceJitsi from "../components/VoiceJitsi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const mockGroup = {
  name: "Study Group Alpha",
  members: [
    { id: "1", name: "Priyanka Hotkar", photoURL: "/priyanka.png" },
    { id: "2", name: "Arpita Baraskar", photoURL: "/arpita.png" },
    { id: "3", name: "Nayan Fulambarkar", photoURL: "/nayan.jpg" },
  ],
};

const mockMessages = [
  { id: 1, sender: "Priyanka Hotkar", text: "Hey team! Ready for the voice chat?" },
  { id: 2, sender: "Arpita Baraskar", text: "Yes! Let's discuss the project." },
];

export function VoiceChatPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const roomName = "voice-group-alpha";

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "You", text: newMessage },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-[#23272a] text-white">
      {/* Sidebar: Group Info & Members */}
      <aside className="w-64 bg-[#2f3136] flex flex-col p-4 border-r border-[#202225]">
        <h2 className="text-xl font-bold mb-4">{mockGroup.name}</h2>
        <div className="mb-2 text-sm text-gray-400">Members</div>
        <ul className="space-y-3">
          {mockGroup.members.map((member) => (
            <li key={member.id} className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={member.photoURL} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <span>{member.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main: Voice Chat & Chat Box */}
      <main className="flex-1 flex flex-col">
        {/* Voice Chat Area (VoiceJitsi, audio only) */}
        <div className="flex-1 flex items-center justify-center bg-[#36393f] border-b border-[#202225]">
          <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-lg">
            {/* VoiceJitsi with audio only */}
            <VoiceJitsi roomName={roomName} />
            {/* Overlay: Show a custom Discord-like banner */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
              <div className="bg-[#23272a]/80 px-8 py-4 rounded-xl shadow-xl flex flex-col items-center">
                <span className="text-3xl font-bold mb-2">🔊 Voice Channel</span>
                <span className="text-lg text-gray-300">Video is off. Audio only.</span>
              </div>
            </div>
          </div>
        </div>
        {/* Chat Area */}
        <div className="bg-[#2f3136] p-4 flex flex-col h-64">
          <div className="flex-1 overflow-y-auto space-y-2 mb-2">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-center space-x-2">
                <span className="font-semibold text-blue-400">{msg.sender}:</span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              className="flex-1 rounded bg-[#40444b] text-white px-3 py-2 focus:outline-none"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">Send</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VoiceChatPage; 