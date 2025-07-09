import React, { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Brain,
  Navigation,
  Users,
  Heart,
  Zap,
  MicOff,
  Volume2,
  Play,
  Pause,
  Square,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Loader2,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VoiceRecorder } from "@/components/ui/voice-recorder";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type AssistantMode =
  | "inactive"
  | "tutor"
  | "navigation"
  | "matching"
  | "support";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function VabTutAI() {
  const [currentMode, setCurrentMode] = useState<AssistantMode>("inactive");
  const [coins] = useState(1250);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("disconnected");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const assistantOptions = [
    {
      id: "tutor" as const,
      title: "AI Tutor Assistant",
      description: "24/7 voice-powered tutor for all subjects",
      icon: Brain,
      color: "from-blue-500 to-blue-600",
      gradient: "bg-gradient-to-br from-blue-500/20 to-blue-600/20",
      buttonText: "Start AI Tutor",
      examples: [
        "Explain how calculus derivatives work",
        "What is the difference between mitosis and meiosis?",
        "How do I solve quadratic equations?",
      ],
    },
    {
      id: "navigation" as const,
      title: "Voice Navigation",
      description: "Navigate the app using voice commands",
      icon: Navigation,
      color: "from-green-500 to-green-600",
      gradient: "bg-gradient-to-br from-green-500/20 to-green-600/20",
      buttonText: "Start Navigation",
      examples: ["Go to doubts page", "Switch to dark mode", "Show my profile"],
    },
    {
      id: "matching" as const,
      title: "Tutor Matching",
      description: "Voice-enabled tutor availability matching",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      gradient: "bg-gradient-to-br from-purple-500/20 to-purple-600/20",
      buttonText: "Set Availability",
      examples: [
        "I can help with React programming",
        "I'm good at mathematics and physics",
        "Available for biology tutoring",
      ],
    },
    {
      id: "support" as const,
      title: "Emotional Support",
      description: "Motivational voice companion for study support",
      icon: Heart,
      color: "from-pink-500 to-pink-600",
      gradient: "bg-gradient-to-br from-pink-500/20 to-pink-600/20",
      buttonText: "Get Support",
      examples: [
        "I'm feeling stressed about exams",
        "Need motivation to study",
        "Having trouble focusing today",
      ],
    },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleModeSelect = (mode: AssistantMode) => {
    setCurrentMode(mode);
    setMessages([]);
    setConnectionStatus("connecting");

    // Add welcome message based on mode
    const welcomeMessage = getWelcomeMessage(mode);
    setTimeout(() => {
      addMessage(welcomeMessage, "assistant");
      setConnectionStatus("connected");
    }, 1000);
  };

  const getWelcomeMessage = (mode: AssistantMode): string => {
    switch (mode) {
      case "tutor":
        return "Hello! I'm your AI tutor assistant. What topic would you like help with today? You can ask me about any academic subject!";
      case "navigation":
        return "Voice navigation ready! You can say things like 'go to doubts page' or 'switch to dark mode' to control the app.";
      case "matching":
        return "Great! Tell me what subjects you feel confident helping other students with, and I'll match you with relevant doubts.";
      case "support":
        return "Hi there! I'm here to support you on your learning journey. How are you feeling about your studies today?";
      default:
        return "How can I help you today?";
    }
  };

  const addMessage = (content: string, role: "user" | "assistant") => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36),
      content,
      role,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleVoiceMessage = (message: any) => {
    console.log("Voice message received:", message);

    if (message?.type === "transcript" && message?.text) {
      // User spoke
      addMessage(message.text, "user");
      setIsProcessing(true);

      // Simulate AI response (in real implementation, this would call your AI service)
      setTimeout(() => {
        const response = generateAIResponse(message.text, currentMode);
        addMessage(response, "assistant");
        setIsProcessing(false);
      }, 1500);
    }
  };

  const generateAIResponse = (
    userInput: string,
    mode: AssistantMode,
  ): string => {
    const input = userInput.toLowerCase();

    switch (mode) {
      case "tutor":
        if (input.includes("calculus") || input.includes("derivative")) {
          return "Great question about calculus! Derivatives measure the rate of change of a function. Think of it like measuring how fast a car is going at any given moment. The derivative tells us the slope of the curve at each point. Would you like me to explain the chain rule or work through a specific example?";
        } else if (input.includes("quadratic")) {
          return "Quadratic equations follow the form ax² + bx + c = 0. You can solve them using the quadratic formula: x = (-b ± √(b²-4ac)) / 2a. Would you like me to walk through a specific example step by step?";
        } else if (input.includes("mitosis") || input.includes("meiosis")) {
          return "Excellent biology question! Mitosis creates two identical diploid cells for growth and repair, while meiosis creates four genetically different haploid gametes for reproduction. The key difference is that meiosis has two divisions and creates genetic diversity. Would you like me to explain the specific phases?";
        } else {
          return "That's an interesting topic! I'd be happy to help explain that concept. Could you be more specific about what aspect you'd like me to focus on? I can break it down step by step.";
        }

      case "navigation":
        if (input.includes("doubt") || input.includes("question")) {
          return "Navigating to the doubts page now! You can also say 'go back' or 'return to dashboard' when you want to navigate elsewhere.";
        } else if (input.includes("dark") || input.includes("theme")) {
          return "Switching to dark mode for you! Say 'light mode' if you want to switch back.";
        } else {
          return "Voice navigation active! Try saying commands like 'go to doubts', 'show profile', 'switch theme', or 'open quizzes'.";
        }

      case "matching":
        if (
          input.includes("math") ||
          input.includes("calculus") ||
          input.includes("algebra")
        ) {
          return "Excellent! I see you're confident with mathematics. I've found 3 open doubts about calculus and 2 about algebra that match your expertise. Your help could earn you 50-100 coins. Would you like me to show you the specific questions?";
        } else if (input.includes("physics")) {
          return "Great! Physics tutoring is in high demand. I found 2 momentum questions and 1 thermodynamics doubt that match your skills. These could earn you up to 75 coins each. Ready to help some students?";
        } else {
          return "Thanks for sharing your expertise! Based on what you mentioned, I'm scanning for doubts that match your skills. This helps connect you with students who need exactly the kind of help you can provide.";
        }

      case "support":
        if (input.includes("stress") || input.includes("anxious")) {
          return "I understand that feeling stressed can be overwhelming. Remember, you're capable of more than you know! Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, out for 8. Every expert was once a beginner. You've got this! 💪";
        } else if (input.includes("motivation") || input.includes("tired")) {
          return "It's completely normal to feel tired sometimes. Your potential is endless - take it one step at a time! Remember why you started this learning journey. Even 15 minutes of progress is still progress. What's one small thing you could accomplish today? 🌟";
        } else {
          return "Thank you for sharing with me. Remember that learning is a journey, not a destination. Every challenge you face is making you stronger and smarter. I believe in you! Is there a specific area where you'd like some encouragement? ❤️";
        }

      default:
        return "I'm here to help! What would you like to know?";
    }
  };

  const getCurrentModeConfig = () => {
    return assistantOptions.find((opt) => opt.id === currentMode);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const renderActiveMode = () => {
    const modeConfig = getCurrentModeConfig();
    if (!modeConfig) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentMode("inactive")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Options
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    connectionStatus === "connected" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {connectionStatus === "connected" && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                  )}
                  {connectionStatus}
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{coins}</span>
                </div>
              </div>
            </div>

            <Card
              className={cn(
                "p-6 border-2",
                modeConfig.gradient,
                "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900",
              )}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${modeConfig.color} flex items-center justify-center shadow-lg`}
                >
                  <modeConfig.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{modeConfig.title}</h1>
                  <p className="text-muted-foreground">
                    {modeConfig.description}
                  </p>
                </div>
              </div>

              {/* Voice Controls */}
              <div className="flex items-center justify-center gap-4">
                <VoiceRecorder
                  sessionType={currentMode as any}
                  onMessage={handleVoiceMessage}
                  size="lg"
                  className="shadow-lg"
                />
                {isProcessing && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-4 max-w-[80%] ${message.role === "user" && "flex-row-reverse"}`}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : `bg-gradient-to-br ${modeConfig.color} text-white`
                    }`}
                  >
                    {message.role === "user" ? (
                      <Mic className="h-5 w-5" />
                    ) : (
                      <modeConfig.icon className="h-5 w-5" />
                    )}
                  </div>
                  <Card
                    className={`${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Example prompts */}
          {messages.length <= 1 && (
            <div className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Try asking:
                  </p>
                  <div className="grid gap-3">
                    {modeConfig.examples?.map((example, index) => (
                      <button
                        key={index}
                        className="text-left p-3 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors"
                        onClick={() => addMessage(example, "user")}
                      >
                        "{example}"
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {currentMode === "inactive" ? (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Button
                  variant="outline"
                  onClick={handleBackToDashboard}
                  className="absolute left-4 top-4"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl">
                  <Mic className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                VabTut AI Voice Assistant
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                Choose how you'd like the voice assistant to help you today
              </p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{coins} coins</span>
              </div>
            </div>

            {/* Inactive State */}
            <Card className="mb-8 border-2 border-dashed border-muted-foreground/30">
              <CardContent className="p-8 text-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <MicOff className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Ready to Start</h3>
                <p className="text-muted-foreground">
                  Select an assistant mode to begin your voice-powered learning
                  experience
                </p>
              </CardContent>
            </Card>

            {/* Assistant Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {assistantOptions.map((option) => (
                <Card
                  key={option.id}
                  className={cn(
                    "group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 overflow-hidden h-full",
                    option.gradient,
                  )}
                  onClick={() => handleModeSelect(option.id)}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`h-14 w-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <option.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4 flex-1">
                      {option.examples?.slice(0, 3).map((example, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {example.split(" ").slice(0, 4).join(" ")}...
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Play className="h-4 w-4 mr-2" />
                      {option.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features Available */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2">
              <CardContent className="p-6">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Real-Time Voice Features Available
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                  {[
                    "Voice-to-Text",
                    "AI Tutoring",
                    "Voice Navigation",
                    "Tutor Matching",
                    "Emotional Support",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 p-3 bg-background/60 rounded-lg"
                    >
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        renderActiveMode()
      )}
    </Layout>
  );
}
