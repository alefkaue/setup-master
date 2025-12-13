import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useDemoMode, DEMO_USERS } from '@/hooks/useDemoMode';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogIn, UserPlus, Loader2, Play, Shield, Users, User } from 'lucide-react';
import { AppRole } from '@/types';

export default function Auth() {
  const { user, isLoading, signIn, signUp } = useAuth();
  const { loginAsDemo } = useDemoMode();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      toast({ title: 'Erro ao entrar', description: error.message, variant: 'destructive' });
    } else {
      navigate('/dashboard');
    }
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
    const { error } = await signUp(email, password, displayName);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast({ title: 'Erro', description: 'Este email já está cadastrado', variant: 'destructive' });
      } else {
        toast({ title: 'Erro ao criar conta', description: error.message, variant: 'destructive' });
      }
    } else {
      toast({ title: 'Conta criada!', description: 'Você já pode usar o UPGRADE' });
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = (role: AppRole) => {
    loginAsDemo(role);
    toast({ 
      title: 'Modo Demo', 
      description: `Entrando como ${role === 'admin' ? 'Administrador' : role === 'partner' ? 'Parceiro' : 'Usuário'}` 
    });
    
    // Navigate based on role
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'partner') {
      navigate('/partner');
    } else {
      navigate('/dashboard');
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'partner': return <Users className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'partner': return 'Parceiro';
      default: return 'Usuário';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

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
        <div className="w-full max-w-md space-y-6">
          {/* Demo Mode Card */}
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Modo Demo
              </CardTitle>
              <CardDescription>
                Teste os dashboards sem criar conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {DEMO_USERS.map((demoUser) => (
                  <Button
                    key={demoUser.role}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(demoUser.role)}
                    className="flex-1 min-w-[100px]"
                  >
                    {getRoleIcon(demoUser.role)}
                    <span className="ml-2">{getRoleLabel(demoUser.role)}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regular Auth Card */}
          <Card className="border-2">
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
