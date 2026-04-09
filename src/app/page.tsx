import HeroHeader from "@/components/HeroHeader";
import MessageWall from "@/components/MessageWall";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <HeroHeader />
      <div className="animate-fade-in-up-delay-1">
        <MessageWall />
      </div>
      <Footer />
    </main>
  );
}
