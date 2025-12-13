import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDemoMode } from '@/hooks/useDemoMode';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, Wallet, TrendingUp, CreditCard, Plus, Trash2, ExternalLink, 
  Sparkles, Package, Search, Play
} from 'lucide-react';
import { Project, Item, StoreOption } from '@/types';
import { formatCurrency, calculateProjectTotals, getCashKingOption, getCashFlowOption } from '@/lib/financial-intelligence';

export default function UserDashboard() {
  const { user, profile, signOut, isDemoMode } = useAuth();
  const { demoProfile, demoProjects, demoItems } = useDemoMode();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Use demo data when in demo mode
  const currentProfile = isDemoMode ? demoProfile : profile;

  useEffect(() => {
    if (isDemoMode) {
      setProjects(demoProjects);
      setActiveProject(demoProjects[0] || null);
      setItems(demoItems);
      setIsLoading(false);
      return;
    }

    if (user) {
      fetchProjects();
    }
  }, [user, isDemoMode, demoProjects, demoItems]);

  useEffect(() => {
    if (!isDemoMode && activeProject) {
      fetchItems(activeProject.id);
    }
  }, [activeProject, isDemoMode]);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user?.id)
      .order('is_active', { ascending: false });
    
    if (data) {
      setProjects(data as Project[]);
      const active = data.find(p => p.is_active) || data[0];
      if (active) setActiveProject(active as Project);
    }
    setIsLoading(false);
  };

  const fetchItems = async (projectId: string) => {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (data) {
      const items = data.map(item => ({
        ...item,
        stores_json: (item.stores_json as unknown as StoreOption[]) || []
      })) as Item[];
      setItems(items);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !activeProject) return;

    // Simulate AI search result with mock store data
    const mockStores = [
      {
        store_name: 'Kabum',
        store_slug: 'kabum',
        price_cash: Math.round(1500 + Math.random() * 2000),
        price_pix: Math.round(1400 + Math.random() * 1900),
        price_installment: Math.round(1600 + Math.random() * 2100),
        installments: 12,
        affiliate_link: 'https://kabum.com.br/produto/123'
      },
      {
        store_name: 'Amazon',
        store_slug: 'amazon',
        price_cash: Math.round(1500 + Math.random() * 2000),
        price_pix: Math.round(1450 + Math.random() * 1950),
        price_installment: Math.round(1700 + Math.random() * 2200),
        installments: 10,
        affiliate_link: 'https://amazon.com.br/dp/B123'
      }
    ];

    const { error } = await supabase.from('items').insert({
      project_id: activeProject.id,
      name: newItemName,
      category: detectCategory(newItemName),
      stores_json: mockStores,
      status: 'found'
    });

    if (!error) {
      setNewItemName('');
      fetchItems(activeProject.id);
    }
  };

  const detectCategory = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('rtx') || lower.includes('gtx') || lower.includes('radeon')) return 'GPU';
    if (lower.includes('ryzen') || lower.includes('intel') || lower.includes('i5') || lower.includes('i7')) return 'CPU';
    if (lower.includes('monitor')) return 'Monitor';
    if (lower.includes('ram') || lower.includes('memória') || lower.includes('ddr')) return 'RAM';
    if (lower.includes('ssd') || lower.includes('nvme') || lower.includes('hd')) return 'Storage';
    return 'Outro';
  };

  const handleDeleteItem = async (itemId: string) => {
    await supabase.from('items').delete().eq('id', itemId);
    fetchItems(activeProject!.id);
  };

  const { totalProject, monthlyFlow, pixTotal } = calculateProjectTotals(items);
  const monthlyBudget = currentProfile?.monthly_available_budget || 3000;
  const budgetWarning = monthlyFlow > monthlyBudget * 0.3;

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
          <nav className="flex items-center gap-4">
            {isDemoMode && (
              <Badge variant="outline" className="gap-1 border-primary/50 text-primary">
                <Play className="h-3 w-3" />
                Demo
              </Badge>
            )}
            <span className="text-sm text-muted-foreground hidden sm:block">
              {currentProfile?.display_name || user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Olá, {currentProfile?.display_name || 'Usuário'}!
            </h1>
            <p className="text-muted-foreground">
              {activeProject ? `Projeto: ${activeProject.name}` : 'Seu painel financeiro'}
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="border-2 hover:border-foreground/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  Total do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{formatCurrency(totalProject)}</div>
                <p className="text-xs text-muted-foreground">{items.length} itens</p>
              </CardContent>
            </Card>

            <Card className={`border-2 transition-colors ${budgetWarning ? 'border-warning/50 bg-warning/5' : 'hover:border-foreground/50'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Fluxo Mensal (Parcelas)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold font-mono ${budgetWarning ? 'text-warning' : ''}`}>
                  {formatCurrency(monthlyFlow)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {budgetWarning ? '⚠️ Acima de 30% do orçamento' : 'Soma das parcelas'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-ai-glow/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-ai-glow" />
                  Meta Pix (À Vista)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-ai-glow">{formatCurrency(pixTotal)}</div>
                <p className="text-xs text-muted-foreground">
                  Economia de {formatCurrency(totalProject - pixTotal)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Smart Add Bar */}
          <Card className="mb-8 border-2 border-ai-glow/30">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Digite o nome do produto para buscar... (ex: RTX 4070 Ti)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleAddItem} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Smart Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Items List */}
          {items.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">Nenhum item ainda</h3>
                <p className="text-muted-foreground">
                  Use o Smart Add acima para começar a adicionar itens ao seu projeto.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Itens do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Item</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Loja</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Preço Parcelado</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Preço Pix</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => {
                        const bestStore = getCashKingOption(item.stores_json || []);
                        const flowStore = getCashFlowOption(item.stores_json || []);
                        return (
                          <tr key={item.id} className="border-b hover:bg-muted/30">
                            <td className="py-3 px-2">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.category}</p>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              {bestStore ? (
                                <span className="text-sm">{bestStore.store_name}</span>
                              ) : '-'}
                            </td>
                            <td className="py-3 px-2 text-right font-mono">
                              {flowStore ? (
                                <div>
                                  <p>{formatCurrency(flowStore.price_installment || flowStore.price_cash)}</p>
                                  {flowStore.installments && (
                                    <p className="text-xs text-muted-foreground">
                                      {flowStore.installments}x
                                    </p>
                                  )}
                                </div>
                              ) : '-'}
                            </td>
                            <td className="py-3 px-2 text-right font-mono text-ai-glow">
                              {bestStore ? formatCurrency(bestStore.price_pix || bestStore.price_cash) : '-'}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <div className="flex justify-end gap-1">
                                {bestStore?.affiliate_link && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(bestStore.affiliate_link, '_blank')}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
