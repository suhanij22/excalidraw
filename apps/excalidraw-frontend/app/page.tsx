import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Templates from '@/components/Templates';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Templates />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
