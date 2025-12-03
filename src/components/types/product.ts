export interface Product {
  _id: string;
  product_id: string; // Note: string type as per your data
  product_name: string;
  description: string;
  price: number;
  stock: number;
  created_at?: string;
  metadata?: Record<string, unknown>;
  org_id?: string;
  category: string;
  images: string;
}
