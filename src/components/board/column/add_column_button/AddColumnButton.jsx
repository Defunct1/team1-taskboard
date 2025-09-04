import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "utils/firebase/firebase";
import Button from "../../../ui/button/Button";
import styles from "./AddColumnButton.module.css";

const AddColumnButton = ({ onColumnAdded }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [columnTitle, setColumnTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAddColumn = async () => {
        if (!columnTitle.trim()) return; // Виправлено "of" на "if"

        setIsLoading(true);
        try {
            // Додаємо нову колонку до Firestore
            const docRef = await addDoc(collection(db, "columns"), {
                title: columnTitle.trim(),
                createdAt: new Date(),
            });

            // Оновлюємо локальний стан (виправлено docRefid на docRef.id)
            onColumnAdded?.({ id: docRef.id, title: columnTitle.trim() });

            // Очищаємо форму
            setColumnTitle("");
            setIsAdding(false);
        } catch (error) { // Додано відсутні дужки та параметр error
            console.error("Помилка додавання колонки:", error);
            alert(`Помилка: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            {isAdding ? (
                <div className={styles.form}>
                    <input // Виправлено inputType на input
                        type="text"
                        value={columnTitle}
                        onChange={(e) => setColumnTitle(e.target.value)}
                        placeholder="Назва колонки"
                        className={styles.input}
                        autoFocus
                    />
                    <div className={styles.buttons}> {/* Виправлено button на buttons */}
                        <Button
                            onClick={handleAddColumn}
                            disabled={isLoading || !columnTitle.trim()}
                            isLoading={isLoading}
                        >
                            Додати
                        </Button>
                        <Button
                            onClick={() => setIsAdding(false)}
                            variant="secondary"
                        >
                            Скасувати
                        </Button>
                    </div>
                </div>
            ) : (
                <Button
                    onClick={() => setIsAdding(true)}
                    variant="ghost"
                    icon="plus"
                >
                    Додати колонку
                </Button>
            )}
        </div>
    );
};

export default AddColumnButton;