import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Loader2, Mail, Lock, ArrowRight, Zap } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Credenciais inválidas. Use demo@seedbuddy.com para testar.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@seedbuddy.com');
    setPassword('demo123');
    setIsLoading(true);
    await login('demo@seedbuddy.com', 'demo123');
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Zap className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">SeedBuddy</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bem-vindo de volta
        </h1>
        <p className="text-muted-foreground">
          Entre para gerenciar seus projetos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-brutal pl-12"
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-brutal pl-12"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-brutal w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Entrar
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="btn-brutal-outline w-full flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Entrar com conta demo
        </button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-foreground hover:underline font-medium"
          >
            Criar conta
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
