import { Item, StoreOption } from '@/types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function calculateTotalMonthlyCost(items: Item[]): number {
  return items.reduce((total, item) => {
    const stores = item.stores_json || [];
    if (stores.length === 0) return total;

    const bestStore = getCashFlowOption(stores);
    if (!bestStore) return total;

    if (bestStore.installments && bestStore.installments > 1) {
      return total + (bestStore.price_installment || bestStore.price_cash) / bestStore.installments;
    }
    return total + (bestStore.price_pix || bestStore.price_cash);
  }, 0);
}

export function getBudgetPercentage(monthlyCommitment: number, budget: number): number {
  if (budget <= 0) return 0;
  return (monthlyCommitment / budget) * 100;
}

export function getCashKingOption(stores: StoreOption[]): StoreOption | null {
  if (stores.length === 0) return null;

  return stores.reduce((best, current) => {
    const bestPrice = best.price_pix || best.price_cash;
    const currentPrice = current.price_pix || current.price_cash;
    return currentPrice < bestPrice ? current : best;
  }, stores[0]);
}

export function getCashFlowOption(stores: StoreOption[]): StoreOption | null {
  if (stores.length === 0) return null;

  const withInstallments = stores.filter(s => s.installments && s.installments > 1);
  if (withInstallments.length === 0) return getCashKingOption(stores);

  return withInstallments.reduce((best, current) => {
    const bestMonthly = (best.price_installment || best.price_cash) / (best.installments || 1);
    const currentMonthly = (current.price_installment || current.price_cash) / (current.installments || 1);
    return currentMonthly < bestMonthly ? current : best;
  }, withInstallments[0]);
}

export function formatInstallments(store: StoreOption): string {
  if (!store.installments || store.installments <= 1) {
    return formatCurrency(store.price_pix || store.price_cash);
  }

  const monthlyValue = (store.price_installment || store.price_cash) / store.installments;
  return `${store.installments}x ${formatCurrency(monthlyValue)}`;
}

export function calculateProjectTotals(items: Item[]) {
  let totalProject = 0;
  let monthlyFlow = 0;
  let pixTotal = 0;

  items.forEach(item => {
    const stores = item.stores_json || [];
    if (stores.length === 0) return;

    const bestCash = getCashKingOption(stores);
    const bestFlow = getCashFlowOption(stores);

    if (bestCash) {
      pixTotal += bestCash.price_pix || bestCash.price_cash;
    }

    if (bestFlow) {
      totalProject += bestFlow.price_installment || bestFlow.price_cash;
      if (bestFlow.installments && bestFlow.installments > 1) {
        monthlyFlow += (bestFlow.price_installment || bestFlow.price_cash) / bestFlow.installments;
      }
    }
  });

  return { totalProject, monthlyFlow, pixTotal };
}
