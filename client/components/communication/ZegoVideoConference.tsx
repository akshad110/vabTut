import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    ZegoUIKitPrebuilt: any;
  }
}

interface ZegoVideoConferenceProps {
  roomID?: string;
  userID?: string;
  userName?: string;
}

export const ZegoVideoConference: React.FC<ZegoVideoConferenceProps> = ({
  roomID,
  userID,
  userName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.ZegoUIKitPrebuilt) {
      console.error("ZegoUIKitPrebuilt is not loaded");
      return;
    }

    function getUrlParams(url: string) {
      const urlStr = url.split("?")[1];
      const urlSearchParams = new URLSearchParams(urlStr);
      return Object.fromEntries(urlSearchParams.entries());
    }

    const params = getUrlParams(window.location.href);
    const room = roomID || params["roomID"] || (Math.floor(Math.random() * 10000) + "");
    const user = userID || (Math.floor(Math.random() * 10000) + "");
    const name = userName || "userName" + user;

    const appID = 2136128491;
    const serverSecret = "2052dc680d61f78e617bf1b1186c49fa";
    const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      room,
      user,
      name
    );

    const zp = window.ZegoUIKitPrebuilt.create(kitToken);
    if (containerRef.current) {
      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              room,
          },
        ],
        scenario: {
          mode: window.ZegoUIKitPrebuilt.VideoConference,
        },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 2,
        layout: "Auto",
        showLayoutButton: false,
      });
    }
  }, [roomID, userID, userName]);

  return <div id="root" ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
};
