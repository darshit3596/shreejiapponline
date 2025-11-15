import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import type { InvoiceItem, InventoryItem } from '../types';
import InvoiceTemplate from '../components/InvoiceTemplate';
import type { Page } from '../App';

interface NewInvoicePageProps {
  setCurrentPage: (page: Page) => void;
}

const NewInvoicePage: React.FC<NewInvoicePageProps> = ({ setCurrentPage }) => {
  const context = useContext(AppContext);
  const [customerName, setCustomerName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [km, setKm] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>([{ id: '1', description: '', qty: 1, rate: 0 }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const [generatedInvoiceId, setGeneratedInvoiceId] = useState<string | null>(null);

  const filteredInventory = useMemo(() => {
    if (!searchTerm) return [];
    return context?.inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [searchTerm, context?.inventory]);

  if (!context) return null;
  const { addInvoice, inventory, getNextInvoiceNumber } = context;

  const handleItemChange = <T,>(index: number, field: keyof InvoiceItem, value: T) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };
  
  const handleItemSelect = (item: InventoryItem, index: number) => {
    handleItemChange(index, 'description', item.name);
    handleItemChange(index, 'rate', item.price);
    setSearchTerm('');
    setActiveItemIndex(null);
  };
  
  const addItem = () => {
    setItems([...items, { id: `${items.length + 1}`, description: '', qty: 1, rate: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const total = useMemo(() => items.reduce((sum, item) => sum + item.qty * item.rate, 0), [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalItems = items.filter(item => item.description && item.qty > 0 && item.rate > 0);
    if (finalItems.length === 0) {
        alert("Please add at least one valid item.");
        return;
    }
    const newInvoice = addInvoice({ customerName, vehicle, vehicleNo, mobileNo, km, date, items: finalItems });
    setGeneratedInvoiceId(newInvoice.id);
  };
  
  if (generatedInvoiceId) {
    const invoice = context.getInvoiceById(generatedInvoiceId);
    if (!invoice) return <div>Error: Invoice not found</div>;
    return (
        <div className="print-container">
            <InvoiceTemplate invoice={invoice} />
            <div className="no-print absolute top-4 right-4 flex space-x-2">
                <button onClick={() => window.print()} className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800">Print</button>
                <button onClick={() => setGeneratedInvoiceId(null)} className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700">New Invoice</button>
                <button onClick={() => setCurrentPage('view-invoices')} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">View All</button>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">New Invoice</h1>
      <p className="text-gray-500 mb-6">Invoice No: <span className="font-semibold text-gray-700">{getNextInvoiceNumber()}</span></p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input type="text" placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="p-2 border rounded-md" />
          <input type="text" placeholder="Vehicle" value={vehicle} onChange={e => setVehicle(e.target.value)} className="p-2 border rounded-md" />
          <input type="text" placeholder="Vehicle No" value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} className="p-2 border rounded-md" />
          <input type="text" placeholder="Mobile No" value={mobileNo} onChange={e => setMobileNo(e.target.value)} className="p-2 border rounded-md" />
          <input type="text" placeholder="K.M" value={km} onChange={e => setKm(e.target.value)} className="p-2 border rounded-md" />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="p-2 border rounded-md" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Items</h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6 relative">
                 <input
                    type="text"
                    placeholder="Description of Goods"
                    value={item.description}
                    onChange={e => {
                        handleItemChange(index, 'description', e.target.value);
                        setSearchTerm(e.target.value);
                        setActiveItemIndex(index);
                    }}
                    onFocus={() => {
                        setSearchTerm(item.description);
                        setActiveItemIndex(index);
                    }}
                    className="p-2 border rounded-md w-full"
                />
                {activeItemIndex === index && filteredInventory.length > 0 && (
                     <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                        {filteredInventory.map(invItem => (
                            <li key={invItem.id} onClick={() => handleItemSelect(invItem, index)} className="p-2 hover:bg-gray-100 cursor-pointer">
                                {invItem.name}
                            </li>
                        ))}
                    </ul>
                )}
              </div>
              <input type="number" placeholder="Qty" value={item.qty} min="1" onChange={e => handleItemChange(index, 'qty', parseInt(e.target.value, 10))} className="p-2 border rounded-md col-span-2" />
              <input type="number" placeholder="Rate" value={item.rate} min="0" onChange={e => handleItemChange(index, 'rate', parseFloat(e.target.value))} className="p-2 border rounded-md col-span-2" />
              <div className="col-span-2 flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-full text-right pr-2">{(item.qty * item.rate).toFixed(2)}</span>
                  <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">&times;</button>
              </div>
            </div>
          ))}
        </div>
        
        <button type="button" onClick={addItem} className="mt-4 text-gray-700 hover:text-gray-900 font-semibold">+ Add Item</button>

        <div className="mt-6 border-t pt-4 flex justify-end">
            <div className="text-right">
                <p className="text-gray-500">Total</p>
                <p className="text-3xl font-bold text-gray-800">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
        </div>

        <div className="mt-8 text-right">
          <button type="submit" className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 font-bold text-lg">Generate & Preview Invoice</button>
        </div>
      </form>
    </div>
  );
};

export default NewInvoicePage;
