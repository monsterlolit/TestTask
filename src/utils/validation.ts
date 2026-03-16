export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateLogin = (
  username: string,
  password: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!username || !username.trim()) {
    errors.push({ field: 'username', message: 'Введите логин' });
  } else if (username.length < 3) {
    errors.push({ field: 'username', message: 'Логин должен быть не менее 3 символов' });
  }

  if (!password || !password.trim()) {
    errors.push({ field: 'password', message: 'Введите пароль' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Пароль должен быть не менее 6 символов' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateProduct = (data: {
  title: string;
  price: string;
  brand: string;
  sku: string;
  category?: string;
  rating?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.title || !data.title.trim()) {
    errors.push({ field: 'title', message: 'Введите наименование' });
  }

  if (!data.price || !data.price.trim()) {
    errors.push({ field: 'price', message: 'Введите цену' });
  } else {
    const price = Number(data.price);
    if (isNaN(price) || price <= 0) {
      errors.push({ field: 'price', message: 'Цена должна быть положительным числом' });
    }
  }

  if (!data.brand || !data.brand.trim()) {
    errors.push({ field: 'brand', message: 'Введите вендора' });
  }

  if (!data.sku || !data.sku.trim()) {
    errors.push({ field: 'sku', message: 'Введите артикул' });
  }

  if (data.rating !== undefined && data.rating !== '') {
    const rating = Number(data.rating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      errors.push({ field: 'rating', message: 'Рейтинг должен быть от 0 до 5' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string, fieldName: string): ValidationError | null => {
  if (!value || !value.trim()) {
    return { field: fieldName, message: `Введите ${fieldName}` };
  }
  return null;
};

export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): ValidationError | null => {
  if (value && value.length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} должен быть не менее ${minLength} символов`,
    };
  }
  return null;
};

export const validateNumber = (
  value: string,
  fieldName: string,
  options: { min?: number; max?: number } = {}
): ValidationError | null => {
  const num = Number(value);
  
  if (isNaN(num)) {
    return { field: fieldName, message: `${fieldName} должен быть числом` };
  }

  if (options.min !== undefined && num < options.min) {
    return {
      field: fieldName,
      message: `${fieldName} должен быть не менее ${options.min}`,
    };
  }

  if (options.max !== undefined && num > options.max) {
    return {
      field: fieldName,
      message: `${fieldName} должен быть не более ${options.max}`,
    };
  }

  return null;
};
