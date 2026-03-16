import { create } from "zustand";
import type { Product } from "../types/product.types.js";
import { productsApi } from "../api/products.api.js";

/**
 * Конфигурация сортировки
 */
export interface SortConfig {
    field: string;
    order: "asc" | "desc";
}

/**
 * Чтение сохранённой сортировки из localStorage
 */
const getInitialSort = (): SortConfig => {
    if (typeof window === "undefined") {
        return { field: "title", order: "asc" };
    }
    try {
        const stored = localStorage.getItem("products_sort");
        if (stored && stored !== "undefined" && stored !== "null") {
            const parsed = JSON.parse(stored);
            if (parsed.sortField && parsed.sortOrder) {
                return {
                    field: parsed.sortField,
                    order: parsed.sortOrder,
                };
            }
        }
    } catch (error) {
        console.error("Error loading sort state:", error);
    }
    return { field: "title", order: "asc" };
};

const initialSort = getInitialSort();

/**
 * Состояние списка продуктов
 */
interface ProductsState {
    products: Product[];
    loading: boolean;
    error: string | null;
    sortBy: SortConfig;
    total: number;
    searchQuery: string;
}

/**
 * Действия для управления продуктами
 */
interface ProductsActions {
    /**
     * Загрузка продуктов с сервера
     * @param limit - количество продуктов
     * @param skip - смещение
     */
    fetchProducts: (limit?: number, skip?: number) => Promise<void>;
    /**
     * Поиск продуктов по запросу
     * @param query - поисковый запрос
     */
    searchProducts: (query: string) => Promise<void>;
    setProducts: (products: Product[]) => void;
    setLoading: (loading: boolean) => void;
    /**
     * Установка сортировки с автоматической пересортировкой
     * @param sortBy - конфигурация сортировки
     */
    setSortBy: (sortBy: SortConfig) => void;
    clearError: () => void;
    addProduct: (product: Product) => void;
    removeProduct: (id: number) => void;
    setSearchQuery: (query: string) => void;
}

type ProductsStore = ProductsState & ProductsActions;

export const useProductsStore = create<ProductsStore>((set, get) => ({
    products: [],
    loading: false,
    error: null,
    sortBy: initialSort, // ← используем сохранённое состояние
    total: 0,
    searchQuery: "",

    /**
     * Загрузка продуктов с сервера DummyJSON
     * Автоматически применяет текущую сортировку
     */
    fetchProducts: async (limit = 20, skip = 0): Promise<void> => {
        set({ loading: true, error: null });

        try {
            const response = await productsApi.getProducts({ limit, skip });
            const { products, total } = response;

            // Сортировка полученных данных на клиенте
            const sortedProducts = [...products].sort((a, b) => {
                const { field, order } = get().sortBy;
                const aValue = a[field as keyof Product];
                const bValue = b[field as keyof Product];

                if (aValue === undefined || bValue === undefined) return 0;

                let comparison = 0;
                if (typeof aValue === "string" && typeof bValue === "string") {
                    comparison = aValue.localeCompare(bValue, "ru");
                } else if (
                    typeof aValue === "number" &&
                    typeof bValue === "number"
                ) {
                    comparison = aValue - bValue;
                }

                return order === "asc" ? comparison : -comparison;
            });

            set({
                products: sortedProducts,
                total,
                loading: false,
            });
        } catch (err) {
            set({
                error:
                    err instanceof Error
                        ? err.message
                        : "Не удалось загрузить продукты",
                loading: false,
            });
        }
    },

    /**
     * Поиск продуктов по запросу через API
     */
    searchProducts: async (query: string): Promise<void> => {
        if (!query.trim()) {
            // Если запрос пустой, загружаем все продукты
            get().fetchProducts(20, 0);
            set({ searchQuery: "" });
            return;
        }

        set({ loading: true, error: null, searchQuery: query });

        try {
            const response = await productsApi.searchProducts(query, 50);
            const { products } = response;

            // Применяем сортировку к результатам поиска
            const sortedProducts = [...products].sort((a, b) => {
                const { field, order } = get().sortBy;
                const aValue = a[field as keyof Product];
                const bValue = b[field as keyof Product];

                if (aValue === undefined || bValue === undefined) return 0;

                let comparison = 0;
                if (typeof aValue === "string" && typeof bValue === "string") {
                    comparison = aValue.localeCompare(bValue, "ru");
                } else if (
                    typeof aValue === "number" &&
                    typeof bValue === "number"
                ) {
                    comparison = aValue - bValue;
                }

                return order === "asc" ? comparison : -comparison;
            });

            set({
                products: sortedProducts,
                total: products.length,
                loading: false,
            });
        } catch (err) {
            set({
                error:
                    err instanceof Error
                        ? err.message
                        : "Не удалось выполнить поиск",
                loading: false,
            });
        }
    },

    setProducts: (products: Product[]): void => {
        set({ products });
    },

    setLoading: (loading: boolean): void => {
        set({ loading });
    },

    /**
     * Установка сортировки с немедленной пересортировкой текущего списка
     * и сохранением в localStorage
     */
    setSortBy: (sortBy: SortConfig): void => {
        // Сохраняем в localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("products_sort", JSON.stringify(sortBy));
        }

        set({ sortBy });

        const { products } = get();
        const sortedProducts = [...products].sort((a, b) => {
            const { field, order } = sortBy;
            const aValue = a[field as keyof Product];
            const bValue = b[field as keyof Product];

            if (aValue === undefined || bValue === undefined) return 0;

            let comparison = 0;
            if (typeof aValue === "string" && typeof bValue === "string") {
                comparison = aValue.localeCompare(bValue, "ru");
            } else if (
                typeof aValue === "number" &&
                typeof bValue === "number"
            ) {
                comparison = aValue - bValue;
            }

            return order === "asc" ? comparison : -comparison;
        });

        set({ products: sortedProducts });
    },

    clearError: (): void => {
        set({ error: null });
    },

    /**
     * Добавление продукта в начало списка
     */
    addProduct: (product: Product): void => {
        set((state) => ({
            products: [product, ...state.products],
            total: state.total + 1,
        }));
    },

    /**
     * Удаление продукта по ID
     */
    removeProduct: (id: number): void => {
        set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            total: state.total - 1,
        }));
    },

    setSearchQuery: (query: string): void => {
        set({ searchQuery: query });
    },
}));
