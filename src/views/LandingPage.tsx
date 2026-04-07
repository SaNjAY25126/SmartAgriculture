import React from 'react';
import { motion } from 'motion/react';
import { Sprout, ShoppingCart, TrendingUp, Users, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
            alt="Field" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sprout className="text-primary-500 w-8 h-8" />
              <span className="font-display text-xl tracking-wider uppercase">Smart Agriculture</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif mb-6 leading-tight">
              Empowering Farmers, <br/>
              <span className="text-primary-400">Growing Futures.</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed max-w-lg">
              The all-in-one digital marketplace and management platform for modern agriculture. 
              Connect with dealers, manage your farm, and track your growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onSelectRole('farmer')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 shadow-xl hover:shadow-primary-600/20"
              >
                Get Started as Farmer <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onSelectRole('dealer')}
                className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
              >
                Dealer Access
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-primary-900 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Farmers', value: '10,000+' },
              { label: 'Fertilizer Stock', value: '500 Tons' },
              { label: 'Orders Processed', value: '25,000+' },
              { label: 'Villages Covered', value: '150+' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-primary-400 text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/60 text-sm uppercase tracking-widest font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Access Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Choose Your Role</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Access role-specific tools designed to streamline your agricultural operations.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                role: 'farmer' as UserRole, 
                title: 'Farmer', 
                desc: 'Order fertilizers, plan crops, and track farm records.', 
                icon: Sprout,
                color: 'bg-green-500'
              },
              { 
                role: 'dealer' as UserRole, 
                title: 'Dealer', 
                desc: 'Manage inventory, process orders, and grow your business.', 
                icon: ShoppingCart,
                color: 'bg-blue-500'
              },
              { 
                role: 'admin' as UserRole, 
                title: 'Admin', 
                desc: 'Monitor platform health, analytics, and system oversight.', 
                icon: TrendingUp,
                color: 'bg-purple-500'
              },
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group cursor-pointer"
                onClick={() => onSelectRole(item.role)}
              >
                <div className={`${item.color} p-4 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500 mb-8">{item.desc}</p>
                <button className="mt-auto text-primary-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Access Portal <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000" 
                alt="Farming" 
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden md:block">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="text-green-500 w-6 h-6" />
                  <span className="font-bold">Real-time Inventory</span>
                </div>
                <p className="text-sm text-gray-500">Never run out of stock with our automated low-stock alerts and easy restocking.</p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-serif text-gray-900 mb-8 leading-tight">Everything you need to <br/>manage your farm digitally.</h2>
              <div className="space-y-6">
                {[
                  { title: 'Fertilizer Marketplace', desc: 'Browse and order high-quality fertilizers with transparent pricing.' },
                  { title: 'Crop Planning', desc: 'Organize your planting schedule by season and track expected yields.' },
                  { title: 'Water Management', desc: 'Log water usage and monitor irrigation efficiency.' },
                  { title: 'Weather Insights', desc: 'Get localized weather data and smart farming advice.' },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="bg-primary-100 text-primary-700 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sprout className="text-primary-500 w-6 h-6" />
            <span className="font-display text-lg tracking-wider uppercase">Smart Agri</span>
          </div>
          <p className="text-gray-400 mb-8">© 2026 Smart Agriculture Management System. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
