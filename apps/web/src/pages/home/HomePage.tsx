import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useAuth, useLanguage, useTheme } from "../../contexts";
import { useTodos } from "../../hooks";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  FloatingDock,
  CommandPalette,
  TopBar,
  CreatePost,
  PostCard,
} from "../../components";
import type { NavItem } from "../../components/layout/FloatingDock";
import { SettingsModal } from "../../components/common/SettingsModal";
import type { Post } from "../../types";

// ============================================
// Home Page - Modern Dashboard with Floating Dock
// ============================================

const API_BASE = "http://localhost:4000";

export function HomePage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { todos, isLoading: todosLoading, addTodo, toggleTodo, completedCount } = useTodos();

  const [activeNav, setActiveNav] = useState<NavItem>("home");
  const [showSettings, setShowSettings] = useState(false);
  const [todoInput, setTodoInput] = useState("");

  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      const res = await fetch(`${API_BASE}/posts`);
      const json = await res.json();
      if (json.success) {
        setPosts(json.data.posts);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Create post
  const handleCreatePost = async (content: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          authorId: user.id,
          authorName: user.name,
          authorNickname: user.nickname,
          authorRole: user.role,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPosts((prev) => [json.data.post, ...prev]);
      }
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  // Like post
  const handleLike = async (postId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const json = await res.json();
      if (json.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, likes: json.data.liked ? [...p.likes, user.id] : p.likes.filter((id) => id !== user.id) }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  // Bookmark post
  const handleBookmark = async (postId: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const json = await res.json();
      if (json.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, bookmarks: json.data.bookmarked ? [...p.bookmarks, user.id] : p.bookmarks.filter((id) => id !== user.id) }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Failed to bookmark post:", err);
    }
  };

  // Comment on post
  const handleComment = async (postId: string, content: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          authorId: user.id,
          authorName: user.name,
          authorNickname: user.nickname,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, json.data.comment] } : p))
        );
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    if (!confirm("Hapus post ini?")) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: user.id }),
      });
      const json = await res.json();
      if (json.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  // Add todo
  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (!todoInput.trim()) return;
    await addTodo({ title: todoInput.trim() });
    setTodoInput("");
  };

  // Handle navigation
  const handleNavigate = (item: NavItem) => {
    if (item === "settings") {
      setShowSettings(true);
    } else {
      setActiveNav(item);
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat pagi";
    if (hour < 17) return "Selamat siang";
    if (hour < 19) return "Selamat sore";
    return "Selamat malam";
  };

  // Get page title
  const getPageTitle = () => {
    switch (activeNav) {
      case "home": return `${getGreeting()}!`;
      case "explore": return t.nav.explore;
      case "notifications": return t.nav.notifications;
      case "messages": return t.nav.messages;
      case "bookmarks": return t.nav.bookmarks;
      case "todos": return t.nav.todos;
      case "profile": return t.nav.profile;
      default: return "Harian";
    }
  };

  const getPageSubtitle = () => {
    switch (activeNav) {
      case "home": return `Apa kabar, ${user?.nickname || user?.name?.split(" ")[0]}?`;
      case "todos": return `${completedCount}/${todos.length} tugas selesai`;
      case "bookmarks": return `${posts.filter(p => user && p.bookmarks.includes(user.id)).length} tersimpan`;
      default: return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary pb-24">
      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette 
        onNavigate={setActiveNav} 
        onOpenSettings={() => setShowSettings(true)} 
        onLogout={logout}
      />

      {/* Top Bar */}
      <TopBar 
        title={getPageTitle()}
        subtitle={getPageSubtitle()}
        onOpenSettings={() => setShowSettings(true)}
        onLogout={logout}
      />

      {/* Floating Dock */}
      <FloatingDock activeItem={activeNav} onNavigate={handleNavigate} />

      {/* 3-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        
        {/* Left Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-20 space-y-4">
            {/* Quick Stats Card */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5'}`}>
              <h3 className="font-semibold text-text-primary text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Statistik
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm">Tugas Selesai</span>
                  <span className={`font-bold ${isDark ? 'text-mornye' : 'text-mornye-light'}`}>{completedCount}/{todos.length}</span>
                </div>
                <div className={`h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                  <div 
                    className={`h-full rounded-full transition-all ${isDark ? 'bg-mornye' : 'bg-mornye-light'}`}
                    style={{ width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm">Total Post</span>
                  <span className="font-bold text-purple-400">{posts.filter(p => p.authorId === user?.id).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm">Disimpan</span>
                  <span className="font-bold text-amber-400">{posts.filter(p => user && p.bookmarks.includes(user.id)).length}</span>
                </div>
              </div>
            </div>

            {/* Streak Card */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.521 1.321-4.966 3.354-6.834l.146-.137c.796-.752 1.5-1.585 1.5-2.529 0-.544-.295-1.068-.656-1.477l-.035-.04 3.691.943 1.009-1.912C15.01 5.4 16 7.137 16 9c0 1.2-.47 2.336-1.32 3.211l-.158.162c-.476.49-.822 1.073-.822 1.627 0 .442.245.87.655 1.259.41.39.945.741 1.453.741.5 0 .9-.18 1.192-.48V16c0 3.866-3.134 7-7 7z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">7 hari</p>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.521 1.321-4.966 3.354-6.834l.146-.137c.796-.752 1.5-1.585 1.5-2.529 0-.544-.295-1.068-.656-1.477l-.035-.04 3.691.943 1.009-1.912C15.01 5.4 16 7.137 16 9c0 1.2-.47 2.336-1.32 3.211l-.158.162c-.476.49-.822 1.073-.822 1.627 0 .442.245.87.655 1.259.41.39.945.741 1.453.741.5 0 .9-.18 1.192-.48V16c0 3.866-3.134 7-7 7z"/>
                    </svg>
                    Streak aktif!
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Shortcut */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5'}`}>
              <h3 className="font-semibold text-text-primary text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Shortcut
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Command Palette</span>
                  <kbd className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>Ctrl+K</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Beranda</span>
                  <kbd className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>G H</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Tugas</span>
                  <kbd className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>G T</kbd>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 max-w-2xl">

          {/* Home Feed */}
          {activeNav === "home" && (
            <div className="space-y-4">
              {/* Create Post */}
              <CreatePost onPost={handleCreatePost} />

              {/* Posts Feed */}
              {postsLoading ? (
                <div className="text-center py-10">
                  <div className={`animate-spin w-6 h-6 border-2 ${isDark ? 'border-mornye' : 'border-mornye-light'} border-t-transparent rounded-full mx-auto`} />
                  <p className="text-text-muted text-sm mt-3">{t.common.loading}</p>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onBookmark={handleBookmark}
                      onComment={handleComment}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5'}`}>
                  <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${isDark ? 'bg-mornye/10' : 'bg-mornye-light/10'}`}>
                    <svg className={`w-7 h-7 ${isDark ? 'text-mornye' : 'text-mornye-light'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <p className="text-text-primary font-medium">Belum ada postingan</p>
                  <p className="text-sm text-text-muted mt-1">Jadilah yang pertama berbagi!</p>
                </div>
              )}
            </div>
          )}

          {/* Todos Page */}
          {activeNav === "todos" && (
            <div className="space-y-6">
              {/* Add Todo Form */}
              <Card variant="elevated">
                <CardContent className="mt-0 pt-4">
                  <form onSubmit={handleAddTodo} className="flex gap-3">
                    <Input
                      placeholder={t.todos.addPlaceholder}
                      value={todoInput}
                      onChange={(e) => setTodoInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!todoInput.trim()}>
                      {t.common.save}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface border border-border rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-mornye">{todos.length}</p>
                  <p className="text-xs text-text-muted">{t.todos.total || "Total"}</p>
                </div>
                <div className="bg-surface border border-border rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{completedCount}</p>
                  <p className="text-xs text-text-muted">{t.todos.completed || "Selesai"}</p>
                </div>
                <div className="bg-surface border border-border rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-amber-400">{todos.length - completedCount}</p>
                  <p className="text-xs text-text-muted">{t.todos.pending || "Belum"}</p>
                </div>
              </div>

              {/* Todo List */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>{t.todos.title}</CardTitle>
                  <CardDescription>{t.todos.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {todos.map((todo) => (
                      <label
                        key={todo.id}
                        className="group flex items-center gap-3 rounded-lg border border-border bg-surface/50 px-4 py-3 cursor-pointer transition-all hover:bg-surface-hover hover:border-mornye/30"
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="w-5 h-5 rounded-md border-border bg-surface text-mornye focus:ring-mornye/50 focus:ring-offset-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-sm transition-colors ${
                              todo.completed ? "line-through text-text-muted" : "text-text-primary"
                            }`}
                          >
                            {todo.title}
                          </span>
                          {todo.priority && (
                            <span
                              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                todo.priority === "high"
                                  ? "bg-rose-500/20 text-rose-400"
                                  : todo.priority === "medium"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-surface-hover text-text-muted"
                              }`}
                            >
                              {t.todos.priority[todo.priority]}
                            </span>
                          )}
                        </div>
                      </label>
                    ))}

                    {!todos.length && !todosLoading && (
                      <p className="text-sm text-text-muted text-center py-8">{t.todos.noTodos}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bookmarks Page */}
          {activeNav === "bookmarks" && (
            <div className="space-y-4">
              {posts.filter((p) => user && p.bookmarks.includes(user.id)).length > 0 ? (
                posts
                  .filter((p) => user && p.bookmarks.includes(user.id))
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onBookmark={handleBookmark}
                      onComment={handleComment}
                      onDelete={handleDeletePost}
                    />
                  ))
              ) : (
                <div className="text-center py-12 bg-surface border border-border rounded-lg">
                  <svg className="w-12 h-12 mx-auto text-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <p className="text-text-muted">{t.posts?.noBookmarks || "Belum ada bookmark"}</p>
                </div>
              )}
            </div>
          )}

          {/* Profile Page */}
          {activeNav === "profile" && (
            <div className="space-y-6">
              {/* Profile Header */}
              <Card variant="elevated">
                <CardContent className="mt-0 pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold ${isDark ? 'bg-gradient-to-br from-mornye to-accent' : 'bg-gradient-to-br from-mornye-light to-accent'}`}>
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-text-primary">{user?.name}</h2>
                        {user?.role === "admin" && (
                          <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-text-muted">@{user?.nickname?.toLowerCase().replace(/\s+/g, '')}</p>
                      <p className="text-sm text-text-secondary mt-1">{user?.email}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {t.profile?.edit || "Edit Profil"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* User's Posts */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">{t.profile?.myPosts || "Postingan Saya"}</h3>
                <div className="space-y-4">
                  {posts.filter((p) => p.authorId === user?.id).length > 0 ? (
                    posts
                      .filter((p) => p.authorId === user?.id)
                      .map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onLike={handleLike}
                          onBookmark={handleBookmark}
                          onComment={handleComment}
                          onDelete={handleDeletePost}
                        />
                      ))
                  ) : (
                    <div className="text-center py-8 bg-surface border border-border rounded-lg">
                      <p className="text-text-muted">Belum ada postingan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Other Pages - Coming Soon */}
          {(activeNav === "explore" || activeNav === "notifications" || activeNav === "messages") && (
            <div className={`text-center py-16 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5'}`}>
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-mornye/10' : 'bg-mornye-light/10'}`}>
                <svg className={`w-8 h-8 ${isDark ? 'text-mornye' : 'text-mornye-light'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Coming Soon</h3>
              <p className="text-text-muted text-sm">Fitur ini sedang dalam pengembangan</p>
            </div>
          )}
        </main>

        {/* Right Sidebar - Hidden on mobile */}
        <aside className="hidden xl:block w-72 flex-shrink-0">
          <div className="sticky top-20 space-y-4">
            {/* Tips Card */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5'}`}>
              <h3 className="font-semibold text-text-primary text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Tips
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Tekan <kbd className={`px-1.5 py-0.5 mx-0.5 rounded text-xs ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>Ctrl+K</kbd> untuk membuka Command Palette dan navigasi cepat ke mana saja!
              </p>
            </div>

            {/* Trending / What's Happening */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5'}`}>
              <h3 className="font-semibold text-text-primary text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.521 1.321-4.966 3.354-6.834l.146-.137c.796-.752 1.5-1.585 1.5-2.529 0-.544-.295-1.068-.656-1.477l-.035-.04 3.691.943 1.009-1.912C15.01 5.4 16 7.137 16 9c0 1.2-.47 2.336-1.32 3.211l-.158.162c-.476.49-.822 1.073-.822 1.627 0 .442.245.87.655 1.259.41.39.945.741 1.453.741.5 0 .9-.18 1.192-.48V16c0 3.866-3.134 7-7 7z"/>
                </svg>
                Trending
              </h3>
              <div className="space-y-3">
                <div className="group cursor-pointer">
                  <p className="text-xs text-text-muted">Produktivitas</p>
                  <p className="text-sm text-text-primary font-medium group-hover:text-mornye transition-colors">#productivity</p>
                  <p className="text-xs text-text-muted">128 posts</p>
                </div>
                <div className="group cursor-pointer">
                  <p className="text-xs text-text-muted">Developer</p>
                  <p className="text-sm text-text-primary font-medium group-hover:text-mornye transition-colors">#coding</p>
                  <p className="text-xs text-text-muted">96 posts</p>
                </div>
                <div className="group cursor-pointer">
                  <p className="text-xs text-text-muted">Daily Life</p>
                  <p className="text-sm text-text-primary font-medium group-hover:text-mornye transition-colors">#dailyjournal</p>
                  <p className="text-xs text-text-muted">64 posts</p>
                </div>
              </div>
            </div>

            {/* Who to Follow */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5'}`}>
              <h3 className="font-semibold text-text-primary text-sm mb-3">👥 Rekomendasi</h3>
              <div className="space-y-3">
                {[
                  { name: "Sarah Dev", handle: "sarahdev", verified: true },
                  { name: "Budi Code", handle: "budicode", verified: false },
                  { name: "Rina Design", handle: "rinadesign", verified: true },
                ].map((person, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${isDark ? 'bg-mornye/20 text-mornye' : 'bg-mornye-light/20 text-mornye-light'}`}>
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-text-primary truncate">{person.name}</span>
                        {person.verified && (
                          <svg className="w-3.5 h-3.5 text-mornye flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-text-muted">@{person.handle}</span>
                    </div>
                    <button className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-gray-700 hover:bg-black/10'}`}>
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-text-muted space-y-1 px-1">
              <p>© 2026 Harian</p>
              <p>Social & Productivity Platform</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
