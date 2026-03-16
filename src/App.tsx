import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProtectedRoute } from "./components/layout/ProtectedRoute.js";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/products"
                element={
                    <ProtectedRoute>
                        <ProductsPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
