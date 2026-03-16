import React, { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store.js";
import { Input, Checkbox, Button } from "../components/common/index.js";
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from "../utils/icons.js";
import "./LoginPage.css";

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error: storeError, clearError } = useAuthStore();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        console.log("[Login] Form submitted", {
            username,
            password: "***",
            rememberMe,
        });
        setFormError(null);
        clearError();

        if (!username.trim()) {
            console.warn("[Login] Validation failed: no username");
            setFormError("Введите логин");
            return;
        }

        if (!password.trim()) {
            console.warn("[Login] Validation failed: no password");
            setFormError("Введите пароль");
            return;
        }

        try {
            console.log("[Login] Calling store.login...");
            await login(username, password, rememberMe);
            console.log("[Login] store.login completed");

            // Редирект ТОЛЬКО через navigate, НЕ в цикле
            const from = (location.state as any)?.from?.pathname;
            const target = from && !from.includes("login") ? from : "/products";
            console.log("[Login] Navigating to:", target);
            navigate(target, { replace: true });
        } catch (err) {
            console.error("[Login] Error:", err);
            setFormError(err instanceof Error ? err.message : "Ошибка входа");
        }
    };

    const displayError = formError || storeError;

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-icon-container">
                    <div className="login-icon">
                        <UserIcon size={28} />
                    </div>
                </div>

                <h1 className="login-title">Добро пожаловать!</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <Input
                        label="Логин"
                        type="text"
                        value={username}
                        onChange={setUsername}
                        placeholder="Введите логин"
                        icon={<UserIcon size={20} />}
                        disabled={isLoading}
                        required
                    />

                    <div className="password-input-wrapper">
                        <Input
                            label="Пароль"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={setPassword}
                            placeholder="Введите пароль"
                            icon={<LockIcon size={20} />}
                            disabled={isLoading}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                            aria-label={
                                showPassword
                                    ? "Скрыть пароль"
                                    : "Показать пароль"
                            }
                        >
                            {showPassword ? (
                                <EyeOffIcon size={20} />
                            ) : (
                                <EyeIcon size={20} />
                            )}
                        </button>
                    </div>

                    <div className="login-options">
                        <Checkbox
                            checked={rememberMe}
                            onChange={setRememberMe}
                            label="Запомнить данные"
                            disabled={isLoading}
                        />
                    </div>

                    {displayError && (
                        <div className="login-error">
                            <span className="login-error-icon">⚠</span>
                            <span className="login-error-text">
                                {displayError}
                            </span>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? "Вход..." : "Войти"}
                    </Button>

                    <p className="login-footer">
                        Нет аккаунта?{" "}
                        <a href="/register" className="login-link">
                            Создать
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};
