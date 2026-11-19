import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import Footer from "@/components/marketing/Footer";

export const metadata = {
  title: "FileFlux | Encrypted File Vault",
  description:
    "A privacy-first personal file vault. Your files are encrypted in your browser before upload — your keys never leave your device.",
};

const LandingPage = () => {
  return (
    <div className="relative isolate min-h-screen bg-brand-cream text-brand-violet flex flex-col w-full overflow-x-hidden">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-pattern-network opacity-50 pointer-events-none"
      />
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
