import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Star } from "lucide-react";

export default function Leaderboard() {
  const [leaders] = useState([
    { id: "1", name: "Rahul Kumar", score: 980, rank: 1 },
    { id: "2", name: "Priya Singh", score: 950, rank: 2 },
    { id: "3", name: "Anita Patel", score: 920, rank: 3 },
    { id: "4", name: "Aarav Sharma", score: 900, rank: 4 },
    { id: "5", name: "Meera Shah", score: 880, rank: 5 },
  ]);

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
        <div className="space-y-4">
          {leaders.map((leader) => (
            <Card key={leader.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{leader.name}</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {leader.rank}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Score: {leader.score}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
