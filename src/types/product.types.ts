export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  sku: string;
  image: string;
  category: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
