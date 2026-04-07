import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Order, CropPlan, WaterRecord } from './types';
import { storage } from './lib/utils';
import { INITIAL_PRODUCTS } from './constants';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  farmers: User[];
  setFarmers: (farmers: User[]) => void;
  cropPlans: CropPlan[];
  setCropPlans: (plans: CropPlan[]) => void;
  waterRecords: WaterRecord[];
  setWaterRecords: (records: WaterRecord[]) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(storage.get('currentUser', null));
  const [products, setProducts] = useState<Product[]>(storage.get('products', INITIAL_PRODUCTS));
  const [orders, setOrders] = useState<Order[]>(storage.get('orders', []));
  const [farmers, setFarmers] = useState<User[]>(storage.get('farmers', []));
  const [cropPlans, setCropPlans] = useState<CropPlan[]>(storage.get('cropPlans', []));
  const [waterRecords, setWaterRecords] = useState<WaterRecord[]>(storage.get('waterRecords', []));

  useEffect(() => { storage.set('currentUser', currentUser); }, [currentUser]);
  useEffect(() => { storage.set('products', products); }, [products]);
  useEffect(() => { storage.set('orders', orders); }, [orders]);
  useEffect(() => { storage.set('farmers', farmers); }, [farmers]);
  useEffect(() => { storage.set('cropPlans', cropPlans); }, [cropPlans]);
  useEffect(() => { storage.set('waterRecords', waterRecords); }, [waterRecords]);

  const resetData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders([]);
    setFarmers([]);
    setCropPlans([]);
    setWaterRecords([]);
    setCurrentUser(null);
    localStorage.clear();
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      products, setProducts,
      orders, setOrders,
      farmers, setFarmers,
      cropPlans, setCropPlans,
      waterRecords, setWaterRecords,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
