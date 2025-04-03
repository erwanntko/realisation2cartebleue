"use client";

import { useEffect, useState } from "react";
import { deletePanier } from "../../actions/deletePanier";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import styles from "@/styles/panier.module.css";

export default function PanierClient({ panier, userId }: PanierProps) {
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const totalPrice = panier.reduce((acc, item) => acc + item.prix, 0);
    setTotal(totalPrice);
  }, [panier]);

  const handlePurchaseClick = async () => {
    const result = await deletePanier(userId);
    redirect('/panier');
  };

  return (
    <div>
      <Navbar />
      <h1 className={styles.panier}>Récapitulatif de votre panier</h1>
      <section className={styles.resume}>
        <div className={styles.reservationDetails}>
          {panier.length > 0 ? (
            <>
              {panier.map((item, index) => (
                <p key={index}>
                  <span>{item.marque} - {item.modele} ({item.annee})</span>
                  <span>{(item.prix?.toLocaleString("fr-FR"))}€</span>
                </p>
              ))}
              <p className={styles.totalPrice}>
                <span>Total</span>
                <strong>{new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(total)} €</strong>
              </p>
            </>
          ) : (
            <p>Votre panier est vide.</p>
          )}
        </div>
        
        {panier.length > 0 && (
          <button className={styles.purchaseCart} onClick={handlePurchaseClick}>
            Valider le panier
          </button>
        )}
      </section>
    </div>
  );
}