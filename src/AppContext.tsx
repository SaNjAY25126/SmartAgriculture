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

  const fetchData = async (userId?: string) => {
    try {
      // 1. Fetch Public Data (Always accessible)
      const [
        { data: productsData, error: pError },
        { data: profilesData, error: prError }
      ] = await Promise.all([
        supabase.from('products').select('*').order('name'),
        supabase.from('profiles').select('*')
      ]);

      if (pError) console.error('Products error:', pError);
      if (prError) console.error('Profiles error:', prError);

      if (productsData) setProducts(productsData);
      if (profilesData) setFarmers(profilesData);

      // 2. Fetch Private Data (Only if logged in)
      if (userId) {
        const [
          { data: ordersData, error: oError },
          { data: cropPlansData, error: cpError },
          { data: waterRecordsData, error: wrError }
        ] = await Promise.all([
          supabase.from('orders').select('*').eq('farmer_id', userId).order('created_at', { ascending: false }),
          supabase.from('crop_plans').select('*').eq('farmer_id', userId),
          supabase.from('water_records').select('*').eq('farmer_id', userId)
        ]);

        if (oError) console.error('Orders error:', oError);
        if (cpError) console.error('Crop plans error:', cpError);
        if (wrError) console.error('Water records error:', wrError);

        if (ordersData) setOrders(ordersData);
        if (cropPlansData) setCropPlans(cropPlansData);
        if (waterRecordsData) setWaterRecords(waterRecordsData);
      } else {
        // Clear private data if not logged in
        setOrders([]);
        setCropPlans([]);
        setWaterRecords([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), 8000);
    try {
      await fetchData(currentUser?.id);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      console.log('Current user changed, fetching private data for:', currentUser.id);
      fetchData(currentUser.id);
    } else {
      console.log('Current user is null, fetching public data only');
      fetchData();
    }
  }, [currentUser?.id]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      setLoading(true);
      const timeoutId = setTimeout(() => {
        if (mounted) setLoading(false);
      }, 8000);
      
      try {
        // 1. Check current session first
        const { data: { session } } = await supabase.auth.getSession();
        let userId = undefined;

        if (session?.user && mounted) {
          userId = session.user.id;
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile && mounted) {
            setCurrentUser({
              id: profile.id,
              username: profile.username,
              role: profile.role,
              profile
            });
          }
        }

        // 2. Fetch data with userId context
        await fetchData(userId);

      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        clearTimeout(timeoutId);
        if (mounted) setLoading(false);
      }
    };

    initialize();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth Event:', event, session?.user?.id);
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Auth change profile fetch error:', error);
        }

        if (profile && mounted) {
          console.log('Auth change: setting user profile', profile.role);
          setCurrentUser({
            id: profile.id,
            username: profile.username,
            role: profile.role,
            profile
          });
          // Fetch private data after login
          fetchData(profile.id);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('Auth change: user signed out');
        setCurrentUser(null);
        fetchData(); // Fetch only public data
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
      mounted = false;
      subscription.unsubscribe();
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
      refreshData: loadData,
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
