import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogIn, UserPlus, Loader2 } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    // Simulate login - replace with actual Supabase auth when connected
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    
    toast({ title: 'Sucesso!', description: 'Login realizado com sucesso' });
    navigate('/dashboard');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }

    if (password.length < 6) {
      toast({ title: 'Erro', description: 'Senha deve ter no mínimo 6 caracteres', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    toast({ title: 'Conta criada!', description: 'Você já pode usar o UPGRADE' });
    navigate('/dashboard');
  };

  const quickLogin = async (type: 'admin' | 'partner' | 'user') => {
    const creds = {
      admin: { email: 'admin@upgrade.com', password: 'admin123' },
      partner: { email: 'parceiro@faguas.com', password: 'parceiro123' },
      user: { email: 'user@teste.com', password: 'user123' },
    };
    
    setEmail(creds[type].email);
    setPassword(creds[type].password);
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tighter">UPGRADE</CardTitle>
            <CardDescription>Inteligência financeira para suas compras</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Entrando...</>
                    ) : (
                      <><LogIn className="h-4 w-4 mr-2" />Entrar</>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nome</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Seu nome"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Senha</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Criando...</>
                    ) : (
                      <><UserPlus className="h-4 w-4 mr-2" />Criar Conta</>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center mb-4">Login rápido (desenvolvimento)</p>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={() => quickLogin('admin')}>Admin</Button>
                <Button variant="outline" size="sm" onClick={() => quickLogin('partner')}>Parceiro</Button>
                <Button variant="outline" size="sm" onClick={() => quickLogin('user')}>Usuário</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
