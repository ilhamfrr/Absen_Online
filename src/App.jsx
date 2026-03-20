import React from 'react';
import AppRouter from './router';
import { AuthProvider } from './services/auth';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
