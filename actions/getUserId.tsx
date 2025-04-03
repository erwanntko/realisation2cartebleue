import { cookies } from 'next/headers';

export async function getUserId() {
    
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const sessionData = JSON.parse(sessionCookie);
    const userId = sessionData.userId;

    return userId;
}