'use server'; 

import { prisma } from '@/lib/db';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { getUserId } from '../actions/getUserId';


export async function imagesSaver(formData: FormData) {

  // Extraire les données du formulaire
  const marque = formData.get('marque') as string;
  const modele = formData.get('modele') as string;
  const prix = Number(formData.get('prix'));
  const kilometrage = Number(formData.get('kilometrage'));
  const annee = Number(formData.get('annee'));
  const carburant = formData.get('carburant') as string;
  const transmission = formData.get('Transmission') as string;
  const puissance = Number(formData.get('Puissance'));
    
  // Requete temporaire
  const newCar = await prisma.catalogueVoiture.create({data: { 
    marque,
    modele,
    prix,
    kilometrage,
    annee,
    carburant,
    Transmission: transmission,
    Puissance: puissance,
    imgVoiture: null,
    user: { connect: { id: await getUserId() } } 
  }});
    
  // Récupération du formulaire, création du chemin, dossier et de l'image.
  const carImage = formData.get('carImage') as File;
  const imageDir = join(process.cwd(), 'public', 'images', 'car-image', newCar.id);
  await mkdir(imageDir);
  const imagePath = join(imageDir, 'image.png');
  await writeFile(imagePath, Buffer.from(await carImage.arrayBuffer()));
      
  // Mettre à jour le chemin de l'image dans la base de données
  await prisma.catalogueVoiture.update({
    where: { id: newCar.id },
    data: { imgVoiture: `public/images/car-image/${newCar.id}/image.png` }
  });

  return { success: true, car: newCar };
}