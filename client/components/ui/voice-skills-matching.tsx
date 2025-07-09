import React, { useState, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Target,
  BookOpen,
  TrendingUp,
  CheckCircle,
  Star,
  MessageSquare,
  Zap,
  Brain,
  Heart,
  Award,
  ArrowRight,
  Plus,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Skill {
  subject: string;
  topics: string[];
  confidence: "beginner" | "intermediate" | "advanced";
  experience?: string;
}

interface MatchedDoubt {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  reward: number;
  matchPercentage: number;
  tags: string[];
  timeAgo: string;
}

interface VoiceSkillsMatchingProps {
  className?: string;
  onSkillsUpdate?: (skills: Skill[]) => void;
  onDoubtSelect?: (doubt: MatchedDoubt) => void;
  existingSkills?: Skill[];
}

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "History",
  "Economics",
  "Statistics",
  "Engineering",
];

const mockDoubts: MatchedDoubt[] = [
  {
    id: "1",
    title: "Help with calculus derivatives and chain rule",
    subject: "Mathematics",
    difficulty: "medium",
    reward: 50,
    matchPercentage: 95,
    tags: ["calculus", "derivatives", "chain rule"],
    timeAgo: "2h ago",
  },
  {
    id: "2",
    title: "React hooks and state management confusion",
    subject: "Computer Science",
    difficulty: "intermediate",
    reward: 75,
    matchPercentage: 88,
    tags: ["react", "hooks", "state management"],
    timeAgo: "4h ago",
  },
  {
    id: "3",
    title: "Understanding photosynthesis process in detail",
    subject: "Biology",
    difficulty: "easy",
    reward: 30,
    matchPercentage: 82,
    tags: ["photosynthesis", "biology", "plants"],
    timeAgo: "1d ago",
  },
];

export function VoiceSkillsMatching({
  className,
  onSkillsUpdate,
  onDoubtSelect,
  existingSkills = [],
}: VoiceSkillsMatchingProps) {
  const [detectedSkills, setDetectedSkills] = useState<Skill[]>(existingSkills);
  const [matchedDoubts, setMatchedDoubts] = useState<MatchedDoubt[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [sessionActive, setSessionActive] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    // Update matched doubts when skills change
    if (detectedSkills.length > 0) {
      updateMatchedDoubts();
    }
  }, [detectedSkills]);

  const handleVoiceMessage = (message: any) => {
    console.log("Skills matching voice message:", message);

    if (message?.type === "transcript" && message?.text) {
      setCurrentTranscript(message.text);
    } else if (message?.type === "assistant-response" && message?.text) {
      processSkillsFromResponse(message.text);
    }
  };

  const processSkillsFromResponse = (response: string) => {
    setIsAnalyzing(true);

    try {
      // Extract skills from AI response
      const extractedSkills = extractSkillsFromText(response);

      if (extractedSkills.length > 0) {
        setDetectedSkills((prev) => {
          const merged = mergeSkills(prev, extractedSkills);
          onSkillsUpdate?.(merged);
          return merged;
        });

        toast({
          title: "Skills Updated!",
          description: `Added ${extractedSkills.length} new skill areas to your profile.`,
        });
      }
    } catch (error) {
      console.error("Error processing skills:", error);
      toast({
        title: "Processing Error",
        description: "Had trouble understanding your skills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractSkillsFromText = (text: string): Skill[] => {
    const skills: Skill[] = [];
    const lowerText = text.toLowerCase();

    // Simple skill extraction logic
    subjects.forEach((subject) => {
      if (lowerText.includes(subject.toLowerCase())) {
        // Extract confidence level
        let confidence: "beginner" | "intermediate" | "advanced" =
          "intermediate";

        if (
          lowerText.includes("expert") ||
          lowerText.includes("advanced") ||
          lowerText.includes("master")
        ) {
          confidence = "advanced";
        } else if (
          lowerText.includes("beginner") ||
          lowerText.includes("basic") ||
          lowerText.includes("starting")
        ) {
          confidence = "beginner";
        }

        // Extract topics (simple keyword matching)
        const topics = extractTopicsForSubject(subject, lowerText);

        skills.push({
          subject,
          topics,
          confidence,
          experience: text, // Store original text as experience
        });
      }
    });

    return skills;
  };

  const extractTopicsForSubject = (subject: string, text: string): string[] => {
    const topicMap: Record<string, string[]> = {
      Mathematics: [
        "calculus",
        "algebra",
        "geometry",
        "statistics",
        "trigonometry",
        "derivatives",
        "integrals",
      ],
      "Computer Science": [
        "react",
        "javascript",
        "python",
        "algorithms",
        "data structures",
        "web development",
        "programming",
      ],
      Physics: [
        "mechanics",
        "thermodynamics",
        "electromagnetism",
        "quantum",
        "optics",
        "waves",
      ],
      Chemistry: [
        "organic",
        "inorganic",
        "physical chemistry",
        "biochemistry",
        "reactions",
        "bonding",
      ],
      Biology: [
        "cell biology",
        "genetics",
        "evolution",
        "ecology",
        "anatomy",
        "physiology",
      ],
    };

    const subjectTopics = topicMap[subject] || [];
    return subjectTopics.filter((topic) => text.includes(topic));
  };

  const mergeSkills = (existing: Skill[], newSkills: Skill[]): Skill[] => {
    const merged = [...existing];

    newSkills.forEach((newSkill) => {
      const existingIndex = merged.findIndex(
        (s) => s.subject === newSkill.subject,
      );

      if (existingIndex >= 0) {
        // Update existing skill
        merged[existingIndex] = {
          ...merged[existingIndex],
          topics: [
            ...new Set([...merged[existingIndex].topics, ...newSkill.topics]),
          ],
          confidence: newSkill.confidence,
          experience: newSkill.experience,
        };
      } else {
        // Add new skill
        merged.push(newSkill);
      }
    });

    return merged;
  };

  const updateMatchedDoubts = () => {
    // Filter and score doubts based on detected skills
    const scored = mockDoubts
      .map((doubt) => {
        const skillMatch = detectedSkills.find(
          (skill) => skill.subject === doubt.subject,
        );

        if (!skillMatch) return { ...doubt, matchPercentage: 0 };

        // Calculate match percentage based on topics and confidence
        const topicMatches = doubt.tags.filter((tag) =>
          skillMatch.topics.some(
            (topic) => topic.includes(tag) || tag.includes(topic),
          ),
        );

        let baseScore = skillMatch ? 60 : 0;
        const topicScore = (topicMatches.length / doubt.tags.length) * 30;
        const confidenceScore =
          skillMatch.confidence === "advanced"
            ? 10
            : skillMatch.confidence === "intermediate"
              ? 7
              : 3;

        const matchPercentage = Math.min(
          100,
          baseScore + topicScore + confidenceScore,
        );

        return { ...doubt, matchPercentage: Math.round(matchPercentage) };
      })
      .filter((doubt) => doubt.matchPercentage > 50)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    setMatchedDoubts(scored);
  };

  const handleSessionEnd = () => {
    setSessionActive(false);
    if (currentTranscript) {
      // Process final transcript if no AI response received
      const extractedSkills = extractSkillsFromText(currentTranscript);
      if (extractedSkills.length > 0) {
        setDetectedSkills((prev) => mergeSkills(prev, extractedSkills));
      }
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "advanced":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "beginner":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Voice Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Voice Skills Assessment
          </CardTitle>
          <CardDescription>
            Tell me about your expertise and what subjects you can help others
            with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <VoiceRecorder
              sessionType="skillsMatching"
              onMessage={handleVoiceMessage}
              onSessionEnd={handleSessionEnd}
              size="lg"
            />
          </div>

          {currentTranscript && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>You said:</strong> {currentTranscript}
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4 animate-pulse" />
              Analyzing your skills...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detected Skills */}
      {detectedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Your Teaching Skills
            </CardTitle>
            <CardDescription>
              Based on your input, here are your identified expertise areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {detectedSkills.map((skill, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{skill.subject}</h4>
                    <Badge
                      className={getConfidenceColor(skill.confidence)}
                      variant="secondary"
                    >
                      {skill.confidence}
                    </Badge>
                  </div>

                  {skill.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {skill.topics.map((topic, topicIndex) => (
                        <Badge
                          key={topicIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {skill.experience && (
                    <p className="text-sm text-muted-foreground">
                      {skill.experience.slice(0, 100)}
                      {skill.experience.length > 100 ? "..." : ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matched Opportunities */}
      {matchedDoubts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Matched Tutoring Opportunities
            </CardTitle>
            <CardDescription>
              Doubts that match your expertise - sorted by relevance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-y-auto">
              <div className="space-y-4">
                {matchedDoubts.map((doubt) => (
                  <div
                    key={doubt.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onDoubtSelect?.(doubt)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">
                          {doubt.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">{doubt.subject}</Badge>
                          <Badge variant="secondary">{doubt.difficulty}</Badge>
                          <span>{doubt.timeAgo}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {doubt.matchPercentage}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Award className="h-3 w-3" />
                            {doubt.reward} coins
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <Progress
                      value={doubt.matchPercentage}
                      className="h-1 mb-2"
                    />

                    <div className="flex flex-wrap gap-1">
                      {doubt.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Getting Started */}
      {detectedSkills.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Share Your Teaching Skills
            </h3>
            <p className="text-muted-foreground mb-4">
              Use the voice recorder above to tell us about subjects you're
              comfortable helping others with.
            </p>
            <div className="text-left space-y-2 max-w-md mx-auto">
              <p className="text-sm font-medium">Try saying something like:</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mic className="h-3 w-3" />
                  "I'm good at helping with calculus and derivatives"
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="h-3 w-3" />
                  "I can help with React and JavaScript programming"
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="h-3 w-3" />
                  "I'm experienced in biology and chemistry basics"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
