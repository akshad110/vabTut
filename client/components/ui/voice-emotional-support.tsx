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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Heart,
  MessageCircle,
  Smile,
  TrendingUp,
  Users,
  Star,
  Sun,
  Coffee,
  BookOpen,
  Target,
  Zap,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SupportMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  mood?: "stressed" | "anxious" | "tired" | "motivated" | "happy" | "neutral";
  supportType?: "encouragement" | "study-tips" | "motivation" | "stress-relief";
}

interface VoiceEmotionalSupportProps {
  className?: string;
  variant?: "floating" | "embedded" | "fullscreen";
  onClose?: () => void;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

const motivationalQuotes = [
  "Every expert was once a beginner. Keep going! 🌟",
  "Your potential is endless. One step at a time! 💪",
  "Difficult roads often lead to beautiful destinations. 🎯",
  "You're stronger than you think and smarter than you know! 🧠",
  "Learning is not about being perfect, it's about being better! 📚",
  "Every mistake is a lesson in disguise. Keep learning! ✨",
];

const studyTips = [
  "Take a 5-minute break every 25 minutes of studying (Pomodoro technique)",
  "Try explaining concepts out loud - it helps with understanding",
  "Create a comfortable study environment with good lighting",
  "Break large topics into smaller, manageable chunks",
  "Practice active recall instead of just re-reading",
  "Get enough sleep - your brain consolidates memories during rest",
];

export function VoiceEmotionalSupport({
  className,
  variant = "embedded",
  onClose,
  minimized = false,
  onToggleMinimize,
}: VoiceEmotionalSupportProps) {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentMood, setCurrentMood] = useState<string>("neutral");
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [supportStats, setSupportStats] = useState({
    sessionsToday: 2,
    totalEncouragement: 15,
    streakDays: 7,
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleVoiceMessage = (message: any) => {
    console.log("Emotional support voice message:", message);

    if (message?.type === "transcript" && message?.text) {
      // Analyze user's mood from transcript
      const mood = analyzeMoodFromText(message.text);
      setCurrentMood(mood);

      addMessage({
        content: message.text,
        role: "user",
        timestamp: new Date(),
        mood: mood as any,
      });
    } else if (message?.type === "assistant-response" && message?.text) {
      // Determine support type from response
      const supportType = determineSupportType(message.text);

      addMessage({
        content: message.text,
        role: "assistant",
        timestamp: new Date(),
        supportType: supportType as any,
      });

      // Update support stats
      setSupportStats((prev) => ({
        ...prev,
        totalEncouragement: prev.totalEncouragement + 1,
      }));
    }
  };

  const analyzeMoodFromText = (text: string): string => {
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes("stressed") ||
      lowerText.includes("overwhelmed") ||
      lowerText.includes("pressure")
    ) {
      return "stressed";
    }
    if (
      lowerText.includes("anxious") ||
      lowerText.includes("worried") ||
      lowerText.includes("nervous")
    ) {
      return "anxious";
    }
    if (
      lowerText.includes("tired") ||
      lowerText.includes("exhausted") ||
      lowerText.includes("burnt out")
    ) {
      return "tired";
    }
    if (
      lowerText.includes("happy") ||
      lowerText.includes("excited") ||
      lowerText.includes("good")
    ) {
      return "happy";
    }
    if (
      lowerText.includes("motivated") ||
      lowerText.includes("ready") ||
      lowerText.includes("confident")
    ) {
      return "motivated";
    }

    return "neutral";
  };

  const determineSupportType = (text: string): string => {
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes("tip") ||
      lowerText.includes("try") ||
      lowerText.includes("technique")
    ) {
      return "study-tips";
    }
    if (
      lowerText.includes("you can") ||
      lowerText.includes("believe") ||
      lowerText.includes("capable")
    ) {
      return "encouragement";
    }
    if (
      lowerText.includes("goal") ||
      lowerText.includes("achieve") ||
      lowerText.includes("success")
    ) {
      return "motivation";
    }
    if (
      lowerText.includes("breathe") ||
      lowerText.includes("relax") ||
      lowerText.includes("calm")
    ) {
      return "stress-relief";
    }

    return "encouragement";
  };

  const addMessage = (messageData: Omit<SupportMessage, "id">) => {
    const newMessage: SupportMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...messageData,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSessionStart = () => {
    setIsSessionActive(true);
    setSessionStartTime(new Date());

    if (messages.length === 0) {
      // Add welcome message
      addMessage({
        content:
          "Hi there! I'm here to support you on your learning journey. How are you feeling about your studies today?",
        role: "assistant",
        timestamp: new Date(),
        supportType: "encouragement",
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
    setCurrentMood("neutral");
    toast({
      title: "Session Reset",
      description: "Your support session has been cleared.",
    });
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "stressed":
        return <Target className="h-4 w-4 text-red-500" />;
      case "anxious":
        return <Heart className="h-4 w-4 text-orange-500" />;
      case "tired":
        return <Coffee className="h-4 w-4 text-gray-500" />;
      case "happy":
        return <Smile className="h-4 w-4 text-green-500" />;
      case "motivated":
        return <Zap className="h-4 w-4 text-blue-500" />;
      default:
        return <Sun className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSupportTypeIcon = (type: string) => {
    switch (type) {
      case "study-tips":
        return <BookOpen className="h-3 w-3" />;
      case "motivation":
        return <TrendingUp className="h-3 w-3" />;
      case "stress-relief":
        return <Heart className="h-3 w-3" />;
      default:
        return <Star className="h-3 w-3" />;
    }
  };

  const getRandomQuote = () => {
    return motivationalQuotes[
      Math.floor(Math.random() * motivationalQuotes.length)
    ];
  };

  const getRandomStudyTip = () => {
    return studyTips[Math.floor(Math.random() * studyTips.length)];
  };

  // Floating variant
  if (variant === "floating") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className={cn(
              "fixed bottom-6 left-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
              className,
            )}
          >
            <Heart className="h-6 w-6 mr-2" />
            Support
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Emotional Support Assistant
            </DialogTitle>
            <DialogDescription>
              A safe space for motivation and mental wellness support
            </DialogDescription>
          </DialogHeader>
          <VoiceEmotionalSupportContent
            messages={messages}
            isSessionActive={isSessionActive}
            currentMood={currentMood}
            supportStats={supportStats}
            onVoiceMessage={handleVoiceMessage}
            onSessionStart={handleSessionStart}
            onSessionEnd={handleSessionEnd}
            onReset={resetSession}
            scrollAreaRef={scrollAreaRef}
            getMoodIcon={getMoodIcon}
            getSupportTypeIcon={getSupportTypeIcon}
            getRandomQuote={getRandomQuote}
            getRandomStudyTip={getRandomStudyTip}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Minimized variant
  if (minimized) {
    return (
      <Card className={cn("w-80", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              Support Bot
              {currentMood !== "neutral" && (
                <Badge variant="outline" className="ml-2">
                  {getMoodIcon(currentMood)}
                </Badge>
              )}
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleMinimize}
              className="h-6 w-6 p-0"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center space-y-3">
            <VoiceRecorder
              sessionType="emotionalSupport"
              onMessage={handleVoiceMessage}
              onSessionEnd={handleSessionEnd}
              size="md"
            />
            <p className="text-xs text-muted-foreground">
              Need a motivation boost? I'm here to listen
            </p>
            <div className="text-xs text-center p-2 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 rounded-md">
              💝 {getRandomQuote()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Embedded variant (default)
  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <VoiceEmotionalSupportContent
        messages={messages}
        isSessionActive={isSessionActive}
        currentMood={currentMood}
        supportStats={supportStats}
        onVoiceMessage={handleVoiceMessage}
        onSessionStart={handleSessionStart}
        onSessionEnd={handleSessionEnd}
        onReset={resetSession}
        scrollAreaRef={scrollAreaRef}
        getMoodIcon={getMoodIcon}
        getSupportTypeIcon={getSupportTypeIcon}
        getRandomQuote={getRandomQuote}
        getRandomStudyTip={getRandomStudyTip}
        onToggleMinimize={onToggleMinimize}
        onClose={onClose}
      />
    </Card>
  );
}

interface VoiceEmotionalSupportContentProps {
  messages: SupportMessage[];
  isSessionActive: boolean;
  currentMood: string;
  supportStats: any;
  onVoiceMessage: (message: any) => void;
  onSessionStart: () => void;
  onSessionEnd: () => void;
  onReset: () => void;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  getMoodIcon: (mood: string) => React.ReactNode;
  getSupportTypeIcon: (type: string) => React.ReactNode;
  getRandomQuote: () => string;
  getRandomStudyTip: () => string;
  onToggleMinimize?: () => void;
  onClose?: () => void;
}

function VoiceEmotionalSupportContent({
  messages,
  isSessionActive,
  currentMood,
  supportStats,
  onVoiceMessage,
  onSessionStart,
  onSessionEnd,
  onReset,
  scrollAreaRef,
  getMoodIcon,
  getSupportTypeIcon,
  getRandomQuote,
  getRandomStudyTip,
  onToggleMinimize,
  onClose,
}: VoiceEmotionalSupportContentProps) {
  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Emotional Support Assistant
              {isSessionActive && (
                <Badge variant="secondary" className="ml-2">
                  Listening
                </Badge>
              )}
              {currentMood !== "neutral" && (
                <Badge variant="outline" className="ml-2">
                  {getMoodIcon(currentMood)}
                  <span className="ml-1 capitalize">{currentMood}</span>
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              A caring companion for your learning journey
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {onToggleMinimize && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleMinimize}
                className="h-8 w-8 p-0"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onReset}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            )}
          </div>
        </div>

        {/* Support Stats */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-500" />
            <span>{supportStats.totalEncouragement} encouragements</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-3 w-3 text-blue-500" />
            <span>{supportStats.streakDays} day streak</span>
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
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50 text-pink-500" />
                <p className="mb-4">
                  Welcome to your personal support space! 💝
                </p>
                <div className="text-left space-y-3 max-w-md mx-auto">
                  <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 rounded-md">
                    <p className="text-sm font-medium mb-2">✨ I'm here to:</p>
                    <ul className="text-xs space-y-1">
                      <li>• Provide motivation and encouragement</li>
                      <li>• Help manage study stress</li>
                      <li>• Share effective study techniques</li>
                      <li>• Celebrate your progress</li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium">💬 Daily inspiration:</p>
                    <p className="text-xs italic text-muted-foreground mt-1">
                      "{getRandomQuote()}"
                    </p>
                  </div>
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
                            : "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
                        )}
                      >
                        {message.role === "user" ? (
                          message.mood ? (
                            getMoodIcon(message.mood)
                          ) : (
                            <MessageCircle className="h-4 w-4" />
                          )
                        ) : (
                          <Heart className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "rounded-lg p-3 text-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950",
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
                          {message.supportType && (
                            <Badge variant="outline" className="text-xs">
                              {getSupportTypeIcon(message.supportType)}
                              <span className="ml-1">
                                {message.supportType}
                              </span>
                            </Badge>
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
            sessionType="emotionalSupport"
            onMessage={onVoiceMessage}
            onSessionEnd={onSessionEnd}
            size="lg"
            className="shadow-lg bg-gradient-to-r from-pink-500 to-purple-600"
          />
        </div>

        {/* Quick Support Actions */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const quote = getRandomQuote();
              // Add quote as a message
            }}
            className="flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Random Quote
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const tip = getRandomStudyTip();
              // Add tip as a message
            }}
            className="flex items-center gap-1"
          >
            <BookOpen className="h-3 w-3" />
            Study Tip
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          💝 Remember: You're doing great, and every step forward counts!
        </div>
      </CardContent>
    </>
  );
}
