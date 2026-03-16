import React from "react";
import type { Product } from "../../types/product.types.js";
import { formatPriceParts } from "../../utils/formatters.js";
import "./ProductRow.css";

export interface ProductRowProps {
    product: Product;
    selected: boolean;
    onToggleSelect: (id: number) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

/**
 * Компонент строки таблицы продуктов
 * - Отображение изображения с placeholder
 * - Выделение строки при выборе
 * - Кнопки действий: ПЛЮС и ТРИ ТОЧКИ (без функционала по ТЗ)
 * - Рейтинг в формате X.XX/5 (красный если < 3)
 */
export const ProductRow: React.FC<ProductRowProps> = ({
    product,
    selected,
    onToggleSelect,
    onEdit,
    onDelete,
}) => {
    const handleCheckboxChange = () => {
        onToggleSelect(product.id);
    };

    const handleRowClick = () => {
        onToggleSelect(product.id);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(product);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(product.id);
    };

    // Форматирование цены: рубли и копейки раздельно
    const { rubles, kopecks } = formatPriceParts(product.price);

    // Рейтинг < 3 - красный цвет
    const isLowRating = product.rating < 3;
    const ratingColor = isLowRating ? "#F11010" : "#222222";

    return (
        <tr
            className={`product-row ${selected ? "product-row--selected" : ""}`}
            onClick={handleRowClick}
        >
            <td className="product-row-cell product-row-checkbox">
                <label className="checkbox-wrapper">
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={handleCheckboxChange}
                        onClick={(e) => e.stopPropagation()}
                        className="checkbox-input"
                    />
                    <span className="checkbox-mark"></span>
                </label>
            </td>
            <td className="product-row-cell product-row-title">
                <div className="product-info">
                    {/* Изображение с placeholder */}
                    <div className="product-image-container">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.title}
                                className="product-image"
                                onError={(e) => {
                                    // При ошибке загрузки скрываем изображение, показываем placeholder
                                    (
                                        e.target as HTMLImageElement
                                    ).style.display = "none";
                                }}
                            />
                        ) : null}
                    </div>
                    <div className="product-details">
                        <span className="product-name">{product.title}</span>
                        <span className="product-category">
                            {product.category}
                        </span>
                    </div>
                </div>
            </td>
            <td className="product-row-cell product-row-vendor">
                {product.brand}
            </td>
            <td className="product-row-cell product-row-sku">{product.sku}</td>
            <td className="product-row-cell product-row-rating">
                {/* Рейтинг в формате X.XX/5 */}
                <div
                    className="product-rating-text"
                    style={{ color: ratingColor }}
                >
                    {product.rating.toFixed(2)}
                    <span>/5</span>
                </div>
            </td>
            <td className="product-row-cell product-row-price">
                <span className="price-rubles">{rubles}</span>
                <span className="price-kopecks">,{kopecks}</span>
                <span className="price-currency">₽</span>
            </td>
            <td className="product-row-cell product-row-actions">
                {/* Кнопка ПЛЮС - серая, без функционала по ТЗ */}
                <button
                    onClick={() => {
                        // По ТЗ функционал не требуется
                        console.log(
                            "Plus button clicked - no action required by spec",
                        );
                    }}
                    className="btn-action btn-action--gray"
                    aria-label="Действия"
                    title="Действия"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#B2B3B9"
                        strokeWidth="2"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
                {/* Кнопка ТРИ ТОЧКИ - серая, без функционала по ТЗ */}
                <button
                    onClick={() => {
                        // По ТЗ функционал не требуется
                        console.log(
                            "Three dots button clicked - no action required by spec",
                        );
                    }}
                    className="btn-action btn-action--gray"
                    aria-label="Меню"
                    title="Меню"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#B2B3B9"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                    </svg>
                </button>
            </td>
        </tr>
    );
};
