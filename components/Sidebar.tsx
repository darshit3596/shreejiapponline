import React, { useContext } from 'react';
import type { Page } from '../App';
import { AppContext } from '../context/AppContext';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const context = useContext(AppContext);

  // Fix: Changed `JSX.Element` to `React.ReactNode` to resolve missing JSX namespace error.
  const NavItem: React.FC<{ page: Page; label: string; icon: React.ReactNode }> = ({ page, label, icon }) => (
    <li
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
        currentPage === page ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
      onClick={() => setCurrentPage(page)}
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </li>
  );

  return (
    <aside className="no-print w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        
        <h1 className="text-2xl font-bold text-center">SHREEJI MOTERS</h1>
        <p className="text-sm text-center text-gray-400">Invoice & Inventory</p>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          <NavItem page="dashboard" label="Dashboard" icon={<DashboardIcon />} />
          <NavItem page="new-invoice" label="New Invoice" icon={<InvoiceIcon />} />
          <NavItem page="view-invoices" label="View Invoices" icon={<ListIcon />} />
          <NavItem page="inventory" label="Inventory" icon={<InventoryIcon />} />
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={context?.logout}
          className="w-full flex items-center justify-center p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
        >
          <LogoutIcon />
          <span className="ml-3 font-medium">Logout</span>
        </button>
      </div>
      <div>
      <p className="m-2 text-center text-sm"> © Darshit Sapariya Solutions </p>
            <p className="m-2 text-center text-sm">+91 8347402205 </p>
      </div>
    </aside>
  );
};

// SVG Icons


const DashboardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
  </svg>
);
const InvoiceIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>
);
const ListIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
  </svg>
);
const InventoryIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
  </svg>
);
const LogoutIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
    </svg>
);


export default Sidebar;
