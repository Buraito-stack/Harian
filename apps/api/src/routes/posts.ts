
import { Router, Request, Response } from "express";
import crypto from "crypto";

const router = Router();

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorNickname: string;
  authorRole: "admin" | "user";
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  bookmarks: string[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorNickname: string;
  content: string;
  createdAt: string;
}

const posts: Map<string, Post> = new Map();

function initializeSamplePosts() {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const samplePosts: Post[] = [
    {
      id: "post-001",
      authorId: "admin-001",
      authorName: "Administrator",
      authorNickname: "Admin",
      authorRole: "admin",
      content: "Selamat datang di Harian! 🎉 Platform sosial media interaktif dengan fitur todo list terintegrasi. Jangan lupa explore semua fitur yang tersedia!",
      likes: ["user-001"],
      comments: [
        {
          id: "comment-001",
          authorId: "user-001",
          authorName: "Demo User",
          authorNickname: "DemoUser",
          content: "Keren banget! 🔥",
          createdAt: yesterday,
        },
      ],
      bookmarks: [],
      createdAt: twoDaysAgo,
      updatedAt: twoDaysAgo,
    },
    {
      id: "post-002",
      authorId: "user-001",
      authorName: "Demo User",
      authorNickname: "DemoUser",
      authorRole: "user",
      content: "Hari ini produktif banget! Sudah selesaikan 5 task dari todo list. 💪 #productivity #coding",
      likes: ["admin-001"],
      comments: [],
      bookmarks: ["admin-001"],
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      id: "post-003",
      authorId: "admin-001",
      authorName: "Administrator",
      authorNickname: "Admin",
      authorRole: "admin",
      content: "Tips: Gunakan fitur bookmark untuk menyimpan post yang menarik dan todo list untuk tracking progress harian kalian! 📝",
      likes: [],
      comments: [],
      bookmarks: [],
      createdAt: now,
      updatedAt: now,
    },
  ];

  samplePosts.forEach((post) => posts.set(post.id, post));
}

initializeSamplePosts();

function generateId(): string {
  return `post-${crypto.randomBytes(8).toString("hex")}`;
}

interface DecodedUser {
  id: string;
  email: string;
  name: string;
  nickname: string;
  role: "admin" | "user";
}

function getUserFromAuth(authHeader: string | undefined): DecodedUser | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  return null; // Will be handled by middleware
}

router.get("/", (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const userId = req.query.userId as string;

    let allPosts = Array.from(posts.values());

    if (userId) {
      allPosts = allPosts.filter((p) => p.authorId === userId);
    }

    allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const start = (page - 1) * limit;
    const paginatedPosts = allPosts.slice(start, start + limit);

    res.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          page,
          limit,
          total: allPosts.length,
          totalPages: Math.ceil(allPosts.length / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.get("/:id", (req: Request, res: Response) => {
  try {
    const post = posts.get(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ success: true, data: { post } });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.post("/", (req: Request, res: Response) => {
  try {
    const { content, image, authorId, authorName, authorNickname, authorRole } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: "Content too long (max 500 characters)" });
    }

    const now = new Date().toISOString();
    const post: Post = {
      id: generateId(),
      authorId: authorId || "anonymous",
      authorName: authorName || "Anonymous",
      authorNickname: authorNickname || "anon",
      authorRole: authorRole || "user",
      content: content.trim(),
      image,
      likes: [],
      comments: [],
      bookmarks: [],
      createdAt: now,
      updatedAt: now,
    };

    posts.set(post.id, post);

    res.status(201).json({ success: true, data: { post } });
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { authorId } = req.body;
    const post = posts.get(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.authorId !== authorId) {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    posts.delete(req.params.id);
    res.json({ success: true, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

router.post("/:id/like", (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const post = posts.get(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    post.updatedAt = new Date().toISOString();
    posts.set(post.id, post);

    res.json({
      success: true,
      data: {
        liked: likeIndex === -1,
        likesCount: post.likes.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

router.post("/:id/bookmark", (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const post = posts.get(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const bookmarkIndex = post.bookmarks.indexOf(userId);
    if (bookmarkIndex > -1) {
      post.bookmarks.splice(bookmarkIndex, 1);
    } else {
      post.bookmarks.push(userId);
    }

    post.updatedAt = new Date().toISOString();
    posts.set(post.id, post);

    res.json({
      success: true,
      data: {
        bookmarked: bookmarkIndex === -1,
        bookmarksCount: post.bookmarks.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle bookmark" });
  }
});

router.post("/:id/comments", (req: Request, res: Response) => {
  try {
    const { content, authorId, authorName, authorNickname } = req.body;
    const post = posts.get(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!content?.trim()) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const comment: Comment = {
      id: `comment-${crypto.randomBytes(8).toString("hex")}`,
      authorId: authorId || "anonymous",
      authorName: authorName || "Anonymous",
      authorNickname: authorNickname || "anon",
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    post.comments.push(comment);
    post.updatedAt = new Date().toISOString();
    posts.set(post.id, post);

    res.status(201).json({ success: true, data: { comment } });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

router.get("/bookmarked/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookmarkedPosts = Array.from(posts.values())
      .filter((p) => p.bookmarks.includes(userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      data: { posts: bookmarkedPosts },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookmarked posts" });
  }
});

export default router;
