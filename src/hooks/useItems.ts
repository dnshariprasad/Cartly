import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  increment 
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

  const addItem = async (item: Omit<Item, 'id' | 'createdAt'>) => {
    if (!listId) return;
    try {
      await addDoc(collection(db, 'lists', listId, 'items'), {
        ...item,
        createdAt: Date.now()
      });

      // Update list counters
      const listRef = doc(db, 'lists', listId);
      await updateDoc(listRef, {
        itemCount: increment(1)
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (itemId: string, data: Partial<Item>, previousStatus?: ItemStatus) => {
    if (!listId) return;
    try {
      const itemRef = doc(db, 'lists', listId, 'items', itemId);
      await updateDoc(itemRef, data);

      // If status changed, update completedCount in list
      if (data.status && previousStatus && data.status !== previousStatus) {
        const listRef = doc(db, 'lists', listId);
        await updateDoc(listRef, {
          completedCount: increment(data.status === 'Purchased' ? 1 : -1)
        });
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (itemId: string, status: ItemStatus) => {
    if (!listId) return;
    try {
      await deleteDoc(doc(db, 'lists', listId, 'items', itemId));
      
      const listRef = doc(db, 'lists', listId);
      await updateDoc(listRef, {
        itemCount: increment(-1),
        completedCount: increment(status === 'Purchased' ? -1 : 0)
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { items, loading, error, addItem, updateItem, deleteItem };
};
