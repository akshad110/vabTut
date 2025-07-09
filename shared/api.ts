/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  coins: number;
  created_at: string;
  updated_at: string;
}

export interface Doubt {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  status: "open" | "in_progress" | "resolved";
  reward_coins: number;
  student_id: string;
  tutor_id?: string;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  topic: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface CreateDoubtRequest {
  title: string;
  description: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  reward_coins: number;
}

export interface GenerateQuizRequest {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  question_count: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college?: string;
  subjects: string[];
  skill_level: "beginner" | "intermediate" | "advanced";
  total_karma: number;
  avatar_url?: string;
  join_date: string;
}

export interface UserActivity {
  doubts_posted: number;
  doubts_resolved: number;
  total_help_time: string;
  helpful_answers: number;
  average_response_time: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earned_date?: string;
}

export interface UserSettings {
  notifications: {
    email_on_response: boolean;
    email_on_karma: boolean;
    weekly_activity: boolean;
    browser_notifications: boolean;
    sound_notifications: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "system";
    accent_color: string;
  };
  voice: {
    enable_voice_assistant: boolean;
    voice_style: "calm" | "excited" | "friendly";
    language: string;
    auto_listen: boolean;
  };
}
