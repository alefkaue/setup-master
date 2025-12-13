import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Project, Item, DashboardStats } from '@/types';
import { createSeedUser, createSeedProject, createSeedItems, calculateStats } from '@/data/seedData';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  projects: Project[];
  currentProject: Project | null;
  items: Item[];
  stats: DashboardStats;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  setCurrentProject: (project: Project | null) => void;
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  createProject: (name: string, description?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjectValue: 0,
    monthlyInstallments: 0,
    pixTotal: 0,
    incomeCommitment: 0,
    itemCount: 0,
  });

  // Initialize with seed data
  useEffect(() => {
    const storedUser = localStorage.getItem('seedbuddy_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadUserData(parsedUser.id);
    }
  }, []);

  // Recalculate stats when items change
  useEffect(() => {
    const newStats = calculateStats(items, user?.monthlyIncome);
    setStats(newStats);
  }, [items, user?.monthlyIncome]);

  const loadUserData = (userId: string) => {
    const storedProjects = localStorage.getItem(`seedbuddy_projects_${userId}`);
    const storedItems = localStorage.getItem(`seedbuddy_items_${userId}`);

    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      setProjects(parsedProjects);
      if (parsedProjects.length > 0) {
        setCurrentProject(parsedProjects[0]);
      }
    }

    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  };

  const initializeSeedData = (userId: string) => {
    const seedProject = createSeedProject(userId);
    const seedItems = createSeedItems(seedProject.id);

    setProjects([seedProject]);
    setCurrentProject(seedProject);
    setItems(seedItems);

    localStorage.setItem(`seedbuddy_projects_${userId}`, JSON.stringify([seedProject]));
    localStorage.setItem(`seedbuddy_items_${userId}`, JSON.stringify(seedItems));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const storedUsers = localStorage.getItem('seedbuddy_users');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    const foundUser = users.find(u => u.email === email);
    if (foundUser || email === 'demo@seedbuddy.com') {
      const userToLogin = foundUser || createSeedUser();
      userToLogin.email = email;
      setUser(userToLogin);
      localStorage.setItem('seedbuddy_user', JSON.stringify(userToLogin));
      
      // Check if user has data, if not, initialize with seed data
      const storedProjects = localStorage.getItem(`seedbuddy_projects_${userToLogin.id}`);
      if (!storedProjects) {
        initializeSeedData(userToLogin.id);
      } else {
        loadUserData(userToLogin.id);
      }
      
      return true;
    }
    
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      monthlyIncome: 8000,
      createdAt: new Date(),
    };

    const storedUsers = localStorage.getItem('seedbuddy_users');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    users.push(newUser);
    localStorage.setItem('seedbuddy_users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('seedbuddy_user', JSON.stringify(newUser));
    
    // Initialize with seed data for new users
    initializeSeedData(newUser.id);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setProjects([]);
    setCurrentProject(null);
    setItems([]);
    localStorage.removeItem('seedbuddy_user');
  };

  const addItem = (itemData: Omit<Item, 'id' | 'createdAt'>) => {
    const newItem: Item = {
      ...itemData,
      id: `item-${Date.now()}`,
      createdAt: new Date(),
    };
    
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    
    if (user) {
      localStorage.setItem(`seedbuddy_items_${user.id}`, JSON.stringify(updatedItems));
    }
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    setItems(updatedItems);
    
    if (user) {
      localStorage.setItem(`seedbuddy_items_${user.id}`, JSON.stringify(updatedItems));
    }
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    
    if (user) {
      localStorage.setItem(`seedbuddy_items_${user.id}`, JSON.stringify(updatedItems));
    }
  };

  const createProject = (name: string, description?: string) => {
    if (!user) return;

    const newProject: Project = {
      id: `project-${Date.now()}`,
      userId: user.id,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    setCurrentProject(newProject);
    
    localStorage.setItem(`seedbuddy_projects_${user.id}`, JSON.stringify(updatedProjects));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        projects,
        currentProject,
        items,
        stats,
        login,
        logout,
        register,
        setCurrentProject,
        addItem,
        updateItem,
        deleteItem,
        createProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
