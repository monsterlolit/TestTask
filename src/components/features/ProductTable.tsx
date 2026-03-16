import React, { useState, useEffect, useCallback } from "react";
import type { Product } from "../../types/product.types.js";
import { ProductRow } from "./ProductRow.js";
import { SortHeader } from "./SortHeader.js";
import { useProductsStore } from "../../store/products.store.js";
import "./ProductTable.css";

export interface ProductTableProps {
    products: Product[];
    selectedIds: number[];
    onToggleSelect: (id: number) => void;
    onToggleSelectAll: () => void;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    loading?: boolean;
}

/**
 * Таблица продуктов с сортировкой по клику на заголовок
 * Состояние сортировки сохраняется в localStorage
 */
export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    onEdit,
    onDelete,
    loading = false,
}) => {
    const { setProducts } = useProductsStore();

    // Инициализация состояния сортировки из localStorage
    const getInitialSortState = (): {
        sortField: string | null;
        sortOrder: "asc" | "desc" | null;
    } => {
        try {
            const stored = localStorage.getItem("products_sort");
            if (stored && stored !== "undefined") {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error("Error loading sort state:", error);
        }
        return { sortField: null, sortOrder: null };
    };

    const [sortField, setSortField] = useState<string | null>(
        getInitialSortState().sortField,
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(
        getInitialSortState().sortOrder,
    );

    const allSelected =
        products.length > 0 && selectedIds.length === products.length;

    const handleSelectAll = () => {
        onToggleSelectAll();
    };

    /**
     * Применение сортировки к продуктам
     */
    const applySort = useCallback(
        (field: string, order: "asc" | "desc") => {
            const sorted = [...products].sort((a, b) => {
                const aValue = a[field as keyof Product];
                const bValue = b[field as keyof Product];

                if (aValue === undefined || bValue === undefined) return 0;

                if (typeof aValue === "string" && typeof bValue === "string") {
                    return order === "asc"
                        ? aValue.localeCompare(bValue, "ru")
                        : bValue.localeCompare(aValue, "ru");
                }

                if (typeof aValue === "number" && typeof bValue === "number") {
                    return order === "asc" ? aValue - bValue : bValue - aValue;
                }

                return 0;
            });

            setProducts(sorted);
        },
        [products, setProducts],
    );

    /**
     * Обработчик сортировки
     * Клик по тому же заголовку: asc → desc → сброс
     */
    const handleSort = useCallback(
        (field: string) => {
            let newOrder: "asc" | "desc" = "asc";

            // Если кликнули на тот же заголовок - меняем порядок
            if (sortField === field) {
                if (sortOrder === "asc") {
                    newOrder = "desc";
                } else if (sortOrder === "desc") {
                    // Если уже desc - сбрасываем сортировку
                    setSortField(null);
                    setSortOrder(null);
                    localStorage.removeItem("products_sort");
                    return;
                }
            }

            setSortField(field);
            setSortOrder(newOrder);
            applySort(field, newOrder);
        },
        [sortField, sortOrder, applySort],
    );

    /**
     * Сохранение состояния сортировки в localStorage
     */
    useEffect(() => {
        if (sortField && sortOrder) {
            localStorage.setItem(
                "products_sort",
                JSON.stringify({
                    sortField,
                    sortOrder,
                }),
            );
        } else {
            localStorage.removeItem("products_sort");
        }
    }, [sortField, sortOrder]);

    /**
     * Применяем сортировку при изменении продуктов
     */
    useEffect(() => {
        if (sortField && sortOrder && products.length > 0) {
            applySort(sortField, sortOrder);
        }
    }, [products.length]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return (
            <div className="product-table-container">
                <div className="product-table-loading">
                    <div className="spinner"></div>
                    <span>Загрузка...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="product-table-container">
            <table className="product-table">
                <thead>
                    <tr className="product-table-header-row">
                        <th className="product-table-checkbox-col">
                            <label className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={handleSelectAll}
                                    className="checkbox-input"
                                />
                                <span className="checkbox-mark"></span>
                            </label>
                        </th>
                        <th
                            className="product-table-header"
                            style={{ width: "278px", padding: 0 }}
                        >
                            <SortHeader
                                field="title"
                                label="Наименование"
                                currentSortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                width={210}
                            />
                        </th>
                        <th
                            className="product-table-header"
                            style={{ width: "125px", padding: 0 }}
                        >
                            <SortHeader
                                field="brand"
                                label="Вендор"
                                currentSortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                textAlign="center"
                            />
                        </th>
                        <th
                            className="product-table-header"
                            style={{ width: "160px", padding: 0 }}
                        >
                            <SortHeader
                                field="sku"
                                label="Артикул"
                                currentSortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                textAlign="center"
                            />
                        </th>
                        <th
                            className="product-table-header"
                            style={{ width: "125px", padding: 0 }}
                        >
                            <SortHeader
                                field="rating"
                                label="Оценка"
                                currentSortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                textAlign="center"
                            />
                        </th>
                        <th
                            className="product-table-header"
                            style={{ width: "160px", padding: 0 }}
                        >
                            <SortHeader
                                field="price"
                                label="Цена, ₽"
                                currentSortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                textAlign="center"
                            />
                        </th>
                        <th
                            className="product-table-header"
                            style={{ width: "80px" }}
                        >
                            <div
                                style={{
                                    color: "#B2B3B9",
                                    fontSize: 16,
                                    fontFamily: "Cairo",
                                    fontWeight: 700,
                                }}
                            >
                                Действия
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <ProductRow
                            key={product.id}
                            product={product}
                            selected={selectedIds.includes(product.id)}
                            onToggleSelect={onToggleSelect}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>

            {products.length === 0 && (
                <div className="product-table-empty">
                    <span>Нет продуктов для отображения</span>
                </div>
            )}
        </div>
    );
};
