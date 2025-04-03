'use server';

import { prisma } from '@/lib/db';

export async function deletePanier(userId: number) {
  await prisma.Panier.deleteMany({
    where: {
      userId: userId,
    }
  })
};