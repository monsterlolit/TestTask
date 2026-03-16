import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProductsStore } from "../store/products.store.js";
import { useAuthStore } from "../store/auth.store.js";
import { SearchBar } from "../components/features/SearchBar.js";
import { ProductTable } from "../components/features/ProductTable.js";
import { Pagination, ProgressBar } from "../components/common/index.js";
import { AddProductModal } from "../components/features/AddProductModal.js";
import { handleApiError } from "../utils/errorHandler.js";
import type { Product } from "../types/product.types.js";
import "./ProductsPage.css";

const ITEMS_PER_PAGE = 20;

/**
 * Страница списка продуктов
 * - Header с заголовком и SearchBar
 * - Вторая строка: "Все позиции" + кнопки Обновить и Добавить
 * - Таблица продуктов с сортировкой
 * - Пагинация
 */
export const ProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout, isAuthenticated, token } = useAuthStore();
    const {
        products,
        loading,
        error,
        total,
        fetchProducts,
        searchProducts,
        setLoading,
    } = useProductsStore();

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(
        null,
    );
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    /**
     * Проверка авторизации при загрузке страницы
     */
    useEffect(() => {
        console.log("[ProductsPage] Auth check:", {
            isAuthenticated,
            hasToken: !!token,
        });
        if (!isAuthenticated || !token) {
            console.log(
                "[ProductsPage] Not authenticated, navigating to /login",
            );
            navigate("/login", { replace: true });
        } else {
            console.log("[ProductsPage] Authenticated, component mounted");
        }
    }, [isAuthenticated, token, navigate]);

    /**
     * Загрузка продуктов при монтировании или изменении страницы
     */
    useEffect(() => {
        if (!searchQuery) {
            const skip = (currentPage - 1) * ITEMS_PER_PAGE;
            fetchProducts(ITEMS_PER_PAGE, skip);
        }
    }, [currentPage, fetchProducts, searchQuery]);

    const handleToggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    const handleToggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map((p) => p.id));
        }
    };

    const handleEdit = (product: Product) => {
        console.log("Edit product:", product);
        setIsEditingProduct(product);
        setIsAddModalOpen(true);
    };

    const handleDelete = (id: number) => {
        console.log("Delete product:", id);
    };

    /**
     * Поиск с debounce (500ms внутри SearchBar)
     */
    const handleSearch = useCallback(
        async (query: string) => {
            setSearchQuery(query);
            setCurrentPage(1);
            setSelectedIds([]);

            if (query.trim()) {
                await searchProducts(query);
            } else {
                await fetchProducts(ITEMS_PER_PAGE, 0);
            }
        },
        [searchProducts, fetchProducts],
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const { addProduct } = useProductsStore();

    const handleAddProduct = (data: {
        title: string;
        price: string;
        brand: string;
        sku: string;
        category: string;
        description: string;
        rating: string;
    }) => {
        console.log("New product:", data);

        // Создаём новый продукт с временным ID
        const newProduct: Product = {
            id: Date.now(), // временный уникальный ID
            title: data.title,
            price: parseFloat(data.price) || 0,
            brand: data.brand,
            sku: data.sku,
            category: data.category || "",
            rating: parseFloat(data.rating) || 0,
            image: "", // пустое изображение по умолчанию
        };

        // Добавляем в store
        addProduct(newProduct);

        // Закрываем модалку и показываем уведомление
        setIsAddModalOpen(false);
        showToast("Товар добавлен", "success");
    };

    /**
     * Кнопка Обновить - перезагружает список товаров
     */
    const handleRefresh = async () => {
        setIsRefreshing(true);

        try {
            if (searchQuery) {
                await searchProducts(searchQuery);
            } else {
                const skip = (currentPage - 1) * ITEMS_PER_PAGE;
                await fetchProducts(ITEMS_PER_PAGE, skip);
            }

            showToast("Данные обновлены", "success");
        } catch (err) {
            showToast("Ошибка при обновлении", "error");
        } finally {
            setIsRefreshing(false);
        }
    };

    /**
     * Показ toast уведомления
     */
    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), type === "success" ? 2000 : 3000);
    };

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = searchQuery ? 1 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = searchQuery
        ? products.length
        : Math.min(currentPage * ITEMS_PER_PAGE, total);

    return (
        <>
            <div className="products-page">
                {/* Header - верхняя часть с заголовком и SearchBar */}
                <header className="products-header">
                    <div className="products-header-content">
                        {/* Заголовок слева */}
                        <h1 className="products-title">Товары</h1>

                        {/* SearchBar по центру */}
                        <div className="products-header-search">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                onSearch={handleSearch}
                                debounceMs={500}
                                placeholder="Найти"
                                disabled={loading || isRefreshing}
                                loading={loading || isRefreshing}
                            />
                        </div>

                        {/* Кнопка выхода справа */}
                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                            aria-label="Выйти"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Вторая строка: "Все позиции" + кнопки */}
                <div className="products-subheader">
                    <div className="products-subheader-content">
                        {/* Заголовок "Все позиции" */}
                        <h2 className="products-subheader-title">
                            Все позиции
                        </h2>

                        {/* Кнопки справа */}
                        <div className="products-subheader-actions">
                            {/* Кнопка Обновить */}
                            <button
                                className="btn-refresh"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                aria-label="Обновить"
                                title="Обновить список товаров"
                            >
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#515161"
                                    strokeWidth="2"
                                    style={{
                                        animation: isRefreshing
                                            ? "spin 1s linear infinite"
                                            : "none",
                                    }}
                                >
                                    <polyline points="23 4 23 10 17 10" />
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                </svg>
                            </button>

                            {/* Кнопка Добавить */}
                            <button
                                className="btn-add"
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2.5"
                                >
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Добавить</span>
                            </button>
                        </div>
                    </div>
                </div>

                <main className="products-main">
                    {/* ProgressBar при загрузке */}
                    {(loading || isRefreshing) && (
                        <ProgressBar progress={100} height={3} />
                    )}

                    <div className="products-content">
                        <ProductTable
                            products={products}
                            selectedIds={selectedIds}
                            onToggleSelect={handleToggleSelect}
                            onToggleSelectAll={handleToggleSelectAll}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            loading={loading || isRefreshing}
                        />

                        {error && (
                            <div className="products-error">
                                <span>Ошибка: {handleApiError(error)}</span>
                            </div>
                        )}

                        {!loading &&
                            !isRefreshing &&
                            products.length === 0 &&
                            !error && (
                                <div className="products-empty">
                                    <span>Нет продуктов для отображения</span>
                                </div>
                            )}
                    </div>

                    {/* Пагинация под таблицей */}
                    {!searchQuery && totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={total}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={handlePageChange}
                        />
                    )}

                    {/* Информация при поиске */}
                    {searchQuery && (
                        <div className="products-search-info">
                            Найдено: {products.length}
                        </div>
                    )}
                </main>
            </div>

            {/* Toast уведомление */}
            {toast && (
                <div
                    className={`toast-toast toast-toast--${toast.type}`}
                    style={{
                        position: "fixed",
                        top: 20,
                        right: 20,
                        padding: "14px 20px",
                        borderRadius: 12,
                        backgroundColor:
                            toast.type === "success" ? "#EBF3EA" : "#FFF5F5",
                        border: `1px solid ${toast.type === "success" ? "#22c55e" : "#F11010"}`,
                        color: toast.type === "success" ? "#222222" : "#F11010",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 14,
                        zIndex: 9999,
                        animation: "slideIn 0.3s ease",
                    }}
                >
                    {toast.message}
                </div>
            )}

            {/* Модалка добавления/редактирования */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setIsEditingProduct(null);
                }}
                onAdd={handleAddProduct}
                editProduct={isEditingProduct}
            />
        </>
    );
};
