export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  vehicle: string;
  vehicleNo: string;
  mobileNo: string;
  km: string;
  items: InvoiceItem[];
  total: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number | 'infinite';
  price: number;
  minStock: number;
}

export interface User {
  username: string;
  password: string;
}
