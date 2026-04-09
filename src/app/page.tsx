import MessageWall from "@/components/MessageWall";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="text-center mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-gray-600 mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft"></span>
          在线
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold gradient-text tracking-tight">
          留言墙
        </h1>
        <p className="text-gray-500 mt-3 text-base sm:text-lg">
          留下你的想法，与大家分享 ✨
        </p>
      </header>
      <div className="animate-fade-in-up-delay-1">
        <MessageWall />
      </div>
      <footer className="text-center mt-16 mb-8 text-xs text-gray-400 animate-fade-in-up-delay-2">
        <p>
          Built with Next.js + Supabase ·{" "}
          <a
            href="https://github.com/gqy20/note_wall"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
