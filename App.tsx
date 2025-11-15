import React, { useState, useContext } from 'react';
import { AppContext } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import NewInvoicePage from './pages/NewInvoicePage';
import ViewInvoicesPage from './pages/ViewInvoicesPage';
import InventoryPage from './pages/InventoryPage';
import Sidebar from './components/Sidebar';

export type Page = 'dashboard' | 'new-invoice' | 'view-invoices' | 'inventory';

export default function App() {
  const context = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');

  if (!context) {
    return <div>Loading...</div>;
  }
  
  const { currentUser } = context;

  if (!currentUser) {
    if (authPage === 'login') {
        return <LoginPage setAuthPage={setAuthPage} />;
    } else {
        return <RegistrationPage setAuthPage={setAuthPage} />;
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'new-invoice':
        return <NewInvoicePage setCurrentPage={setCurrentPage} />;
      case 'view-invoices':
        return <ViewInvoicesPage />;
      case 'inventory':
        return <InventoryPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
