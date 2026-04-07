import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Order, CropPlan, WaterRecord, FarmerProfile } from './types';
import { supabase } from './supabase';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  farmers: FarmerProfile[];
  setFarmers: (farmers: FarmerProfile[]) => void;
  cropPlans: CropPlan[];
  setCropPlans: (plans: CropPlan[]) => void;
  waterRecords: WaterRecord[];
  setWaterRecords: (records: WaterRecord[]) => void;
  refreshData: () => Promise<void>;
  resetData: () => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [waterRecords, setWaterRecords] = useState<WaterRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [
        { data: productsData },
        { data: ordersData },
        { data: profilesData },
        { data: cropPlansData },
        { data: waterRecordsData }
      ] = await Promise.all([
        supabase.from('products').select('*').order('name'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*'),
        supabase.from('crop_plans').select('*'),
        supabase.from('water_records').select('*')
      ]);

      if (productsData) setProducts(productsData);
      if (ordersData) setOrders(ordersData);
      if (profilesData) setFarmers(profilesData);
      if (cropPlansData) setCropPlans(cropPlansData);
      if (waterRecordsData) setWaterRecords(waterRecordsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data) setCurrentUser({ id: data.id, username: data.username, role: data.role, profile: data });
          });
      }
    });

    // Real-time subscriptions
    const productSub = supabase.channel('products-all')
      .on('postgres_changes' as any, { event: '*', table: 'products' }, fetchData)
      .subscribe();

    const orderSub = supabase.channel('orders-all')
      .on('postgres_changes' as any, { event: '*', table: 'orders' }, fetchData)
      .subscribe();

    const profileSub = supabase.channel('profiles-all')
      .on('postgres_changes' as any, { event: '*', table: 'profiles' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(productSub);
      supabase.removeChannel(orderSub);
      supabase.removeChannel(profileSub);
    };
  }, []);

  const resetData = async () => {
    // In a real app, this would be a backend function or specific deletes
    // For demo, we just re-fetch
    await fetchData();
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      products, setProducts,
      orders, setOrders,
      farmers, setFarmers,
      cropPlans, setCropPlans,
      waterRecords, setWaterRecords,
      refreshData: fetchData,
      resetData,
      loading
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
