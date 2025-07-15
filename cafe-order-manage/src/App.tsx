import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider } from './cartcontext'; // ★ CartProviderをインポート
import Home from './components/home';
import Login from './login';
import Register from './register';
import './App.css';

const AppContent = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'login' | 'register'>('login');

  if (user) {
    return <Home />;
  }

  return view === 'login' ? (
    <Login onSwitchToRegister={() => setView('register')} />
  ) : (
    <Register onSwitchToLogin={() => setView('login')} />
  );
};

const App = () => {
  return (
    <AuthProvider>
      {/* ★ CartProviderでラップする */}
      <CartProvider>
        <div className="App">
          <AppContent />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
