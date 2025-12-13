import React from 'react';
import { useApp } from '@/context/AppContext';
import { LogOut, User, Settings, Zap } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, currentProject } = useApp();

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">SeedBuddy</span>
          </div>
          
          {currentProject && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">
                {currentProject.name}
              </span>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-foreground hidden sm:block">
              {user?.name || user?.email}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
