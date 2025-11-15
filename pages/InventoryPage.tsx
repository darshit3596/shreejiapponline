import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { InventoryItem } from '../types';

const InventoryForm: React.FC<{ item?: InventoryItem; onSave: (item: Omit<InventoryItem, 'id'> | InventoryItem) => void; onCancel: () => void }> = ({ item, onSave, onCancel }) => {
  const [name, setName] = useState(item?.name || '');
  const [price, setPrice] = useState(item?.price || 0);
  const [quantity, setQuantity] = useState(item?.quantity === 'infinite' ? '' : item?.quantity || 0);
  const [isInfinite, setIsInfinite] = useState(item?.quantity === 'infinite');
  const [minStock, setMinStock] = useState(item?.minStock || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuantity = isInfinite ? 'infinite' : Number(quantity);
    const savedItem = { name, price: Number(price), quantity: finalQuantity, minStock: Number(minStock) };
    if (item) {
        onSave({ ...savedItem, id: item.id });
    } else {
        onSave(savedItem);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold">{item ? 'Edit Item' : 'Add New Item'}</h2>
        <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded-md" />
        <input type="number" placeholder="Selling Price" value={price} onChange={e => setPrice(parseFloat(e.target.value))} required className="w-full p-2 border rounded-md" />
        <div>
            <div className="flex items-center">
                <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10))} disabled={isInfinite} className="w-full p-2 border rounded-md disabled:bg-gray-100" />
                <label className="ml-4 flex items-center space-x-2">
                    <input type="checkbox" checked={isInfinite} onChange={e => setIsInfinite(e.target.checked)} />
                    <span>Infinite</span>
                </label>
            </div>
        </div>
        <input type="number" placeholder="Min Stock Alert" value={minStock} onChange={e => setMinStock(parseInt(e.target.value, 10))} disabled={isInfinite} className="w-full p-2 border rounded-md disabled:bg-gray-100" />
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800">Save</button>
        </div>
      </form>
    </div>
  );
};

export default function InventoryPage() {
  const context = useContext(AppContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);

  if (!context) return null;
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = context;

  const handleSave = (item: Omit<InventoryItem, 'id'> | InventoryItem) => {
    if ('id' in item) {
        updateInventoryItem(item);
    } else {
        addInventoryItem(item);
    }
    setIsFormOpen(false);
    setEditingItem(undefined);
  };
  
  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
        <button onClick={() => { setEditingItem(undefined); setIsFormOpen(true); }} className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800">Add New Item</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-semibold text-gray-600">Item Name</th>
              <th className="p-3 font-semibold text-gray-600">Quantity</th>
              <th className="p-3 font-semibold text-gray-600">Price</th>
              <th className="p-3 font-semibold text-gray-600">Min Stock</th>
              <th className="p-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{item.name}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">₹{item.price.toLocaleString('en-IN')}</td>
                <td className="p-3">{item.quantity === 'infinite' ? 'N/A' : item.minStock}</td>
                <td className="p-3 flex space-x-4">
                  <button onClick={() => handleEdit(item)} className="text-gray-600 hover:underline">Edit</button>
                  <button onClick={() => deleteInventoryItem(item.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isFormOpen && <InventoryForm item={editingItem} onSave={handleSave} onCancel={() => {setIsFormOpen(false); setEditingItem(undefined);}} />}
    </div>
  );
}
