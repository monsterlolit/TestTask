import React from "react";

export interface SortHeaderProps {
    field: string;
    label: string;
    currentSortField: string | null;
    sortOrder: "asc" | "desc" | null;
    onSort: (field: string) => void;
    width?: number;
    textAlign?: "left" | "center" | "right";
}

/**
 * Компонент сортируемого заголовка таблицы
 * При клике меняет сортировку (asc → desc → сброс)
 */
export const SortHeader: React.FC<SortHeaderProps> = ({
    field,
    label,
    currentSortField,
    sortOrder,
    onSort,
    width,
    textAlign = "left",
}) => {
    const isActive = currentSortField === field;
    const isAsc = sortOrder === "asc";
    const isDesc = sortOrder === "desc";

    return (
        <div
            onClick={() => onSort(field)}
            style={{
                width: width || "auto",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#B2B3B9",
                fontSize: 16,
                fontFamily: "Cairo",
                fontWeight: 700,
                textAlign: textAlign,
                justifyContent:
                    textAlign === "center"
                        ? "center"
                        : textAlign === "right"
                          ? "flex-end"
                          : "flex-start",
                userSelect: "none",
                transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.color = isActive ? "#242EDB" : "#999999";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.color = isActive ? "#242EDB" : "#B2B3B9";
            }}
        >
            {label}

            {/* Стрелки сортировки */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    opacity: isActive ? 1 : 0.3,
                }}
            >
                {/* Стрелка вверх */}
                <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill={isActive && isAsc ? "#242EDB" : "none"}
                    stroke={isActive && isAsc ? "#242EDB" : "#B2B3B9"}
                    strokeWidth="2.5"
                    style={{ display: "block" }}
                >
                    <polyline points="18 15 12 9 6 15" />
                </svg>

                {/* Стрелка вниз */}
                <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill={isActive && isDesc ? "#242EDB" : "none"}
                    stroke={isActive && isDesc ? "#242EDB" : "#B2B3B9"}
                    strokeWidth="2.5"
                    style={{ display: "block" }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>
        </div>
    );
};
