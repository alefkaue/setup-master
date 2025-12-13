import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Cpu, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ai-glow/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-success/5 rounded-full blur-2xl" />
      </div>

      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card animate-fade-in ai-border">
            <Sparkles className="h-4 w-4 text-ai-glow" />
            <span className="text-sm font-medium">Powered by AI • Sniper Financeiro</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter animate-slide-up">
            Pare de pagar
            <span className="block text-muted-foreground">mais do que deveria</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            O <span className="text-foreground font-semibold">UPGRADE</span> usa IA para comparar preços em tempo real,
            analisar condições de pagamento e recomendar a melhor estratégia para seu bolso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button asChild size="lg" className="text-lg px-8 animate-glow">
              <Link to="/auth">
                Começar Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <a href="#como-funciona">Como Funciona</a>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col items-center gap-2 p-4">
              <Cpu className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground text-center">7+ Lojas Comparadas</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4">
              <Sparkles className="h-8 w-8 text-ai-glow" />
              <span className="text-sm text-muted-foreground text-center">IA Financeira</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4">
              <Shield className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground text-center">Links Verificados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
