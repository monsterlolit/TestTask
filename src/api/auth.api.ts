import apiClient from "./client.js";
import type { LoginRequest, User } from "../types/auth.types.js";
import type { ApiError } from "../types/api.types.js";

/**
 * DummyJSON /auth/login response format
 */
export interface DummyJSONLoginResponse {
    token: string;
    refreshToken?: string;
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: "male" | "female";
    image: string;
}

/**
 * Результат авторизации для внутреннего использования
 */
export interface AuthApiResult {
    user: User;
    token: string;
    refreshToken: string;
}

/**
 * Ключи для localStorage/sessionStorage
 */
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_REFRESH_KEY = "auth_refresh";
const AUTH_USER_KEY = "auth_user";

/**
 * Получение хранилища в зависимости от rememberMe
 */
const getStorage = (rememberMe: boolean): Storage => {
    return rememberMe ? localStorage : sessionStorage;
};

export const authApi = {
    /**
     * Логин пользователя через DummyJSON API
     * @param credentials - логин, пароль и rememberMe флаг
     * @returns данные пользователя и токены
     */
    async login(
        credentials: LoginRequest & { rememberMe?: boolean },
    ): Promise<AuthApiResult> {
        try {
            const { username, password } = credentials;
            console.log("[AuthAPI] Sending login request for:", username);

            const response = await apiClient.post<DummyJSONLoginResponse>(
                "/auth/login",
                { username, password },
            );

            // 🔍 ПОДРОБНОЕ ЛОГИРОВАНИЕ ВСЕГО ОТВЕТА:
            console.log("[AuthAPI] Full response object:", {
                status: response.status,
                statusText: response.statusText,
                data: response.data,
                dataType: typeof response.data,
                dataIsArray: Array.isArray(response.data),
                dataKeys: response.data ? Object.keys(response.data) : "N/A",
            });

            const data = response.data;

            // 🔍 ПРОВЕРЯЕМ РАЗНЫЕ ВОЗМОЖНЫЕ МЕСТА ДЛЯ ТОКЕНА:
            const dataAny = data as any;
            const possibleToken =
                data?.token ||
                dataAny?.data?.token ||
                dataAny?.accessToken ||
                dataAny?.access_token ||
                (response as any)?.token;

            console.log("[AuthAPI] Token search:", {
                "response.data.token": data?.token,
                "response.data.data.token": dataAny?.data?.token,
                "response.data.accessToken": dataAny?.accessToken,
                "response.data.access_token": dataAny?.access_token,
                "response.token": (response as any)?.token,
                found: !!possibleToken,
            });

            // ВАЛИДАЦИЯ: проверяем что токен есть
            if (!possibleToken) {
                console.error(
                    "[AuthAPI] ❌ No token found in any expected location",
                );
                throw new Error(
                    `Invalid auth response: no token. Received: ${JSON.stringify(data)}`,
                );
            }

            // Преобразуем ответ DummyJSON в наш формат
            const user: User = {
                id: data.id,
                username: data.username,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                image: data.image,
            };

            // DummyJSON может не возвращать refreshToken
            const refreshToken = data.refreshToken || "";

            console.log("[AuthAPI] Parsed response:", {
                token: !!possibleToken,
                user: !!user,
                hasRefreshToken: !!refreshToken,
            });

            // Сохраняем токены в appropriate storage (localStorage или sessionStorage)
            const storage = getStorage(credentials.rememberMe !== false);
            storage.setItem(AUTH_TOKEN_KEY, possibleToken);
            storage.setItem(AUTH_REFRESH_KEY, refreshToken);
            storage.setItem(AUTH_USER_KEY, JSON.stringify(user));

            return { user, token: possibleToken, refreshToken };
        } catch (error) {
            console.error("[AuthAPI] Login error:", error);
            const apiError = error as ApiError;
            throw new Error(apiError.message || "Не удалось войти");
        }
    },

    /**
     * Выход пользователя - очистка localStorage и sessionStorage
     */
    async logout(): Promise<void> {
        try {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_REFRESH_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
            sessionStorage.removeItem(AUTH_TOKEN_KEY);
            sessionStorage.removeItem(AUTH_REFRESH_KEY);
            sessionStorage.removeItem(AUTH_USER_KEY);
        } catch (error) {
            console.error("Logout error:", error);
            throw new Error("Не удалось выйти");
        }
    },

    /**
     * Получение данных текущего пользователя
     * Проверяет сначала localStorage, потом sessionStorage
     */
    getCurrentUser(): User | null {
        try {
            const localData = localStorage.getItem(AUTH_USER_KEY);
            const sessionData = sessionStorage.getItem(AUTH_USER_KEY);
            const userData = localData || sessionData;

            if (userData && userData !== "undefined" && userData !== "null") {
                return JSON.parse(userData) as User;
            }
            return null;
        } catch (error) {
            console.error("Error getting current user:", error);
            return null;
        }
    },

    /**
     * Проверка наличия токена
     */
    hasToken(): boolean {
        if (typeof window === "undefined") return false;
        const localToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const sessionToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
        return !!(localToken || sessionToken);
    },
};
