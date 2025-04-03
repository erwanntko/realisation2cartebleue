"use server";

import { cookies } from "next/headers";

export async function isSalor() {

    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
        return false;
    }
    
    const sessionData = JSON.parse(sessionCookie);
    return  sessionData.isSalor;
}
