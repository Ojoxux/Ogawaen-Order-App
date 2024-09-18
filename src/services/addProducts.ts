import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

interface Product {
  name: string;
  price: number;
  description?: string;
  tags: string;
}

export const addProduct = async (productData: Product, imageFile: File) => {
  try {
    // 画像をStorageにアップロード
    const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);

    // アップロードした画像のURLを取得
    const imageUrl = await getDownloadURL(imageRef);
    console.log('Uploaded image URL:', imageUrl); // 追加

    // 商品データをFirestoreに追加
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      image: imageUrl,
      createdAt: new Date(),
      tags: productData.tags,
    });

    console.log('Product added with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product: ', error);
    throw error;
  }
};
