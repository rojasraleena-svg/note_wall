import HeroHeader from "@/components/HeroHeader";
import MessageWall from "@/components/MessageWall";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="page-shell">
      <HeroHeader />
      <div className="section-shell animate-fade-in-up-delay-1">
        <MessageWall />
      </div>
      <Footer />
    </main>
  );
}
