"use server";
import { prisma } from "@/lib/db";
import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function validateUser(username: string, password: string) {
    // Recherche de l'utilisateur en base de données
    const user = await prisma.user.findUnique({
        where: { username }
    });

    if (!user) {
        return { error: "Utilisateur non trouvé." };
    }

    // Vérification du mot de passe en utilisant bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return { error: "Mot de passe incorrect." };
    }

    // Création du token de session avec des informations utilisateur
    const sessionData = JSON.stringify({
        userId: user.id,
        username: user.username,
        isSalor: user.isSalor,
    });

    // Stockage du token dans un cookie
    cookies().set("session", sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 // 1 jour
    });

    // Redirection vers la page d'accueil après la connexion
    redirect("/");
}
