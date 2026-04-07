export type UserRole = 'farmer' | 'dealer' | 'admin' | 'guest';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  profile?: FarmerProfile;
}

export interface FarmerProfile {
  name: string;
  village: string;
  phone: string;
  landArea: string;
  email: string;
  avatar: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  farmerId: string;
  farmerName: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  date: string;
}

export interface CropPlan {
  id: string;
  farmerId: string;
  cropName: string;
  season: string;
  area: string;
  expectedYield: string;
}

export interface WaterRecord {
  id: string;
  farmerId: string;
  date: string;
  amount: number; // in liters or cubic meters
  source: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  advice: string;
}
