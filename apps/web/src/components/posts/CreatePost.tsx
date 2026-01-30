import { useState, useRef } from "react";
import { useAuth, useLanguage, useTheme } from "../../contexts";

// ============================================
// Create Post Component - Harian Unique Style
// Clean Card Design with Focus States
// ============================================

interface CreatePostProps {
  onPost: (content: string) => Promise<void>;
}

export function CreatePost({ onPost }: CreatePostProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() || isPosting) return;
    
    setIsPosting(true);
    try {
      await onPost(content.trim());
      setContent("");
      setIsFocused(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } finally {
      setIsPosting(false);
    }
  };

  const charCount = content.length;
  const maxChars = 500;
  const isOverLimit = charCount > maxChars;
  const showCounter = charCount > 400;

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 ${
      isDark 
        ? `bg-white/[0.02] ${isFocused ? 'border-mornye/30' : 'border-white/5'}` 
        : `bg-white ${isFocused ? 'border-mornye-light/30 shadow-lg shadow-mornye-light/5' : 'border-black/5'}`
    }`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          isDark 
            ? 'bg-mornye/20 text-mornye' 
            : 'bg-mornye-light/20 text-mornye-light'
        }`}>
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* Input Area */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !content && setIsFocused(false)}
            placeholder={t.posts?.placeholder || "Apa yang ingin kamu bagikan hari ini?"}
            className="w-full bg-transparent border-none outline-none resize-none text-text-primary placeholder:text-text-muted text-[15px] leading-relaxed min-h-[60px]"
            rows={2}
          />

          {/* Actions Row */}
          <div className={`flex items-center justify-between pt-3 mt-2 border-t transition-all duration-200 ${
            isFocused ? 'border-border/50' : 'border-transparent'
          }`}>
            {/* Attachment Buttons */}
            <div className="flex items-center gap-1">
              <button 
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-text-muted hover:text-mornye hover:bg-mornye/10' 
                    : 'text-text-muted hover:text-mornye-light hover:bg-mornye-light/10'
                }`}
                title="Tambah gambar"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button 
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-text-muted hover:text-mornye hover:bg-mornye/10' 
                    : 'text-text-muted hover:text-mornye-light hover:bg-mornye-light/10'
                }`}
                title="Tambah emoji"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button 
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-text-muted hover:text-mornye hover:bg-mornye/10' 
                    : 'text-text-muted hover:text-mornye-light hover:bg-mornye-light/10'
                }`}
                title="Tambah lokasi"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* Right Side: Counter & Submit */}
            <div className="flex items-center gap-3">
              {/* Character Counter */}
              {showCounter && (
                <span className={`text-xs font-medium ${
                  isOverLimit ? 'text-rose-500' : 'text-text-muted'
                }`}>
                  {charCount}/{maxChars}
                </span>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || isOverLimit || isPosting}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  !content.trim() || isOverLimit || isPosting
                    ? 'bg-surface text-text-muted cursor-not-allowed opacity-50'
                    : isDark
                      ? 'bg-mornye text-white hover:bg-mornye/90 shadow-lg shadow-mornye/20'
                      : 'bg-mornye-light text-white hover:bg-mornye-light/90 shadow-lg shadow-mornye-light/20'
                }`}
              >
                {isPosting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>{t.posts?.post || "Posting"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
