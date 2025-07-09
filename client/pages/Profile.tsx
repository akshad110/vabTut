import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Trophy,
  Clock,
  MessageSquare,
  CheckCircle,
  Star,
  Coins,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Zap,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const userProfile = {
    name: user?.user_metadata?.name || "Anonymous User",
    email: user?.email || "user@example.com",
    college: "MIT University",
    skillLevel: "Intermediate",
    totalKarma: 1250,
    subjects: ["Mathematics", "Physics", "Computer Science"],
    joinDate: "September 2024",
    avatar: "",
  };

  const activityStats = {
    doubtsPosted: 12,
    doubtsResolved: 8,
    totalHelpTime: "24h 30m",
    helpfulAnswers: 15,
    averageResponseTime: "4.2 minutes",
  };

  const recentDoubts = [
    {
      id: 1,
      title: "Calculus derivatives problem",
      subject: "Mathematics",
      status: "resolved",
      timestamp: "2 days ago",
      responses: 3,
    },
    {
      id: 2,
      title: "Quantum mechanics explanation",
      subject: "Physics",
      status: "open",
      timestamp: "1 week ago",
      responses: 1,
    },
    {
      id: 3,
      title: "Binary search algorithm",
      subject: "Computer Science",
      status: "resolved",
      timestamp: "2 weeks ago",
      responses: 5,
    },
  ];

  const helpedTopics = [
    {
      topic: "Linear Algebra",
      sessionsHelped: 5,
      avgRating: 4.8,
      feedback: "Very clear explanations!",
    },
    {
      topic: "Thermodynamics",
      sessionsHelped: 3,
      avgRating: 4.9,
      feedback: "Excellent problem-solving approach",
    },
    {
      topic: "Data Structures",
      sessionsHelped: 7,
      avgRating: 4.7,
      feedback: "Great step-by-step guidance",
    },
  ];

  const badges = [
    {
      name: "Top Helper",
      description: "Helped 10+ students this month",
      icon: Trophy,
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      earned: true,
    },
    {
      name: "Quick Responder",
      description: "Average response time under 5 minutes",
      icon: Zap,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      earned: true,
    },
    {
      name: "Problem Solver",
      description: "Resolved 5+ complex doubts",
      icon: CheckCircle,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      earned: true,
    },
    {
      name: "Study Streak",
      description: "7 days of consecutive activity",
      icon: Target,
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      earned: false,
    },
    {
      name: "Knowledge Master",
      description: "Expertise in 5+ subjects",
      icon: Award,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      earned: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
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
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your profile and view your learning journey
            </p>
          </div>

          {/* Basic Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={userProfile.avatar} />
                    <AvatarFallback className="text-lg">
                      {userProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{userProfile.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {userProfile.skillLevel}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userProfile.college}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {userProfile.joinDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {userProfile.totalKarma} Karma Points
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Subjects of Interest
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 rounded-lg bg-accent/50">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold">
                      {activityStats.doubtsPosted}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Doubts Posted
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/50">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold">
                      {activityStats.doubtsResolved}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Doubts Resolved
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/50">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold">
                      {activityStats.totalHelpTime}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Time Helping
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Helpful Answers</span>
                          <span>{activityStats.helpfulAnswers}/20</span>
                        </div>
                        <Progress
                          value={(activityStats.helpfulAnswers / 20) * 100}
                          className="h-2"
                        />
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Avg. Response Time:
                        </span>
                        <span className="ml-2 font-medium">
                          {activityStats.averageResponseTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Recent Activity</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Answered math question (2h ago)</p>
                      <p>• Posted new doubt (1d ago)</p>
                      <p>• Earned "Quick Responder" badge (3d ago)</p>
                      <p>• Helped with physics problem (5d ago)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Doubts and Help History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Doubts Posted
                </CardTitle>
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
                        <Badge
                          className={getStatusColor(doubt.status)}
                          variant="secondary"
                        >
                          {doubt.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {doubt.subject}
                        </Badge>
                        <span>{doubt.responses} responses</span>
                        <span>{doubt.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Doubts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Topics You've Helped With
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {helpedTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{topic.topic}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm">{topic.avgRating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {topic.sessionsHelped} sessions • "{topic.feedback}"
                      </p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Sessions
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Badges Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Badges & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        badge.earned
                          ? "bg-card border-primary/20"
                          : "bg-muted/50 opacity-60"
                      } transition-all hover:shadow-md`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`p-2 rounded-lg ${
                            badge.earned ? badge.color : "bg-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{badge.name}</h4>
                          {badge.earned && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Earned
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
