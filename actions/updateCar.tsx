"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs";

export async function updateCar(formData: FormData) {

    // Récupérer les données du formulaire
    const marque = formData.get("marque") as string;
    const modele = formData.get("modele") as string;
    const prix = parseFloat(formData.get("prix") as string);
    const kilometrage = parseInt(formData.get("kilometrage") as string);
    const annee = parseInt(formData.get("annee") as string);
    const carburant = formData.get("carburant") as string;
    const transmission = formData.get("Transmission") as string;
    const puissance = parseInt(formData.get("Puissance") as string);
    const carImage = formData.get("carImage") as File;
    const carId = formData.get("id") as string;

    let imgUpdated = false;

    // Vérifier si une nouvelle image a été fournie
    if (carImage && carImage.size > 0) {
        
        // Vérifier que le type est bien du png
        if (carImage.type !== "image/png") {
            return { success: false, error: "Seuls les fichiers PNG sont acceptés" };
        }
    
        // Vérifier la taille du fichier (5MB max)
        if (carImage.size > 5 * 1024 * 1024) {
            return { success: false, error: "L'image ne doit pas dépasser 5MB" };
        }

        // Sauvegarder l'image
        fs.writeFileSync(path.join(process.cwd(), "public", "images", "car-image", carId, "image.png"), Buffer.from(await carImage.arrayBuffer()));
                
        imgUpdated = true;
    }

    // Mettre à jour les données de la voiture dans la base de données
    await prisma.catalogueVoiture.update({
        where: {
            id: carId
        },
        data: {
            marque,
            modele,
            prix,
            kilometrage,
            annee,
            carburant,
            Transmission: transmission,
            Puissance: puissance
        }
    });

    return { success: true };
}