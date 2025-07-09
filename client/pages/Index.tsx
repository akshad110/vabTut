import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import {
  BookOpen,
  MessageSquare,
  Video,
  Coins,
  Trophy,
  Users,
  Zap,
  Star,
  ArrowRight,
  Play,
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: MessageSquare,
      title: "Ask & Answer",
      description: "Post your doubts and help others solve theirs",
      color: "text-blue-500",
    },
    {
      icon: Video,
      title: "Live Sessions",
      description: "Connect via voice, video, or chat for real-time help",
      color: "text-green-500",
    },
    {
      icon: Coins,
      title: "Earn Coins",
      description: "Get rewarded for helping your peers succeed",
      color: "text-yellow-500",
    },
    {
      icon: Trophy,
      title: "AI Quizzes",
      description: "Test your knowledge with AI-generated questions",
      color: "text-purple-500",
    },
  ];

  const stats = [
    { label: "Active Students", value: "10K+", icon: Users },
    { label: "Questions Solved", value: "50K+", icon: MessageSquare },
    { label: "Success Rate", value: "94%", icon: Star },
    { label: "Avg Response", value: "< 5min", icon: Zap },
  ];

  return (
    <Layout>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />

        <section className="relative px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              ✨ The Future of Peer Learning
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Learn Together,{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Grow Together
              </span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
              Join vabTut - where students help students. Post your doubts, earn
              coins by teaching others, and master any subject through our
              AI-powered platform.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/dashboard">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" className="text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to make learning collaborative and
              rewarding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-background border-2 ${feature.color}`}
                    >
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              );
            })}
          </div>
        </section>

        <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
            <CardContent className="relative p-8 sm:p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-6 text-primary" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to start learning?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students already using vabTut to excel in
                their studies. Start earning coins while helping others today.
              </p>
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/dashboard">
                  Join vabTut Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
