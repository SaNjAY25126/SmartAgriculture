import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { useApp } from '../AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export const AdminDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { products, orders, farmers, resetData } = useApp();

  const stats = [
    { label: 'Total Farmers', value: farmers.length, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-green-100 text-green-600' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'bg-purple-100 text-purple-600' },
    { label: 'Revenue', value: `₹${orders.reduce((acc, o) => acc + Number(o.total_price), 0)}`, icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
  ];

  const lowStockCount = products.filter(p => p.quantity <= 20).length;

  const orderStatusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
    { name: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: '#3b82f6' },
    { name: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: '#10b981' },
  ].filter(d => d.value > 0);

  const productStockData = products.map(p => ({
    name: p.name,
    stock: p.quantity
  }));

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">System Overview</h2>
          <p className="text-gray-500">Real-time platform metrics and activity.</p>
        </div>
        <button 
          onClick={() => { if(confirm('Reset all demo data?')) resetData(); }}
          className="btn-red flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Reset Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {lowStockCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-center gap-3 text-orange-700">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">Alert: {lowStockCount} products are below the stock threshold (20 units).</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-8">Order Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {orderStatusData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-sm font-medium text-gray-600">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-8">Product Stock Levels</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productStockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#4caf50" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">Inventory levels across all fertilizer types</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold">Recent Orders</h3>
          <button className="text-primary-600 font-bold text-sm">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Farmer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(-6)}</td>
                  <td className="px-6 py-4 font-bold">{order.farmer_name}</td>
                  <td className="px-6 py-4 text-gray-600">{order.product_name}</td>
                  <td className="px-6 py-4 font-bold text-primary-700">₹{order.total_price}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      order.status === 'pending' ? "bg-orange-100 text-orange-600" :
                      order.status === 'processing' ? "bg-blue-100 text-blue-600" :
                      "bg-green-100 text-green-600"
                    )}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTable = (title: string, data: any[], columns: { key: string, label: string, render?: (val: any) => React.ReactNode }[]) => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input className="bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-500" placeholder="Search..." />
          </div>
          <button className="bg-white border border-gray-200 p-2 rounded-xl hover:bg-gray-50"><Filter className="w-5 h-5 text-gray-500" /></button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'farmers' && renderTable('Registered Farmers', farmers, [
          { key: 'username', label: 'Username', render: (f) => <span className="font-bold">{f.username}</span> },
          { key: 'village', label: 'Village', render: (f) => f.village || '-' },
          { key: 'phone', label: 'Phone', render: (f) => f.phone || '-' },
          { key: 'land_area', label: 'Land Area', render: (f) => f.land_area ? `${f.land_area} Acres` : '-' },
          { key: 'id', label: 'System ID', render: (f) => <span className="font-mono text-xs text-gray-400">{f.id}</span> },
        ])}
        {activeTab === 'products' && renderTable('Product Catalog', products, [
          { key: 'name', label: 'Product', render: (p) => <span className="font-bold">{p.name}</span> },
          { key: 'category', label: 'Category', render: (p) => <span className="bg-gray-100 px-2 py-1 rounded text-xs">{p.category}</span> },
          { key: 'price', label: 'Price', render: (p) => <span className="font-bold text-primary-700">₹{p.price}</span> },
          { key: 'quantity', label: 'Stock', render: (p) => (
            <span className={cn(
              "font-bold",
              p.quantity > 20 ? "text-green-600" : p.quantity > 0 ? "text-orange-600" : "text-red-600"
            )}>
              {p.quantity} units
            </span>
          )},
        ])}
        {activeTab === 'orders' && renderTable('All Orders', orders, [
          { key: 'id', label: 'Order ID', render: (o) => <span className="font-mono text-xs">#{o.id.slice(-6)}</span> },
          { key: 'farmer_name', label: 'Farmer', render: (o) => <span className="font-bold">{o.farmer_name}</span> },
          { key: 'product_name', label: 'Product', render: (o) => o.product_name },
          { key: 'total_price', label: 'Total', render: (o) => <span className="font-bold text-primary-700">₹{o.total_price}</span> },
          { key: 'status', label: 'Status', render: (o) => (
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
              o.status === 'pending' ? "bg-orange-100 text-orange-600" :
              o.status === 'processing' ? "bg-blue-100 text-blue-600" :
              "bg-green-100 text-green-600"
            )}>
              {o.status}
            </span>
          )},
        ])}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Advanced Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-8">Monthly Order Trends</h3>
                <div className="h-80 flex items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed">
                  <TrendingUp className="w-12 h-12 mb-2" />
                  <p>Historical data visualization will appear here as orders accumulate.</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-8">Farmer Geographic Distribution</h3>
                <div className="h-80 flex items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed">
                  <Users className="w-12 h-12 mb-2" />
                  <p>Village-wise distribution map will be available in the next update.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">System Settings</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h4 className="font-bold mb-4">Platform Maintenance</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="font-bold">Reset System Cache</p>
                      <p className="text-xs text-gray-500">Refresh all local data from Supabase.</p>
                    </div>
                    <button onClick={resetData} className="btn-blue px-4 py-2 text-sm">Refresh Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
