import 'firebase/compat/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { Product, Order } from '../types';
import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const createOrder = async (order: Omit<Order, 'id' | 'timestamp'>) => {
  return addDoc(collection(db, 'orders'), {
    ...order,
    timestamp: Timestamp.now(),
  });
};

export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(
    (doc: QueryDocumentSnapshot) =>
      ({
        id: doc.id,
        name: doc.data().name || '',
        price: doc.data().price || 0,
        tags: doc.data().tags || [],
        image: doc.data().image || '',
        tag: doc.data().tag || '',
        description: doc.data().description || '',
        allergens: doc.data().allergens || '',
        isRecommended: doc.data().isRecommended || false,
      }) as Product
  );
};

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  const q = query(collection(db, 'orders'), where('status', '==', 'pending'));
  return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const orders = querySnapshot.docs.map(
      (doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }) as Order
    );
    callback(orders);
  });
};

export const addProduct = async (productData: Omit<Product, 'id'>) => {
  return addDoc(collection(db, 'products'), productData);
};

export const updateProduct = async (id: string, productData: Omit<Product, 'id'>) => {
  const productRef = doc(db, 'products', id);
  return updateDoc(productRef, productData);
};

export const deleteProduct = async (id: string) => {
  const productRef = doc(db, 'products', id);
  return deleteDoc(productRef);
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { status });
};

export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `product-images/${Date.now()}_${file.name}`);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Firebaseストレージエラー:', error);
    if (error instanceof Error) {
      throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
    }
    throw new Error('画像のアップロードに失敗しました');
  }
};

export const getCategories = async (): Promise<{ id: string; name: string }[]> => {
  const querySnapshot = await getDocs(collection(db, 'categories'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));
};

export const addCategory = async (name: string) => {
  await addDoc(collection(db, 'categories'), { name });
};

export const updateCategory = async (id: string, name: string) => {
  await updateDoc(doc(db, 'categories', id), { name });
};

export const deleteCategory = async (id: string) => {
  await deleteDoc(doc(db, 'categories', id));
};
