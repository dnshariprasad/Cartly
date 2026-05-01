import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Item, ItemStatus } from '../types';

export const useItems = (listId: string | undefined) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listId) {
      setItems([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'lists', listId, 'items'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const itemsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Item[];
        setItems(itemsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching items:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [listId]);

  const addItem = useCallback(async (item: Omit<Item, 'id' | 'createdAt'>) => {
    if (!listId) return;
    try {
      const batch = writeBatch(db);
      
      const itemsCollection = collection(db, 'lists', listId, 'items');
      const newItemRef = doc(itemsCollection);
      
      batch.set(newItemRef, {
        ...item,
        createdAt: Date.now()
      });

      const listRef = doc(db, 'lists', listId);
      batch.update(listRef, {
        itemCount: increment(1)
      });

      await batch.commit();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [listId]);

  const updateItem = useCallback(async (itemId: string, data: Partial<Item>, previousStatus?: ItemStatus) => {
    if (!listId) return;
    try {
      const batch = writeBatch(db);
      const itemRef = doc(db, 'lists', listId, 'items', itemId);
      batch.update(itemRef, data);

      if (data.status && previousStatus && data.status !== previousStatus) {
        const listRef = doc(db, 'lists', listId);
        batch.update(listRef, {
          completedCount: increment(data.status === 'Purchased' ? 1 : -1)
        });
      }

      await batch.commit();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [listId]);

  const deleteItem = useCallback(async (itemId: string, status: ItemStatus) => {
    if (!listId) return;
    try {
      const batch = writeBatch(db);
      const itemRef = doc(db, 'lists', listId, 'items', itemId);
      batch.delete(itemRef);
      
      const listRef = doc(db, 'lists', listId);
      batch.update(listRef, {
        itemCount: increment(-1),
        completedCount: increment(status === 'Purchased' ? -1 : 0)
      });

      await batch.commit();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [listId]);

  return { items, loading, error, addItem, updateItem, deleteItem };
};
