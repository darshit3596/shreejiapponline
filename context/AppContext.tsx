import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { Invoice, InventoryItem, User } from '../types';

interface AppContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (user: User) => boolean;
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'total'>) => Invoice;
  deleteInvoice: (invoiceId: string) => void;
  getInvoiceById: (invoiceId: string) => Invoice | undefined;
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (itemId: string) => void;
  getNextInvoiceNumber: () => string;
  exportData: () => string;
  importData: (jsonData: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const initialInventory: InventoryItem[] = [
  { id: '1', name: 'Alignment', quantity: 'infinite', price: 250, minStock: 0 },
  { id: '2', name: 'Balancing', quantity: 'infinite', price: 150, minStock: 0 },
  { id: '3', name: 'Weight', quantity: 'infinite', price: 300, minStock: 0 },
  { id: '4', name: 'Tubeless Valve', quantity: 'infinite', price: 50, minStock: 0 },
  { id: '5', name: 'tyer ', quantity: 'infinite', price: 100, minStock: 0 },
];


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : [];
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);
  
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (newUser: User): boolean => {
    if (users.some(u => u.username === newUser.username)) {
        return false; // Username already exists
    }
    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const getNextInvoiceNumber = () => {
    const lastInvoiceNumber = invoices.length > 0 ? invoices.map(i => parseInt(i.invoiceNumber.replace('SJIV', ''), 10)).reduce((a, b) => Math.max(a, b), 0) : 0;
    return `SJIV${(lastInvoiceNumber + 1).toString().padStart(6, '0')}`;
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'total'>): Invoice => {
    const total = invoiceData.items.reduce((acc, item) => acc + item.qty * item.rate, 0);
    const newInvoice: Invoice = {
      ...invoiceData,
      id: new Date().toISOString(),
      invoiceNumber: getNextInvoiceNumber(),
      total,
    };
    setInvoices(prev => [...prev, newInvoice]);

    // Update inventory
    setInventory(prevInventory => {
      const newInventory = [...prevInventory];
      newInvoice.items.forEach(invoiceItem => {
        const stockItem = newInventory.find(stock => stock.name === invoiceItem.description);
        if (stockItem && typeof stockItem.quantity === 'number') {
          stockItem.quantity -= invoiceItem.qty;
        }
      });
      return newInventory;
    });
    return newInvoice;
  };

  const deleteInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
  };

  const getInvoiceById = (invoiceId: string): Invoice | undefined => {
    return invoices.find(invoice => invoice.id === invoiceId);
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...item, id: new Date().toISOString() };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteInventoryItem = (itemId: string) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  };

  const exportData = (): string => {
    const data = {
        users,
        invoices,
        inventory
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData: string) => {
    try {
        const data = JSON.parse(jsonData);
        if (data.users && data.invoices && data.inventory) {
            setUsers(data.users);
            setInvoices(data.invoices);
            setInventory(data.inventory);
            alert('Data imported successfully!');
        } else {
            alert('Invalid data file format.');
        }
    } catch (error) {
        alert('Failed to parse data file.');
        console.error(error);
    }
  };


  return (
    <AppContext.Provider value={{
      currentUser, login, logout, register,
      invoices, addInvoice, deleteInvoice, getInvoiceById, getNextInvoiceNumber,
      inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem,
      exportData, importData
    }}>
      {children}
    </AppContext.Provider>
  );
};
