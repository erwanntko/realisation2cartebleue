import { prisma } from "@/lib/db";
import { CatalogueVoiture } from "@prisma/client";
import Link from "next/link";
import styles from '@/styles/carContainer.module.css';

export default async function CarContainer() {
    try {
        const cars: CatalogueVoiture[] = await prisma.catalogueVoiture.findMany();
        return (
            <div className={styles.carContainer}>
                {cars.map((car) => (
                    <Link key={car.id} href={`/cars/car/${car.id}`}>
                        <div className={styles.main} key={car.id}>
                            <h1 className={styles.marqueModele}>{car.marque} - {car.modele}</h1>
                            <div className={styles.imgContainer}>
                                <img src={`/images/car-image/${car.id}/image.png`} alt={`${car.marque} ${car.modele}`} />
                            </div>
                            <div className={styles.detailsContainer}>
                                <span className={styles.anee}>{car.annee}</span>
                                <span className={styles.prix}>{car.prix?.toLocaleString("fr-FR")}€</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    } catch (error) {
        console.error("Erreur lors de la récupération des voitures :", error);
        return <div className={styles.error}>Erreur de récupération des données</div>;
    }
}
