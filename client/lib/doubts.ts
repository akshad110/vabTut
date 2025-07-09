import { supabase } from "@/lib/supabase"

// Simple UUID v4 generator
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getDoubts() {
  const { data, error } = await supabase
    .from("doubts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createDoubt(
  newDoubt: CreateDoubtData,
  studentId: string,
  studentName: string
) {
  const id = generateUUID();
  const { data, error } = await supabase
    .from("doubts")
    .insert([
      {
        id,
        ...newDoubt,
        student_id: studentId,
        student_name: studentName,
        status: "open",
        responses: 0,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function takeDoubt(
  doubtId: string,
  tutorId: string,
  tutorName: string
) {
  const { error } = await supabase
    .from("doubts")
    .update({
      tutor_id: tutorId,
      tutor_name: tutorName,
      status: "in_progress",
    })
    .eq("id", doubtId);

  return !error;
}

export async function resolveDoubt(doubtId: string, rating: number) {
  const { error } = await supabase
    .from("doubts")
    .update({
      status: "resolved",
      rating,
    })
    .eq("id", doubtId);

  return !error;
}

export function subscribeToDoubts(callback: (data: DoubtRecord[]) => void) {
  const channel = supabase
    .channel("realtime-doubts")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "doubts",
      },
      () => {
        getDoubts().then(callback);
      }
    )
    .subscribe();

  return channel;
}

export function filterDoubts(
  doubts: DoubtRecord[],
  filters: {
    searchTerm: string;
    subject: string;
    difficulty: string;
    status: string;
  }
) {
  return doubts.filter((doubt) => {
    const matchesSearch = doubt.title
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    const matchesSubject =
      filters.subject === "all" || doubt.subject === filters.subject;
    const matchesDifficulty =
      filters.difficulty === "all" || doubt.difficulty === filters.difficulty;
    const matchesStatus =
      filters.status === "all" || doubt.status === filters.status;

    return (
      matchesSearch && matchesSubject && matchesDifficulty && matchesStatus
    );
  });
}

export type DoubtRecord = {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  status: string;
  reward_coins: number;
  student_id: string;
  student_name: string;
  tutor_id?: string;
  tutor_name?: string;
  responses: number;
  rating?: number;
  created_at: string;
  updated_at: string;
};

export type CreateDoubtData = {
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  reward_coins: number;
};

// Demo data insertion function
export async function insertDemoDoubts(studentId: string, studentName: string) {
  const demoDoubts: CreateDoubtData[] = [
    {
      title: "How to solve quadratic equations?",
      description: "I need help understanding how to solve quadratic equations step by step.",
      subject: "Mathematics",
      difficulty: "Medium",
      reward_coins: 50,
    },
    {
      title: "What is photosynthesis?",
      description: "Can someone explain the process of photosynthesis in plants?",
      subject: "Biology",
      difficulty: "Easy",
      reward_coins: 30,
    },
    {
      title: "Explain Newton's second law",
      description: "I want a detailed explanation of Newton's second law of motion.",
      subject: "Physics",
      difficulty: "Medium",
      reward_coins: 40,
    },
    {
      title: "What is the Pythagorean theorem?",
      description: "Looking for a clear explanation and examples of the Pythagorean theorem.",
      subject: "Mathematics",
      difficulty: "Easy",
      reward_coins: 35,
    },
    {
      title: "How does the water cycle work?",
      description: "Need help understanding the stages of the water cycle.",
      subject: "Geography",
      difficulty: "Easy",
      reward_coins: 25,
    },
    {
      title: "Basics of chemical bonding",
      description: "Can someone explain ionic and covalent bonds with examples?",
      subject: "Chemistry",
      difficulty: "Medium",
      reward_coins: 45,
    },
    {
      title: "Introduction to World War II",
      description: "Looking for a summary of the main events and causes of World War II.",
      subject: "History",
      difficulty: "Medium",
      reward_coins: 40,
    },
  ];

  for (const doubt of demoDoubts) {
    try {
      await createDoubt(doubt, studentId, studentName);
    } catch (error) {
      console.error("Error inserting demo doubt:", error);
    }
  }
}


