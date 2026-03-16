/**
 * Форматирование цены в формате "123 456,78 ₽"
 * Рубли разделяются пробелами, копейки через запятую
 */
export const formatPrice = (price: number): string => {
    const rubles = Math.floor(price);
    const kopecks = Math.round((price - rubles) * 100);
    return `${rubles.toLocaleString("ru-RU")},${kopecks.toString().padStart(2, "0")} ₽`;
};

/**
 * Разделение цены на рубли и копейки для раздельного отображения
 */
export const formatPriceParts = (
    price: number,
): { rubles: string; kopecks: string } => {
    const rubles = Math.floor(price);
    const kopecks = Math.round((price - rubles) * 100);
    return {
        rubles: rubles.toLocaleString("ru-RU"),
        kopecks: kopecks.toString().padStart(2, "0"),
    };
};

/**
 * Полное форматирование цены с раздельными частями
 */
export const formatPriceFull = (price: number): string => {
    const { rubles, kopecks } = formatPriceParts(price);
    return `${rubles},${kopecks} ₽`;
};

export const formatRating = (rating: number): string => {
    return rating.toFixed(1);
};

export const formatStars = (rating: number): string => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        "★".repeat(fullStars) +
        (hasHalfStar ? "½" : "") +
        "☆".repeat(emptyStars)
    );
};

export const formatNumber = (num: number): string => {
    return num.toLocaleString("ru-RU");
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
};

export const capitalizeFirst = (text: string): string => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatSku = (sku: string): string => {
    return sku.toUpperCase();
};
