export type ItemStatus = 'Pending' | 'Purchased';

export interface Item {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price?: number;
  notes?: string;
  status: ItemStatus;
  createdAt: number;
}

export interface List {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: string; // 'Home', 'Event', 'Custom'
  createdAt: number;
  itemCount: number;
  completedCount: number;
  totalCost?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  isCustom: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
