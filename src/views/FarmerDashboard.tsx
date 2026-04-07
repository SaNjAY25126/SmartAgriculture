import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  ShoppingCart, 
  Droplets, 
  CloudSun, 
  User as UserIcon,
  Plus,
  Calendar,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package
} from 'lucide-react';
import { useApp } from '../AppContext';
import { cn } from '../lib/utils';
import { CropPlan, WaterRecord, Order, Product, WeatherData } from '../types';
import { SEASONS } from '../constants';
import { format } from 'date-fns';

export const FarmerDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { 
    currentUser, setCurrentUser, 
    products, 
    orders, setOrders,
    cropPlans, setCropPlans,
    waterRecords, setWaterRecords
  } = useApp();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  useEffect(() => {
    // Mock weather fetch
    setWeather({
      temp: 28,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 12,
      advice: 'Great day for sowing! Soil moisture is optimal.'
    });
  }, []);

  const myOrders = orders.filter(o => o.farmerId === currentUser?.id);
  const myCrops = cropPlans.filter(c => c.farmerId === currentUser?.id);
  const myWater = waterRecords.filter(w => w.farmerId === currentUser?.id);

  const handlePlaceOrder = (product: Product, quantity: number) => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      farmerId: currentUser!.id,
      farmerName: currentUser!.username,
      productId: product.id,
      productName: product.name,
      quantity,
      totalPrice: product.price * quantity,
      status: 'pending',
      date: new Date().toISOString()
    };
    setOrders([newOrder, ...orders]);
    setShowOrderSuccess(true);
    setTimeout(() => setShowOrderSuccess(false), 3000);
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser?.username}!</h2>
          <p className="text-gray-500">Here's what's happening on your farm today.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
          <Calendar className="text-primary-600 w-5 h-5" />
          <span className="font-semibold">{format(new Date(), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="bg-primary-100 p-3 rounded-2xl text-primary-700">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Crops</p>
            <p className="text-2xl font-bold">{myCrops.length}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-700">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Orders</p>
            <p className="text-2xl font-bold">{myOrders.filter(o => o.status === 'pending').length}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="bg-accent-orange/10 p-3 rounded-2xl text-accent-orange-dark">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Spent</p>
            <p className="text-2xl font-bold">₹{myOrders.reduce((acc, o) => acc + o.totalPrice, 0)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Clock className="text-primary-600 w-5 h-5" /> Recent Orders
          </h3>
          <div className="space-y-4">
            {myOrders.slice(0, 3).map(order => (
              <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-xl">
                    <Package className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-bold">{order.productName}</p>
                    <p className="text-xs text-gray-500">{format(new Date(order.date), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-700">₹{order.totalPrice}</p>
                  <span className={cn(
                    "text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full",
                    order.status === 'pending' ? "bg-orange-100 text-orange-600" :
                    order.status === 'processing' ? "bg-blue-100 text-blue-600" :
                    "bg-green-100 text-green-600"
                  )}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {myOrders.length === 0 && <p className="text-gray-400 text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed">No orders yet.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CloudSun className="text-primary-600 w-5 h-5" /> Weather & Advice
          </h3>
          {weather && (
            <div className="bg-linear-to-br from-primary-600 to-primary-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-5xl font-bold mb-1">{weather.temp}°C</p>
                    <p className="text-primary-100 font-medium">{weather.condition}</p>
                  </div>
                  <CloudSun className="w-16 h-16 text-primary-200 opacity-50" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <p className="text-xs text-primary-100 uppercase font-bold mb-1">Humidity</p>
                    <p className="font-bold">{weather.humidity}%</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <p className="text-xs text-primary-100 uppercase font-bold mb-1">Wind</p>
                    <p className="font-bold">{weather.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="bg-white/20 p-4 rounded-2xl border border-white/20">
                  <p className="text-sm italic">"{weather.advice}"</p>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Fertilizer Marketplace</h2>
          <p className="text-gray-500">High-quality inputs for your farm.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700">
                {product.category}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold text-gray-900">{product.name}</h4>
                <p className="text-xl font-bold text-accent-orange-dark">₹{product.price}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <p className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full",
                  product.quantity > 20 ? "bg-green-100 text-green-600" : 
                  product.quantity > 0 ? "bg-orange-100 text-orange-600" : 
                  "bg-red-100 text-red-600"
                )}>
                  {product.quantity > 0 ? `${product.quantity} units left` : 'Out of Stock'}
                </p>
                <button 
                  disabled={product.quantity === 0}
                  onClick={() => handlePlaceOrder(product, 1)}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" /> Order Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCrops = () => {
    const [newCrop, setNewCrop] = useState({ name: '', season: 'Kharif', area: '', yield: '' });
    
    const addCrop = (e: React.FormEvent) => {
      e.preventDefault();
      const plan: CropPlan = {
        id: `cp-${Date.now()}`,
        farmerId: currentUser!.id,
        cropName: newCrop.name,
        season: newCrop.season,
        area: newCrop.area,
        expectedYield: newCrop.yield
      };
      setCropPlans([...cropPlans, plan]);
      setNewCrop({ name: '', season: 'Kharif', area: '', yield: '' });
    };

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Crop Planning</h2>
            <p className="text-gray-500">Plan your seasons and track your yields.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Add New Plan</h3>
              <form onSubmit={addCrop} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Crop Name</label>
                  <input 
                    type="text" 
                    value={newCrop.name}
                    onChange={e => setNewCrop({...newCrop, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="e.g. Wheat"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Season</label>
                  <select 
                    value={newCrop.season}
                    onChange={e => setNewCrop({...newCrop, season: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Area (Acres)</label>
                    <input 
                      type="number" 
                      value={newCrop.area}
                      onChange={e => setNewCrop({...newCrop, area: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Exp. Yield</label>
                    <input 
                      type="text" 
                      value={newCrop.yield}
                      onChange={e => setNewCrop({...newCrop, yield: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="20 Tons"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full btn-primary py-3 mt-4">Add Crop Plan</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCrops.map(plan => (
                <div key={plan.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:w-32 group-hover:h-32" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary-100 p-2 rounded-xl text-primary-700">
                        <Sprout className="w-5 h-5" />
                      </div>
                      <h4 className="text-xl font-bold">{plan.cropName}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">Season</p>
                        <p className="font-semibold text-primary-700">{plan.season}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">Area</p>
                        <p className="font-semibold">{plan.area} Acres</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400 uppercase font-bold">Expected Yield</p>
                        <p className="font-semibold">{plan.expectedYield}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {myCrops.length === 0 && (
                <div className="col-span-2 py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No crop plans added yet. Start planning your season!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWater = () => {
    const [newRecord, setNewRecord] = useState({ amount: '', source: 'Canal' });
    
    const addRecord = (e: React.FormEvent) => {
      e.preventDefault();
      const record: WaterRecord = {
        id: `wr-${Date.now()}`,
        farmerId: currentUser!.id,
        date: new Date().toISOString(),
        amount: Number(newRecord.amount),
        source: newRecord.source
      };
      setWaterRecords([...waterRecords, record]);
      setNewRecord({ amount: '', source: 'Canal' });
    };

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Water Usage</h2>
            <p className="text-gray-500">Monitor your irrigation and water consumption.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Log Usage</h3>
              <form onSubmit={addRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (Liters)</label>
                  <input 
                    type="number" 
                    value={newRecord.amount}
                    onChange={e => setNewRecord({...newRecord, amount: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="1000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Source</label>
                  <select 
                    value={newRecord.source}
                    onChange={e => setNewRecord({...newRecord, source: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {['Canal', 'Tube Well', 'Rainwater', 'River'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full btn-blue py-3 mt-4">Log Water Usage</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myWater.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{format(new Date(record.date), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{record.source}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-700">{record.amount} L</td>
                    </tr>
                  ))}
                  {myWater.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-400">No records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const [profile, setProfile] = useState(currentUser?.profile || {
      name: '', village: '', phone: '', landArea: '', email: '', avatar: ''
    });

    const saveProfile = (e: React.FormEvent) => {
      e.preventDefault();
      setCurrentUser({ ...currentUser!, profile });
      setIsEditingProfile(false);
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-48 bg-linear-to-r from-primary-600 to-primary-800 relative">
            <div className="absolute -bottom-16 left-12">
              <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl bg-white overflow-hidden">
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div className="pt-20 pb-12 px-12">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{profile.name || currentUser?.username}</h2>
                <p className="text-gray-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {profile.village || 'Village not set'}
                </p>
              </div>
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="btn-blue flex items-center gap-2"
              >
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Village</label>
                  <input 
                    type="text" 
                    value={profile.village}
                    onChange={e => setProfile({...profile, village: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={profile.phone}
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Land Area (Acres)</label>
                  <input 
                    type="text" 
                    value={profile.landArea}
                    onChange={e => setProfile({...profile, landArea: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={e => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <button type="submit" className="md:col-span-2 btn-primary py-4 mt-4">Save Profile Changes</button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <Phone className="text-primary-600 w-6 h-6" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Phone</p>
                    <p className="font-semibold">{profile.phone || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <Mail className="text-primary-600 w-6 h-6" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                    <p className="font-semibold">{profile.email || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <MapPin className="text-primary-600 w-6 h-6" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Village</p>
                    <p className="font-semibold">{profile.village || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <Sprout className="text-primary-600 w-6 h-6" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Land Area</p>
                    <p className="font-semibold">{profile.landArea ? `${profile.landArea} Acres` : 'Not set'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 pb-24">
      <AnimatePresence>
        {showOrderSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 right-8 z-[100] bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold">Order placed successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'marketplace' && renderMarketplace()}
        {activeTab === 'crops' && renderCrops()}
        {activeTab === 'water' && renderWater()}
        {activeTab === 'weather' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Weather Forecast</h2>
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
              <CloudSun className="w-24 h-24 text-primary-600 mx-auto mb-6" />
              <p className="text-5xl font-bold text-gray-900 mb-2">{weather?.temp}°C</p>
              <p className="text-xl text-gray-500 mb-8">{weather?.condition}</p>
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-2">Humidity</p>
                  <p className="text-2xl font-bold text-primary-700">{weather?.humidity}%</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-2">Wind Speed</p>
                  <p className="text-2xl font-bold text-primary-700">{weather?.windSpeed} km/h</p>
                </div>
              </div>
              <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100">
                <p className="text-primary-800 font-medium italic">"{weather?.advice}"</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'profile' && renderProfile()}
      </motion.div>
    </div>
  );
};
