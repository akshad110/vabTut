import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, User, Bot, FileText, Image } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "participant";
  timestamp: Date;
  type?: "text" | "file" | "image";
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  doubtTitle: string;
}

export function Chat({
  isOpen,
  onClose,
  participantName,
  doubtTitle,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hi! I'm here to help with "${doubtTitle}". What specific part are you struggling with?`,
      sender: "participant",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      text: "Thanks for helping! I'm having trouble understanding the core concepts.",
      sender: "user",
      timestamp: new Date(Date.now() - 30000),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate participant typing and response
    setIsTyping(true);
    setTimeout(
      () => {
        const responses = [
          "That's a great question! Let me explain it step by step.",
          "I understand your confusion. Here's a clearer way to think about it...",
          "Good point! This is actually a common area where students get stuck.",
          "Let me break this down into smaller parts for you.",
          "That makes sense. Here's how I approach this type of problem...",
        ];

        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: "participant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, response]);
        setIsTyping(false);
      },
      1500 + Math.random() * 2000,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] p-0 flex flex-col">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="font-semibold">
                {participantName}
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-normal">
                {doubtTitle}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[400px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span
                  className={`text-xs mt-1 block ${
                    message.sender === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted px-3 py-2 rounded-lg">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast({
                  title: "File Upload",
                  description: "File upload feature coming soon!",
                });
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              File
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast({
                  title: "Image Upload",
                  description: "Image upload feature coming soon!",
                });
              }}
            >
              <Image className="h-4 w-4 mr-2" />
              Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
