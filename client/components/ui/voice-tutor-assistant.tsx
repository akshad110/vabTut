import React, { useState, useRef, useEffect } from "react";
import { VoiceRecorder } from "@/components/ui/voice-recorder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  MessageCircle,
  User,
  Bot,
  Clock,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Brain,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  audioUrl?: string;
}

interface VoiceTutorAssistantProps {
  className?: string;
  initialTopic?: string;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

export function VoiceTutorAssistant({
  className,
  initialTopic,
  minimized = false,
  onToggleMinimize,
}: VoiceTutorAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(initialTopic || "");
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleVoiceMessage = (message: any) => {
    console.log("Tutor voice message:", message);

    // Handle different message types
    if (message?.type === "transcript" && message?.text) {
      // User's speech transcript
      addMessage({
        content: message.text,
        role: "user",
        timestamp: new Date(),
      });
    } else if (message?.type === "assistant-response" && message?.text) {
      // AI tutor's response
      addMessage({
        content: message.text,
        role: "assistant",
        timestamp: new Date(),
        audioUrl: message.audioUrl, // If available
      });

      // Extract topic if mentioned
      const response = message.text.toLowerCase();
      if (response.includes("topic:") || response.includes("subject:")) {
        const topicMatch = response.match(/(?:topic|subject):\s*([^.!?]+)/i);
        if (topicMatch) {
          setCurrentTopic(topicMatch[1].trim());
        }
      }
    }
  };

  const addMessage = (messageData: Omit<Message, "id">) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...messageData,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSessionStart = () => {
    setIsSessionActive(true);
    setSessionStartTime(new Date());
    if (messages.length === 0) {
      // Add welcome message if this is the first session
      addMessage({
        content: `Hello! I'm your AI tutor assistant. ${
          currentTopic ? `I see you want help with ${currentTopic}. ` : ""
        }What would you like to learn about today?`,
        role: "assistant",
        timestamp: new Date(),
      });
    }
  };

  const handleSessionEnd = () => {
    setIsSessionActive(false);
  };

  const resetSession = () => {
    setMessages([]);
    setIsSessionActive(false);
    setSessionStartTime(null);
    setCurrentTopic("");
    toast({
      title: "Session Reset",
      description: "Your tutoring session has been cleared.",
    });
  };

  const formatSessionDuration = () => {
    if (!sessionStartTime) return "0m";
    const now = new Date();
    const diff = Math.floor(
      (now.getTime() - sessionStartTime.getTime()) / 1000,
    );
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const getSampleQuestions = () => [
    "Explain how calculus derivatives work",
    "What is the difference between mitosis and meiosis?",
    "How do I solve quadratic equations?",
    "Can you help me understand photosynthesis?",
    "Explain recursion in programming",
    "What are the laws of thermodynamics?",
  ];

  if (minimized) {
    return (
      <Card className={cn("w-80", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              AI Tutor
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleMinimize}
              className="h-6 w-6 p-0"
            >
              <BookOpen className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center">
            <VoiceRecorder
              sessionType="tutor"
              onMessage={handleVoiceMessage}
              onSessionEnd={handleSessionEnd}
              size="md"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Click to ask your AI tutor
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              AI Tutor Assistant
              {isSessionActive && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {currentTopic
                ? `Learning about: ${currentTopic}`
                : "Get instant help with any academic topic through voice"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {sessionStartTime && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {formatSessionDuration()}
              </Badge>
            )}
            {onToggleMinimize && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleMinimize}
                className="h-8 w-8 p-0"
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={resetSession}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <div
          ref={scrollAreaRef}
          className="h-80 w-full rounded-md border p-4 overflow-y-auto"
        >
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">
                  Start a voice conversation with your AI tutor
                </p>
                <div className="text-left space-y-2">
                  <p className="text-xs font-medium">Try asking:</p>
                  {getSampleQuestions()
                    .slice(0, 3)
                    .map((question, index) => (
                      <div
                        key={index}
                        className="text-xs p-2 bg-muted rounded-md flex items-center gap-2"
                      >
                        <HelpCircle className="h-3 w-3 flex-shrink-0" />"
                        {question}"
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={message.id}>
                  <div
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "flex gap-3 max-w-[80%]",
                        message.role === "user" && "flex-row-reverse",
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary",
                        )}
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "rounded-lg p-3 text-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        )}
                      >
                        <p>{message.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {message.audioUrl && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
                            >
                              <Volume2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < messages.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Voice Controls */}
        <div className="flex items-center justify-center gap-4">
          <VoiceRecorder
            sessionType="tutor"
            onMessage={handleVoiceMessage}
            onSessionEnd={handleSessionEnd}
            size="lg"
            className="shadow-lg"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lightbulb className="h-3 w-3" />
          <span>Speak naturally about any topic you need help with</span>
        </div>
      </CardContent>
    </Card>
  );
}
