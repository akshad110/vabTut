import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Users } from "lucide-react";

export default function StudyGroups() {
  const [groups] = useState([
    {
      id: "1",
      name: "Calculus Study Group",
      description: "Join us to master calculus concepts and problem-solving.",
      members: 12,
      activeSessions: 3,
    },
    {
      id: "2",
      name: "Physics Enthusiasts",
      description: "Discuss physics problems and share resources.",
      members: 8,
      activeSessions: 2,
    },
    {
      id: "3",
      name: "Chemistry Learners",
      description: "Collaborate on chemistry topics and experiments.",
      members: 15,
      activeSessions: 4,
    },
  ]);

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Study Groups</h1>
        <div className="space-y-6">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-muted-foreground">{group.description}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                  <span>{group.members} members</span>
                  <span>{group.activeSessions} active sessions</span>
                </div>
                <Button variant="outline" size="sm">
                  Find Group
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
