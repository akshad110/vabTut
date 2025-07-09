import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Coins,
  Trophy,
  Clock,
  Users,
  TrendingUp,
  Plus,
  Star,
  BookOpen,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const recentDoubts = [
    {
      id: 1,
      title: "Help with calculus derivatives",
      subject: "Mathematics",
      difficulty: "medium",
      reward: 50,
      timeAgo: "2 hours ago",
      status: "open",
    },
    {
      id: 2,
      title: "Physics momentum conservation",
      subject: "Physics",
      difficulty: "hard",
      reward: 75,
      timeAgo: "4 hours ago",
      status: "in_progress",
    },
    {
      id: 3,
      title: "Chemistry bonding concepts",
      subject: "Chemistry",
      difficulty: "easy",
      reward: 25,
      timeAgo: "1 day ago",
      status: "resolved",
    },
  ];

  const quizStats = [
    { subject: "Mathematics", score: 85, attempts: 12 },
    { subject: "Physics", score: 92, attempts: 8 },
    { subject: "Chemistry", score: 78, attempts: 15 },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "in_progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground mt-2">
              Track your progress and help others learn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Coins
                    </p>
                    <p className="text-2xl font-bold">1,250</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Questions Answered
                    </p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Quiz Average
                    </p>
                    <p className="text-2xl font-bold">85%</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Response Time
                    </p>
                    <p className="text-2xl font-bold">4.2m</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Doubts
                </CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Doubt
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDoubts.map((doubt) => (
                    <div
                      key={doubt.id}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{doubt.title}</h4>
                        <div className="flex items-center gap-1">
                          <Coins className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">
                            {doubt.reward}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline">{doubt.subject}</Badge>
                        <Badge
                          className={getDifficultyColor(doubt.difficulty)}
                          variant="secondary"
                        >
                          {doubt.difficulty}
                        </Badge>
                        <Badge
                          className={getStatusColor(doubt.status)}
                          variant="secondary"
                        >
                          {doubt.status}
                        </Badge>
                        <span className="text-muted-foreground">
                          {doubt.timeAgo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Quiz Performance
                </CardTitle>
                <Button size="sm" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  New Quiz
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quizStats.map((quiz, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {quiz.subject}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {quiz.score}% ({quiz.attempts} attempts)
                        </span>
                      </div>
                      <Progress value={quiz.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Browse Doubts</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Help other students and earn coins
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View All Doubts
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Study Groups</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join or create study sessions
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Find Groups
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Leaderboard</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  See how you rank among peers
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Rankings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* VabTut AI Assistant - Bottom */}
        <div className="mt-8 text-center pb-8">
          <Button
            size="lg"
            onClick={() => navigate("/vabtut-ai")}
            className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="mr-3">🎙️</span>
            VabTut AI Assistant
            <span className="ml-2">✨</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
