import React from 'react';
import { useApp } from '@/context/AppContext';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';

const Index: React.FC = () => {
  const { isAuthenticated } = useApp();

  return isAuthenticated ? <Dashboard /> : <AuthPage />;
};

export default Index;
