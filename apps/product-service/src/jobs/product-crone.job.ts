import prisma from "@packages/libs/prisma";

import cron from 'node-cron';

cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();


        // Delete product where `deletedAt` is older than 24 hours

        await prisma.products.deleteMany({
            where: {
                isDeleted: true,
                deletedAt: { lte: now }

            }
        })

    } catch (error) {
        console.log(error);
    }
})