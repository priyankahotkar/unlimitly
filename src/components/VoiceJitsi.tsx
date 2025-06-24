import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const VoiceJitsi = ({ roomName }: { roomName: string }) => {
  return (
    <div style={{ height: "100vh", width: "100%", position: 'relative' }}>
      <JitsiMeeting
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: true,
          startAudioOnly: true,
        }}
        interfaceConfigOverwrite={{
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
        }}
        userInfo={{
          displayName: "Guest User",
          email: "guest@example.com",
        }}
        getIFrameRef={(iframe) => {
          iframe.style.height = "100vh";
          iframe.style.width = "100%";
        }}
      />
    </div>
  );
};

export default VoiceJitsi; 