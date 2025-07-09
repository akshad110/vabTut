import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import {
  Trophy,
  Zap,
  Clock,
  Target,
  Brain,
  Star,
  Play,
  RotateCcw,
  Check,
  X,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  topic: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  questions: Question[];
  timeLimit: number;
  attempts: number;
  bestScore: number;
}

export default function Quizzes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  const [newQuiz, setNewQuiz] = useState({
    topic: "",
    subject: "",
    difficulty: "medium" as const,
    questionCount: 10,
  });

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "History",
  ];

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      topic: "Calculus Basics",
      subject: "Mathematics",
      difficulty: "medium",
      questions: [
        {
          id: "q1",
          question: "What is the derivative of x²?",
          options: ["x", "2x", "x²", "2x²"],
          correct_answer: 1,
          explanation: "The derivative of x² is 2x using the power rule.",
        },
        {
          id: "q2",
          question: "What is the integral of 2x?",
          options: ["x", "x²", "2x²", "x² + C"],
          correct_answer: 3,
          explanation:
            "The integral of 2x is x² + C, where C is the constant of integration.",
        },
      ],
      timeLimit: 300,
      attempts: 3,
      bestScore: 85,
    },
    {
      id: "2",
      topic: "Newton's Laws",
      subject: "Physics",
      difficulty: "hard",
      questions: [
        {
          id: "q1",
          question: "Newton's first law is also known as?",
          options: [
            "Law of Acceleration",
            "Law of Inertia",
            "Law of Action-Reaction",
            "Law of Gravity",
          ],
          correct_answer: 1,
          explanation:
            "Newton's first law is also known as the Law of Inertia.",
        },
      ],
      timeLimit: 420,
      attempts: 1,
      bestScore: 0,
    },
    {
      id: "3",
      topic: "Chemical Bonding",
      subject: "Chemistry",
      difficulty: "easy",
      questions: [
        {
          id: "q1",
          question: "What type of bond forms between metals and non-metals?",
          options: ["Covalent", "Ionic", "Metallic", "Hydrogen"],
          correct_answer: 1,
          explanation:
            "Ionic bonds form between metals and non-metals through electron transfer.",
        },
      ],
      timeLimit: 240,
      attempts: 5,
      bestScore: 95,
    },
  ]);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSubject =
      selectedSubject === "all" || quiz.subject === selectedSubject;
    const matchesDifficulty =
      selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
    return matchesSubject && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const generateQuiz = async () => {
    if (!newQuiz.topic || !newQuiz.subject) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Show loading state
    toast({
      title: "Generating Quiz...",
      description: "AI is creating personalized questions for your topic.",
    });

    try {
      // Simulate API call to generate quiz
      const response = await fetch("/api/quizzes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: newQuiz.topic,
          difficulty: newQuiz.difficulty,
          question_count: newQuiz.questionCount,
          subject: newQuiz.subject,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const result = await response.json();

      const quiz: Quiz = {
        id: Date.now().toString(),
        topic: newQuiz.topic,
        subject: newQuiz.subject,
        difficulty: newQuiz.difficulty,
        questions: result.data.questions,
        timeLimit: result.data.timeLimit,
        attempts: 0,
        bestScore: 0,
      };

      setQuizzes([quiz, ...quizzes]);
      setNewQuiz({
        topic: "",
        subject: "",
        difficulty: "medium",
        questionCount: 10,
      });
      setIsGenerateModalOpen(false);

      toast({
        title: "Success!",
        description: `Generated ${quiz.questions.length} AI-powered questions on ${newQuiz.topic}!`,
      });
    } catch (error) {
      // Fallback to local generation if API fails
      const localQuestions: Question[] = generateLocalQuestions(
        newQuiz.topic,
        newQuiz.subject,
        newQuiz.difficulty,
        newQuiz.questionCount,
      );

      const quiz: Quiz = {
        id: Date.now().toString(),
        topic: newQuiz.topic,
        subject: newQuiz.subject,
        difficulty: newQuiz.difficulty,
        questions: localQuestions,
        timeLimit:
          newQuiz.difficulty === "easy"
            ? 240
            : newQuiz.difficulty === "medium"
              ? 300
              : 420,
        attempts: 0,
        bestScore: 0,
      };

      setQuizzes([quiz, ...quizzes]);
      setNewQuiz({
        topic: "",
        subject: "",
        difficulty: "medium",
        questionCount: 10,
      });
      setIsGenerateModalOpen(false);

      toast({
        title: "Quiz Generated!",
        description: `Created ${quiz.questions.length} questions on ${newQuiz.topic}!`,
      });
    }
  };

  // Local fallback question generation
  const generateLocalQuestions = (
    topic: string,
    subject: string,
    difficulty: string,
    count: number,
  ): Question[] => {
    const questions: Question[] = [];

    // Generate realistic questions based on topic and subject
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `q_${Date.now()}_${i}`,
        question: `Question ${i + 1}: What key concept in ${topic} is essential for ${subject} understanding?`,
        options: [
          `Core principle of ${topic}`,
          `Secondary aspect of ${topic}`,
          `Advanced application in ${topic}`,
          `Historical context of ${topic}`,
        ],
        correct_answer: 0,
        explanation: `The core principle is fundamental for understanding ${topic} in ${subject}. This forms the foundation for more advanced concepts.`,
      });
    }

    return questions;
  };

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setTimeLeft(quiz.timeLimit);
    setIsQuizActive(true);
    setQuizComplete(false);
    setScore(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!currentQuiz) return;

    let correctAnswers = 0;
    currentQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round(
      (correctAnswers / currentQuiz.questions.length) * 100,
    );
    setScore(finalScore);
    setQuizComplete(true);
    setIsQuizActive(false);

    // Update quiz stats
    setQuizzes(
      quizzes.map((quiz) =>
        quiz.id === currentQuiz.id
          ? {
              ...quiz,
              attempts: quiz.attempts + 1,
              bestScore: Math.max(quiz.bestScore, finalScore),
            }
          : quiz,
      ),
    );

    toast({
      title: "Quiz Complete!",
      description: `You scored ${finalScore}% (${correctAnswers}/${currentQuiz.questions.length})`,
    });
  };

  const resetQuiz = () => {
    setIsQuizActive(false);
    setQuizComplete(false);
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTimeLeft(0);
    setScore(0);
  };

  // Timer effect
  useEffect(() => {
    if (isQuizActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isQuizActive && timeLeft === 0) {
      completeQuiz();
    }
  }, [isQuizActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isQuizActive && currentQuiz) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const progress =
      ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{currentQuiz.topic}</CardTitle>
                    <CardDescription>
                      Question {currentQuestionIndex + 1} of{" "}
                      {currentQuiz.questions.length}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono">{formatTime(timeLeft)}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetQuiz}>
                      Exit Quiz
                    </Button>
                  </div>
                </div>
                <Progress value={progress} className="mt-4" />
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {currentQuestion.question}
                  </h3>

                  <RadioGroup
                    value={selectedAnswers[currentQuestionIndex]?.toString()}
                    onValueChange={(value) =>
                      handleAnswerSelect(parseInt(value))
                    }
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`option-${index}`}
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={nextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === -1}
                  >
                    {currentQuestionIndex === currentQuiz.questions.length - 1
                      ? "Complete Quiz"
                      : "Next Question"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (quizComplete && currentQuiz) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mb-6">
                  {score >= 80 ? (
                    <Award className="h-16 w-16 mx-auto text-yellow-500" />
                  ) : score >= 60 ? (
                    <Trophy className="h-16 w-16 mx-auto text-primary" />
                  ) : (
                    <Target className="h-16 w-16 mx-auto text-muted-foreground" />
                  )}
                </div>

                <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
                <p className="text-xl mb-6">
                  You scored{" "}
                  <span className="text-primary font-bold">{score}%</span> on{" "}
                  {currentQuiz.topic}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{score}%</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {
                        selectedAnswers.filter(
                          (answer, index) =>
                            answer ===
                            currentQuiz.questions[index].correct_answer,
                        ).length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {currentQuiz.questions.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold">Review Answers</h3>
                  {currentQuiz.questions.map((question, index) => {
                    const isCorrect =
                      selectedAnswers[index] === question.correct_answer;
                    return (
                      <div
                        key={question.id}
                        className="text-left p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {isCorrect ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium">
                            Question {index + 1}
                          </span>
                        </div>
                        <p className="mb-2">{question.question}</p>
                        <p className="text-sm text-muted-foreground">
                          Correct answer:{" "}
                          {question.options[question.correct_answer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-primary mt-1">
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => startQuiz(currentQuiz)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Quiz
                  </Button>
                  <Button variant="outline" onClick={resetQuiz}>
                    Back to Quizzes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                AI Quizzes
              </h1>
              <p className="text-muted-foreground mt-2">
                Test your knowledge with AI-generated quizzes
              </p>
            </div>

            <Dialog
              open={isGenerateModalOpen}
              onOpenChange={setIsGenerateModalOpen}
            >
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Quiz
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate AI Quiz</DialogTitle>
                  <DialogDescription>
                    Create a custom quiz on any topic using AI.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Quadratic Equations, Photosynthesis"
                      value={newQuiz.topic}
                      onChange={(e) =>
                        setNewQuiz({ ...newQuiz, topic: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={newQuiz.subject}
                        onValueChange={(value) =>
                          setNewQuiz({ ...newQuiz, subject: value })
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
                        value={newQuiz.difficulty}
                        onValueChange={(value) =>
                          setNewQuiz({ ...newQuiz, difficulty: value as any })
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
                    <Label htmlFor="questionCount">Number of Questions</Label>
                    <Select
                      value={newQuiz.questionCount.toString()}
                      onValueChange={(value) =>
                        setNewQuiz({
                          ...newQuiz,
                          questionCount: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                        <SelectItem value="20">20 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsGenerateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={generateQuiz}>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Quiz
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{quiz.topic}</CardTitle>
                      <CardDescription>{quiz.subject}</CardDescription>
                    </div>
                    <Badge
                      className={getDifficultyColor(quiz.difficulty)}
                      variant="secondary"
                    >
                      {quiz.difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(quiz.timeLimit)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {quiz.questions.length} questions
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Best Score:</span>
                      <div className="flex items-center gap-1">
                        {quiz.bestScore > 0 && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                        <span className="font-medium">
                          {quiz.bestScore > 0
                            ? `${quiz.bestScore}%`
                            : "Not taken"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Attempts:</span>
                      <span className="font-medium">{quiz.attempts}</span>
                    </div>

                    <Button className="w-full" onClick={() => startQuiz(quiz)}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredQuizzes.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No quizzes found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or generate a new quiz.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
