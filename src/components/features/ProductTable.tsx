import React, { useState, useEffect, useCallback } from "react";
import type { Product } from "../../types/product.types.js";
import { ProductRow } from "./ProductRow.js";
import { SortHeader } from "./SortHeader.js";
import {
    useProductsStore,
    type SortConfig,
} from "../../store/products.store.js";
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
 * Состояние сортировки сохраняется в localStorage и синхронизируется с store
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
    const { setProducts, sortBy, setSortBy } = useProductsStore();

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
     * Обработчик сортировки - использует store state
     * Клик по тому же заголовку: asc → desc → сброс
     */
    const handleSort = useCallback(
        (field: string) => {
            // Определяем новый порядок на основе текущего состояния store
            let newOrder: "asc" | "desc" | null = "asc";

            if (sortBy.field === field && sortBy.order === "asc") {
                newOrder = "desc";
            } else if (sortBy.field === field && sortBy.order === "desc") {
                // Сброс сортировки
                setSortBy({ field: "", order: "asc" });
                localStorage.removeItem("products_sort");
                return;
            }

            // Обновляем store и localStorage
            const newSortConfig: SortConfig = { field, order: newOrder };
            setSortBy(newSortConfig);
            localStorage.setItem(
                "products_sort",
                JSON.stringify(newSortConfig),
            );

            // Применяем сортировку к текущим данным
            applySort(field, newOrder);
        },
        [sortBy, setSortBy, applySort],
    );

    /**
     * Сохранение состояния сортировки в localStorage
     */
    useEffect(() => {
        if (sortBy.field && sortBy.order) {
            localStorage.setItem(
                "products_sort",
                JSON.stringify({
                    sortField: sortBy.field,
                    sortOrder: sortBy.order,
                }),
            );
        } else {
            localStorage.removeItem("products_sort");
        }
    }, [sortBy]);

    /**
     * Применяем сортировку при изменении продуктов
     */
    useEffect(() => {
        if (sortBy.field && sortBy.order && products.length > 0) {
            applySort(sortBy.field, sortBy.order);
        }
    }, [products.length, sortBy.field, sortBy.order]); // eslint-disable-line react-hooks/exhaustive-deps

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
                                currentSortField={sortBy.field}
                                sortOrder={sortBy.order}
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
                                currentSortField={sortBy.field}
                                sortOrder={sortBy.order}
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
                                currentSortField={sortBy.field}
                                sortOrder={sortBy.order}
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
                                currentSortField={sortBy.field}
                                sortOrder={sortBy.order}
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
                                currentSortField={sortBy.field}
                                sortOrder={sortBy.order}
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
