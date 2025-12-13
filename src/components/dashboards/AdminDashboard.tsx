import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDemoMode, DEMO_USERS } from '@/hooks/useDemoMode';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, Users, Briefcase, Package, UserPlus, Trash2, 
  Database, Loader2, Shield, Play
} from 'lucide-react';
import { PartnerConfig, Profile } from '@/types';

export default function AdminDashboard() {
  const { signOut, isDemoMode } = useAuth();
  const { demoPartnerConfig, demoProjects, demoItems } = useDemoMode();
  const { toast } = useToast();
  const [partners, setPartners] = useState<PartnerConfig[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // New partner form
  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerSlug, setNewPartnerSlug] = useState('');
  const [isCreatingPartner, setIsCreatingPartner] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      // Use demo data
      setPartners([demoPartnerConfig]);
      setProfiles(DEMO_USERS.map(u => ({
        id: u.id,
        display_name: u.displayName,
        monthly_available_budget: 3000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })));
      setTotalItems(demoItems.length);
      setIsLoading(false);
      return;
    }

    fetchAllData();
  }, [isDemoMode, demoPartnerConfig, demoItems]);

  const fetchAllData = async () => {
    // Fetch partners
    const { data: partnersData } = await supabase
      .from('partners_config')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (partnersData) setPartners(partnersData as PartnerConfig[]);

    // Fetch profiles count
    const { data: profilesData, count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });
    
    if (profilesData) setProfiles(profilesData as Profile[]);

    // Fetch items count
    const { count: itemsCount } = await supabase
      .from('items')
      .select('*', { count: 'exact', head: true });
    
    if (itemsCount !== null) setTotalItems(itemsCount);

    setIsLoading(false);
  };

  const handleCreatePartner = async () => {
    if (isDemoMode) {
      toast({ title: 'Modo Demo', description: 'Alterações não são salvas no modo demo' });
      return;
    }
    
    if (!newPartnerEmail || !newPartnerName || !newPartnerSlug) {
      toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }

    setIsCreatingPartner(true);

    // First, check if user exists by email
    // Note: In a real app, you'd create an invitation system or use Supabase admin API
    // For now, we'll create a placeholder entry that can be claimed

    const { error } = await supabase.from('partners_config').insert({
      user_id: '00000000-0000-0000-0000-000000000000', // Placeholder - would be replaced when user signs up
      name: newPartnerName,
      slug: newPartnerSlug,
    });

    setIsCreatingPartner(false);

    if (error) {
      toast({ 
        title: 'Erro', 
        description: error.message.includes('duplicate') ? 'Slug já existe' : error.message,
        variant: 'destructive' 
      });
    } else {
      toast({ title: 'Sucesso!', description: 'Parceiro criado' });
      setDialogOpen(false);
      setNewPartnerEmail('');
      setNewPartnerName('');
      setNewPartnerSlug('');
      fetchAllData();
    }
  };

  const handleDeletePartner = async (partnerId: string) => {
    if (isDemoMode) {
      toast({ title: 'Modo Demo', description: 'Alterações não são salvas no modo demo' });
      return;
    }
    
    const { error } = await supabase
      .from('partners_config')
      .delete()
      .eq('id', partnerId);

    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível excluir', variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso!', description: 'Parceiro removido' });
      fetchAllData();
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    
    // This would call an edge function in production
    toast({ 
      title: 'Seed Database', 
      description: 'Funcionalidade disponível via Edge Function' 
    });
    
    setIsSeeding(false);
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
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tighter font-display">UPGRADE</Link>
          <div className="flex items-center gap-4">
            {isDemoMode && (
              <Badge variant="outline" className="gap-1 border-primary/50 text-primary">
                <Play className="h-3 w-3" />
                Demo
              </Badge>
            )}
            <span className="text-sm px-2 py-1 bg-destructive/20 text-destructive rounded flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="container max-w-6xl">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground">
              Visão global do sistema e gestão de parceiros
            </p>
          </div>

          {/* God View KPIs */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Total de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{profiles.length}</div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Total de Parceiros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{partners.length}</div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4 text-ai-glow" />
                  Itens Rastreados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ai-glow">{totalItems}</div>
              </CardContent>
            </Card>
          </div>

          {/* Partners Management */}
          <Card className="mb-8 border-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestão de Parceiros</CardTitle>
                <CardDescription>Gerencie os influenciadores do sistema</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Criar Parceiro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Parceiro</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="parceiro@email.com"
                        value={newPartnerEmail}
                        onChange={(e) => setNewPartnerEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        placeholder="Nome do Parceiro"
                        value={newPartnerName}
                        onChange={(e) => setNewPartnerName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input
                        id="slug"
                        placeholder="meu-parceiro"
                        value={newPartnerSlug}
                        onChange={(e) => setNewPartnerSlug(e.target.value.toLowerCase().replace(/\s/g, '-'))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Link: upgrade.app/?p={newPartnerSlug || 'slug'}
                      </p>
                    </div>
                    <Button 
                      onClick={handleCreatePartner} 
                      disabled={isCreatingPartner} 
                      className="w-full"
                    >
                      {isCreatingPartner ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Criando...</>
                      ) : 'Criar Parceiro'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {partners.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum parceiro cadastrado
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Nome</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Slug</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Cliques</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Visitantes</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partners.map((partner) => (
                        <tr key={partner.id} className="border-b hover:bg-muted/30">
                          <td className="py-3 px-2 font-medium">{partner.name}</td>
                          <td className="py-3 px-2 font-mono text-sm text-muted-foreground">
                            ?p={partner.slug}
                          </td>
                          <td className="py-3 px-2 text-right">{partner.total_clicks}</td>
                          <td className="py-3 px-2 text-right">{partner.unique_visitors}</td>
                          <td className="py-3 px-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePartner(partner.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Controls */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Controle do Sistema</CardTitle>
              <CardDescription>Ferramentas administrativas</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSeedDatabase} 
                disabled={isSeeding}
                variant="outline"
                className="gap-2"
              >
                {isSeeding ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Executando...</>
                ) : (
                  <><Database className="h-4 w-4" />Seed Database</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
