import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";
import Vapi from "@vapi-ai/web";

interface VoiceCallProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  doubtTitle: string;
}

export function VoiceCall({
  isOpen,
  onClose,
  participantName,
  doubtTitle,
}: VoiceCallProps) {
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<
    "connecting" | "connected" | "ended"
  >("connecting");

  const { toast } = useToast();
  const vapi = useRef<Vapi | null>(null);
  const ASSISTANT_ID = "157fd43f-f803-4fbd-aa75-040b06b4d516"; // TODO: Replace with your real Vapi Assistant ID

  useEffect(() => {
    if (!vapi.current) {
      vapi.current = new Vapi("9e61ed06-6e83-4136-91ce-79ec677e8285");
      vapi.current.on("call-start", () => {
        setCallStatus("connected");
        toast({
          title: "Connected!",
          description: `Voice call connected with ${participantName}`,
        });
      });
      vapi.current.on("call-end", () => {
        setCallStatus("ended");
        setCallDuration(0);
        toast({
          title: "Call Ended",
          description: "The voice call has been ended successfully.",
        });
        onClose();
      });
      vapi.current.on("error", (e: any) => {
        setCallStatus("ended");
        toast({
          title: "Error",
          description: e.message || "An error occurred during the call.",
          variant: "destructive",
        });
      });
    }
    return () => {
      vapi.current?.stop();
      vapi.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (isOpen && callStatus !== "connected" && callStatus !== "connecting") {
      startCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startCall = () => {
    if (vapi.current && callStatus !== "connected") {
      setCallStatus("connecting");
      vapi.current.start(ASSISTANT_ID);
    }
  };

  const handleEndCall = () => {
    vapi.current?.stop();
    setCallStatus("ended");
    setCallDuration(0);
    toast({
      title: "Call Ended",
      description: "The voice call has been ended successfully.",
    });
    onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center py-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-center text-xl font-semibold">
              {doubtTitle}
            </DialogTitle>
            <p className="text-center text-muted-foreground">
              Voice call with {participantName}
            </p>
          </DialogHeader>

          {/* Avatar and Status */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <User className="h-16 w-16 text-primary-foreground" />
              {callStatus === "connected" && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                </div>
              )}
            </div>

            <h4 className="text-lg font-semibold mb-2">{participantName}</h4>

            {callStatus === "connecting" && (
              <div className="text-yellow-500">
                <div className="animate-pulse">Connecting...</div>
              </div>
            )}

            {callStatus === "connected" && (
              <div className="text-green-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>{formatDuration(callDuration)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Start Call Button (if not connected) */}
          {callStatus !== "connected" && callStatus !== "connecting" && (
            <Button onClick={startCall} className="mb-4">Start Call</Button>
          )}
          {/* Audio Visualizer */}
          {callStatus === "connected" && isAudioOn && (
            <div className="flex items-center justify-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: Math.random() * 20 + 10,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "0.5s",
                  }}
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <Button
              variant={isAudioOn ? "secondary" : "destructive"}
              size="lg"
              onClick={toggleAudio}
              className="rounded-full w-14 h-14 p-0"
              disabled={callStatus !== "connected"}
            >
              {isAudioOn ? (
                <Mic className="h-6 w-6" />
              ) : (
                <MicOff className="h-6 w-6" />
              )}
            </Button>

            <Button
              variant={isSpeakerOn ? "secondary" : "destructive"}
              size="lg"
              onClick={toggleSpeaker}
              className="rounded-full w-14 h-14 p-0"
              disabled={callStatus !== "connected"}
            >
              {isSpeakerOn ? (
                <Volume2 className="h-6 w-6" />
              ) : (
                <VolumeX className="h-6 w-6" />
              )}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={handleEndCall}
              className="rounded-full w-14 h-14 p-0 bg-red-600 hover:bg-red-700"
              disabled={callStatus !== "connected" && callStatus !== "connecting"}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
