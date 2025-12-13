import { DollarSign, TrendingUp, Zap, ShieldCheck, Cpu, Search } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Busca Universal',
    description: 'Compare preços em Amazon, Mercado Livre, Kabum, AliExpress, Terabyte e mais em segundos.',
  },
  {
    icon: Zap,
    title: 'Smart Add com IA',
    description: 'Digite o que quer comprar e a IA encontra, corrige e analisa automaticamente.',
  },
  {
    icon: DollarSign,
    title: 'Cash King Mode',
    description: 'Encontra o menor preço absoluto, priorizando Pix e importação.',
  },
  {
    icon: TrendingUp,
    title: 'Cash Flow Mode',
    description: 'Otimiza suas parcelas para não comprometer seu orçamento mensal.',
  },
  {
    icon: Cpu,
    title: 'Modo PC Builder',
    description: 'Evita erros comuns: RAM de notebook, GPUs incompatíveis, fontes subdimensionadas.',
  },
  {
    icon: ShieldCheck,
    title: 'Links de Afiliado',
    description: 'Sistema inteligente que beneficia você e quem te indicou.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            Inteligência Financeira para suas Compras
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada feature foi projetada para economizar seu dinheiro e tempo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 bg-card rounded-lg border hover:border-ai-glow/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-md bg-muted group-hover:bg-ai-glow/10 transition-colors">
                  <feature.icon className="h-6 w-6 group-hover:text-ai-glow transition-colors" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
