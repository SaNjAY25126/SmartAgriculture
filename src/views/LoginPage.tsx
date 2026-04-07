import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserRole } from '../types';
import { useApp } from '../AppContext';
import { DEMO_CREDENTIALS } from '../constants';
import { ArrowLeft, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  role: UserRole;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ role, onBack }) => {
  const { setCurrentUser, farmers, setFarmers } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'farmer') {
      if (!username.trim()) {
        setError('Please enter a username');
        return;
      }
      
      let farmer = farmers.find(f => f.username.toLowerCase() === username.toLowerCase());
      if (!farmer) {
        farmer = {
          id: `f-${Date.now()}`,
          username,
          role: 'farmer',
          profile: {
            name: username,
            village: '',
            phone: '',
            landArea: '',
            email: '',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
          }
        };
        setFarmers([...farmers, farmer]);
      }
      setCurrentUser(farmer);
    } else {
      const creds = DEMO_CREDENTIALS[role as 'dealer' | 'admin'];
      if (username === creds.username && password === creds.password) {
        setCurrentUser({
          id: role,
          username: role.charAt(0).toUpperCase() + role.slice(1),
          role
        });
      } else {
        setError('Invalid credentials. Check demo info below.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-primary-900">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <button 
          onClick={onBack}
          className="text-white/70 hover:text-white mb-8 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to roles
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 capitalize mb-2">{role} Login</h2>
            <p className="text-gray-500">
              {role === 'farmer' 
                ? 'Enter your username to access your farm dashboard' 
                : `Use demo credentials to access the ${role} portal`}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            {role !== 'farmer' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <button type="submit" className="w-full btn-primary py-4 text-lg">
              Login to Dashboard
            </button>
          </form>

          {role !== 'farmer' && (
            <div className="mt-8 p-4 bg-primary-50 rounded-2xl border border-primary-100">
              <p className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">Demo Credentials</p>
              <div className="text-sm text-primary-900 space-y-1">
                <p><span className="font-semibold">User:</span> {DEMO_CREDENTIALS[role as 'dealer' | 'admin'].username}</p>
                <p><span className="font-semibold">Pass:</span> {DEMO_CREDENTIALS[role as 'dealer' | 'admin'].password}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
