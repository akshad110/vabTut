import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Coins, MessageSquare, User, Clock, Star } from "lucide-react";

export default function BrowseDoubts() {
  const [doubts] = useState([
    {
      id: "1",
      title: "Help with calculus derivatives",
      subject: "Mathematics",
      difficulty: "medium",
      status: "open",
      reward: 50,
      student: "Rahul Kumar",
      timeAgo: "2 hours ago",
      rating: null,
    },
    {
      id: "2",
      title: "Physics momentum conservation",
      subject: "Physics",
      difficulty: "hard",
      status: "in_progress",
      reward: 75,
      student: "Priya Singh",
      timeAgo: "4 hours ago",
      rating: null,
    },
    {
      id: "3",
      title: "Chemistry bonding concepts",
      subject: "Chemistry",
      difficulty: "easy",
      status: "resolved",
      reward: 25,
      student: "Anita Patel",
      timeAgo: "1 day ago",
      rating: 4.8,
    },
  ]);

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
      <div className="min-h-screen bg-background py-8 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Browse Doubts</h1>
        <div className="space-y-6">
          {doubts.map((doubt) => (
            <Card key={doubt.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>{doubt.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">{doubt.reward} coins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(doubt.difficulty)}>{doubt.difficulty}</Badge>
                    <Badge className={getStatusColor(doubt.status)}>{doubt.status}</Badge>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Posted by {doubt.student}</span>
                  <span>{doubt.timeAgo}</span>
                  {doubt.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {doubt.rating}
                    </span>
                  )}
                </div>
                <Button className="mt-4" variant="outline" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
