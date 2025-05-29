import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initializeConfig = async () => {
    try {
        const exisitingConfig = await prisma.site_config.findFirst();

        if (!exisitingConfig) {
            await prisma.site_config.create({
                data: {
                    categories: [
                        'Electronics',
                        "Fashion",
                        'Home & Garden',
                        'Sports & Outdoors',
                    ],
                    subCategories : {
                        'Electronics': ['Mobile Phones', 'Laptops', 'Cameras'],
                        'Fashion': ['Men', 'Women', 'Accessories'],
                        'Home & Garden': ['Furniture', 'Kitchenware', 'Gardening Tools'],
                        'Sports & Outdoors': ['Fitness Equipment', 'Outdoor Gear', 'Sportswear']
                    }
                }
            })
        }

    } catch (error) {
        console.error('Error initializing site config:', error);
    }
}

export default initializeConfig;