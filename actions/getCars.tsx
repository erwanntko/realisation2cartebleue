'use server';

import { prisma } from '@/lib/db';
import { getUserId } from '../actions/getUserId';

export async function getCars() {
    const userId = await getUserId();
    const cars = await prisma.catalogueVoiture.findMany({
        where: { byUserId: userId },
        orderBy: { marque: 'asc' }
    });

    return { success: true, cars }; 
}