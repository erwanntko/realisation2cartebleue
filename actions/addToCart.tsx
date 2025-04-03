"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function addToCart(carId: number) {

    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session");
    

    if (!sessionCookie) {
        return { success: false, message: "La connexion est requise" };
    }

    const user = await prisma.user.findUnique({
        where: { username: JSON.parse(sessionCookie.value).username},
    });

    const existingEntry = await prisma.panier.findUnique({
        where: {
            userId_voitureId: { userId: user.id, voitureId: carId },
        },
    });

    if (existingEntry) {
        return { success: false, message: "Produit déjà ajouté au panier" };
    }

    await prisma.panier.create({
        data: { userId: user.id, voitureId: carId },
    });

    return { success: true };    
}