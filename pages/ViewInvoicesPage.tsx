
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import InvoiceTemplate from '../components/InvoiceTemplate';
import type { Invoice } from '../types';

export default function ViewInvoicesPage() {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Invoice | null>(null);
  const [deleteInvoiceNumber, setDeleteInvoiceNumber] = useState('');

  const filteredInvoices = useMemo(() => {
    return context?.invoices.filter(invoice =>
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
  }, [searchTerm, context?.invoices]);

  const handleDelete = () => {
    if (deleteConfirm && deleteInvoiceNumber === deleteConfirm.invoiceNumber) {
        context?.deleteInvoice(deleteConfirm.id);
        setDeleteConfirm(null);
        setDeleteInvoiceNumber('');
    } else {
        alert('Invoice number does not match.');
    }
  };
  
  if (selectedInvoice) {
    return (
        <div className="print-container">
            <InvoiceTemplate invoice={selectedInvoice} />
            <div className="no-print absolute top-4 right-4 flex space-x-2">
                <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">Print</button>
                <button onClick={() => setSelectedInvoice(null)} className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700">Back to List</button>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">View Invoices</h1>
      <input
        type="text"
        placeholder="Search by customer name or invoice no..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full p-3 border rounded-lg mb-6"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-semibold text-gray-600">Invoice #</th>
              <th className="p-3 font-semibold text-gray-600">Customer Name</th>
              <th className="p-3 font-semibold text-gray-600">Date</th>
              <th className="p-3 font-semibold text-gray-600">Total</th>
              <th className="p-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{invoice.invoiceNumber}</td>
                <td className="p-3 font-medium text-gray-800">{invoice.customerName}</td>
                <td className="p-3">{new Date(invoice.date).toLocaleDateString()}</td>
                <td className="p-3 font-medium">₹{invoice.total.toLocaleString('en-IN')}</td>
                <td className="p-3 flex space-x-2">
                  <button onClick={() => setSelectedInvoice(invoice)} className="text-blue-600 hover:underline">View/Print</button>
                  <button onClick={() => setDeleteConfirm(invoice)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredInvoices.length === 0 && <p className="text-center text-gray-500 py-8">No invoices found.</p>}
      </div>
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-4">To delete invoice <span className="font-bold">{deleteConfirm.invoiceNumber}</span>, please type the invoice number below:</p>
                <input
                    type="text"
                    value={deleteInvoiceNumber}
                    onChange={e => setDeleteInvoiceNumber(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder={deleteConfirm.invoiceNumber}
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={() => {setDeleteConfirm(null); setDeleteInvoiceNumber('');}} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
