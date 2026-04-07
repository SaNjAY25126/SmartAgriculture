import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  ShoppingCart, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  X,
  Loader2
} from 'lucide-react';
import { useApp } from '../AppContext';
import { supabase } from '../supabase';
import { Product, Order, OrderStatus } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export const DealerDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { products, orders } = useApp();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [loading, setLoading] = useState(false);

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity <= 20).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    pendingOrders: orders.filter(o => o.status === 'pending').length
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status.');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const productData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      quantity: Number(formData.get('quantity')),
      description: formData.get('description') as string,
      category: formData.get('category') as string
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        setEditingProduct(null);
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
        if (error) throw error;
        setIsAddingProduct(false);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  const renderInventory = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-500">Manage your fertilizer stock and pricing.</p>
        </div>
        <button 
          onClick={() => setIsAddingProduct(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Products</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-orange-500">
          <p className="text-sm text-gray-500 font-medium mb-1">Low Stock</p>
          <p className="text-3xl font-bold text-orange-600">{stats.lowStock}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-red-500">
          <p className="text-sm text-gray-500 font-medium mb-1">Out of Stock</p>
          <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 font-medium mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-blue-600">{stats.pendingOrders}</p>
        </div>
      </div>

      {stats.lowStock > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-center gap-3 text-orange-700">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">Attention: {stats.lowStock} products are running low on stock. Please consider restocking soon.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">
                    {product.category}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">{product.name}</h4>
                  <p className="text-sm text-primary-600 font-bold">₹{product.price}</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold",
                  product.quantity > 20 ? "bg-green-100 text-green-600" : 
                  product.quantity > 0 ? "bg-orange-100 text-orange-600" : 
                  "bg-red-100 text-red-600"
                )}>
                  {product.quantity} in stock
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-8 line-clamp-2">{product.description}</p>
              <div className="flex gap-2 pt-6 border-t border-gray-50">
                <button 
                  onClick={() => setEditingProduct(product)}
                  className="flex-1 btn-blue py-2 flex items-center justify-center gap-2 text-sm"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="btn-red p-2 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {(isAddingProduct || editingProduct) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <button 
                    onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                      <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                      <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
                      <input name="quantity" type="number" defaultValue={editingProduct?.quantity} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                      <input name="category" defaultValue={editingProduct?.category} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                      <textarea name="description" defaultValue={editingProduct?.description} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg mt-4 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingProduct ? 'Update Product' : 'Create Product')}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Incoming Orders</h2>
          <p className="text-gray-500">Process and fulfill farmer requests.</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-700">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xl font-bold">{order.product_name}</h4>
                  <span className="text-sm text-gray-400">x {order.quantity}</span>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  Ordered by <span className="font-bold text-gray-700">{order.farmer_name}</span> • {format(new Date(order.created_at), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Amount</p>
                <p className="text-xl font-bold text-primary-700">₹{order.total_price}</p>
              </div>
              
              <div className="flex items-center gap-2">
                {order.status === 'pending' && (
                  <button 
                    onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                    className="btn-blue px-6 py-2 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Process
                  </button>
                )}
                {order.status === 'processing' && (
                  <button 
                    onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                    className="btn-primary px-6 py-2 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Complete
                  </button>
                )}
                <div className={cn(
                  "px-4 py-2 rounded-xl font-bold text-sm uppercase tracking-wider",
                  order.status === 'pending' ? "bg-orange-100 text-orange-600" :
                  order.status === 'processing' ? "bg-blue-100 text-blue-600" :
                  "bg-green-100 text-green-600"
                )}>
                  {order.status}
                </div>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No orders received yet.</p>
          </div>
        )}
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
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'orders' && renderOrders()}
      </motion.div>
    </div>
  );
};
