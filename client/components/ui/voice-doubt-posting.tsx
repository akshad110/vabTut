import React, { useState } from "react";
import { VoiceRecorder } from "@/components/ui/voice-recorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mic,
  Edit3,
  Save,
  RotateCcw,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VoiceDoubtPostingProps {
  onSubmit: (doubt: {
    title: string;
    description: string;
    subject: string;
    difficulty: string;
    reward_coins: number;
  }) => void;
  onCancel?: () => void;
  className?: string;
}

interface DoubtData {
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  reward_coins: number;
}

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "History",
];

export function VoiceDoubtPosting({
  onSubmit,
  onCancel,
  className,
}: VoiceDoubtPostingProps) {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [processedDoubt, setProcessedDoubt] = useState<Partial<DoubtData>>({});
  const [manualDoubt, setManualDoubt] = useState<DoubtData>({
    title: "",
    description: "",
    subject: "",
    difficulty: "medium",
    reward_coins: 50,
  });
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const { toast } = useToast();

  const handleVoiceTranscript = (text: string) => {
    setVoiceTranscript((prev) => prev + " " + text);
  };

  const handleVoiceMessage = (message: any) => {
    console.log("Voice message:", message);

    if (message?.type === "assistant-response" && message?.text) {
      // Try to extract structured data from the assistant's response
      try {
        const response = message.text;

        // Simple parsing logic - could be enhanced with more sophisticated NLP
        if (response.includes("Title:") || response.includes("Subject:")) {
          const lines = response.split("\n");
          const extracted: Partial<DoubtData> = {};

          lines.forEach((line) => {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes("title:")) {
              extracted.title = line.split(":")[1]?.trim() || "";
            } else if (lowerLine.includes("description:")) {
              extracted.description = line.split(":")[1]?.trim() || "";
            } else if (lowerLine.includes("subject:")) {
              const subject = line.split(":")[1]?.trim() || "";
              if (subjects.includes(subject)) {
                extracted.subject = subject;
              }
            } else if (lowerLine.includes("difficulty:")) {
              const difficulty = line.split(":")[1]?.trim().toLowerCase();
              if (["easy", "medium", "hard"].includes(difficulty)) {
                extracted.difficulty = difficulty;
              }
            }
          });

          if (extracted.title || extracted.description) {
            setProcessedDoubt((prev) => ({ ...prev, ...extracted }));
          }
        }
      } catch (error) {
        console.error("Error processing voice response:", error);
      }
    }
  };

  const handleVoiceSessionEnd = () => {
    setIsProcessingVoice(false);
    if (voiceTranscript.trim()) {
      // Auto-populate description if not already processed
      if (!processedDoubt.description) {
        setProcessedDoubt((prev) => ({
          ...prev,
          description: voiceTranscript.trim(),
          title:
            prev.title || generateTitleFromTranscript(voiceTranscript.trim()),
        }));
      }
    }
  };

  const generateTitleFromTranscript = (transcript: string): string => {
    // Simple title generation from transcript
    const words = transcript.split(" ").slice(0, 8);
    return words.join(" ") + (transcript.split(" ").length > 8 ? "..." : "");
  };

  const applyVoiceDataToForm = () => {
    setManualDoubt((prev) => ({
      ...prev,
      title: processedDoubt.title || prev.title,
      description: processedDoubt.description || prev.description,
      subject: processedDoubt.subject || prev.subject,
      difficulty: processedDoubt.difficulty || prev.difficulty,
    }));
    setIsVoiceMode(false);
    toast({
      title: "Voice Data Applied",
      description: "Your voice input has been added to the form.",
    });
  };

  const resetVoiceData = () => {
    setVoiceTranscript("");
    setProcessedDoubt({});
    setIsProcessingVoice(false);
  };

  const handleSubmit = () => {
    const finalDoubt = {
      ...manualDoubt,
      title: manualDoubt.title || processedDoubt.title || "",
      description: manualDoubt.description || processedDoubt.description || "",
      subject: manualDoubt.subject || processedDoubt.subject || "",
    };

    if (!finalDoubt.title || !finalDoubt.description || !finalDoubt.subject) {
      toast({
        title: "Missing Information",
        description: "Please provide title, description, and subject.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(finalDoubt);
  };

  const currentDoubt = {
    ...manualDoubt,
    ...processedDoubt,
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Voice/Manual Mode Toggle */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={!isVoiceMode ? "default" : "outline"}
          onClick={() => setIsVoiceMode(false)}
          className="flex items-center gap-2"
        >
          <Edit3 className="h-4 w-4" />
          Manual Entry
        </Button>
        <Button
          variant={isVoiceMode ? "default" : "outline"}
          onClick={() => setIsVoiceMode(true)}
          className="flex items-center gap-2"
        >
          <Mic className="h-4 w-4" />
          Voice Input
        </Button>
      </div>

      {/* Voice Input Mode */}
      {isVoiceMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Voice Doubt Assistant
            </CardTitle>
            <CardDescription>
              Speak naturally about your academic doubt. I'll help structure it
              for you!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <VoiceRecorder
                sessionType="doubtPosting"
                onTranscript={handleVoiceTranscript}
                onMessage={handleVoiceMessage}
                onSessionEnd={handleVoiceSessionEnd}
                size="lg"
              />
            </div>

            {/* Voice transcript preview */}
            {voiceTranscript && (
              <div className="p-4 bg-muted rounded-lg">
                <Label className="text-sm font-medium mb-2 block">
                  What you said:
                </Label>
                <p className="text-sm">{voiceTranscript}</p>
              </div>
            )}

            {/* Processed doubt preview */}
            {Object.keys(processedDoubt).length > 0 && (
              <div className="space-y-3">
                <Separator />
                <Label className="text-sm font-medium">
                  AI-Processed Information:
                </Label>
                <div className="grid gap-3">
                  {processedDoubt.title && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Title:
                      </Label>
                      <p className="text-sm">{processedDoubt.title}</p>
                    </div>
                  )}
                  {processedDoubt.description && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Description:
                      </Label>
                      <p className="text-sm">{processedDoubt.description}</p>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {processedDoubt.subject && (
                      <Badge variant="outline">
                        Subject: {processedDoubt.subject}
                      </Badge>
                    )}
                    {processedDoubt.difficulty && (
                      <Badge variant="outline">
                        Difficulty: {processedDoubt.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={applyVoiceDataToForm}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Save className="h-3 w-3" />
                    Apply to Form
                  </Button>
                  <Button
                    onClick={resetVoiceData}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual Entry Form */}
      {!isVoiceMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Post Your Doubt
            </CardTitle>
            <CardDescription>
              Fill in the details about your academic question.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title*</Label>
              <Input
                id="title"
                placeholder="Brief description of your doubt"
                value={currentDoubt.title || ""}
                onChange={(e) =>
                  setManualDoubt({ ...manualDoubt, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                placeholder="Explain your doubt in detail..."
                className="min-h-32"
                value={currentDoubt.description || ""}
                onChange={(e) =>
                  setManualDoubt({
                    ...manualDoubt,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Subject*</Label>
                <Select
                  value={currentDoubt.subject || ""}
                  onValueChange={(value) =>
                    setManualDoubt({ ...manualDoubt, subject: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={currentDoubt.difficulty || "medium"}
                  onValueChange={(value) =>
                    setManualDoubt({ ...manualDoubt, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="reward">Reward Coins</Label>
              <Input
                id="reward"
                type="number"
                min="10"
                max="200"
                value={manualDoubt.reward_coins}
                onChange={(e) =>
                  setManualDoubt({
                    ...manualDoubt,
                    reward_coins: parseInt(e.target.value) || 50,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Post Doubt
        </Button>
      </div>
    </div>
  );
}
