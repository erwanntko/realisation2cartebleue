import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import PanierClient from '@/components/panier';

export default async function Panier() {

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value || '';

  if (!sessionCookie) {
    redirect('/compte');
  }
  else {

    const prisma = new PrismaClient();
    const sessionData = JSON.parse(sessionCookie);
    const userId = sessionData.userId;;
    const panierItems = await prisma.panier.findMany({
      where: {
        userId: userId,
      },
      include: {
        voiture: true,
      },
    });

    const panierFormatted = panierItems.map((item) => ({
      marque: item.voiture.marque,
      modele: item.voiture.modele,
      prix: item.voiture.prix,
      annee: item.voiture.annee,
    }));

    return <PanierClient panier={panierFormatted} userId={userId}/>;
  }
}