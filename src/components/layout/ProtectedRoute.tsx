import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store.js";

export interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Защищённый маршрут
 * - СИНХРОННАЯ проверка авторизации (без useEffect)
 * - Никаких лоадеров и задержек
 * - Мгновенный редирект если не авторизован
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { token, user, isAuthenticated } = useAuthStore();
    const location = useLocation();

    console.log("[ProtectedRoute] Check:", {
        hasToken: !!token,
        hasUser: !!user,
        isAuthenticated,
    });

    // СИНХРОННАЯ проверка — никаких useEffect!
    // Zustand store уже инициализирован к моменту рендера
    const isAuth = !!(token && user && isAuthenticated);

    // Если не авторизован — сразу редирект (без эффектов!)
    if (!isAuth) {
        console.log(
            "[ProtectedRoute] Not authenticated, redirecting to /login",
        );
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log("[ProtectedRoute] Access granted, rendering children");
    // Авторизован — рендерим children
    return <>{children}</>;
};
