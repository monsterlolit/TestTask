import { useState, useEffect } from "react";

/**
 * Хук debounce для отложенного обновления значения
 * @param value - текущее значение
 * @param delay - задержка в мс
 * @returns отложенное значение
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Устанавливаем таймер
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Очищаем таймер если value изменился до истечения delay
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
