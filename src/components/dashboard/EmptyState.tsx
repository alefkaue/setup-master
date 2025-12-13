import React from 'react';
import { Plus, Sparkles, Package } from 'lucide-react';

interface EmptyStateProps {
  onCreateProject: () => void;
  onAddItem: () => void;
  hasProject: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateProject, onAddItem, hasProject }) => {
  return (
    <div className="empty-state animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
        {hasProject ? (
          <Package className="w-10 h-10 text-muted-foreground" />
        ) : (
          <Sparkles className="w-10 h-10 text-muted-foreground" />
        )}
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        {hasProject ? 'Nenhum item ainda' : 'Nenhum projeto criado'}
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-8">
        {hasProject
          ? 'Comece adicionando itens ao seu projeto. Use nossa busca inteligente para encontrar os melhores preços.'
          : 'Crie seu primeiro projeto para começar a planejar seu setup dos sonhos com preços atualizados.'}
      </p>

      <button
        onClick={hasProject ? onAddItem : onCreateProject}
        className="btn-brutal flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        {hasProject ? 'Adicionar primeiro item' : 'Criar primeiro projeto'}
      </button>
    </div>
  );
};

export default EmptyState;
