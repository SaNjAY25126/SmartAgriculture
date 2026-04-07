import { Product } from './types';

export const DEMO_CREDENTIALS = {
  dealer: { username: 'dealer', password: 'password123' },
  admin: { username: 'admin', password: 'password123' }
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Urea Fertilizer',
    price: 450,
    quantity: 100,
    description: 'High nitrogen fertilizer for rapid plant growth.',
    category: 'Nitrogenous',
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'DAP (Diammonium Phosphate)',
    price: 1200,
    quantity: 50,
    description: 'Excellent source of P and nitrogen for plant nutrition.',
    category: 'Phosphatic',
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'Potash (MOP)',
    price: 850,
    quantity: 75,
    description: 'Helps in root development and disease resistance.',
    category: 'Potassic',
    created_at: new Date().toISOString()
  },
  {
    id: 'p4',
    name: 'NPK 19:19:19',
    price: 600,
    quantity: 120,
    description: 'Balanced fertilizer for all types of crops.',
    category: 'Complex',
    created_at: new Date().toISOString()
  },
  {
    id: 'p5',
    name: 'Organic Compost',
    price: 200,
    quantity: 200,
    description: 'Natural soil conditioner and nutrient source.',
    category: 'Organic',
    created_at: new Date().toISOString()
  }
];

export const SEASONS = ['Kharif', 'Rabi', 'Zaid'];
