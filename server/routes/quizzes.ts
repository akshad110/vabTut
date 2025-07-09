import { RequestHandler } from "express";
import { GenerateQuizRequest, QuizQuestion } from "@shared/api";

// Realistic AI quiz generation with topic-specific questions
const generateAIQuestions = (
  topic: string,
  subject: string,
  difficulty: string,
  count: number,
): QuizQuestion[] => {
  const questionTemplates = getQuestionTemplates(
    topic.toLowerCase(),
    subject,
    difficulty,
  );
  const sampleQuestions: QuizQuestion[] = [];

  // Shuffle templates to get variety
  const shuffledTemplates = [...questionTemplates].sort(
    () => Math.random() - 0.5,
  );

  for (let i = 0; i < Math.min(count, shuffledTemplates.length); i++) {
    const template = shuffledTemplates[i];
    sampleQuestions.push({
      id: `q_${Date.now()}_${i}`,
      ...template,
    });
  }

  // If we need more questions than templates, cycle through them with variations
  while (sampleQuestions.length < count) {
    const template =
      questionTemplates[sampleQuestions.length % questionTemplates.length];
    sampleQuestions.push({
      id: `q_${Date.now()}_${sampleQuestions.length}`,
      ...template,
      question:
        template.question +
        ` (Variation ${Math.floor(sampleQuestions.length / questionTemplates.length) + 1})`,
    });
  }

  return sampleQuestions;
};

const getQuestionTemplates = (
  topic: string,
  subject: string,
  difficulty: string,
) => {
  // Mathematics questions
  if (
    subject === "Mathematics" ||
    topic.includes("math") ||
    topic.includes("calculus") ||
    topic.includes("algebra")
  ) {
    if (topic.includes("calculus") || topic.includes("derivative")) {
      return [
        {
          question: "What is the derivative of x³?",
          options: ["3x²", "x²", "3x", "x³"],
          correct_answer: 0,
          explanation:
            "Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x³) = 3x²",
        },
        {
          question: "What is the derivative of sin(x)?",
          options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
          correct_answer: 0,
          explanation: "The derivative of sin(x) is cos(x)",
        },
        {
          question: "What is the chain rule used for?",
          options: [
            "Composite functions",
            "Product of functions",
            "Sum of functions",
            "Quotient of functions",
          ],
          correct_answer: 0,
          explanation:
            "The chain rule is used to differentiate composite functions: d/dx[f(g(x))] = f'(g(x)) × g'(x)",
        },
      ];
    } else if (topic.includes("algebra")) {
      return [
        {
          question: "Solve for x: 2x + 5 = 13",
          options: ["x = 4", "x = 6", "x = 8", "x = 9"],
          correct_answer: 0,
          explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
        },
        {
          question: "What is the slope of the line y = 3x + 2?",
          options: ["3", "2", "1", "5"],
          correct_answer: 0,
          explanation: "In the form y = mx + b, the slope (m) is 3",
        },
      ];
    }
  }

  // Physics questions
  if (
    subject === "Physics" ||
    topic.includes("physics") ||
    topic.includes("momentum") ||
    topic.includes("force")
  ) {
    if (topic.includes("momentum")) {
      return [
        {
          question: "What is the formula for momentum?",
          options: ["p = mv", "p = ma", "p = F/t", "p = mgh"],
          correct_answer: 0,
          explanation:
            "Momentum (p) equals mass (m) times velocity (v): p = mv",
        },
        {
          question: "In a collision, what is conserved?",
          options: [
            "Total momentum",
            "Individual momentum",
            "Kinetic energy only",
            "Potential energy only",
          ],
          correct_answer: 0,
          explanation:
            "The law of conservation of momentum states that total momentum before collision equals total momentum after collision",
        },
        {
          question:
            "What type of collision conserves both momentum and kinetic energy?",
          options: [
            "Elastic collision",
            "Inelastic collision",
            "Perfectly inelastic collision",
            "Explosive collision",
          ],
          correct_answer: 0,
          explanation:
            "Elastic collisions conserve both momentum and kinetic energy",
        },
      ];
    } else if (topic.includes("force") || topic.includes("newton")) {
      return [
        {
          question: "What is Newton's second law?",
          options: ["F = ma", "F = mv", "F = mg", "F = ma²"],
          correct_answer: 0,
          explanation:
            "Newton's second law states that Force equals mass times acceleration: F = ma",
        },
        {
          question: "What is the unit of force?",
          options: ["Newton (N)", "Joule (J)", "Watt (W)", "Pascal (Pa)"],
          correct_answer: 0,
          explanation:
            "The SI unit of force is the Newton (N), which equals 1 kg⋅m/s²",
        },
      ];
    }
  }

  // Chemistry questions
  if (
    subject === "Chemistry" ||
    topic.includes("chemistry") ||
    topic.includes("bond") ||
    topic.includes("atom")
  ) {
    if (topic.includes("bond")) {
      return [
        {
          question: "What type of bond forms between a metal and non-metal?",
          options: [
            "Ionic bond",
            "Covalent bond",
            "Metallic bond",
            "Hydrogen bond",
          ],
          correct_answer: 0,
          explanation:
            "Ionic bonds form between metals (which lose electrons) and non-metals (which gain electrons)",
        },
        {
          question: "What type of bond involves sharing electrons?",
          options: [
            "Covalent bond",
            "Ionic bond",
            "Metallic bond",
            "Van der Waals forces",
          ],
          correct_answer: 0,
          explanation:
            "Covalent bonds form when atoms share electrons to achieve stability",
        },
        {
          question: "Which has the strongest intermolecular forces?",
          options: [
            "Ionic compounds",
            "Covalent networks",
            "Molecular compounds",
            "Noble gases",
          ],
          correct_answer: 0,
          explanation:
            "Ionic compounds have strong electrostatic attractions between ions",
        },
      ];
    }
  }

  // Computer Science questions
  if (
    subject === "Computer Science" ||
    topic.includes("algorithm") ||
    topic.includes("complexity") ||
    topic.includes("programming")
  ) {
    if (topic.includes("complexity") || topic.includes("big o")) {
      return [
        {
          question: "What is the time complexity of binary search?",
          options: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"],
          correct_answer: 0,
          explanation:
            "Binary search divides the search space in half each time, resulting in O(log n) complexity",
        },
        {
          question: "What is the worst-case time complexity of quicksort?",
          options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
          correct_answer: 0,
          explanation:
            "Quicksort's worst case occurs when the pivot is always the smallest/largest element, leading to O(n²)",
        },
        {
          question:
            "Which sorting algorithm has O(n log n) guaranteed time complexity?",
          options: [
            "Merge sort",
            "Quick sort",
            "Bubble sort",
            "Selection sort",
          ],
          correct_answer: 0,
          explanation:
            "Merge sort always divides the array and merges in O(n log n) time, regardless of input",
        },
      ];
    }
  }

  // Biology questions
  if (
    subject === "Biology" ||
    topic.includes("biology") ||
    topic.includes("cell") ||
    topic.includes("mitosis")
  ) {
    if (
      topic.includes("cell") ||
      topic.includes("mitosis") ||
      topic.includes("meiosis")
    ) {
      return [
        {
          question: "How many daughter cells does mitosis produce?",
          options: ["2", "4", "1", "8"],
          correct_answer: 0,
          explanation:
            "Mitosis produces 2 genetically identical diploid daughter cells",
        },
        {
          question: "How many daughter cells does meiosis produce?",
          options: ["4", "2", "1", "8"],
          correct_answer: 0,
          explanation:
            "Meiosis produces 4 genetically different haploid gametes",
        },
        {
          question: "What is the main purpose of mitosis?",
          options: [
            "Growth and repair",
            "Sexual reproduction",
            "Genetic variation",
            "Energy production",
          ],
          correct_answer: 0,
          explanation:
            "Mitosis is used for growth, repair, and asexual reproduction in organisms",
        },
      ];
    }
  }

  // English questions
  if (
    subject === "English" ||
    topic.includes("literature") ||
    topic.includes("shakespeare") ||
    topic.includes("poetry")
  ) {
    if (topic.includes("shakespeare") || topic.includes("macbeth")) {
      return [
        {
          question:
            "What literary device is 'Life's but a walking shadow' an example of?",
          options: ["Metaphor", "Simile", "Alliteration", "Personification"],
          correct_answer: 0,
          explanation:
            "This compares life to a shadow without using 'like' or 'as', making it a metaphor",
        },
        {
          question: "What is the main theme of Macbeth?",
          options: [
            "Ambition and its consequences",
            "Love and romance",
            "Friendship",
            "Family loyalty",
          ],
          correct_answer: 0,
          explanation:
            "Macbeth explores how unchecked ambition leads to moral corruption and destruction",
        },
      ];
    }
  }

  // Default/Generic questions for any topic
  return [
    {
      question: `What is a fundamental principle in ${topic}?`,
      options: [
        `Basic concept of ${topic}`,
        `Advanced theory in ${topic}`,
        `Practical application`,
        `Historical background`,
      ],
      correct_answer: 0,
      explanation: `This covers the foundational understanding needed for ${topic} in ${subject}.`,
    },
    {
      question: `Which method is commonly used in ${topic}?`,
      options: [
        `Standard approach`,
        `Alternative method`,
        `Experimental technique`,
        `Traditional way`,
      ],
      correct_answer: 0,
      explanation: `The standard approach is most commonly taught and used in ${topic}.`,
    },
  ];
};

export const generateQuiz: RequestHandler = (req, res) => {
  const quizData: GenerateQuizRequest = req.body;

  if (!quizData.topic || !quizData.difficulty) {
    res.status(400).json({
      success: false,
      message: "Topic and difficulty are required",
    });
    return;
  }

  const questions = generateAIQuestions(
    quizData.topic,
    quizData.difficulty === "easy" ? "General" : "Advanced", // More realistic subject handling
    quizData.difficulty,
    quizData.question_count,
  );

  const quiz = {
    id: Date.now().toString(),
    topic: quizData.topic,
    difficulty: quizData.difficulty,
    questions,
    timeLimit:
      quizData.difficulty === "easy"
        ? 240
        : quizData.difficulty === "medium"
          ? 300
          : 420,
    created_at: new Date().toISOString(),
  };

  res.json({
    success: true,
    data: quiz,
    message: "Quiz generated successfully",
  });
};

export const submitQuizAttempt: RequestHandler = (req, res) => {
  const { quizId, answers, timeSpent } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const userId = token?.replace("token_", "") || "anonymous";

  // Mock quiz data validation and scoring
  const correctAnswers = Math.floor(Math.random() * answers.length);
  const score = Math.round((correctAnswers / answers.length) * 100);

  const attempt = {
    id: Date.now().toString(),
    user_id: userId,
    quiz_id: quizId,
    score,
    total_questions: answers.length,
    time_spent: timeSpent,
    completed_at: new Date().toISOString(),
  };

  // Simulate coin reward
  const coinsEarned = score >= 80 ? 50 : score >= 60 ? 30 : 10;

  res.json({
    success: true,
    data: {
      attempt,
      score,
      correctAnswers,
      totalQuestions: answers.length,
      coinsEarned,
    },
    message: `Quiz completed! You scored ${score}% and earned ${coinsEarned} coins.`,
  });
};

export const getQuizLeaderboard: RequestHandler = (req, res) => {
  // Mock leaderboard data
  const leaderboard = [
    {
      user_id: "1",
      name: "Aarav Sharma",
      average_score: 92,
      total_quizzes: 15,
      coins_earned: 750,
    },
    {
      user_id: "2",
      name: "Priya Patel",
      average_score: 89,
      total_quizzes: 12,
      coins_earned: 600,
    },
    {
      user_id: "3",
      name: "Rohit Kumar",
      average_score: 87,
      total_quizzes: 18,
      coins_earned: 720,
    },
  ];

  res.json({
    success: true,
    data: leaderboard,
  });
};
