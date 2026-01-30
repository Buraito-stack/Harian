import { useState } from "react";
import { useAuth, useLanguage, useTheme } from "../../contexts";
import type { Post } from "../../types";

// ============================================
// Post Card Component - Harian Unique Style
// Clean Card Design with Subtle Interactions
// ============================================

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
  onBookmark: (postId: string) => Promise<void>;
  onComment: (postId: string, content: string) => Promise<void>;
  onDelete?: (postId: string) => Promise<void>;
}

export function PostCard({ post, onLike, onBookmark, onComment, onDelete }: PostCardProps) {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = user ? post.likes.includes(user.id) : false;
  const isBookmarked = user ? post.bookmarks.includes(user.id) : false;
  const isOwner = user?.id === post.authorId;
  const canDelete = isOwner || isAdmin;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || isCommenting) return;
    setIsCommenting(true);
    try {
      await onComment(post.id, commentText.trim());
      setCommentText("");
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <article className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
      isDark 
        ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10' 
        : 'bg-white border-black/5 hover:shadow-black/5'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
            isDark 
              ? 'bg-mornye/20 text-mornye' 
              : 'bg-mornye-light/20 text-mornye-light'
          }`}>
            {post.authorName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          
          {/* Author Info */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-text-primary text-sm">{post.authorNickname || post.authorName}</span>
              {post.authorRole === "admin" && (
                <span className="flex items-center justify-center w-4 h-4 rounded bg-amber-500/20">
                  <svg className="w-2.5 h-2.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </span>
              )}
            </div>
            <span className="text-text-muted text-xs">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Delete Button */}
        {canDelete && (
          <button
            onClick={() => onDelete?.(post.id)}
            className="p-1.5 rounded-md text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mt-3">
        <p className="text-text-primary text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
        
        {post.image && (
          <img
            src={post.image}
            alt=""
            className="mt-3 rounded-lg max-h-80 w-full object-cover"
          />
        )}
      </div>

      {/* Stats Bar */}
      {(post.likes.length > 0 || post.comments.length > 0) && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30 text-xs text-text-muted">
          {post.likes.length > 0 && (
            <span>{post.likes.length} suka</span>
          )}
          {post.comments.length > 0 && (
            <span>{post.comments.length} komentar</span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/30">
        {/* Like */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            isLiked 
              ? 'text-rose-500 bg-rose-500/10' 
              : 'text-text-muted hover:text-rose-500 hover:bg-rose-500/5'
          }`}
        >
          <svg className={`w-4 h-4 transition-transform ${isLiked ? 'scale-110' : ''}`} fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Suka</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            showComments
              ? isDark ? 'text-mornye bg-mornye/10' : 'text-mornye-light bg-mornye-light/10'
              : 'text-text-muted hover:text-mornye hover:bg-mornye/5'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Komentar</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={() => onBookmark(post.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            isBookmarked 
              ? isDark ? 'text-mornye bg-mornye/10' : 'text-mornye-light bg-mornye-light/10'
              : 'text-text-muted hover:text-mornye hover:bg-mornye/5'
          }`}
        >
          <svg className={`w-4 h-4 transition-transform ${isBookmarked ? 'scale-110' : ''}`} fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span>Simpan</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-border/30">
          {/* Comment Input */}
          <div className="flex gap-2">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              isDark ? 'bg-mornye/20 text-mornye' : 'bg-mornye-light/20 text-mornye-light'
            }`}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Tulis komentar..."
                className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all ${
                  isDark 
                    ? 'bg-white/5 border border-white/10 focus:border-mornye/50 text-text-primary placeholder:text-text-muted' 
                    : 'bg-black/5 border border-black/5 focus:border-mornye-light/50 text-text-primary placeholder:text-text-muted'
                }`}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim() || isCommenting}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  commentText.trim()
                    ? isDark
                      ? "bg-mornye text-white hover:bg-mornye/90"
                      : "bg-mornye-light text-white hover:bg-mornye-light/90"
                    : "bg-surface text-text-muted cursor-not-allowed opacity-50"
                }`}
              >
                {isCommenting ? "..." : "Kirim"}
              </button>
            </div>
          </div>

          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div className="mt-4 space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className={`flex gap-2 p-3 rounded-lg ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`}>
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    isDark ? 'bg-mornye/15 text-mornye' : 'bg-mornye-light/15 text-mornye-light'
                  }`}>
                    {comment.authorName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary text-sm">{comment.authorNickname}</span>
                      <span className="text-[11px] text-text-muted">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-text-primary text-sm mt-0.5">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm text-center py-4 mt-3">Belum ada komentar</p>
          )}
        </div>
      )}
    </article>
  );
}
