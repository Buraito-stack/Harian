// ============================================
// HARIAN - Shared Type Definitions
// ============================================

// ---------- User & Auth ----------
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ---------- Todo ----------
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  priority?: Todo["priority"];
  dueDate?: string;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Todo["priority"];
  dueDate?: string;
}

// ---------- Post / Social ----------
export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorNickname: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorNickname: string;
  authorRole: "admin" | "user";
  content: string;
  image?: string;
  likes: string[];
  comments: PostComment[];
  bookmarks: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------- Feed ----------
export interface FeedItem {
  id: string;
  type: "post" | "achievement" | "todo_completed" | "streak";
  actor: Pick<User, "id" | "name" | "avatar">;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ---------- Stats ----------
export interface UserStats {
  todosCompleted: number;
  todosTotal: number;
  postsThisWeek: number;
  activeFriends: number;
  currentStreak: number;
  inbox: number;
}

// ---------- Language ----------
export type Language = "en" | "id";

// ---------- Theme ----------
export type Theme = "dark" | "light";

export interface Translations {
  common: {
    appName: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    submit: string;
    search: string;
    filter: string;
    sortBy: string;
    noData: string;
    seeAll: string;
    logout: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    nickname: string;
    forgotPassword: string;
    rememberMe: string;
    orContinueWith: string;
    noAccount: string;
    haveAccount: string;
    welcomeBack: string;
    createAccount: string;
    loginSubtitle: string;
    registerSubtitle: string;
  };
  nav: {
    home: string;
    feed: string;
    todos: string;
    profile: string;
    settings: string;
    notifications: string;
    explore: string;
    messages: string;
    bookmarks: string;
  };
  home: {
    greeting: string;
    subtitle: string;
    quickPost: string;
    friendFeed: string;
    realtimeReady: string;
    quickStats: string;
    todosCompleted: string;
    postsThisWeek: string;
    activeFriends: string;
    inbox: string;
    currentStreak: string;
  };
  todos: {
    title: string;
    subtitle: string;
    addPlaceholder: string;
    noTodos: string;
    markComplete: string;
    priority: {
      low: string;
      medium: string;
      high: string;
    };
    filters: {
      all: string;
      active: string;
      completed: string;
    };
  };
  feed: {
    title: string;
    whatsOnMind: string;
    postPlaceholder: string;
    hoursAgo: string;
    minutesAgo: string;
    justNow: string;
  };
  errors: {
    invalidEmail: string;
    passwordTooShort: string;
    passwordMismatch: string;
    requiredField: string;
    networkError: string;
    unauthorized: string;
  };
  settings: {
    title: string;
    appearance: string;
    language: string;
    darkMode: string;
    darkModeDesc: string;
    lightMode: string;
    lightModeDesc: string;
    english: string;
    indonesian: string;
  };
  posts?: {
    placeholder: string;
    post: string;
    addComment: string;
    reply: string;
    noComments: string;
    empty: string;
    noBookmarks: string;
  };
  profile?: {
    edit: string;
    myPosts: string;
  };
}

// ---------- API Response ----------
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

// ---------- Component Props ----------
export interface ChildrenProps {
  children: React.ReactNode;
}

export interface ClassNameProps {
  className?: string;
}
