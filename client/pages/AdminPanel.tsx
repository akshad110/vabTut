import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import {
  Shield,
  Users,
  MessageSquare,
  Trophy,
  Star,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";

export default function AdminPanel() {
  const { isAdmin, user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalDoubts: 3842,
    resolvedDoubts: 3654,
    totalQuizzes: 892,
    activeUsers: 234,
  });

  const topMentors = [
    {
      id: "1",
      name: "Aarav Sharma",
      email: "aarav@example.com",
      doubtsSolved: 156,
      rating: 4.8,
      coins: 7800,
      subjects: ["Math", "Physics"],
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya@example.com",
      doubtsSolved: 134,
      rating: 4.9,
      coins: 6700,
      subjects: ["Chemistry", "Biology"],
    },
    {
      id: "3",
      name: "Rohit Kumar",
      email: "rohit@example.com",
      doubtsSolved: 128,
      rating: 4.7,
      coins: 6400,
      subjects: ["Math", "Computer Science"],
    },
    {
      id: "4",
      name: "Ananya Singh",
      email: "ananya@example.com",
      doubtsSolved: 115,
      rating: 4.8,
      coins: 5750,
      subjects: ["English", "History"],
    },
    {
      id: "5",
      name: "Vikram Gupta",
      email: "vikram@example.com",
      doubtsSolved: 98,
      rating: 4.6,
      coins: 4900,
      subjects: ["Physics", "Chemistry"],
    },
  ];

  const recentActivity = [
    {
      type: "doubt_solved",
      message: "Aarav Sharma solved a Physics doubt",
      time: "2 minutes ago",
    },
    {
      type: "new_user",
      message: "New user Kavya joined the platform",
      time: "5 minutes ago",
    },
    {
      type: "quiz_completed",
      message: "Priya Patel completed a Math quiz with 95% score",
      time: "10 minutes ago",
    },
    {
      type: "doubt_posted",
      message: "New Chemistry doubt posted by student",
      time: "15 minutes ago",
    },
  ];

  if (!isAdmin) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Admin Panel</h1>
            </div>
            <p className="text-muted-foreground">
              Welcome, {user?.user_metadata?.name || "Admin"}. Monitor platform
              performance and user analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Doubts
                    </p>
                    <p className="text-2xl font-bold">{stats.totalDoubts}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Resolution Rate
                    </p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        (stats.resolvedDoubts / stats.totalDoubts) * 100,
                      )}
                      %
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Quizzes
                    </p>
                    <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Users
                    </p>
                    <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Mentors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMentors.map((mentor, index) => (
                    <div
                      key={mentor.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{mentor.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {mentor.email}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {mentor.subjects.map((subject) => (
                              <Badge
                                key={subject}
                                variant="outline"
                                className="text-xs"
                              >
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{mentor.rating}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {mentor.doubtsSolved} solved
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {mentor.coins} coins
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Doubt Resolution Rate</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <Progress value={95} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">User Satisfaction</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Quiz Completion Rate</span>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                  <Progress value={88} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-medium">4.2 min avg</span>
                  </div>
                  <Progress value={85} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  View All Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Monitor Active Sessions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Generate Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Manage Content
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  System Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
