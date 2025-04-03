"use client";

import { useState, useTransition } from "react";
import { addToCart } from "../../actions/addToCart";
import styles from "@/styles/carId.module.css";

export default function AddToCartButton({ carId }: { carId: number }) {
    const [added, setAdded] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const handleAddToCart = () => {
        startTransition(async () => {
            const result = await addToCart(carId);
            if (result.success) {
                setAdded(true);
                setErrorMessage(null);
            } else {
                setErrorMessage(result.message || "Une erreur s'est produite");
            }
        });
    };

    return (
        <button onClick={handleAddToCart} className={styles.addToCartBtn} disabled={added || isPending}>
            {isPending ? "Ajout..." : added ? "Ajouté !" : errorMessage || "Ajouter au panier !"}
        </button>
    );
}
