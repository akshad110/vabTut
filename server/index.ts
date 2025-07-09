import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSignIn, handleSignUp, handleProfile } from "./routes/auth";
import {
  getDoubts,
  createDoubt,
  takeDoubt,
  resolveDoubt,
} from "./routes/doubts";
import {
  generateQuiz,
  submitQuizAttempt,
  getQuizLeaderboard,
} from "./routes/quizzes";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from vabTut Express server!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/signin", handleSignIn);
  app.post("/api/auth/signup", handleSignUp);
  app.get("/api/auth/profile", handleProfile);

  // Doubts routes
  app.get("/api/doubts", getDoubts);
  app.post("/api/doubts", createDoubt);
  app.post("/api/doubts/:doubtId/take", takeDoubt);
  app.post("/api/doubts/:doubtId/resolve", resolveDoubt);

  // Quiz routes
  app.post("/api/quizzes/generate", generateQuiz);
  app.post("/api/quizzes/submit", submitQuizAttempt);
  app.get("/api/quizzes/leaderboard", getQuizLeaderboard);

  // Admin routes
  app.get("/api/admin/stats", (_req, res) => {
    res.json({
      success: true,
      data: {
        totalUsers: 1247,
        totalDoubts: 3842,
        resolvedDoubts: 3654,
        totalQuizzes: 892,
        activeUsers: 234,
      },
    });
  });

  return app;
}
