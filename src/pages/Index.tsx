import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tighter font-display">UPGRADE</Link>
          <nav className="flex items-center gap-4">
            <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Como Funciona
            </a>
            <Button asChild variant="outline" size="sm">
              <Link to="/auth"><LogIn className="h-4 w-4 mr-2" />Entrar</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <HeroSection />
        <FeaturesSection />

        <section id="como-funciona" className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-8">Pronto para economizar?</h2>
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/auth">Começar Agora</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 UPGRADE. Inteligência financeira para suas compras.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
