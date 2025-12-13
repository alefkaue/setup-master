import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppRole, Profile, Project, Item, PartnerConfig } from '@/types';

interface DemoUser {
  id: string;
  email: string;
  displayName: string;
  role: AppRole;
}

// Demo users that will be available when project is exported
export const DEMO_USERS: DemoUser[] = [
  { id: 'demo-admin-001', email: 'admin@demo.com', displayName: 'Admin Demo', role: 'admin' },
  { id: 'demo-partner-001', email: 'parceiro@demo.com', displayName: 'Parceiro Demo', role: 'partner' },
  { id: 'demo-user-001', email: 'usuario@demo.com', displayName: 'Usuário Demo', role: 'user' },
];

// Demo data
export const DEMO_PROFILE: Profile = {
  id: 'demo-user-001',
  display_name: 'Usuário Demo',
  monthly_available_budget: 3000,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-project-001',
    user_id: 'demo-user-001',
    name: 'Setup Gamer Completo',
    description: 'PC gamer + periféricos para streaming',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-project-002',
    user_id: 'demo-user-001',
    name: 'Home Office',
    description: 'Setup para trabalho remoto',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEMO_ITEMS: Item[] = [
  {
    id: 'demo-item-001',
    project_id: 'demo-project-001',
    name: 'RTX 4070 Super',
    category: 'GPU',
    status: 'researching',
    ai_recommendation: 'Excelente custo-benefício para 1440p gaming',
    stores_json: [
      { store_name: 'Kabum', store_slug: 'kabum', price_cash: 3299, price_pix: 3199, affiliate_link: 'https://kabum.com.br' },
      { store_name: 'Terabyte', store_slug: 'terabyte', price_cash: 3399, price_pix: 3249, affiliate_link: 'https://terabyte.com.br' },
      { store_name: 'Amazon', store_slug: 'amazon', price_cash: 3450, affiliate_link: 'https://amazon.com.br' },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-item-002',
    project_id: 'demo-project-001',
    name: 'Monitor LG 27" 144Hz',
    category: 'Monitor',
    status: 'pending',
    ai_recommendation: null,
    stores_json: [
      { store_name: 'Amazon', store_slug: 'amazon', price_cash: 1299, affiliate_link: 'https://amazon.com.br' },
      { store_name: 'Kabum', store_slug: 'kabum', price_cash: 1350, price_pix: 1280, affiliate_link: 'https://kabum.com.br' },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-item-003',
    project_id: 'demo-project-001',
    name: 'Ryzen 7 5800X3D',
    category: 'CPU',
    status: 'approved',
    ai_recommendation: 'Melhor CPU gaming da geração',
    stores_json: [
      { store_name: 'Kabum', store_slug: 'kabum', price_cash: 1899, price_pix: 1799, affiliate_link: 'https://kabum.com.br' },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEMO_PARTNER_CONFIG: PartnerConfig = {
  id: 'demo-partner-config-001',
  user_id: 'demo-partner-001',
  name: 'Tech Reviews BR',
  slug: 'techreviews',
  amazon_tag: 'techrev-20',
  kabum_code: 'TECHREV',
  terabyte_code: 'TRBR',
  aliexpress_code: null,
  mercadolivre_code: null,
  total_clicks: 15420,
  unique_visitors: 8234,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

interface DemoModeContextType {
  isDemoMode: boolean;
  demoUser: DemoUser | null;
  loginAsDemo: (role: AppRole) => void;
  logoutDemo: () => void;
  demoProfile: Profile;
  demoProjects: Project[];
  demoItems: Item[];
  demoPartnerConfig: PartnerConfig;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

const DEMO_STORAGE_KEY = 'upgrade_demo_user';

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    // Check for existing demo session
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    if (stored) {
      try {
        setDemoUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(DEMO_STORAGE_KEY);
      }
    }
  }, []);

  const loginAsDemo = (role: AppRole) => {
    const user = DEMO_USERS.find(u => u.role === role);
    if (user) {
      setDemoUser(user);
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(user));
    }
  };

  const logoutDemo = () => {
    setDemoUser(null);
    localStorage.removeItem(DEMO_STORAGE_KEY);
  };

  const demoProfile: Profile = {
    ...DEMO_PROFILE,
    id: demoUser?.id || DEMO_PROFILE.id,
    display_name: demoUser?.displayName || DEMO_PROFILE.display_name,
  };

  return (
    <DemoModeContext.Provider value={{
      isDemoMode: !!demoUser,
      demoUser,
      loginAsDemo,
      logoutDemo,
      demoProfile,
      demoProjects: DEMO_PROJECTS,
      demoItems: DEMO_ITEMS,
      demoPartnerConfig: DEMO_PARTNER_CONFIG,
    }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}
