import apiClient from "./client";
import type { Product, ProductListResponse } from "../types/product.types";
import type { ApiError } from "../types/api.types";

export interface ProductsQueryParams {
    limit?: number;
    skip?: number;
    select?: string;
}

export interface AddProductRequest {
    title: string;
    price: number;
    description: string;
    category: string;
    brand: string;
    sku: string;
    stock: number;
    images: string[];
}

export const productsApi = {
    async getProducts(
        params?: ProductsQueryParams,
    ): Promise<ProductListResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (params?.limit)
                queryParams.append("limit", params.limit.toString());
            if (params?.skip)
                queryParams.append("skip", params.skip.toString());
            if (params?.select) queryParams.append("select", params.select);

            const response = await apiClient.get<ProductListResponse>(
                `/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
            );

            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.message || "Failed to fetch products");
        }
    },

    async getProductById(id: number): Promise<Product> {
        try {
            const response = await apiClient.get<Product>(`/products/${id}`);
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            if (apiError.status === 404) {
                throw new Error("Product not found");
            }
            throw new Error(apiError.message || "Failed to fetch product");
        }
    },

    async searchProducts(
        query: string,
        limit: number = 10,
    ): Promise<ProductListResponse> {
        try {
            const response = await apiClient.get<ProductListResponse>(
                `/products/search?q=${encodeURIComponent(query)}&limit=${limit}`,
            );
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.message || "Failed to search products");
        }
    },

    async addProduct(productData: AddProductRequest): Promise<Product> {
        try {
            const response = await apiClient.post<Product>(
                "/products/add",
                productData,
            );
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.message || "Failed to add product");
        }
    },
};
