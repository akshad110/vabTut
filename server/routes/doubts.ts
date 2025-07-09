import { RequestHandler } from "express";
import { Doubt, CreateDoubtRequest } from "@shared/api";

// Mock database
let doubts: Doubt[] = [
  {
    id: "1",
    title: "Help with calculus derivatives",
    description:
      "I'm struggling to understand the concept of derivatives in calculus. Specifically, I need help with the chain rule and how to apply it to complex functions.",
    subject: "Mathematics",
    difficulty: "medium",
    status: "open",
    reward_coins: 50,
    student_id: "student1",
    tutor_id: undefined,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Physics momentum conservation",
    description:
      "Can someone explain momentum conservation in collisions? I have a problem where two objects collide and I need to find their final velocities.",
    subject: "Physics",
    difficulty: "hard",
    status: "in_progress",
    reward_coins: 75,
    student_id: "student2",
    tutor_id: "tutor1",
    created_at: "2024-01-15T08:15:00Z",
    updated_at: "2024-01-15T09:20:00Z",
  },
];

export const getDoubts: RequestHandler = (req, res) => {
  const { subject, difficulty, status } = req.query;

  let filteredDoubts = [...doubts];

  if (subject && subject !== "all") {
    filteredDoubts = filteredDoubts.filter(
      (doubt) => doubt.subject === subject,
    );
  }

  if (difficulty && difficulty !== "all") {
    filteredDoubts = filteredDoubts.filter(
      (doubt) => doubt.difficulty === difficulty,
    );
  }

  if (status && status !== "all") {
    filteredDoubts = filteredDoubts.filter((doubt) => doubt.status === status);
  }

  res.json({
    success: true,
    data: filteredDoubts,
    total: filteredDoubts.length,
  });
};

export const createDoubt: RequestHandler = (req, res) => {
  const doubtData: CreateDoubtRequest = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const userId = token?.replace("token_", "") || "anonymous";

  if (!doubtData.title || !doubtData.description || !doubtData.subject) {
    res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
    return;
  }

  const newDoubt: Doubt = {
    id: Date.now().toString(),
    ...doubtData,
    status: "open",
    student_id: userId,
    tutor_id: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  doubts.unshift(newDoubt);

  res.json({
    success: true,
    data: newDoubt,
    message: "Doubt created successfully",
  });
};

export const takeDoubt: RequestHandler = (req, res) => {
  const { doubtId } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const userId = token?.replace("token_", "");

  const doubtIndex = doubts.findIndex((doubt) => doubt.id === doubtId);

  if (doubtIndex === -1) {
    res.status(404).json({
      success: false,
      message: "Doubt not found",
    });
    return;
  }

  if (doubts[doubtIndex].status !== "open") {
    res.status(400).json({
      success: false,
      message: "Doubt is not available",
    });
    return;
  }

  doubts[doubtIndex] = {
    ...doubts[doubtIndex],
    status: "in_progress",
    tutor_id: userId,
    updated_at: new Date().toISOString(),
  };

  res.json({
    success: true,
    data: doubts[doubtIndex],
    message: "Doubt taken successfully",
  });
};

export const resolveDoubt: RequestHandler = (req, res) => {
  const { doubtId } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const userId = token?.replace("token_", "");

  const doubtIndex = doubts.findIndex((doubt) => doubt.id === doubtId);

  if (doubtIndex === -1) {
    res.status(404).json({
      success: false,
      message: "Doubt not found",
    });
    return;
  }

  if (doubts[doubtIndex].tutor_id !== userId) {
    res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  doubts[doubtIndex] = {
    ...doubts[doubtIndex],
    status: "resolved",
    updated_at: new Date().toISOString(),
  };

  res.json({
    success: true,
    data: doubts[doubtIndex],
    message: "Doubt resolved successfully",
  });
};
