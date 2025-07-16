
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'business_owner' | 'assistant';
  name: string;
  storeAccess?: string[];
  isActive: boolean;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  description: string;
  ownerId: string;
}

export interface Product {
  id: string;
  name: string;
  color: string;
  category: string;
  form: 'boxes' | 'pcs' | 'dozen' | 'bag' | 'rolls' | 'meters' | 'kg';
  description: string;
  quantity: number;
  storeId: string;
  lastUpdated: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  productId?: string;
  quantity?: number;
  timestamp: Date;
  storeId: string;
}
