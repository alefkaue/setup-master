import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDemoMode } from '@/hooks/useDemoMode';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LogOut, MousePointer, Users, TrendingUp, Link2, Copy, Check, Save, Play } from 'lucide-react';
import { PartnerConfig } from '@/types';

export default function PartnerDashboard() {
  const { user, signOut, isDemoMode } = useAuth();
  const { demoPartnerConfig } = useDemoMode();
  const { toast } = useToast();
  const [partnerConfig, setPartnerConfig] = useState<PartnerConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Form state
  const [amazonTag, setAmazonTag] = useState('');
  const [kabumCode, setKabumCode] = useState('');
  const [terabyteCode, setTerabyteCode] = useState('');
  const [aliexpressCode, setAliexpressCode] = useState('');

  useEffect(() => {
    if (isDemoMode) {
      setPartnerConfig(demoPartnerConfig);
      setAmazonTag(demoPartnerConfig.amazon_tag || '');
      setKabumCode(demoPartnerConfig.kabum_code || '');
      setTerabyteCode(demoPartnerConfig.terabyte_code || '');
      setAliexpressCode(demoPartnerConfig.aliexpress_code || '');
      setIsLoading(false);
      return;
    }

    if (user) {
      fetchPartnerConfig();
    }
  }, [user, isDemoMode, demoPartnerConfig]);

  const fetchPartnerConfig = async () => {
    const { data } = await supabase
      .from('partners_config')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();
    
    if (data) {
      const config = data as PartnerConfig;
      setPartnerConfig(config);
      setAmazonTag(config.amazon_tag || '');
      setKabumCode(config.kabum_code || '');
      setTerabyteCode(config.terabyte_code || '');
      setAliexpressCode(config.aliexpress_code || '');
    }
    setIsLoading(false);
  };

  const handleSaveConfig = async () => {
    if (isDemoMode) {
      toast({ title: 'Modo Demo', description: 'Alterações não são salvas no modo demo' });
      return;
    }
    
    if (!partnerConfig) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('partners_config')
      .update({
        amazon_tag: amazonTag || null,
        kabum_code: kabumCode || null,
        terabyte_code: terabyteCode || null,
        aliexpress_code: aliexpressCode || null,
      })
      .eq('id', partnerConfig.id);

    setIsSaving(false);

    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar', variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso!', description: 'Configurações salvas' });
      fetchPartnerConfig();
    }
  };

  const handleGenerateLink = () => {
    if (!linkInput || !amazonTag) {
      toast({ title: 'Erro', description: 'Cole um link da Amazon e configure sua tag', variant: 'destructive' });
      return;
    }

    try {
      const url = new URL(linkInput);
      url.searchParams.set('tag', amazonTag);
      setGeneratedLink(url.toString());
    } catch {
      toast({ title: 'Erro', description: 'Link inválido', variant: 'destructive' });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copiado!', description: 'Link copiado para a área de transferência' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!partnerConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Você não tem uma conta de parceiro configurada.
            </p>
            <Button asChild>
              <Link to="/">Voltar para Home</Link>
            </Button>
          </CardContent>
        </Card>
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
            <span className="text-sm px-2 py-1 bg-primary/20 text-primary rounded">Parceiro</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="container max-w-4xl">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Painel do Parceiro
            </h1>
            <p className="text-muted-foreground">
              Olá, {partnerConfig.name}! Gerencie seus links e acompanhe suas métricas.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                  Cliques Totais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{partnerConfig.total_clicks}</div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Visitantes Únicos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{partnerConfig.unique_visitors}</div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-ai-glow" />
                  Conversão Estimada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ai-glow">
                  {partnerConfig.total_clicks > 0 
                    ? `${((partnerConfig.unique_visitors / partnerConfig.total_clicks) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Link Generator */}
          <Card className="mb-8 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Gerador de Link Rápido
              </CardTitle>
              <CardDescription>
                Cole um link da Amazon e gere seu link de afiliado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Cole o link da Amazon aqui..."
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                />
                <Button onClick={handleGenerateLink}>Gerar</Button>
              </div>
              
              {generatedLink && (
                <div className="flex gap-2">
                  <Input value={generatedLink} readOnly className="font-mono text-sm" />
                  <Button variant="outline" onClick={handleCopyLink}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuration Form */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Configuração de Códigos</CardTitle>
              <CardDescription>
                Configure seus códigos de afiliado para cada loja
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amazon">Amazon Tag</Label>
                  <Input
                    id="amazon"
                    placeholder="seu-tag-20"
                    value={amazonTag}
                    onChange={(e) => setAmazonTag(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kabum">Kabum ID</Label>
                  <Input
                    id="kabum"
                    placeholder="seu-id-kabum"
                    value={kabumCode}
                    onChange={(e) => setKabumCode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terabyte">Terabyte Code</Label>
                  <Input
                    id="terabyte"
                    placeholder="seu-code-terabyte"
                    value={terabyteCode}
                    onChange={(e) => setTerabyteCode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aliexpress">AliExpress ID</Label>
                  <Input
                    id="aliexpress"
                    placeholder="seu-id-ali"
                    value={aliexpressCode}
                    onChange={(e) => setAliexpressCode(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleSaveConfig} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
