import Link from "next/link";
import MessageWall from "@/components/MessageWall";
import Footer from "@/components/Footer";

export default function WallPage() {
  return (
    <main className="page-shell flex min-h-screen flex-col">
      <section className="section-shell flex-1 pt-8 animate-fade-in-up">
        <MessageWall
          headerAction={
            <Link href="/" className="editorial-button rounded-full px-5 py-2 text-sm">
              返回首页
            </Link>
          }
        />
      </section>
      <Footer className="mt-auto" />
    </main>
  );
}
