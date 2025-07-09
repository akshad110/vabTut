import { RequestHandler } from "express";

export const handleSignIn: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  // Special admin login
  if (email === "vibhu123@gmail.com" && password === "vibhu@123") {
    res.json({
      success: true,
      user: {
        id: "admin",
        email: "vibhu123@gmail.com",
        name: "Admin",
        role: "admin",
      },
      token: "admin_token_123",
    });
    return;
  }

  // Simulate user authentication
  const users = [
    {
      id: "1",
      email: "student@example.com",
      password: "password123",
      name: "John Student",
      role: "student",
    },
    {
      id: "2",
      email: "mentor@example.com",
      password: "password123",
      name: "Sarah Mentor",
      role: "mentor",
    },
  ];

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token: `token_${user.id}`,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
};

export const handleSignUp: RequestHandler = (req, res) => {
  const { email, password, name } = req.body;

  // Simulate user creation
  if (!email || !password || !name) {
    res.status(400).json({
      success: false,
      message: "All fields are required",
    });
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    name,
    role: "student",
    coins: 100, // Starting coins
  };

  res.json({
    success: true,
    user: newUser,
    token: `token_${newUser.id}`,
    message: "Account created successfully",
  });
};

export const handleProfile: RequestHandler = (req, res) => {
  // Simulate getting user profile
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token === "admin_token_123") {
    res.json({
      id: "admin",
      email: "vibhu123@gmail.com",
      name: "Admin",
      role: "admin",
      coins: 99999,
    });
    return;
  }

  // Simulate other users
  const userId = token?.replace("token_", "");
  res.json({
    id: userId,
    email: "user@example.com",
    name: "User",
    role: "student",
    coins: 1250,
  });
};
