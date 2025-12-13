import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, Check, Sparkles, Tag, Store } from 'lucide-react';
import { Item, StoreOffer, ItemCategory } from '@/types';
import { cn } from '@/lib/utils';

interface SmartAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  projectId: string;
}

const categories: ItemCategory[] = [
  'GPU', 'CPU', 'Motherboard', 'RAM', 'Storage', 
  'PSU', 'Case', 'Cooling', 'Monitor', 'Peripheral', 'Other'
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Simulated AI search results
const generateMockOffers = (name: string): StoreOffer[] => {
  const basePrice = 1500 + Math.random() * 3000;
  
  return [
    {
      id: `offer-${Date.now()}-1`,
      store: 'Kabum',
      storeLogo: '🟠',
      productName: `${name} - Modelo Avançado`,
      pixPrice: Math.round(basePrice * 0.95),
      installmentPrice: Math.round(basePrice),
      installments: 12,
      installmentValue: Math.round(basePrice / 12),
      url: '#',
      inStock: true,
    },
    {
      id: `offer-${Date.now()}-2`,
      store: 'Pichau',
      storeLogo: '🔵',
      productName: `${name} - Versão Gaming`,
      pixPrice: Math.round(basePrice * 0.92),
      installmentPrice: Math.round(basePrice * 0.97),
      installments: 10,
      installmentValue: Math.round((basePrice * 0.97) / 10),
      url: '#',
      inStock: true,
    },
    {
      id: `offer-${Date.now()}-3`,
      store: 'Amazon',
      storeLogo: '📦',
      productName: `${name} - Importado`,
      pixPrice: Math.round(basePrice * 0.88),
      installmentPrice: Math.round(basePrice * 0.93),
      installments: 12,
      installmentValue: Math.round((basePrice * 0.93) / 12),
      url: '#',
      inStock: Math.random() > 0.3,
    },
  ];
};

const SmartAddModal: React.FC<SmartAddModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  projectId,
}) => {
  const [name, setName] = useState('');
  const [targetBudget, setTargetBudget] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Other');
  const [isSearching, setIsSearching] = useState(false);
  const [offers, setOffers] = useState<StoreOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<StoreOffer | null>(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (name.length < 3) {
      setOffers([]);
      setSearchTriggered(false);
      return;
    }

    setIsSearching(true);
    setSearchTriggered(true);

    const timer = setTimeout(() => {
      const mockOffers = generateMockOffers(name);
      setOffers(mockOffers);
      setIsSearching(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [name]);

  // Auto-detect category based on name
  useEffect(() => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('rtx') || lowercaseName.includes('gtx') || lowercaseName.includes('radeon')) {
      setCategory('GPU');
    } else if (lowercaseName.includes('ryzen') || lowercaseName.includes('intel') || lowercaseName.includes('i5') || lowercaseName.includes('i7') || lowercaseName.includes('i9')) {
      setCategory('CPU');
    } else if (lowercaseName.includes('monitor') || lowercaseName.includes('alienware')) {
      setCategory('Monitor');
    } else if (lowercaseName.includes('ram') || lowercaseName.includes('memória') || lowercaseName.includes('ddr')) {
      setCategory('RAM');
    } else if (lowercaseName.includes('ssd') || lowercaseName.includes('hd') || lowercaseName.includes('nvme')) {
      setCategory('Storage');
    } else if (lowercaseName.includes('fonte') || lowercaseName.includes('psu')) {
      setCategory('PSU');
    } else if (lowercaseName.includes('gabinete') || lowercaseName.includes('case')) {
      setCategory('Case');
    } else if (lowercaseName.includes('cooler') || lowercaseName.includes('water')) {
      setCategory('Cooling');
    } else if (lowercaseName.includes('placa-mãe') || lowercaseName.includes('motherboard') || lowercaseName.includes('b550') || lowercaseName.includes('x570')) {
      setCategory('Motherboard');
    } else if (lowercaseName.includes('teclado') || lowercaseName.includes('mouse') || lowercaseName.includes('headset')) {
      setCategory('Peripheral');
    }
  }, [name]);

  const handleSubmit = () => {
    if (!name || !selectedOffer) return;

    onAddItem({
      projectId,
      name,
      category,
      targetBudget: targetBudget ? parseFloat(targetBudget) : undefined,
      selectedOffer,
      offers,
    });

    // Reset form
    setName('');
    setTargetBudget('');
    setCategory('Other');
    setOffers([]);
    setSelectedOffer(null);
    setSearchTriggered(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Smart Add</h2>
              <p className="text-sm text-muted-foreground">
                Busca inteligente de preços
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Two Columns */}
        <div className="flex divide-x divide-border">
          {/* Left Column - Form */}
          <div className="w-1/2 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome do Item
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-brutal pl-12"
                  placeholder="Ex: RTX 4070 Ti, Ryzen 7 7800X3D..."
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Digite pelo menos 3 caracteres para buscar
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Orçamento Alvo (opcional)
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(e.target.value)}
                  className="input-brutal pl-12"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Categoria
                <span className="ml-2 text-xs text-accent">(auto-detectada)</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="input-brutal"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!name || !selectedOffer}
              className={cn(
                'btn-brutal w-full flex items-center justify-center gap-2',
                (!name || !selectedOffer) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Check className="w-5 h-5" />
              Adicionar ao Projeto
            </button>
          </div>

          {/* Right Column - AI Preview */}
          <div className="w-1/2 p-6 bg-secondary/30">
            <div className="flex items-center gap-2 mb-6">
              <Store className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">
                Ofertas Encontradas
              </h3>
            </div>

            {!searchTriggered && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  Digite o nome do produto para buscar ofertas
                </p>
              </div>
            )}

            {isSearching && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-accent animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-accent/20 rounded-full" />
                </div>
                <p className="mt-4 text-muted-foreground animate-pulse">
                  Buscando melhores preços...
                </p>
              </div>
            )}

            {!isSearching && offers.length > 0 && (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    onClick={() => setSelectedOffer(offer)}
                    className={cn(
                      'store-card',
                      selectedOffer?.id === offer.id && 'selected'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{offer.storeLogo}</span>
                        <div>
                          <p className="font-medium text-foreground">
                            {offer.store}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {offer.productName}
                          </p>
                        </div>
                      </div>
                      {!offer.inStock && (
                        <span className="badge bg-destructive/20 text-destructive">
                          Sem estoque
                        </span>
                      )}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Preço Pix</p>
                        <p className="text-lg font-bold text-accent font-mono">
                          {formatCurrency(offer.pixPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Parcelado</p>
                        <p className="text-sm text-foreground font-mono">
                          {offer.installments}x {formatCurrency(offer.installmentValue)}
                        </p>
                      </div>
                    </div>

                    {selectedOffer?.id === offer.id && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <Check className="w-4 h-4 text-accent-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAddModal;
