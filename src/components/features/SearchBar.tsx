import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { useDebounce } from "../../hooks/useDebounce.js";
import "./SearchBar.css";

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: (query: string) => void;
    debounceMs?: number;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    loading?: boolean;
}

/**
 * Компонент поисковой строки с debounce
 * - Не теряет фокус при вводе (React.memo + useCallback + useRef)
 * - Вызывает поиск только после debounce (500ms по умолчанию)
 * - Показывает лоадер только при загрузке И наличии текста
 */
export const SearchBar: React.FC<SearchBarProps> = memo(
    ({
        value,
        onChange,
        onSearch,
        debounceMs = 500,
        placeholder = "Найти",
        disabled = false,
        className = "",
        loading = false,
    }) => {
        const [localValue, setLocalValue] = useState(value);
        const inputRef = useRef<HTMLInputElement>(null);
        const onSearchRef = useRef(onSearch);

        // Обновляем ref при изменении onSearch чтобы не триггерить эффект
        onSearchRef.current = onSearch;

        // Debounce значение - используется для вызова поиска
        const debouncedValue = useDebounce(localValue, debounceMs);

        // Синхронизация с внешним value (если нужно сбросить извне)
        useEffect(() => {
            if (value !== localValue) {
                setLocalValue(value);
            }
        }, [value, localValue]);

        // Вызываем поиск когда debouncedValue меняется
        useEffect(() => {
            onSearchRef.current(debouncedValue);
        }, [debouncedValue]);

        const handleChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                // Обновляем только локальное состояние - НЕ вызываем onSearch здесь!
                setLocalValue(e.target.value);
                onChange(e.target.value);
            },
            [onChange],
        );

        const handleClear = useCallback(() => {
            setLocalValue("");
            onChange("");
            onSearchRef.current("");
            // Возвращаем фокус после очистки
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }, [onChange]);

        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    onSearchRef.current(localValue);
                }
            },
            [localValue],
        );

        return (
            <div className={`search-bar ${className}`}>
                {/* Иконка поиска */}
                <svg
                    className="search-bar-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ flexShrink: 0 }}
                >
                    <circle
                        cx="11"
                        cy="11"
                        r="8"
                        stroke="#999999"
                        strokeWidth="2"
                        fill="none"
                    />
                    <line
                        x1="21"
                        y1="21"
                        x2="16.65"
                        y2="16.65"
                        stroke="#999999"
                        strokeWidth="2"
                    />
                </svg>

                {/* Input - ref для контроля фокуса */}
                <input
                    ref={inputRef}
                    type="text"
                    value={localValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="search-bar-input"
                />

                {/* Кнопка очистки (показываем если есть текст) */}
                {localValue && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="search-bar-clear"
                        aria-label="Очистить поиск"
                        style={{ marginRight: 4 }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            stroke="#999999"
                            strokeWidth="2"
                            fill="none"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}

                {/* Лоадер (показываем только если loading=true И есть текст) */}
                {loading && localValue && <div className="search-bar-loader" />}
            </div>
        );
    },
);

SearchBar.displayName = "SearchBar";
