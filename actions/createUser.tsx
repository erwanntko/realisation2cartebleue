'use server';

import bcrypt from 'bcrypt';
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createUser(
    username: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phoneNumber: string, 
    address: string, 
    postalCode: string,
    isSalor: boolean
) {

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            address,
            postalCode,
            isSalor
        }
    });

    // Création du cookie session pour l'utilisateur
    const sessionData = JSON.stringify({
        userId: user.id,
        username: user.username,
        isSalor: false
    });

    // Stockage du cookie
    cookies().set("session", sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 365 // 1 an
    });
    
    redirect("/");
}
