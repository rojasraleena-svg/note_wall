import MessageWall from "@/components/MessageWall";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">留言墙</h1>
        <p className="text-gray-500 mt-2">留下你的想法，与大家分享</p>
      </header>
      <MessageWall />
    </main>
  );
}
