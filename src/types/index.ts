import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  tag: string;
  description: string; // 商品の説明を追加
  allergens: string; // アレルギー情報を追加
  isRecommended: boolean; // おすすめプロパティを追加
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
