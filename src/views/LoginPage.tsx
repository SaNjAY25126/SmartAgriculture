import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserRole } from '../types';
import { useApp } from '../AppContext';
import { supabase } from '../supabase';
import { ArrowLeft, Lock, User as UserIcon, AlertCircle, Mail, Loader2 } from 'lucide-react';

interface LoginPageProps {
  role: UserRole;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ role, onBack }) => {
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('Authentication timed out. Please try again.');
    }, 15000);

    try {
      if (isSignUp) {
        console.log('Attempting sign up...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
              role: 'farmer',
              password: password // For simulation purposes
            }
          }
        });

        if (signUpError) throw signUpError;
        
        if (signUpData.user) {
          alert('Sign up successful! You can now log in.');
          setIsSignUp(false);
          setLoading(false);
          return;
        }
      }

      console.log(`Attempting login for role: ${role}`);
      
      // 1. Try Real Supabase Auth First
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!authError && authData.user) {
        console.log('Real Auth successful, fetching profile...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw new Error('Profile not found.');
        
        if (role !== 'farmer' && profileData.role !== role) {
          await supabase.auth.signOut();
          throw new Error(`Access denied. You do not have ${role} privileges.`);
        }

        setCurrentUser({
          id: profileData.id,
          username: profileData.username,
          role: profileData.role,
          profile: profileData
        });
        return;
      }

      // 2. Fallback: Check Profiles Table (Demo Mode)
      console.log('Real Auth failed, checking Profiles table (Demo Mode)...');
      const { data: demoProfile, error: demoError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (demoError) {
        if (demoError.code === 'PGRST116') {
          throw new Error('Invalid login credentials. Please check your email and password.');
        } else if (demoError.code === '42501') {
          throw new Error('Database Permission Denied. Please ensure you have run the SQL script in your Supabase SQL Editor.');
        } else if (demoError.code === '42P01') {
          throw new Error('Database Table Not Found. Please ensure you have run the SQL script in your Supabase SQL Editor.');
        } else {
          throw new Error(`Database Error: ${demoError.message} (Code: ${demoError.code})`);
        }
      }

      if (!demoProfile) {
        throw new Error('Invalid login credentials. Please check your email and password.');
      }

      if (role !== 'farmer' && demoProfile.role !== role) {
        throw new Error(`Access denied. You do not have ${role} privileges.`);
      }

      console.log('Demo Login successful!');
      setCurrentUser({
        id: demoProfile.id,
        username: demoProfile.username,
        role: demoProfile.role,
        profile: demoProfile
      });

    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
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
            <h2 className="text-3xl font-bold text-gray-900 capitalize mb-2">{role} {isSignUp ? 'Sign Up' : 'Login'}</h2>
            <p className="text-gray-500">
              {role === 'farmer' 
                ? (isSignUp ? 'Create your farmer account' : 'Access your farm dashboard')
                : `Enter your ${role} credentials`}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {role === 'farmer' && isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
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

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Sign Up' : 'Login')}
            </button>
          </form>

          {role === 'farmer' && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary-700 font-semibold hover:underline"
              >
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
            </div>
          )}

          {!isSignUp && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">Quick Demo Login</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setEmail('ram@farm.com');
                    setPassword('ram123');
                  }}
                  className="text-xs bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 py-2.5 px-3 rounded-xl border border-gray-200 transition-all font-medium"
                >
                  Farmer (Ram)
                </button>
                <button
                  onClick={() => {
                    setEmail('dealer1@smartagri.com');
                    setPassword('dealer123');
                  }}
                  className="text-xs bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 py-2.5 px-3 rounded-xl border border-gray-200 transition-all font-medium"
                >
                  Dealer
                </button>
              </div>
            </div>
          )}

          {role !== 'farmer' && (
            <div className="mt-8 p-4 bg-primary-50 rounded-2xl border border-primary-100">
              <p className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">Admin/Dealer Note</p>
              <p className="text-xs text-primary-900">
                Please use the accounts created in Supabase Auth with the appropriate role assigned in the <code className="bg-primary-100 px-1 rounded">profiles</code> table.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
