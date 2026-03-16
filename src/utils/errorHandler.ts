import { ApiError } from '../types/api.types.js';

export type ErrorHandler = (error: string, code?: string) => void;

let globalErrorHandler: ErrorHandler | null = null;

export const setGlobalErrorHandler = (handler: ErrorHandler): void => {
  globalErrorHandler = handler;
};

export const handleApiError = (error: unknown, defaultMessage = 'Произошла ошибка'): string => {
  let errorMessage = defaultMessage;
  let errorCode: string | undefined;

  if (isApiError(error)) {
    errorMessage = error.message || defaultMessage;
    errorCode = error.code;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  if (globalErrorHandler) {
    globalErrorHandler(errorMessage, errorCode);
  }

  return errorMessage;
};

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  );
};

export const getErrorMessage = (error: unknown, defaultMessage = 'Произошла ошибка'): string => {
  if (isApiError(error)) {
    switch (error.status) {
      case 400:
        return 'Некорректные данные';
      case 401:
        return 'Необходима авторизация';
      case 403:
        return 'Доступ запрещен';
      case 404:
        return 'Не найдено';
      case 409:
        return 'Конфликт данных';
      case 422:
        return 'Ошибка валидации';
      case 429:
        return 'Слишком много запросов';
      case 500:
        return 'Внутренняя ошибка сервера';
      case 502:
        return 'Ошибка шлюза';
      case 503:
        return 'Сервис недоступен';
      default:
        return error.message || defaultMessage;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('network') || error.message.includes('Network');
  }
  return false;
};
