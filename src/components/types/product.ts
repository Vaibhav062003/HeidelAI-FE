export interface Product {
  _id: string;
  product_id: string;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  created_at?: string;
  metadata?: Record<string, unknown>;
  category: string;
  images: string;
  onsale: string;
  permalink: string;
  purchasable: string;
  regularprice: string;
  saleprice: string;
  slug: string;
}
