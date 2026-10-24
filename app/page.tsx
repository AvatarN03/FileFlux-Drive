import Navbar from "./_components/marketing/Navbar";
import Hero from "./_components/marketing/Hero";
import Features from "./_components/marketing/Features";
import Footer from "./_components/marketing/Footer";

export const metadata = {
  title: "FileFlux | Intelligent File & Folder Management Platform",
  description:
    "A fast, secure, and modern file management platform featuring encrypted personal vaults, granular file sharing, and real-time usage metrics.",
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-violet selection:bg-brand-peach selection:text-brand-violet flex flex-col w-full overflow-x-hidden">
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
