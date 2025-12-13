import { Project, Item, StoreOffer, User } from '@/types';

export const createSeedUser = (): User => ({
  id: 'seed-user-1',
  email: 'usuario@exemplo.com',
  name: 'Usuário',
  monthlyIncome: 8000,
  createdAt: new Date(),
});

export const createSeedProject = (userId: string): Project => ({
  id: 'seed-project-1',
  userId,
  name: 'Meu Setup dos Sonhos (Exemplo)',
  description: 'Um setup gamer de alta performance para trabalho e jogos',
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const createSeedItems = (projectId: string): Item[] => [
  {
    id: 'item-1',
    projectId,
    name: 'RTX 4070 Ti Super',
    category: 'GPU',
    targetBudget: 5000,
    offers: [
      {
        id: 'offer-1a',
        store: 'Kabum',
        storeLogo: '🟠',
        productName: 'Placa de Vídeo RTX 4070 Ti Super 16GB',
        pixPrice: 4499,
        installmentPrice: 4999,
        installments: 12,
        installmentValue: 416.58,
        url: '#',
        inStock: true,
      },
      {
        id: 'offer-1b',
        store: 'Pichau',
        storeLogo: '🔵',
        productName: 'RTX 4070 Ti Super Gaming OC',
        pixPrice: 4599,
        installmentPrice: 5099,
        installments: 12,
        installmentValue: 424.92,
        url: '#',
        inStock: true,
      },
      {
        id: 'offer-1c',
        store: 'Terabyte',
        storeLogo: '🟢',
        productName: 'RTX 4070 Ti Super 16GB GDDR6X',
        pixPrice: 4650,
        installmentPrice: 5150,
        installments: 10,
        installmentValue: 515,
        url: '#',
        inStock: false,
      },
    ],
    selectedOffer: {
      id: 'offer-1a',
      store: 'Kabum',
      storeLogo: '🟠',
      productName: 'Placa de Vídeo RTX 4070 Ti Super 16GB',
      pixPrice: 4499,
      installmentPrice: 4999,
      installments: 12,
      installmentValue: 416.58,
      url: '#',
      inStock: true,
    },
    createdAt: new Date(),
  },
  {
    id: 'item-2',
    projectId,
    name: 'Monitor Alienware 34"',
    category: 'Monitor',
    targetBudget: 3000,
    offers: [
      {
        id: 'offer-2a',
        store: 'Amazon',
        storeLogo: '📦',
        productName: 'Alienware AW3423DWF 34" QD-OLED',
        pixPrice: 4200,
        installmentPrice: 4600,
        installments: 12,
        installmentValue: 383.33,
        url: '#',
        inStock: true,
      },
      {
        id: 'offer-2b',
        store: 'Kabum',
        storeLogo: '🟠',
        productName: 'Monitor Dell Alienware 34 Curvo',
        pixPrice: 4350,
        installmentPrice: 4800,
        installments: 12,
        installmentValue: 400,
        url: '#',
        inStock: true,
      },
    ],
    selectedOffer: {
      id: 'offer-2a',
      store: 'Amazon',
      storeLogo: '📦',
      productName: 'Alienware AW3423DWF 34" QD-OLED',
      pixPrice: 4200,
      installmentPrice: 4600,
      installments: 12,
      installmentValue: 383.33,
      url: '#',
      inStock: true,
    },
    createdAt: new Date(),
  },
  {
    id: 'item-3',
    projectId,
    name: 'Ryzen 7 7800X3D',
    category: 'CPU',
    targetBudget: 2500,
    offers: [
      {
        id: 'offer-3a',
        store: 'Pichau',
        storeLogo: '🔵',
        productName: 'AMD Ryzen 7 7800X3D 4.2GHz',
        pixPrice: 2199,
        installmentPrice: 2399,
        installments: 12,
        installmentValue: 199.92,
        url: '#',
        inStock: true,
      },
      {
        id: 'offer-3b',
        store: 'Terabyte',
        storeLogo: '🟢',
        productName: 'Processador Ryzen 7 7800X3D AM5',
        pixPrice: 2250,
        installmentPrice: 2450,
        installments: 10,
        installmentValue: 245,
        url: '#',
        inStock: true,
      },
    ],
    selectedOffer: {
      id: 'offer-3a',
      store: 'Pichau',
      storeLogo: '🔵',
      productName: 'AMD Ryzen 7 7800X3D 4.2GHz',
      pixPrice: 2199,
      installmentPrice: 2399,
      installments: 12,
      installmentValue: 199.92,
      url: '#',
      inStock: true,
    },
    createdAt: new Date(),
  },
  {
    id: 'item-4',
    projectId,
    name: 'Memória RAM 32GB DDR5',
    category: 'RAM',
    targetBudget: 800,
    offers: [
      {
        id: 'offer-4a',
        store: 'Kabum',
        storeLogo: '🟠',
        productName: 'Kingston Fury Beast 32GB DDR5 5200MHz',
        pixPrice: 699,
        installmentPrice: 799,
        installments: 6,
        installmentValue: 133.17,
        url: '#',
        inStock: true,
      },
    ],
    selectedOffer: {
      id: 'offer-4a',
      store: 'Kabum',
      storeLogo: '🟠',
      productName: 'Kingston Fury Beast 32GB DDR5 5200MHz',
      pixPrice: 699,
      installmentPrice: 799,
      installments: 6,
      installmentValue: 133.17,
      url: '#',
      inStock: true,
    },
    createdAt: new Date(),
  },
  {
    id: 'item-5',
    projectId,
    name: 'SSD NVMe 2TB',
    category: 'Storage',
    targetBudget: 600,
    offers: [
      {
        id: 'offer-5a',
        store: 'Amazon',
        storeLogo: '📦',
        productName: 'Samsung 980 Pro 2TB NVMe',
        pixPrice: 899,
        installmentPrice: 999,
        installments: 10,
        installmentValue: 99.9,
        url: '#',
        inStock: true,
      },
    ],
    selectedOffer: {
      id: 'offer-5a',
      store: 'Amazon',
      storeLogo: '📦',
      productName: 'Samsung 980 Pro 2TB NVMe',
      pixPrice: 899,
      installmentPrice: 999,
      installments: 10,
      installmentValue: 99.9,
      url: '#',
      inStock: true,
    },
    createdAt: new Date(),
  },
];

export const calculateStats = (items: Item[], monthlyIncome: number = 8000) => {
  const selectedItems = items.filter(item => item.selectedOffer);
  
  const totalProjectValue = selectedItems.reduce(
    (sum, item) => sum + (item.selectedOffer?.installmentPrice || 0),
    0
  );
  
  const monthlyInstallments = selectedItems.reduce(
    (sum, item) => sum + (item.selectedOffer?.installmentValue || 0),
    0
  );
  
  const pixTotal = selectedItems.reduce(
    (sum, item) => sum + (item.selectedOffer?.pixPrice || 0),
    0
  );
  
  const incomeCommitment = monthlyIncome > 0 ? (monthlyInstallments / monthlyIncome) * 100 : 0;
  
  return {
    totalProjectValue,
    monthlyInstallments,
    pixTotal,
    incomeCommitment,
    itemCount: items.length,
  };
};
