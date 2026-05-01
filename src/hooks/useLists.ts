import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import type { List } from '../types';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const useLists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      setLists([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'lists'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const listsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as List[];
        setLists(listsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching lists:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const createList = useCallback(async (title: string, type: string, description?: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'lists'), {
        userId: user.uid,
        title,
        type,
        description: description || '',
        createdAt: Date.now(),
        itemCount: 0,
        completedCount: 0,
        totalCost: 0
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  const updateList = useCallback(async (id: string, data: Partial<List>) => {
    try {
      const listRef = doc(db, 'lists', id);
      await updateDoc(listRef, data);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteList = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'lists', id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return { lists, loading, error, createList, updateList, deleteList };
};
