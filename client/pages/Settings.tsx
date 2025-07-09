import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { toast } from "@/hooks/use-toast";
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Lock,
  Trash2,
  Palette,
  Bell,
  Mic,
  MessageSquare,
  HelpCircle,
  Send,
  ExternalLink,
  Save,
  Sun,
  Moon,
  Monitor,
  Volume2,
  Globe,
} from "lucide-react";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const [accountData, setAccountData] = useState({
    displayName: user?.user_metadata?.name || "",
    email: user?.email || "",
    college: "MIT University",
  });

  const [notifications, setNotifications] = useState({
    emailOnResponse: true,
    emailOnKarma: true,
    weeklyActivity: false,
    browserNotifications: true,
    soundNotifications: true,
  });

  const [voicePreferences, setVoicePreferences] = useState({
    enableVoiceAssistant: true,
    voiceStyle: "calm",
    language: "english",
    autoListen: false,
  });

  const [accentColor, setAccentColor] = useState("purple");
  const [feedback, setFeedback] = useState("");

  const handleSaveAccount = () => {
    toast({
      title: "Account Updated",
      description: "Your account information has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleSaveVoice = () => {
    toast({
      title: "Voice Settings Updated",
      description: "Your voice assistant preferences have been saved.",
    });
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) return;
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! We'll review it soon.",
    });
    setFeedback("");
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion Requested",
      description:
        "Your account deletion request has been submitted. You'll receive an email with next steps.",
      variant: "destructive",
    });
  };

  const accentColors = [
    { name: "Purple", value: "purple", color: "bg-purple-500" },
    { name: "Blue", value: "blue", color: "bg-blue-500" },
    { name: "Green", value: "green", color: "bg-green-500" },
    { name: "Red", value: "red", color: "bg-red-500" },
    { name: "Orange", value: "orange", color: "bg-orange-500" },
    { name: "Pink", value: "pink", color: "bg-pink-500" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account and customize your experience
            </p>
          </div>

          <div className="space-y-8">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={accountData.displayName}
                      onChange={(e) =>
                        setAccountData({
                          ...accountData,
                          displayName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={accountData.email}
                      onChange={(e) =>
                        setAccountData({
                          ...accountData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">College/Institute (Optional)</Label>
                  <Input
                    id="college"
                    value={accountData.college}
                    onChange={(e) =>
                      setAccountData({
                        ...accountData,
                        college: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSaveAccount}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-destructive">
                    Account Actions
                  </h4>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={signOut}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove all your data from
                            our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose your preferred theme
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Accent Color</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Customize your interface color
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {accentColors.map((color) => (
                      <Button
                        key={color.value}
                        variant={
                          accentColor === color.value ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setAccentColor(color.value)}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${color.color}`}
                        />
                        {color.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email on Doubt Response</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone responds to your doubts
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailOnResponse}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emailOnResponse: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Karma Points Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you earn karma points
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailOnKarma}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emailOnKarma: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Activity Summary</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of your activity
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyActivity}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          weeklyActivity: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notifications.browserNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          browserNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.soundNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          soundNotifications: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Voice/AI Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice & AI Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Voice Assistant</Label>
                      <p className="text-sm text-muted-foreground">
                        Use voice commands and responses
                      </p>
                    </div>
                    <Switch
                      checked={voicePreferences.enableVoiceAssistant}
                      onCheckedChange={(checked) =>
                        setVoicePreferences({
                          ...voicePreferences,
                          enableVoiceAssistant: checked,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Voice Style</Label>
                      <Select
                        value={voicePreferences.voiceStyle}
                        onValueChange={(value) =>
                          setVoicePreferences({
                            ...voicePreferences,
                            voiceStyle: value,
                          })
                        }
                        disabled={!voicePreferences.enableVoiceAssistant}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="calm">
                            <div className="flex items-center gap-2">
                              <Volume2 className="h-4 w-4" />
                              Calm & Professional
                            </div>
                          </SelectItem>
                          <SelectItem value="excited">
                            <div className="flex items-center gap-2">
                              <Volume2 className="h-4 w-4" />
                              Excited & Energetic
                            </div>
                          </SelectItem>
                          <SelectItem value="friendly">
                            <div className="flex items-center gap-2">
                              <Volume2 className="h-4 w-4" />
                              Friendly & Casual
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={voicePreferences.language}
                        onValueChange={(value) =>
                          setVoicePreferences({
                            ...voicePreferences,
                            language: value,
                          })
                        }
                        disabled={!voicePreferences.enableVoiceAssistant}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              English
                            </div>
                          </SelectItem>
                          <SelectItem value="spanish">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Spanish
                            </div>
                          </SelectItem>
                          <SelectItem value="french">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              French
                            </div>
                          </SelectItem>
                          <SelectItem value="german">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              German
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Listen Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically start listening after responses
                      </p>
                    </div>
                    <Switch
                      checked={voicePreferences.autoListen}
                      onCheckedChange={(checked) =>
                        setVoicePreferences({
                          ...voicePreferences,
                          autoListen: checked,
                        })
                      }
                      disabled={!voicePreferences.enableVoiceAssistant}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveVoice}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Voice Settings
                </Button>
              </CardContent>
            </Card>

            {/* Feedback & Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Feedback & Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="feedback">Submit Feedback</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Help us improve by sharing your thoughts and suggestions
                    </p>
                    <Textarea
                      id="feedback"
                      placeholder="Tell us what you think..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button
                      onClick={handleSubmitFeedback}
                      className="mt-3"
                      disabled={!feedback.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-medium">Help Center</p>
                          <p className="text-sm text-muted-foreground">
                            Browse FAQ and guides
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </div>
                    </Button>

                    <Button variant="outline" className="h-auto p-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-medium">Contact Support</p>
                          <p className="text-sm text-muted-foreground">
                            Get direct help from our team
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
