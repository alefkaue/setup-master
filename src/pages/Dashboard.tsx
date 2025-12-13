import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Wallet, Package, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const monthlyBudget = 3000;

  const handleSignOut = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b-2 border-foreground/10 bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tighter">UPGRADE</Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Olá, Usuário!
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo ao seu painel de inteligência financeira.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="border-2 hover:border-foreground/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  Orçamento Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(monthlyBudget)}</div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Projetos Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-ai-glow" />
                  IA Ativa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-ai-glow">Online</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-dashed">
            <CardContent className="py-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Dashboard Completo</h3>
              <p className="text-muted-foreground mb-4">
                O sistema está configurado e pronto para uso.
              </p>
              <p className="text-sm text-muted-foreground">
                Conecte o Supabase para habilitar todos os recursos.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
