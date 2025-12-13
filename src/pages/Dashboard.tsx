import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Header from '@/components/layout/Header';
import KPICard from '@/components/dashboard/KPICard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import ItemsTable from '@/components/dashboard/ItemsTable';
import EmptyState from '@/components/dashboard/EmptyState';
import SmartAddModal from '@/components/modals/SmartAddModal';
import { 
  DollarSign, 
  CreditCard, 
  Wallet, 
  Plus,
  TrendingUp,
  Package
} from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const Dashboard: React.FC = () => {
  const { 
    user, 
    currentProject, 
    items, 
    stats, 
    deleteItem, 
    addItem,
    createProject 
  } = useApp();
  const [isSmartAddOpen, setIsSmartAddOpen] = useState(false);

  const projectItems = currentProject 
    ? items.filter(item => item.projectId === currentProject.id)
    : items;

  const handleCreateProject = () => {
    createProject('Novo Projeto', 'Meu novo setup');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Olá, {user?.name || 'Usuário'}! 👋
            </h1>
            <p className="text-muted-foreground">
              {currentProject 
                ? `Gerenciando: ${currentProject.name}`
                : 'Seu centro de comando financeiro'}
            </p>
          </div>

          <button
            onClick={() => setIsSmartAddOpen(true)}
            className="btn-brutal flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Smart Add</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Total do Projeto"
            value={formatCurrency(stats.totalProjectValue)}
            subtitle={`${stats.itemCount} itens selecionados`}
            icon={DollarSign}
            variant="default"
          />
          <KPICard
            title="Fluxo Mensal (Parcelas)"
            value={formatCurrency(stats.monthlyInstallments)}
            subtitle="Soma das parcelas mensais"
            icon={CreditCard}
            variant={stats.incomeCommitment > 50 ? 'warning' : 'default'}
          />
          <KPICard
            title="Meta Pix (À Vista)"
            value={formatCurrency(stats.pixTotal)}
            subtitle={`Economia de ${formatCurrency(stats.totalProjectValue - stats.pixTotal)}`}
            icon={Wallet}
            variant="accent"
          />
        </div>

        {/* Income Commitment Bar */}
        {user?.monthlyIncome && stats.monthlyInstallments > 0 && (
          <div className="kpi-card mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Comprometimento de Renda
                </h3>
                <p className="text-sm text-muted-foreground">
                  Baseado em renda de {formatCurrency(user.monthlyIncome)}/mês
                </p>
              </div>
            </div>
            <ProgressBar
              value={stats.incomeCommitment}
              label="Parcelas sobre a renda mensal"
            />
            {stats.incomeCommitment > 30 && (
              <p className="mt-3 text-sm text-warning">
                ⚠️ Atenção: Recomendamos não comprometer mais de 30% da renda com parcelas.
              </p>
            )}
          </div>
        )}

        {/* Items Section */}
        {projectItems.length > 0 ? (
          <ItemsTable
            items={projectItems}
            onDeleteItem={deleteItem}
            onSelectItem={(item) => console.log('Selected:', item)}
          />
        ) : (
          <EmptyState
            hasProject={!!currentProject}
            onCreateProject={handleCreateProject}
            onAddItem={() => setIsSmartAddOpen(true)}
          />
        )}
      </main>

      {/* Smart Add Modal */}
      <SmartAddModal
        isOpen={isSmartAddOpen}
        onClose={() => setIsSmartAddOpen(false)}
        onAddItem={addItem}
        projectId={currentProject?.id || 'default'}
      />
    </div>
  );
};

export default Dashboard;
