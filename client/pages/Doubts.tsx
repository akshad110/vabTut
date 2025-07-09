import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { VideoCall } from "@/components/communication/VideoCall";
import { VoiceCall } from "@/components/communication/VoiceCall";
import { Chat } from "@/components/communication/Chat";
import { VoiceDoubtPosting } from "@/components/ui/voice-doubt-posting";
import { ZegoVideoConference } from "@/components/communication/ZegoVideoConference";
import {
  Plus,
  Search,
  Filter,
  MessageSquare,
  Coins,
  Clock,
  User,
  Video,
  Phone,
  MessageCircle,
  Star,
  CheckCircle,
  Mic,
  Edit3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Doubts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeVideoCall, setActiveVideoCall] = useState<{
    isOpen: boolean;
    participantName: string;
    doubtTitle: string;
  }>({ isOpen: false, participantName: "", doubtTitle: "" });
  const [activeVoiceCall, setActiveVoiceCall] = useState<{
    isOpen: boolean;
    participantName: string;
    doubtTitle: string;
  }>({ isOpen: false, participantName: "", doubtTitle: "" });
  const [activeChat, setActiveChat] = useState<{
    isOpen: boolean;
    participantName: string;
    doubtTitle: string;
  }>({ isOpen: false, participantName: "", doubtTitle: "" });

  // State for Zego video conference
  const [zegoVideoOpen, setZegoVideoOpen] = useState(false);
  const [zegoRoomID, setZegoRoomID] = useState<string | null>(null);

  const [doubts, setDoubts] = useState([
    {
      id: "1",
      title: "Help with calculus derivatives",
      description:
        "I'm struggling to understand the concept of derivatives in calculus. Specifically, I need help with the chain rule and how to apply it to complex functions. I've watched videos but still can't grasp when to use which method.",
      subject: "Mathematics",
      difficulty: "medium",
      status: "open",
      reward_coins: 50,
      student_id: "student1",
      student_name: "Rahul Kumar",
      tutor_id: null,
      tutor_name: null,
      created_at: "2024-01-15T10:30:00Z",
      responses: 3,
      rating: null,
    },
    {
      id: "2",
      title: "Physics momentum conservation",
      description:
        "Can someone explain momentum conservation in collisions? I have a problem where two objects collide and I need to find their final velocities. The textbook explanation is confusing me.",
      subject: "Physics",
      difficulty: "hard",
      status: "in_progress",
      reward_coins: 75,
      student_id: "student2",
      student_name: "Priya Singh",
      tutor_id: "tutor1",
      tutor_name: "Aarav Sharma",
      created_at: "2024-01-15T08:15:00Z",
      responses: 5,
      rating: null,
    },
    {
      id: "3",
      title: "Chemistry bonding concepts",
      description:
        "I need help understanding ionic vs covalent bonding. What determines which type of bond forms between different elements? Examples would be helpful!",
      subject: "Chemistry",
      difficulty: "easy",
      status: "resolved",
      reward_coins: 25,
      student_id: "student3",
      student_name: "Anita Patel",
      tutor_id: "tutor2",
      tutor_name: "Priya Patel",
      created_at: "2024-01-14T16:45:00Z",
      responses: 7,
      rating: 4.8,
    },
    {
      id: "4",
      title: "Computer Science algorithms",
      description:
        "Need help with understanding time complexity analysis. How do I calculate Big O notation for recursive algorithms? I'm preparing for technical interviews.",
      subject: "Computer Science",
      difficulty: "hard",
      status: "open",
      reward_coins: 100,
      student_id: "student4",
      student_name: "Vikram Gupta",
      tutor_id: null,
      tutor_name: null,
      created_at: "2024-01-15T14:20:00Z",
      responses: 1,
      rating: null,
    },
    {
      id: "5",
      title: "English literature analysis",
      description:
        "How do I analyze themes in Shakespeare's plays? I'm working on Macbeth and need help identifying literary devices and their significance.",
      subject: "English",
      difficulty: "medium",
      status: "open",
      reward_coins: 40,
      student_id: "student5",
      student_name: "Meera Shah",
      tutor_id: null,
      tutor_name: null,
      created_at: "2024-01-15T12:00:00Z",
      responses: 2,
      rating: null,
    },
    {
      id: "6",
      title: "Biology cell division",
      description:
        "Can someone explain the difference between mitosis and meiosis? I understand the basics but need help with the specific phases and their purposes.",
      subject: "Biology",
      difficulty: "medium",
      status: "in_progress",
      reward_coins: 60,
      student_id: "student6",
      student_name: "Arjun Reddy",
      tutor_id: "tutor3",
      tutor_name: "Dr. Sarah Wilson",
      created_at: "2024-01-15T09:30:00Z",
      responses: 4,
      rating: null,
    },
  ]);

  const [newDoubt, setNewDoubt] = useState({
    title: "",
    description: "",
    subject: "",
    difficulty: "medium",
    reward_coins: 50,
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

  interface Doubt {
    id: string;
    title: string;
    description: string;
    subject: string;
    difficulty: string;
    status: string;
    reward_coins: number;
    student_id: string;
    student_name: string;
    tutor_id: string | null;
    tutor_name: string | null;
    created_at: string;
    responses: number;
    rating: number | null;
  }

  const filteredDoubts: Doubt[] = doubts.filter((doubt: Doubt) => {
    const matchesSearch =
      doubt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doubt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "all" || doubt.subject === selectedSubject;
    const matchesDifficulty =
      selectedDifficulty === "all" || doubt.difficulty === selectedDifficulty;
    const matchesStatus =
      selectedStatus === "all" || doubt.status === selectedStatus;

    return (
      matchesSearch && matchesSubject && matchesDifficulty && matchesStatus
    );
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

  const handleCreateDoubt = async () => {
    if (!newDoubt.title || !newDoubt.description || !newDoubt.subject) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const doubt = {
      id: Date.now().toString(),
      ...newDoubt,
      status: "open" as const,
      student_id: user?.id || "anonymous",
      student_name: user?.user_metadata?.name || "Anonymous",
      tutor_id: null,
      tutor_name: null,
      created_at: new Date().toISOString(),
      responses: 0,
      rating: null,
    };

    setDoubts([doubt, ...doubts]);
    setNewDoubt({
      title: "",
      description: "",
      subject: "",
      difficulty: "medium",
      reward_coins: 50,
    });
    setIsCreateModalOpen(false);

    toast({
      title: "Success!",
      description: "Your doubt has been posted successfully.",
    });
  };

  const handleTakeDoubt = (doubtId: string) => {
    setDoubts(
      doubts.map((doubt) =>
        doubt.id === doubtId
          ? {
              ...doubt,
              status: "in_progress" as const,
              tutor_id: user?.id || "current_user",
              tutor_name: user?.user_metadata?.name || "Current User",
            }
          : doubt,
      ),
    );

    toast({
      title: "Success!",
      description: "You've taken this doubt. Start helping the student!",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const startVideoCall = (doubt: any) => {
    const participantName = doubt.tutor_name || doubt.student_name;
    setActiveVideoCall({
      isOpen: true,
      participantName,
      doubtTitle: doubt.title,
    });
    // Open Zego video conference with roomID as doubt id
    setZegoRoomID(doubt.id);
    setZegoVideoOpen(true);
  };

  const startVoiceCall = (doubt: any) => {
    const participantName = doubt.tutor_name || doubt.student_name;
    setActiveVoiceCall({
      isOpen: true,
      participantName,
      doubtTitle: doubt.title,
    });
  };

  const startChat = (doubt: any) => {
    const participantName = doubt.tutor_name || doubt.student_name;
    setActiveChat({
      isOpen: true,
      participantName,
      doubtTitle: doubt.title,
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                Doubts & Questions
              </h1>
              <p className="text-muted-foreground mt-2">
                Help your peers and earn coins by solving their doubts
              </p>
            </div>

            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Doubt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Post a New Doubt</DialogTitle>
                  <DialogDescription>
                    Type your question or use voice input for a more natural
                    experience.
                  </DialogDescription>
                </DialogHeader>

                  <VoiceDoubtPosting
                    onSubmit={async (doubtData) => {
                      // Validate the data first
                      if (
                        !doubtData.title ||
                        !doubtData.description ||
                        !doubtData.subject
                      ) {
                        toast({
                          title: "Error",
                          description: "Please fill in all required fields.",
                          variant: "destructive",
                        });
                        return;
                      }

                      try {
                        const { data, error } = await supabase
                          .from("doubts")
                          .insert([
                            {
                              title: doubtData.title,
                              description: doubtData.description,
                              subject: doubtData.subject,
                              difficulty: doubtData.difficulty,
                              reward: doubtData.reward_coins,
                              status: "open",
                              student_id: user?.id || "anonymous",
                              student_name: user?.user_metadata?.name || "Anonymous",
                              tutor_id: null,
                              tutor_name: null,
                              created_at: new Date().toISOString(),
                              updated_at: new Date().toISOString(),
                            },
                          ]);

                        if (error) throw error;
                        if (!data || data.length === 0) throw new Error("No data returned from insert");

                        // Add the new doubt to local state
                        setDoubts([
                          {
                            id: (data as any)[0].id,
                            ...doubtData,
                            status: "open",
                            student_id: user?.id || "anonymous",
                            student_name: user?.user_metadata?.name || "Anonymous",
                            tutor_id: null,
                            tutor_name: null,
                            created_at: new Date().toISOString(),
                            responses: 0,
                            rating: null,
                          },
                          ...doubts,
                        ]);

                        setIsCreateModalOpen(false);

                        toast({
                          title: "Success!",
                          description: "Your doubt has been posted successfully.",
                        });
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message || "Failed to post doubt.",
                          variant: "destructive",
                        });
                      }
                    }}
                    onCancel={() => setIsCreateModalOpen(false)}
                  />
              </DialogContent>
            </Dialog>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search doubts..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
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

                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {filteredDoubts.map((doubt) => (
              <Card
                key={doubt.id}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {doubt.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {doubt.description}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold text-lg">
                        {doubt.reward_coins}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
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
                    {doubt.rating && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        {doubt.rating}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Posted by {doubt.student_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimeAgo(doubt.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{doubt.responses} responses</span>
                      </div>
                      {doubt.tutor_name && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Tutored by {doubt.tutor_name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {doubt.status === "open" && (
                        <Button
                          size="sm"
                          onClick={() => handleTakeDoubt(doubt.id)}
                        >
                          Take Doubt
                        </Button>
                      )}

                      {doubt.status === "in_progress" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startChat(doubt)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startVoiceCall(doubt)}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startVideoCall(doubt)}
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Video
                          </Button>
                        </div>
                      )}

                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {Array.isArray(filteredDoubts) && filteredDoubts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No doubts found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search filters or post a new doubt.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Communication Components */}
        <VideoCall
          isOpen={activeVideoCall.isOpen}
          onClose={() =>
            setActiveVideoCall({
              isOpen: false,
              participantName: "",
              doubtTitle: "",
            })
          }
          participantName={activeVideoCall.participantName}
          doubtTitle={activeVideoCall.doubtTitle}
        />

        <VoiceCall
          isOpen={activeVoiceCall.isOpen}
          onClose={() =>
            setActiveVoiceCall({
              isOpen: false,
              participantName: "",
              doubtTitle: "",
            })
          }
          participantName={activeVoiceCall.participantName}
          doubtTitle={activeVoiceCall.doubtTitle}
        />

        <Chat
          isOpen={activeChat.isOpen}
          onClose={() =>
            setActiveChat({
              isOpen: false,
              participantName: "",
              doubtTitle: "",
            })
          }
          participantName={activeChat.participantName}
          doubtTitle={activeChat.doubtTitle}
        />
        {zegoVideoOpen && (
          <ZegoVideoConference
            roomID={zegoRoomID || undefined}
            userID={user?.id || undefined}
            userName={user?.user_metadata?.name || undefined}
            key={zegoRoomID || undefined}
          />
        )}
      </div>
    </Layout>
  );
}
