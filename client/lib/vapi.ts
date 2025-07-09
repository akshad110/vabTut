let Vapi: any;
try {
  Vapi = require("@vapi-ai/web").default || require("@vapi-ai/web");
} catch (e) {
  console.warn("Vapi SDK not available:", e);
  Vapi = null;
}

// Configuration for Vapi voice AI
export const VAPI_CONFIG = {
  // TODO: Add your Vapi public key here
  // You can get this from https://dashboard.vapi.ai
  publicKey:
    import.meta.env.VITE_VAPI_PUBLIC_KEY || "your-vapi-public-key-here",

  // Default assistant configuration for different use cases
  assistants: {
    doubtPosting: {
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a voice assistant that helps students post academic doubts. 
            When a student speaks, convert their spoken doubt into a structured format with:
            1. A clear, concise title
            2. A detailed description 
            3. Suggested subject category
            4. Estimated difficulty level
            
            Always ask clarifying questions if the doubt is unclear. Be encouraging and supportive.`,
          },
        ],
        temperature: 0.7,
      },
      voice: {
        provider: "11labs",
        voiceId: "pNInz6obpgDQGcFmaJgB", // Adam voice - friendly male voice
      },
      firstMessage:
        "Hi! I'm here to help you post your academic doubt. Just speak naturally about what you're struggling with, and I'll help format it properly.",
    },

    tutor: {
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI tutor assistant that provides helpful explanations for academic topics.
            You can help with Mathematics, Physics, Chemistry, Biology, Computer Science, and more.
            
            Provide clear, step-by-step explanations. Use examples when helpful.
            If you don't know something, recommend they ask a human tutor.
            Keep responses concise but thorough. Be encouraging and patient.`,
          },
        ],
        temperature: 0.3,
      },
      voice: {
        provider: "11labs",
        voiceId: "EXAVITQu4vr4xnSDxMaL", // Bella voice - professional female
      },
      firstMessage:
        "Hello! I'm your AI tutor assistant. What topic would you like help with today?",
    },

    navigation: {
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a voice navigation assistant for a tutoring platform.
            You can help users navigate the interface using voice commands like:
            - "Show me doubts" or "Go to doubts page"
            - "Switch to dark mode" or "Toggle theme"
            - "Show beginner topics" or "Filter by difficulty"
            - "List doubts I can help with"
            - "Go to dashboard"
            - "Show my profile"
            
            Respond with the action to take and confirm what you're doing.
            If a command is unclear, ask for clarification.`,
          },
        ],
        temperature: 0.2,
      },
      voice: {
        provider: "11labs",
        voiceId: "pNInz6obpgDQGcFmaJgB",
      },
      firstMessage:
        "Voice navigation ready! You can say things like 'show me doubts' or 'switch to dark mode'.",
    },

    skillsMatching: {
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a voice assistant that helps match tutors with students based on skills.
            When someone describes their skills or topics they can help with, 
            extract the key subjects and difficulty levels they mentioned.
            
            Then provide a summary of their skills and suggest relevant doubts they could help with.
            Be encouraging about their abilities to help others.`,
          },
        ],
        temperature: 0.4,
      },
      voice: {
        provider: "11labs",
        voiceId: "EXAVITQu4vr4xnSDxMaL",
      },
      firstMessage:
        "Great! Tell me what subjects or topics you feel confident helping other students with.",
    },

    emotionalSupport: {
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a supportive and empathetic voice assistant that provides motivation and emotional support to students.
            
            Help with:
            - Study motivation and encouragement
            - Dealing with academic stress
            - Building confidence in learning
            - Study tips and strategies
            - Celebrating small victories
            
            Be warm, understanding, and genuinely caring. Keep responses concise but meaningful.
            If someone needs serious mental health support, gently suggest they speak with a counselor.`,
          },
        ],
        temperature: 0.7,
      },
      voice: {
        provider: "11labs",
        voiceId: "EXAVITQu4vr4xnSDxMaL",
      },
      firstMessage:
        "Hi there! I'm here to support you on your learning journey. How are you feeling about your studies today?",
    },

    // Add missing session types
    matching: {
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a voice assistant that helps match tutors with students based on skills.
            When someone describes their skills or topics they can help with,
            extract the key subjects and difficulty levels they mentioned.

            Then provide a summary of their skills and suggest relevant doubts they could help with.
            Be encouraging about their abilities to help others.`,
          },
        ],
        temperature: 0.4,
      },
      voice: {
        provider: "11labs",
        voiceId: "EXAVITQu4vr4xnSDxMaL",
      },
      firstMessage:
        "Great! Tell me what subjects or topics you feel confident helping other students with.",
    },

    support: {
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a supportive and empathetic voice assistant that provides motivation and emotional support to students.

            Help with:
            - Study motivation and encouragement
            - Dealing with academic stress
            - Building confidence in learning
            - Study tips and strategies
            - Celebrating small victories

            Be warm, understanding, and genuinely caring. Keep responses concise but meaningful.
            If someone needs serious mental health support, gently suggest they speak with a counselor.`,
          },
        ],
        temperature: 0.7,
      },
      voice: {
        provider: "11labs",
        voiceId: "EXAVITQu4vr4xnSDxMaL",
      },
      firstMessage:
        "Hi there! I'm here to support you on your learning journey. How are you feeling about your studies today?",
    },
  },
};

// Create and configure Vapi instance
export const createVapiInstance = () => {
  // Always return a demo instance for development
  return createDemoVapiInstance();
};

// Create a demo Vapi instance that simulates voice functionality
export const createDemoVapiInstance = () => {
  const events = new Map();
  let isActive = false;
  let recordingInterval: any = null;

  const mockVapi = {
    isDemo: true,

    start: async (config: any) => {
      console.log("Demo Vapi: Starting session with config:", config);
      isActive = true;

      // Simulate connection process
      setTimeout(() => {
        const callbacks = events.get("call-start") || [];
        callbacks.forEach((cb: Function) => cb());

        // Simulate volume levels during recording
        recordingInterval = setInterval(() => {
          if (isActive) {
            const volumeCallbacks = events.get("volume-level") || [];
            const randomVolume = Math.random() * 0.5 + 0.2; // Random volume between 0.2-0.7
            volumeCallbacks.forEach((cb: Function) => cb(randomVolume));
          }
        }, 100);

        // Show initial message
        setTimeout(() => {
          const messageCallbacks = events.get("message") || [];
          messageCallbacks.forEach((cb: Function) => {
            cb({
              type: "assistant-response",
              text:
                config.firstMessage ||
                "Hello! I'm ready to help you. What would you like to know?",
              timestamp: new Date().toISOString(),
            });
          });
        }, 1000);
      }, 800);

      return Promise.resolve();
    },

    stop: () => {
      console.log("Demo Vapi: Stopping session");
      isActive = false;
      if (recordingInterval) {
        clearInterval(recordingInterval);
        recordingInterval = null;
      }

      setTimeout(() => {
        const callbacks = events.get("call-end") || [];
        callbacks.forEach((cb: Function) => cb());
      }, 200);
    },

    on: (event: string, callback: Function) => {
      if (!events.has(event)) {
        events.set(event, []);
      }
      events.get(event).push(callback);
    },

    off: (event: string, callback: Function) => {
      const callbacks = events.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    },

    simulateUserSpeech: (text: string) => {
      const callbacks = events.get("message") || [];
      callbacks.forEach((cb: Function) => {
        cb({
          type: "transcript",
          text: text,
          timestamp: new Date().toISOString(),
        });
      });
    },

    simulateAssistantResponse: (text: string) => {
      const callbacks = events.get("message") || [];
      callbacks.forEach((cb: Function) => {
        cb({
          type: "assistant-response",
          text: text,
          timestamp: new Date().toISOString(),
        });
      });
    },
  };

  // Enable click-to-speak functionality for demo
  if (typeof window !== "undefined") {
    // Add click event listener to simulate voice input
    const handleDemoClick = (e: MouseEvent) => {
      if (
        isActive &&
        e.target instanceof HTMLElement &&
        e.target.closest("[data-voice-demo]")
      ) {
        e.preventDefault();
        const demoInputs = [
          "Hello, can you help me?",
          "I need assistance with my studies",
          "What can you do for me?",
          "How does this work?",
          "Can you explain calculus to me?",
        ];
        const randomInput =
          demoInputs[Math.floor(Math.random() * demoInputs.length)];
        mockVapi.simulateUserSpeech(randomInput);
      }
    };

    document.addEventListener("click", handleDemoClick);

    // Cleanup function
    mockVapi.cleanup = () => {
      document.removeEventListener("click", handleDemoClick);
    };
  }

  return mockVapi;
};

// Helper function to get assistant config by type
export const getAssistantConfig = (
  type: keyof typeof VAPI_CONFIG.assistants,
) => {
  return VAPI_CONFIG.assistants[type];
};

// Voice session types
export type VoiceSessionType = keyof typeof VAPI_CONFIG.assistants;

// Event types for voice sessions
export interface VoiceSessionEvents {
  "call-start": () => void;
  "call-end": () => void;
  message: (message: any) => void;
  "volume-level": (level: number) => void;
  error: (error: any) => void;
}
