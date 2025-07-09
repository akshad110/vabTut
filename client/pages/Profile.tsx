import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
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
  Settings,
  Lock,
  Shield,
} from "lucide-react";

type UserProfile = {
  name: string;
  email: string;
  college?: string;
  totalKarma: number;
  joinDate: string;
  avatar?: string;
  level: string;
  topSubject?: string;
};

type ActivityStats = {
  doubtsPosted: number;
  doubtsResolved: number;
  helpfulAnswers: number;
  avgRating: number;
  totalSessions: number;
};

type RecentDoubt = {
  id: string;
  title: string;
  subject: string;
  status: string;
  created_at: string;
  responses?: number;
  rating?: number;
};

export default function Profile() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activityStats, setActivityStats] = useState<ActivityStats>({
    doubtsPosted: 0,
    doubtsResolved: 0,
    helpfulAnswers: 0,
    avgRating: 0,
    totalSessions: 0,
  });
  const [recentDoubts, setRecentDoubts] = useState<RecentDoubt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    setLoading(true);

    // Create fallback profile data
    const fallbackProfile = {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
      coins: 1250, // Starting karma
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let profile = fallbackProfile;
    let userDoubts: any[] = [];
    let helpedDoubts: any[] = [];

    // Try to fetch user profile, but don't fail if table doesn't exist
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code === "PGRST116") {
        // Profile doesn't exist, try to create it
        const now = new Date().toISOString();
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              email: user.email || "",
              name:
                user.user_metadata?.name || user.email?.split("@")[0] || "User",
              coins: 1250,
              created_at: now,
              updated_at: now,
            },
          ])
          .select()
          .single();

        if (!createError && newProfile) {
          profile = newProfile;
        }
      } else if (!profileError && profileData) {
        profile = profileData;
      }
    } catch (error) {
      console.log("Profiles table not available, using fallback data");
    }

    // Try to fetch user's doubts, but don't fail if table doesn't exist
    try {
      const { data: doubtsData, error: doubtsError } = await supabase
        .from("doubts")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!doubtsError && doubtsData) {
        userDoubts = doubtsData;
      }
    } catch (error) {
      console.log("Doubts table not available, using empty data");
    }

    // Try to fetch doubts user has helped with, but don't fail if table doesn't exist
    try {
      const { data: helpedData, error: helpedError } = await supabase
        .from("doubts")
        .select("*")
        .eq("tutor_id", user.id);

      if (!helpedError && helpedData) {
        helpedDoubts = helpedData;
      }
    } catch (error) {
      console.log(
        "Doubts table not available for helped queries, using empty data",
      );
    }

    // Calculate stats
    const doubtsPosted = userDoubts?.length || 0;
    const doubtsResolved =
      helpedDoubts?.filter((d) => d.status === "resolved").length || 0;
    const totalSessions = helpedDoubts?.length || 0;
    const ratingsWithValues =
      helpedDoubts?.filter((d) => d.rating && d.rating > 0) || [];
    const avgRating =
      ratingsWithValues.length > 0
        ? ratingsWithValues.reduce((sum, d) => sum + (d.rating || 0), 0) /
          ratingsWithValues.length
        : 0;

    // Determine user level based on karma
    let level = "Beginner";
    if ((profile?.coins || 0) >= 5000) level = "Expert";
    else if ((profile?.coins || 0) >= 2000) level = "Advanced";
    else if ((profile?.coins || 0) >= 500) level = "Intermediate";

    // Find top subject
    const subjectCounts: { [key: string]: number } = {};
    helpedDoubts?.forEach((doubt) => {
      subjectCounts[doubt.subject] = (subjectCounts[doubt.subject] || 0) + 1;
    });
    const topSubject = Object.keys(subjectCounts).reduce(
      (a, b) => (subjectCounts[a] > subjectCounts[b] ? a : b),
      Object.keys(subjectCounts)[0],
    );

    setUserProfile({
      name: profile?.name || user.user_metadata?.name || "User",
      email: profile?.email || user.email || "",
      college: "MIT University", // Could be added to profile table
      totalKarma: profile?.coins || 0,
      joinDate: new Date(
        profile?.created_at || user.created_at || "",
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      avatar: profile?.avatar_url,
      level,
      topSubject,
    });

    setActivityStats({
      doubtsPosted,
      doubtsResolved,
      helpfulAnswers: doubtsResolved, // Simplified for now
      avgRating: Math.round(avgRating * 10) / 10,
      totalSessions,
    });

    setRecentDoubts(userDoubts || []);

    setLoading(false);
  };

  const badges = [
    {
      name: "Top Helper",
      description: "Helped 10+ students this month",
      icon: Trophy,
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      earned: activityStats.totalSessions >= 10,
    },
    {
      name: "Quick Responder",
      description: "Active and responsive tutor",
      icon: Zap,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      earned: activityStats.avgRating >= 4.5,
    },
    {
      name: "Problem Solver",
      description: "Resolved 5+ complex doubts",
      icon: CheckCircle,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      earned: activityStats.doubtsResolved >= 5,
    },
    {
      name: "Knowledge Sharer",
      description: "Posted helpful content",
      icon: BookOpen,
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      earned: activityStats.doubtsPosted >= 5,
    },
    {
      name: "Karma Master",
      description: "Earned 2000+ karma points",
      icon: Award,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      earned: (userProfile?.totalKarma || 0) >= 2000,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!userProfile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Profile not found</h2>
            <p className="text-muted-foreground">
              Unable to load your profile data.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground mt-2">
                Track your progress and achievements in the vabTut ecosystem
              </p>
            </div>
            <Button asChild variant="outline">
              <a href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </a>
            </Button>
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
                    {userProfile.level}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userProfile.email}</span>
                  </div>
                  {userProfile.college && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{userProfile.college}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Member since {userProfile.joinDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {userProfile.totalKarma} Karma Points
                    </span>
                  </div>
                  {userProfile.topSubject && (
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Top subject: {userProfile.topSubject}
                      </span>
                    </div>
                  )}
                  {activityStats.avgRating > 0 && (
                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        Rating: {activityStats.avgRating}/5.0
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Profile Status
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-green-600">
                      {userProfile.level} Level
                    </Badge>
                    {activityStats.totalSessions > 0 && (
                      <Badge variant="outline" className="text-blue-600">
                        {activityStats.totalSessions} Sessions
                      </Badge>
                    )}
                    {activityStats.doubtsResolved > 0 && (
                      <Badge variant="outline" className="text-purple-600">
                        {activityStats.doubtsResolved} Solved
                      </Badge>
                    )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                      Doubts Solved
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/50">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-2xl font-bold">
                      {activityStats.avgRating > 0
                        ? activityStats.avgRating
                        : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Average Rating
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/50">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold">
                      {activityStats.totalSessions}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Help Sessions
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Problem Solving</span>
                          <span>{activityStats.doubtsResolved}/50</span>
                        </div>
                        <Progress
                          value={Math.min(
                            (activityStats.doubtsResolved / 50) * 100,
                            100,
                          )}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Karma Progress</span>
                          <span>{userProfile.totalKarma}/5000</span>
                        </div>
                        <Progress
                          value={Math.min(
                            (userProfile.totalKarma / 5000) * 100,
                            100,
                          )}
                          className="h-2"
                        />
                      </div>
                      {activityStats.avgRating > 0 && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Community Rating:
                          </span>
                          <span className="ml-2 font-medium">
                            {activityStats.avgRating}/5.0 ⭐
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Achievement Summary</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Member since {userProfile.joinDate}</p>
                      <p>• {activityStats.doubtsPosted} questions asked</p>
                      <p>• {activityStats.doubtsResolved} problems solved</p>
                      <p>
                        • {badges.filter((b) => b.earned).length} badges earned
                      </p>
                      {userProfile.topSubject && (
                        <p>• Expert in {userProfile.topSubject}</p>
                      )}
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
                  {recentDoubts.length > 0 ? (
                    recentDoubts.map((doubt) => (
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
                            {doubt.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {doubt.subject}
                          </Badge>
                          {doubt.rating && <span>⭐ {doubt.rating}/5</span>}
                          <span>{formatTimeAgo(doubt.created_at)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No doubts posted yet</p>
                      <p className="text-xs">
                        Start asking questions to get help!
                      </p>
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <a href="/doubts">View All Doubts</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Help Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityStats.totalSessions > 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 mx-auto mb-3 text-yellow-500" />
                      <h4 className="font-medium mb-2">Great Helper!</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        You've helped with {activityStats.totalSessions}{" "}
                        sessions
                      </p>
                      {activityStats.avgRating > 0 && (
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">
                            {activityStats.avgRating}/5.0
                          </span>
                          <span className="text-sm text-muted-foreground">
                            average rating
                          </span>
                        </div>
                      )}
                      {userProfile.topSubject && (
                        <Badge variant="outline" className="mb-4">
                          Expert in {userProfile.topSubject}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No help sessions yet</p>
                      <p className="text-xs">
                        Start helping others to build your reputation!
                      </p>
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <a href="/browse-doubts">Help Others</a>
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
