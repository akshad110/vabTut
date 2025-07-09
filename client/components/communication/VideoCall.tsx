import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Monitor,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  doubtTitle: string;
}

export function VideoCall({
  isOpen,
  onClose,
  participantName,
  doubtTitle,
}: VideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<
    "connecting" | "connected" | "ended"
  >("connecting");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && callStatus === "connecting") {
      // Simulate connection
      const connectTimer = setTimeout(() => {
        setCallStatus("connected");
        toast({
          title: "Connected!",
          description: `You are now connected with ${participantName}`,
        });
      }, 2000);

      return () => clearTimeout(connectTimer);
    }
  }, [isOpen, callStatus, participantName, toast]);

  useEffect(() => {
    let durationTimer: NodeJS.Timeout;

    if (callStatus === "connected") {
      durationTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (durationTimer) clearInterval(durationTimer);
    };
  }, [callStatus]);

  useEffect(() => {
    // Simulate getting user media for demo purposes
    if (isOpen && localVideoRef.current) {
      // Create a colored canvas as placeholder for local video
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#6B26D9";
        ctx.fillRect(0, 0, 320, 240);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Your Video", 160, 120);

        canvas.toBlob((blob) => {
          if (blob && localVideoRef.current) {
            localVideoRef.current.src = URL.createObjectURL(blob);
          }
        });
      }
    }
  }, [isOpen, isVideoOn]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    setCallStatus("ended");
    setCallDuration(0);
    toast({
      title: "Call Ended",
      description: "The video call has been ended successfully.",
    });
    onClose();
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Video Off" : "Video On",
      description: `Your video is now ${isVideoOn ? "disabled" : "enabled"}.`,
    });
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast({
      title: isAudioOn ? "Muted" : "Unmuted",
      description: `Your microphone is now ${isAudioOn ? "muted" : "unmuted"}.`,
    });
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast({
      title: isSpeakerOn ? "Speaker Off" : "Speaker On",
      description: `Speaker is now ${isSpeakerOn ? "disabled" : "enabled"}.`,
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen Share Stopped" : "Screen Share Started",
      description: `Screen sharing is now ${isScreenSharing ? "disabled" : "enabled"}.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="bg-black text-white h-full">
          <DialogHeader className="p-4 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold text-white">
                  {doubtTitle}
                </DialogTitle>
                <p className="text-sm text-gray-300">with {participantName}</p>
              </div>
              <div className="flex items-center gap-4">
                {callStatus === "connected" && (
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm">
                      {formatDuration(callDuration)}
                    </span>
                  </div>
                )}
                {callStatus === "connecting" && (
                  <div className="text-yellow-400 text-sm">Connecting...</div>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="relative h-96 bg-gray-900">
            {/* Remote Video */}
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              {callStatus === "connected" ? (
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-300">{participantName}</p>
                  <p className="text-sm text-gray-500">Video connecting...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-gray-300">
                    Connecting to {participantName}...
                  </p>
                </div>
              )}
            </div>

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
              {isVideoOn ? (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs text-white">You</span>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <VideoOff className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 bg-gray-900">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isAudioOn ? "secondary" : "destructive"}
                size="lg"
                onClick={toggleAudio}
                className="rounded-full w-12 h-12 p-0"
              >
                {isAudioOn ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant={isVideoOn ? "secondary" : "destructive"}
                size="lg"
                onClick={toggleVideo}
                className="rounded-full w-12 h-12 p-0"
              >
                {isVideoOn ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant={isSpeakerOn ? "secondary" : "destructive"}
                size="lg"
                onClick={toggleSpeaker}
                className="rounded-full w-12 h-12 p-0"
              >
                {isSpeakerOn ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant={isScreenSharing ? "default" : "secondary"}
                size="lg"
                onClick={toggleScreenShare}
                className="rounded-full w-12 h-12 p-0"
              >
                <Monitor className="h-5 w-5" />
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={handleEndCall}
                className="rounded-full w-12 h-12 p-0 bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
