import { Router, Request, Response } from "express";
import crypto from "crypto";

// ============================================
// Auth Routes - Real Authentication
// ============================================

const router = Router();

// ---------- Types ----------
interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  role: "admin" | "user";
  password: string; // In production, this would be hashed
  createdAt: string;
}

interface Session {
  token: string;
  userId: string;
  expiresAt: Date;
}

// ---------- In-Memory Storage ----------
// In production, use a proper database like PostgreSQL with Prisma
const users: Map<string, User> = new Map();
const sessions: Map<string, Session> = new Map();

// Initialize default accounts
function initializeDefaultUsers() {
  const now = new Date().toISOString();

  // Admin account
  const adminId = "admin-001";
  users.set(adminId, {
    id: adminId,
    email: "admin@harian.dev",
    name: "Administrator",
    nickname: "Admin",
    role: "admin",
    password: "admin123", // In production, hash this!
    createdAt: now,
  });

  // Default user account
  const userId = "user-001";
  users.set(userId, {
    id: userId,
    email: "user@harian.dev",
    name: "Demo User",
    nickname: "DemoUser",
    role: "user",
    password: "user123", // In production, hash this!
    createdAt: now,
  });

  console.log("✓ Default users initialized");
  console.log("  Admin: admin@harian.dev / admin123");
  console.log("  User:  user@harian.dev / user123");
}

// Initialize on module load
initializeDefaultUsers();

// ---------- Helper Functions ----------
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function createSession(userId: string): string {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  sessions.set(token, {
    token,
    userId,
    expiresAt,
  });

  return token;
}

function findUserByEmail(email: string): User | undefined {
  for (const user of users.values()) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return user;
    }
  }
  return undefined;
}

function findUserByNickname(nickname: string): User | undefined {
  for (const user of users.values()) {
    if (user.nickname.toLowerCase() === nickname.toLowerCase()) {
      return user;
    }
  }
  return undefined;
}

function findUserByEmailOrNickname(identifier: string): User | undefined {
  // Try email first
  let user = findUserByEmail(identifier);
  if (user) return user;
  
  // Then try nickname
  user = findUserByNickname(identifier);
  return user;
}

function sanitizeUser(user: User): Omit<User, "password"> {
  const { password, ...safeUser } = user;
  return safeUser;
}

// ---------- Routes ----------

// POST /auth/login
router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // 'email' field can be email or nickname
  const identifier = email;

  // Validate input
  if (!identifier || !password) {
    return res.status(400).json({
      error: "Email/nickname and password are required",
    });
  }

  // Find user by email or nickname
  const user = findUserByEmailOrNickname(identifier);
  if (!user) {
    return res.status(401).json({
      error: "Invalid email/nickname or password",
    });
  }

  // Check password (in production, use bcrypt.compare)
  if (user.password !== password) {
    return res.status(401).json({
      error: "Invalid email/nickname or password",
    });
  }

  // Create session
  const token = createSession(user.id);

  // Return user data and token
  return res.json({
    data: {
      user: sanitizeUser(user),
      token,
    },
  });
});

// POST /auth/register
router.post("/register", (req: Request, res: Response) => {
  const { email, name, nickname, password, confirmPassword } = req.body;

  // Validate input
  if (!email || !name || !nickname || !password) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  if (nickname.length < 3) {
    return res.status(400).json({
      error: "Nickname must be at least 3 characters",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      error: "Passwords do not match",
    });
  }

  // Check if email already exists
  if (findUserByEmail(email)) {
    return res.status(409).json({
      error: "Email already registered",
    });
  }

  // Create new user
  const userId = `user-${crypto.randomUUID()}`;
  const newUser: User = {
    id: userId,
    email: email.toLowerCase(),
    name,
    nickname,
    role: "user", // New registrations are always regular users
    password, // In production, hash this!
    createdAt: new Date().toISOString(),
  };

  users.set(userId, newUser);

  // Create session
  const token = createSession(userId);

  // Return user data and token
  return res.json({
    data: {
      user: sanitizeUser(newUser),
      token,
    },
  });
});

// POST /auth/logout
router.post("/logout", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (token) {
    sessions.delete(token);
  }

  return res.json({ message: "Logged out successfully" });
});

// GET /auth/me - Get current user
router.get("/me", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (new Date() > session.expiresAt) {
    sessions.delete(token);
    return res.status(401).json({ error: "Token expired" });
  }

  const user = users.get(session.userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  return res.json({
    data: {
      user: sanitizeUser(user),
    },
  });
});

// GET /auth/users - Admin only: list all users
router.get("/users", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const currentUser = users.get(session.userId);
  if (!currentUser || currentUser.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  const allUsers = Array.from(users.values()).map(sanitizeUser);
  return res.json({ data: allUsers });
});

export const authRouter = router;
