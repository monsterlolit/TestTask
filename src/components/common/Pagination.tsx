import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../../utils/icons.js";
import "./Pagination.css";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    className?: string;
}

/**
 * Компонент пагинации
 * - Текст "Показано 1-20 из 120" слева
 * - Кнопки страниц справа
 * - Active кнопка: #797FEA фон
 */
export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    className = "",
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        onPageChange(page);
    };

    const getVisiblePages = (): number[] => {
        const delta = 2;
        const range: number[] = [];
        const rangeWithDots: number[] = [];
        let l: number | undefined;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        for (const i of range) {
            if (l !== undefined) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push(-1);
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={`pagination ${className}`}>
            {/* Текст "Показано 1-20 из 120" слева */}
            <span className="pagination-info">
                Показано {startItem}-{endItem} из {totalItems}
            </span>

            {/* Кнопки страниц справа */}
            <div className="pagination-controls">
                <button
                    className="pagination-btn pagination-btn--arrow"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    aria-label="Предыдущая страница"
                >
                    <ChevronLeftIcon size={16} />
                </button>

                {visiblePages.map((page, index) =>
                    page === -1 ? (
                        <span key={`dots-${index}`} className="pagination-dots">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            className={`pagination-btn ${
                                page === currentPage
                                    ? "pagination-btn--active"
                                    : ""
                            }`}
                            onClick={() => handlePageClick(page)}
                            aria-label={`Страница ${page}`}
                            aria-current={
                                page === currentPage ? "page" : undefined
                            }
                        >
                            {page}
                        </button>
                    ),
                )}

                <button
                    className="pagination-btn pagination-btn--arrow"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    aria-label="Следующая страница"
                >
                    <ChevronRightIcon size={16} />
                </button>
            </div>
        </div>
    );
};
