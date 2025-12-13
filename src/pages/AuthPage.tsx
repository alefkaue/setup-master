import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary/30 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-accent/20 flex items-center justify-center mb-8 animate-pulse-glow">
            <svg
              viewBox="0 0 24 24"
              className="w-12 h-12 text-accent"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Monte seu setup dos sonhos
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8">
            Compare preços em tempo real, planeje parcelamentos e encontre as melhores ofertas para seu PC Gamer.
          </p>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-card border border-border">
              <p className="text-2xl font-bold text-accent">50+</p>
              <p className="text-xs text-muted-foreground">Lojas</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <p className="text-2xl font-bold text-accent">24/7</p>
              <p className="text-xs text-muted-foreground">Atualização</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <p className="text-2xl font-bold text-accent">100%</p>
              <p className="text-xs text-muted-foreground">Gratuito</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
