import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://demo.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "demo_key";

export const supabase =
  supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://demo.supabase.co"
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          coins: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          coins?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          coins?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      doubts: {
        Row: {
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
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          subject: string;
          difficulty: "easy" | "medium" | "hard";
          status?: "open" | "in_progress" | "resolved";
          reward_coins: number;
          student_id: string;
          tutor_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          subject?: string;
          difficulty?: "easy" | "medium" | "hard";
          status?: "open" | "in_progress" | "resolved";
          reward_coins?: number;
          student_id?: string;
          tutor_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          score: number;
          total_questions: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic: string;
          score: number;
          total_questions: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic?: string;
          score?: number;
          total_questions?: number;
          completed_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
