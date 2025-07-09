import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Square,
  Volume2,
  VolumeX,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createVapiInstance,
  getAssistantConfig,
  VoiceSessionType,
} from "@/lib/vapi";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  sessionType: VoiceSessionType;
  onTranscript?: (text: string) => void;
  onMessage?: (message: any) => void;
  onSessionEnd?: (data?: any) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "secondary";
  disabled?: boolean;
  autoStart?: boolean;
}

export function VoiceRecorder({
  sessionType,
  onTranscript,
  onMessage,
  onSessionEnd,
  className,
  size = "md",
  variant = "default",
  disabled = false,
  autoStart = false,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [sessionActive, setSessionActive] = useState(false);

  const vapiRef = useRef<any>(null);
  const { toast } = useToast();

  // Initialize Vapi instance
  useEffect(() => {
    const vapi = createVapiInstance();
    if (!vapi) {
      console.warn("Voice features not available - Vapi SDK not configured");
      return;
    }
    vapiRef.current = vapi;

    // Set up event listeners
    const handleCallStart = () => {
      setIsConnecting(false);
      setIsRecording(true);
      setSessionActive(true);
    };

    const handleCallEnd = () => {
      setIsRecording(false);
      setIsConnecting(false);
      setSessionActive(false);
      setVolumeLevel(0);
      onSessionEnd?.();
    };

    const handleMessage = (message: any) => {
      console.log("Voice message received:", message);
      setLastMessage(message?.text || message?.content || "");
      onMessage?.(message);

      // Handle transcript messages
      if (message?.type === "transcript" && message?.text) {
        onTranscript?.(message.text);
      }
    };

    const handleVolumeLevel = (level: number) => {
      setVolumeLevel(level);
    };

    const handleError = (error: any) => {
      console.error("Vapi error:", error);
      setIsRecording(false);
      setIsConnecting(false);
      setSessionActive(false);
      toast({
        title: "Voice Error",
        description: "There was an issue with the voice connection.",
        variant: "destructive",
      });
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    vapi.on("volume-level", handleVolumeLevel);
    vapi.on("error", handleError);

    // Auto-start if requested
    if (autoStart) {
      startRecording();
    }

    return () => {
      if (vapi) {
        vapi.off("call-start", handleCallStart);
        vapi.off("call-end", handleCallEnd);
        vapi.off("message", handleMessage);
        vapi.off("volume-level", handleVolumeLevel);
        vapi.off("error", handleError);
        vapi.stop();
      }
    };
  }, [autoStart, onMessage, onTranscript, onSessionEnd, toast]);

  const startRecording = async () => {
    if (!vapiRef.current || disabled) return;

    try {
      setIsConnecting(true);
      const assistantConfig = getAssistantConfig(sessionType);
      await vapiRef.current.start(assistantConfig);

      // Simulate demo voice interaction
      if (vapiRef.current.isDemo) {
        setTimeout(() => {
          // Simulate microphone access and voice recording
          const demoMessages = [
            "Hello, I can hear you clearly!",
            "Voice recording is working perfectly.",
            "Try speaking and I'll respond!",
            "I'm ready to help with your questions.",
          ];
          const randomMessage =
            demoMessages[Math.floor(Math.random() * demoMessages.length)];
          vapiRef.current.simulateAssistantResponse(randomMessage);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to start voice session:", error);
      setIsConnecting(false);
      toast({
        title: "Connection Failed",
        description: "Could not start voice session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Note: Vapi doesn't have a direct mute method, this is for UI feedback
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "lg":
        return "h-16 w-16";
      default:
        return "h-12 w-12";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4";
      case "lg":
        return "h-8 w-8";
      default:
        return "h-6 w-6";
    }
  };

  const handleMainAction = () => {
    if (sessionActive) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const renderMainButton = () => {
    const iconSize = getIconSize();
    let icon;
    let bgColor = "bg-primary hover:bg-primary/90";

    if (isConnecting) {
      icon = <Loader2 className={cn(iconSize, "animate-spin")} />;
    } else if (isRecording) {
      icon = <Square className={iconSize} />;
      bgColor = "bg-red-500 hover:bg-red-600";
    } else {
      icon = <Mic className={iconSize} />;
    }

    return (
      <Button
        onClick={handleMainAction}
        disabled={disabled || isConnecting}
        size="icon"
        variant={variant}
        data-voice-demo="true"
        className={cn(
          getSizeClasses(),
          "rounded-full relative transition-all duration-200",
          isRecording && "animate-pulse",
          bgColor,
          className,
        )}
      >
        {icon}
        {/* Volume indicator */}
        {isRecording && volumeLevel > 0 && (
          <div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            style={{
              transform: `scale(${1 + volumeLevel * 0.3})`,
            }}
          />
        )}
      </Button>
    );
  };

  // Voice features are always available in demo mode

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {renderMainButton()}

        {/* Mute button when recording */}
        {sessionActive && (
          <Button
            onClick={toggleMute}
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Status indicators */}
      <div className="flex flex-col items-center gap-1">
        {!isConnecting && !isRecording && !sessionActive && (
          <Badge
            variant="outline"
            className="text-xs bg-green-50 text-green-700 border-green-200"
          >
            ✅ Voice Ready
          </Badge>
        )}
        {isConnecting && (
          <Badge variant="secondary" className="text-xs">
            Connecting...
          </Badge>
        )}
        {isRecording && (
          <Badge variant="default" className="text-xs animate-pulse">
            🎙️ Recording
          </Badge>
        )}

        {/* Last message preview */}
        {lastMessage && (
          <div className="flex items-center gap-1 max-w-xs">
            <MessageCircle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              {lastMessage}
            </span>
          </div>
        )}

        {!isRecording && !isConnecting && !sessionActive && (
          <span className="text-xs text-muted-foreground">Click to start</span>
        )}
      </div>
    </div>
  );
}
