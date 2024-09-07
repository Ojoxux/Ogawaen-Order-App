import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id?: string;
  tableNumber: string;
  items: { product: Product; quantity: number }[];
  status: string;
  timestamp: Timestamp;
}

export interface Employee {
  id: string;
  username: string;
  role: string;
}
