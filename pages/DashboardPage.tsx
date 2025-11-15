import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { InventoryItem } from '../types';

// Fix: Changed `JSX.Element` to `React.ReactNode` to resolve missing JSX namespace error.
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
    <div className={`p-4 rounded-full ${color}`}>
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const LowStockItem: React.FC<{ item: InventoryItem }> = ({ item }) => (
  <li className="flex justify-between items-center py-3 border-b last:border-b-0">
    <span className="font-medium text-gray-700">{item.name}</span>
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
        typeof item.quantity === 'number' && item.quantity <= 0 ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
    }`}>
      {item.quantity} left
    </span>
  </li>
);

export default function DashboardPage() {
  const context = useContext(AppContext);
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const dailyInvoices = context?.invoices.filter(inv => inv.date === todayStr) || [];
  const dailySales = dailyInvoices.reduce((sum, inv) => sum + inv.total, 0);
  
  const lowStockItems = context?.inventory.filter(item => 
    typeof item.quantity === 'number' && item.quantity <= item.minStock
  ) || [];

  const handleExport = () => {
    if (!context) return;
    const jsonData = context.exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shreeji-moters-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!context) return;
      const file = event.target.files?.[0];
      if (!file) return;

      if (!window.confirm("Are you sure you want to import data? This will overwrite all existing data.")) {
          event.target.value = ''; // Reset file input
          return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
          const text = e.target?.result;
          if (typeof text === 'string') {
              context.importData(text);
              // Force a reload to ensure all components refresh with new data
              window.location.reload(); 
          }
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset file input
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">{today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Today's Sales" value={`₹${dailySales.toLocaleString('en-IN')}`} icon={<SalesIcon />} color="bg-green-100 text-green-600" />
        <StatCard title="Invoices Today" value={dailyInvoices.length} icon={<InvoiceIcon />} color="bg-blue-100 text-blue-600" />
        <StatCard title="Low Stock Items" value={lowStockItems.length} icon={<WarningIcon />} color="bg-yellow-100 text-yellow-600" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Low Stock Alerts</h2>
        {lowStockItems.length > 0 ? (
          <ul>
            {lowStockItems.map(item => <LowStockItem key={item.id} item={item} />)}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8">All items are well-stocked. Great job!</p>
        )}
      </div>

       {/* New Data Management Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Data Management</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
              <button onClick={handleExport} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors">
                  Export Data (Backup)
              </button>
              <div>
                  <label htmlFor="import-file" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer hover:bg-gray-300 transition-colors">
                      Import Data (Restore)
                  </label>
                  <input id="import-file" type="file" accept=".json" className="hidden" onChange={handleImport} />
              </div>
          </div>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Warning:</strong> Importing data will overwrite all current invoices, inventory, and user accounts. It's recommended to export a backup first.
            </p>
      </div>
    </div>
  );
}

// Icons
const SalesIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
);
const InvoiceIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);
const WarningIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
);
