import React from 'react';
import { Item } from '@/types';
import { Trash2, ExternalLink, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ItemsTableProps {
  items: Item[];
  onDeleteItem: (id: string) => void;
  onSelectItem: (item: Item) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    GPU: 'bg-purple-500/20 text-purple-400',
    CPU: 'bg-blue-500/20 text-blue-400',
    Monitor: 'bg-cyan-500/20 text-cyan-400',
    RAM: 'bg-green-500/20 text-green-400',
    Storage: 'bg-orange-500/20 text-orange-400',
    Motherboard: 'bg-red-500/20 text-red-400',
    PSU: 'bg-yellow-500/20 text-yellow-400',
    Case: 'bg-pink-500/20 text-pink-400',
    Cooling: 'bg-indigo-500/20 text-indigo-400',
    Peripheral: 'bg-teal-500/20 text-teal-400',
    Other: 'bg-gray-500/20 text-gray-400',
  };
  return colors[category] || colors.Other;
};

const ItemsTable: React.FC<ItemsTableProps> = ({ items, onDeleteItem, onSelectItem }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="kpi-card overflow-hidden p-0">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Package className="w-5 h-5" />
          Itens do Projeto
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-secondary rounded-full">
            {items.length}
          </span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="table-brutal">
          <thead>
            <tr>
              <th>Item</th>
              <th>Loja</th>
              <th>Preço Pix</th>
              <th>Preço Parcelado</th>
              <th>Parcela</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                className="cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onSelectItem(item)}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <span className={cn('badge', getCategoryColor(item.category))}>
                      {item.category}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      {item.selectedOffer && (
                        <p className="text-xs text-muted-foreground">
                          {item.selectedOffer.productName}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  {item.selectedOffer ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.selectedOffer.storeLogo}</span>
                      <span className="text-foreground">{item.selectedOffer.store}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td>
                  <span className="font-mono text-accent font-medium">
                    {item.selectedOffer
                      ? formatCurrency(item.selectedOffer.pixPrice)
                      : '-'}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-foreground">
                    {item.selectedOffer
                      ? formatCurrency(item.selectedOffer.installmentPrice)
                      : '-'}
                  </span>
                </td>
                <td>
                  {item.selectedOffer && (
                    <span className="font-mono text-muted-foreground text-sm">
                      {item.selectedOffer.installments}x de{' '}
                      {formatCurrency(item.selectedOffer.installmentValue)}
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {item.selectedOffer?.url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(item.selectedOffer?.url, '_blank');
                        }}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemsTable;
