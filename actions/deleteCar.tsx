'use server';

import { prisma } from "@/lib/db";

export async function deleteCar(id) {
  await prisma.catalogueVoiture.delete({
      where: { id }
    });
}