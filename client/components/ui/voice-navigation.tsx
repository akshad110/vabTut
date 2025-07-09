import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Navigation,
  Mic,
  Home,
  MessageSquare,
  Trophy,
  Users,
  Settings,
  Moon,
  Sun,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VoiceNavigationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "floating" | "embedded";
  onNavigationComplete?: (action: string) => void;
}

interface NavigationAction {
  command: string;
  description: string;
  action: () => void;
  icon: React.ReactNode;
  category: "navigation" | "ui" | "filter";
}

export function VoiceNavigation({
  className,
  size = "md",
  variant = "floating",
  onNavigationComplete,
}: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();

  // Define available navigation actions
  const navigationActions: NavigationAction[] = [
    {
      command: "go to dashboard",
      description: "Navigate to the main dashboard",
      action: () => navigate("/dashboard"),
      icon: <Home className="h-4 w-4" />,
      category: "navigation",
    },
    {
      command: "show doubts",
      description: "Go to the doubts and questions page",
      action: () => navigate("/doubts"),
      icon: <MessageSquare className="h-4 w-4" />,
      category: "navigation",
    },
    {
      command: "show quizzes",
      description: "Navigate to the quizzes section",
      action: () => navigate("/quizzes"),
      icon: <Trophy className="h-4 w-4" />,
      category: "navigation",
    },
    {
      command: "switch to dark mode",
      description: "Enable dark theme",
      action: () => setTheme("dark"),
      icon: <Moon className="h-4 w-4" />,
      category: "ui",
    },
    {
      command: "switch to light mode",
      description: "Enable light theme",
      action: () => setTheme("light"),
      icon: <Sun className="h-4 w-4" />,
      category: "ui",
    },
    {
      command: "toggle theme",
      description: "Switch between light and dark mode",
      action: () => setTheme(theme === "dark" ? "light" : "dark"),
      icon:
        theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        ),
      category: "ui",
    },
  ];

  const handleVoiceMessage = (message: any) => {
    console.log("Voice navigation message:", message);

    if (message?.type === "transcript" && message?.text) {
      const transcript = message.text.toLowerCase().trim();
      processVoiceCommand(transcript);
    } else if (message?.type === "assistant-response" && message?.text) {
      // Handle assistant responses for command interpretation
      const response = message.text.toLowerCase();

      // Extract action from assistant response
      if (
        response.includes("navigating to") ||
        response.includes("switching to") ||
        response.includes("going to")
      ) {
        const actionMatches = navigationActions.filter(
          (action) =>
            response.includes(action.command.split(" ").slice(-1)[0]) ||
            response.includes(action.command.split(" ").slice(-2).join(" ")),
        );

        if (actionMatches.length > 0) {
          executeAction(actionMatches[0]);
        }
      }
    }
  };

  const processVoiceCommand = (command: string) => {
    setLastCommand(command);
    setCommandHistory((prev) => [...prev.slice(-4), command]); // Keep last 5 commands

    // Find matching action
    const matchedAction = findMatchingAction(command);

    if (matchedAction) {
      executeAction(matchedAction);
    } else {
      // Show available commands if no match found
      toast({
        title: "Command Not Recognized",
        description: `"${command}" - Try saying "go to dashboard" or "switch to dark mode"`,
        variant: "destructive",
      });
    }
  };

  const findMatchingAction = (command: string): NavigationAction | null => {
    // Direct command matching
    const directMatch = navigationActions.find(
      (action) =>
        command.includes(action.command) || action.command.includes(command),
    );

    if (directMatch) return directMatch;

    // Fuzzy matching for common variations
    const keywords = command.split(" ");

    // Navigation keywords
    if (keywords.some((k) => ["dashboard", "home", "main"].includes(k))) {
      return navigationActions.find((a) => a.command.includes("dashboard"));
    }

    if (keywords.some((k) => ["doubts", "questions", "help"].includes(k))) {
      return navigationActions.find((a) => a.command.includes("doubts"));
    }

    if (keywords.some((k) => ["quiz", "quizzes", "test"].includes(k))) {
      return navigationActions.find((a) => a.command.includes("quizzes"));
    }

    // Theme keywords
    if (keywords.some((k) => ["dark", "night", "black"].includes(k))) {
      return navigationActions.find((a) => a.command.includes("dark mode"));
    }

    if (keywords.some((k) => ["light", "day", "white", "bright"].includes(k))) {
      return navigationActions.find((a) => a.command.includes("light mode"));
    }

    if (
      keywords.some((k) => ["toggle", "switch", "change"].includes(k)) &&
      keywords.some((k) => ["theme", "mode"].includes(k))
    ) {
      return navigationActions.find((a) => a.command.includes("toggle theme"));
    }

    return null;
  };

  const executeAction = (action: NavigationAction) => {
    try {
      action.action();
      setLastCommand(`Executed: ${action.description}`);
      onNavigationComplete?.(action.command);

      toast({
        title: "Command Executed",
        description: action.description,
        duration: 2000,
      });
    } catch (error) {
      console.error("Error executing navigation action:", error);
      toast({
        title: "Command Failed",
        description: "There was an error executing your command.",
        variant: "destructive",
      });
    }
  };

  const handleSessionEnd = () => {
    setIsListening(false);
  };

  const getAvailableCommands = () => {
    const grouped = navigationActions.reduce(
      (acc, action) => {
        if (!acc[action.category]) acc[action.category] = [];
        acc[action.category].push(action);
        return acc;
      },
      {} as Record<string, NavigationAction[]>,
    );

    return grouped;
  };

  if (variant === "floating") {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size={size === "sm" ? "sm" : "default"}
            variant="outline"
            className={cn(
              "fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
              size === "lg" && "h-16 w-16",
              size === "sm" && "h-10 w-10",
              className,
            )}
          >
            <Navigation
              className={cn(
                size === "lg"
                  ? "h-8 w-8"
                  : size === "sm"
                    ? "h-4 w-4"
                    : "h-5 w-5",
              )}
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-80">
          <VoiceNavigationContent
            onVoiceMessage={handleVoiceMessage}
            onSessionEnd={handleSessionEnd}
            lastCommand={lastCommand}
            commandHistory={commandHistory}
            availableCommands={getAvailableCommands()}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <VoiceNavigationContent
        onVoiceMessage={handleVoiceMessage}
        onSessionEnd={handleSessionEnd}
        lastCommand={lastCommand}
        commandHistory={commandHistory}
        availableCommands={getAvailableCommands()}
      />
    </Card>
  );
}

interface VoiceNavigationContentProps {
  onVoiceMessage: (message: any) => void;
  onSessionEnd: () => void;
  lastCommand: string;
  commandHistory: string[];
  availableCommands: Record<string, NavigationAction[]>;
}

function VoiceNavigationContent({
  onVoiceMessage,
  onSessionEnd,
  lastCommand,
  commandHistory,
  availableCommands,
}: VoiceNavigationContentProps) {
  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Command className="h-5 w-5 text-primary" />
          Voice Navigation
        </CardTitle>
        <CardDescription>
          Use your voice to navigate and control the interface
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Voice Control */}
        <div className="flex justify-center">
          <VoiceRecorder
            sessionType="navigation"
            onMessage={onVoiceMessage}
            onSessionEnd={onSessionEnd}
            size="md"
          />
        </div>

        {/* Last Command */}
        {lastCommand && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Last Command</span>
            </div>
            <p className="text-sm text-muted-foreground">{lastCommand}</p>
          </div>
        )}

        {/* Available Commands */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Available Commands</h4>

          {Object.entries(availableCommands).map(([category, actions]) => (
            <div key={category} className="space-y-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {category}
              </Badge>
              <div className="space-y-1">
                {actions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    {action.icon}
                    <div>
                      <p className="text-sm font-mono">"{action.command}"</p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Command History */}
        {commandHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Commands</h4>
            <div className="space-y-1">
              {commandHistory.slice(-3).map((cmd, index) => (
                <div
                  key={index}
                  className="text-xs p-2 bg-muted/50 rounded-md font-mono"
                >
                  "{cmd}"
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
}
