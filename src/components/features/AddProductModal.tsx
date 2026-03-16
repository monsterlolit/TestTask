import React, { useState, FormEvent, useEffect } from "react";
import { Modal } from "../common/Modal.js";
import { Input } from "../common/Input.js";
import { Button } from "../common/index.js";
import { ToastContainer } from "../common/Toast.js";
import type { Product } from "../../types/product.types.js";
import "./AddProductModal.css";

export interface AddProductFormData {
    title: string;
    price: string;
    brand: string;
    sku: string;
    category: string;
    description: string;
    rating: string;
}

export interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd?: (data: AddProductFormData) => void;
    editProduct?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
    isOpen,
    onClose,
    onAdd,
    editProduct = null,
}) => {
    const [formData, setFormData] = useState<AddProductFormData>({
        title: "",
        price: "",
        brand: "",
        sku: "",
        category: "",
        description: "",
        rating: "5",
    });

    // Заполнение формы при редактировании
    useEffect(() => {
        if (editProduct && isOpen) {
            setFormData({
                title: editProduct.title || "",
                price: editProduct.price?.toString() || "",
                brand: editProduct.brand || "",
                sku: editProduct.sku || "",
                category: editProduct.category || "",
                description: "",
                rating: editProduct.rating?.toString() || "5",
            });
        } else if (isOpen) {
            // Сброс формы при открытии для нового продукта
            setFormData({
                title: "",
                price: "",
                brand: "",
                sku: "",
                category: "",
                description: "",
                rating: "5",
            });
        }
    }, [editProduct, isOpen]);

    const [errors, setErrors] = useState<
        Partial<Record<keyof AddProductFormData, string>>
    >({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toasts, setToasts] = useState<
        Array<{ id: string; message: string; type: "success" | "error" }>
    >([]);

    const addToast = (message: string, type: "success" | "error") => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof AddProductFormData, string>> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Введите наименование";
        }

        if (!formData.price.trim()) {
            newErrors.price = "Введите цену";
        } else if (
            isNaN(Number(formData.price)) ||
            Number(formData.price) <= 0
        ) {
            newErrors.price = "Цена должна быть положительным числом";
        }

        if (!formData.brand.trim()) {
            newErrors.brand = "Введите вендора";
        }

        if (!formData.sku.trim()) {
            newErrors.sku = "Введите артикул";
        }

        if (
            formData.rating &&
            (Number(formData.rating) < 0 || Number(formData.rating) > 5)
        ) {
            newErrors.rating = "Рейтинг должен быть от 0 до 5";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange =
        (field: keyof AddProductFormData) => (value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            if (errors[field as keyof typeof errors]) {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Call onAdd callback if provided
        if (onAdd) {
            onAdd(formData);
        }

        // Show success toast
        addToast("Товар добавлен", "success");

        // Reset form and close modal
        setFormData({
            title: "",
            price: "",
            brand: "",
            sku: "",
            category: "",
            description: "",
            rating: "5",
        });
        setIsSubmitting(false);

        // Close modal after a short delay to show the toast
        setTimeout(() => {
            onClose();
        }, 500);
    };

    const handleCancel = () => {
        setFormData({
            title: "",
            price: "",
            brand: "",
            sku: "",
            category: "",
            description: "",
            rating: "5",
        });
        setErrors({});
        onClose();
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleCancel}
                title="Добавить товар"
                size="medium"
            >
                <form onSubmit={handleSubmit} className="add-product-form">
                    <div className="form-row form-row--double">
                        <Input
                            label="Наименование *"
                            type="text"
                            value={formData.title}
                            onChange={handleChange("title")}
                            placeholder="Введите наименование"
                            error={errors.title}
                            disabled={isSubmitting}
                        />
                        <Input
                            label="Цена *"
                            type="number"
                            value={formData.price}
                            onChange={handleChange("price")}
                            placeholder="Введите цену"
                            error={errors.price}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-row form-row--double">
                        <Input
                            label="Вендор *"
                            type="text"
                            value={formData.brand}
                            onChange={handleChange("brand")}
                            placeholder="Введите вендора"
                            error={errors.brand}
                            disabled={isSubmitting}
                        />
                        <Input
                            label="Артикул *"
                            type="text"
                            value={formData.sku}
                            onChange={handleChange("sku")}
                            placeholder="Введите артикул"
                            error={errors.sku}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-row">
                        <Input
                            label="Категория"
                            type="text"
                            value={formData.category}
                            onChange={handleChange("category")}
                            placeholder="Введите категорию"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-row">
                        <label className="form-label">
                            <span className="label-text">Описание</span>
                            <textarea
                                className="form-textarea"
                                value={formData.description}
                                onChange={(e) =>
                                    handleChange("description")(e.target.value)
                                }
                                placeholder="Введите описание"
                                rows={4}
                                disabled={isSubmitting}
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <Input
                            label="Рейтинг (0-5)"
                            type="number"
                            value={formData.rating}
                            onChange={handleChange("rating")}
                            placeholder="Введите рейтинг"
                            error={errors.rating}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            size="medium"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="medium"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Добавление..." : "Добавить"}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ToastContainer
                toasts={toasts}
                onRemove={removeToast}
                position="top-right"
            />
        </>
    );
};
