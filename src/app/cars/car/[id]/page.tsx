import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import AddToCartButton from "@/components/addToCartButton";
import styles from "@/styles/carId.module.css";

interface CarPageProps {
  params: { id: string };
}

export default async function CarPage({ params }: CarPageProps) {
  const car = await prisma.catalogueVoiture.findUnique({
    where: {
      id: params.id,
    },
  });
  
  return (
    <>
      <Navbar/>
      {!car ? (
        <div className={styles.notFound}>
          <h2>Voiture non trouvée</h2>
          <p>Nous n'avons pas pu trouver la voiture que vous recherchez.</p>
        </div>
      ) : (
        <div className={styles.carDetailContainer}>
          <header className={styles.carHeader}>
            <h1 className={styles.carTitle}>{car.marque} - {car.modele}</h1>
          </header>

          <div className={styles.carLayout}>
            {car.imgVoiture && (
              <div className={styles.carImageContainer}>
                <img
                  className={styles.carImage}
                  src={`/images/car-image/${car.id}/image.png`}
                  alt={`${car.marque} ${car.modele}`}
                />
              </div>
            )}

            <div className={styles.carSpecs}>
              <div className={styles.carSpecItem}>
                <span className={styles.specLabel}>Prix</span>
                <span className={`${styles.specValue} ${styles.priceHighlight}`}>
                  {car.prix?.toLocaleString()}€
                </span>
              </div>

              <div className={styles.carSpecItem}>
                <span className={styles.specLabel}>Kilométrage</span>
                <span className={styles.specValue}>
                  {car.kilometrage?.toLocaleString("fr-FR")} km
                </span>
              </div>

              <div className={styles.carSpecItem}>
                <span className={styles.specLabel}>Année</span>
                <span className={styles.specValue}>{car.annee}</span>
              </div>

              <div className={styles.carSpecItem}>
                <span className={styles.specLabel}>Carburant</span>
                <span className={styles.specValue}>{car.carburant}</span>
              </div>

              <div className={styles.carSpecItem}>
                <span className={styles.specLabel}>Transmission</span>
                <span className={styles.specValue}>{car.Transmission}</span>
              </div>

              <div className={styles.carSpecItem}>       
                <span className={styles.specLabel}>Puissance</span>
                <span className={styles.specValue}>{car.Puissance} CV</span>
              </div>

              <div className={styles.carSpecItemAlt}>
                <AddToCartButton carId={car.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}