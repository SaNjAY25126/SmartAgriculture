export type UserRole = 'farmer' | 'dealer' | 'admin' | 'guest';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  profile?: FarmerProfile;
}

export interface FarmerProfile {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  village: string;
  phone: string;
  land_area: string;
  email: string;
  avatar_url: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  created_at: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  farmer_id: string;
  farmer_name: string;
  product_id: string;
  product_name: string;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  created_at: string;
}

export interface CropPlan {
  id: string;
  farmer_id: string;
  crop_name: string;
  season: string;
  area: string;
  expected_yield: string;
  created_at: string;
}

export interface WaterRecord {
  id: string;
  farmer_id: string;
  date: string;
  amount: number;
  source: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  advice: string;
  location?: string;
}
