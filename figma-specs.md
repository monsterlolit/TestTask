// Основные цвета
primary: '#242EDB', // Синий (кнопки, активные элементы)
primaryLight: '#797FEA', // Светло-синий (активная пагинация)
primaryOutline: '#367AFF', // Обводка кнопок

// Фоны
backgroundGray: '#404040', // Темный фон canvas
backgroundLight: '#F6F6F6', // Светлый фон страницы
backgroundCard: '#FFFFFF', // Фон карточек
backgroundInput: '#F3F3F3', // Фон инпутов
backgroundSearch: '#F9F9F9', // Фон login страницы

// Текст
textPrimary: '#202020', // Основной текст
textSecondary: '#222222', // Заголовки
textDark: '#333333', // Темный текст
textGray: '#B2B3B9', // Серый текст (подписи)
textLight: '#999999', // Светло-серый (placeholder)
textMuted: '#969B9F', // Приглушенный

// Границы
borderLight: '#E2E2E2', // Основные границы
borderMuted: '#ECECEB', // Тихие границы
borderInput: '#EDEDED', // Границы инпутов

// Специальные
error: '#F11010', // Красный (низкий рейтинг < 3)
success: '#EBF3EA', // Светло-зеленый
selectedRow: '#3C538E', // Синяя полоса выбранной строки

// Border Radius
radiusSm: '4px', // Чекбоксы, маленькие кнопки
radiusMd: '8px', // Инпуты, search
radiusLg: '10px', // Header карточка
radiusXl: '12px', // Основные карточки, кнопки
radiusXXl: '23px', // Pill кнопки (edit)
radiusRound: '100px', // Круглые элементы

// Padding
paddingCard: '30px', // Основной карточки
paddingInput: '14px 16px', // Инпуты
paddingButton: '10px 20px', // Кнопки
paddingHeader: '20px 30px', // Header

// Gap
gapSm: '8px', // Маленький
gapMd: '10px', // Средний
gapLg: '14px', // Большой
gapXl: '18px', // Очень большой
gapXXl: '30px', // Между секциями
gapXXXl: '40px', // Внутри карточек

// Размеры компонентов
tableRowHeight: '71px',
headerHeight: '105px',
inputHeight: '42px',
buttonHeight: '42px',
checkboxSize: '22px',
iconSize: '24px',

// Шрифты
fontPrimary: 'Cairo', // Заголовки, основной UI
fontSecondary: 'Inter', // Формы, login
fontTable: 'Open Sans', // Табличные данные
fontMono: 'Roboto Mono', // Цены

// Размеры шрифтов
textXs: '14px', // Подписи, placeholder
textSm: '16px', // Основной текст таблиц
textMd: '18px', // Labels, пагинация
textLg: '20px', // Заголовки секций
textXl: '24px', // Заголовок страницы
textXXl: '40px', // Welcome заголовок

// FontWeight
weightRegular: '400',
weightMedium: '500',
weightSemiBold: '600',
weightBold: '700',

// Line Height
lineHeightTight: '20px', // 20/20
lineHeightNormal: '24px', // 14/24
lineHeightRelaxed: '27px', // 18/27
lineHeightLoose: '44px', // 40/44

📦 Структура компонентов

1. LoginPage:
   Карточка: 527px ширина, padding 6px
   Внутренний контейнер: padding 48px, radius 34px
   Иконка: 52x52px, radius 100px
   Заголовок: 40px/44px, Cairo 600
   Инпуты: ширина 399px, height ~58px
   Кнопка: полная ширина, radius 12px
2. ProductsPage:
   Header: высота 105px, padding 30px
   Search: ширина 1023px, background #F3F3F3
   Таблица:
   Checkbox: 22x22px
   Изображение: 48x48px, radius 8px
   Название: 210px ширина
   Колонки: Vendor 125px, Article 160px, Rating 125px, Price 160px
   Кнопки действий: Edit 52x27px (pill), Delete 32x32px
3. Pagination:
   Кнопки: 30x30px, radius 4px
   Gap: 16px
   Active: background #797FEA, shadow
   🎯 Специфичные требования
   Рейтинг < 3 → красный цвет #F11010
   Выбранная строка → синяя полоса слева #3C538E, фон чекбокса #3C538E
   Цена → Roboto Mono, разделение на рубли/копейки (черный/серый)
   Кнопка "Добавить" → background #242EDB, текст #EBF3EA (почти белый)
   Search placeholder → текст "Найти", цвет #999999
