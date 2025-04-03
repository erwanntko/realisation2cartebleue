"use server";

import Navbar from "@/components/navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import styles from '@/styles/compte.module.css';

// Fonction de déconnexion
export async function disconnect() {
    cookies().delete('session');
    redirect('/');
}

export default async function Compte() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
        redirect("/logister");
    }

    let firstName = "";
    let lastName = "";
    let phoneNumber = "";
    let address = "";
    let postalCode = "";

    let username = sessionCookie ? JSON.parse(sessionCookie.value).username : "";

    const user = await prisma.user.findUnique({
        where: { username }
    });

    if (user) {
        firstName = user.firstName;
        lastName = user.lastName;
        phoneNumber = user.phoneNumber;
        address = user.address;
        postalCode = user.postalCode;
    }
        

    return (
        <div>
            <Navbar />
            <section className={styles.background}>
                <div className={styles.divContainer}>
                    <h1 className={styles.title}>Informations de compte :</h1>
                    <table className={styles.tableContainer}>
                        <tbody>
                            <tr>
                                <th>Vos données</th>
                            </tr>
                            <tr>
                                <td>Username : {username}</td>
                            </tr>
                            <tr>
                                <td>Prénom : {firstName}</td>
                            </tr>
                            <tr>
                                <td>Nom : {lastName}</td>
                            </tr>
                            <tr>
                                <td>Téléphone : {phoneNumber}</td>
                            </tr>
                            <tr>
                                <td>Adresse : {address}</td>
                            </tr>
                            <tr>
                                <td>Code Postal : {postalCode}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className={styles.disconnectContainer}>
                    <form action={disconnect}>
                        <button type="submit" className={styles.roundButton}>Déconnexion</button>
                    </form>
                </div>
            </section>
        </div>
    );
}
