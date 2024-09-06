import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  CollectionReference,
  Query,
  DocumentData,
} from 'firebase/firestore';

export const useFirebase = <T extends DocumentData>(
  collectionName: string,
  conditions?: [string, any, any][]
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let q: CollectionReference<T> | Query<T> = collection(
      db,
      collectionName
    ) as CollectionReference<T>;
    if (conditions) {
      conditions.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value)) as Query<T>;
      });
    }

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, conditions]);

  return { data, loading, error };
};
