import { create } from "zustand";
import type { User } from "../types/auth.types.js";
import { authApi } from "../api/auth.api.js";

/**
 * Состояние авторизации
 */
interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (
        username: string,
        password: string,
        rememberMe?: boolean,
    ) => Promise<void>;
    logout: () => void;
    setToken: (token: string, rememberMe?: boolean) => void;
    clearError: () => void;
    // УБРАТЬ: isInitialized, initialize()
}

/**
 * Ключи для storage
 */
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

/**
 * Безопасное чтение из storage
 */
const safeGetItem = (
    key: string,
    storage: Storage = localStorage,
): string | null => {
    if (typeof window === "undefined") return null;
    try {
        const value = storage.getItem(key);
        if (
            !value ||
            value === "undefined" ||
            value === "null" ||
            value === ""
        ) {
            return null;
        }
        return value;
    } catch {
        return null;
    }
};

/**
 * Безопасный парсинг User
 */
const safeParseUser = (json: string | null): User | null => {
    if (!json) return null;
    try {
        const parsed = JSON.parse(json);
        return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
        return null;
    }
};

/**
 * Чтение из ОБЕИХ хранилищ при инициализации
 * Сначала localStorage (rememberMe=true), потом sessionStorage (rememberMe=false)
 */
const getStoredAuth = () => {
    // Сначала пробуем localStorage (rememberMe=true)
    let token = safeGetItem(AUTH_TOKEN_KEY, localStorage);
    let user = safeParseUser(safeGetItem(AUTH_USER_KEY, localStorage));

    // Если не нашли — пробуем sessionStorage (rememberMe=false)
    if (!token) {
        token = safeGetItem(AUTH_TOKEN_KEY, sessionStorage);
        user = safeParseUser(safeGetItem(AUTH_USER_KEY, sessionStorage));
    }

    return { token, user };
};

/**
 * Синхронная инициализация — вызывается СРАЗУ при создании store
 * Вне create(), чтобы состояние было готово к первому рендеру
 */
const initialAuth = getStoredAuth();

export const useAuthStore = create<AuthState>((set, get) => ({
    // СИНХРОННОЕ начальное состояние — готово к первому рендеру!
    token: initialAuth.token,
    user: initialAuth.user,
    isAuthenticated: !!(initialAuth.token && initialAuth.user),
    isLoading: false,
    error: null,

    /**
     * Логин пользователя через API
     * @param rememberMe - если true, используется localStorage
     *                     если false, используется sessionStorage
     */
    login: async (
        username: string,
        password: string,
        rememberMe = true,
    ): Promise<void> => {
        console.log("[AuthStore] login called", { username, rememberMe });
        set({ isLoading: true, error: null });

        try {
            console.log("[AuthStore] Calling authApi.login...");
            const { user, token } = await authApi.login({
                username,
                password,
                rememberMe,
            });

            console.log("[AuthStore] API response received", {
                token: !!token,
                user: !!user,
                userId: user?.id,
                username: user?.username,
            });

            // ВАЛИДАЦИЯ: не продолжаем если нет токена или пользователя
            if (!token || !user) {
                console.error(
                    "[AuthStore] Invalid API response - no token or user",
                );
                throw new Error("Invalid auth response");
            }

            // Очищаем оба хранилища перед записью
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
            sessionStorage.removeItem(AUTH_TOKEN_KEY);
            sessionStorage.removeItem(AUTH_USER_KEY);

            // Пишем в нужное хранилище
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem(AUTH_TOKEN_KEY, token);
            storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
            console.log(
                "[AuthStore] Saved to",
                rememberMe ? "localStorage" : "sessionStorage",
            );

            set({
                token,
                user,
                isAuthenticated: true,
                isLoading: false,
            });
            console.log("[AuthStore] State updated", {
                token: !!token,
                isAuthenticated: true,
            });
        } catch (err) {
            console.error("[AuthStore] Login error:", err);
            set({
                error: err instanceof Error ? err.message : "Не удалось войти",
                isLoading: false,
            });
            throw err;
        }
    },

    /**
     * Выход пользователя - очистка ОБЕИХ хранилищ
     */
    logout: (): void => {
        try {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
            sessionStorage.removeItem(AUTH_TOKEN_KEY);
            sessionStorage.removeItem(AUTH_USER_KEY);
        } catch (error) {
            console.error("Error during logout:", error);
        }
        set({
            token: null,
            user: null,
            isAuthenticated: false,
            error: null,
        });
    },

    /**
     * Установка токена вручную
     */
    setToken: (token: string, rememberMe = true): void => {
        try {
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem(AUTH_TOKEN_KEY, token);
        } catch (error) {
            console.error("Error saving token:", error);
        }
        set({ token, isAuthenticated: true });
    },

    /**
     * Очистка сообщения об ошибке
     */
    clearError: (): void => {
        set({ error: null });
    },
}));
