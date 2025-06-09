import { NextFunction, Request, Response } from "express";
import prisma from "@packages/libs/prisma";
import { AuthError, NotFoundError, ValidationError } from "@packages/error-handler";
import { imagekit } from "@packages/libs/imageKit";
import { Prisma } from "@prisma/client";




// get product categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await prisma.site_config.findFirst();

        if (!config) {
            return res.status(404).json({ message: 'Categories not found' });
        }

        return res.status(200).json({
            categories: config.categories,
            subCategories: config.subCategories,
        })

    } catch (error) {
        return next(error);
    }
}

//create discout code
export const createDiscountCodes = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { public_name, discountType, discountValue, discountCode } = req.body;

        const isDiscountCodeExists = await prisma.discount_codes.findUnique({ where: { discountCode } });
        if (isDiscountCodeExists) {
            return next(new ValidationError("Discount code already available please use a different code!"));
        }

        const discount_code = await prisma.discount_codes.create({
            data: {
                public_name,
                discountType,
                discountValue: parseFloat(discountValue),
                discountCode,
                sellerId: req.seller.id,
            }
        })

        res.status(201).json({
            success: true,
            discount_code,
        })

    } catch (error) {
        return next(error);
    }
}

//get discount codes
export const getDiscountCodes = async (req: any, res: Response, next: NextFunction) => {
    try {
        const discount_codes = await prisma.discount_codes.findMany({
            where: {
                sellerId: req.seller.id,
            }
        });

        res.status(200).json({
            success: true,
            discount_codes,
        })

    } catch (error) {
        return next(error);
    }
}

//delete discount code
export const deleteDiscountCode = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const sellerId = req.seller?.id;

        const discountCode = await prisma.discount_codes.findUnique({ where: { id }, select: { id: true, sellerId: true } });

        if (!discountCode) {
            return next(new NotFoundError("Discount code not found!"));
        }

        if (discountCode.sellerId !== sellerId) {
            return next(new ValidationError("Unauthorized access!"));
        }

        await prisma.discount_codes.delete({ where: { id } });

        res.status(200).json({
            message: "Discount code deleted successfully!",
        })

    } catch (error) {
        return next(error);
    }
}

// upload product Image
export const uploadProductImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileName } = req.body;

        const response = await imagekit.upload({
            file: fileName,
            fileName: `product-${Date.now()}.jpg`,
            folder: '/products',
        })

        res.status(201).json({
            file_url: response.url,
            fileId: response.fileId,
        })

    } catch (error) {
        next(error);
    }
}

// delete product image
export const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileId } = req.body;

        if (!fileId) {
            return next(new ValidationError("File ID is required!"));
        }

        await imagekit.deleteFile(fileId);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully!",
        })

    } catch (error) {
        next(error);
    }
}

// create product 
export const createProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { title,
            short_description,
            detailed_description,
            warranty,
            custom_specifications,
            slug,
            tags,
            cash_on_delivery,
            brand,
            video_url,
            category,
            colors = [],
            sizes = [],
            discountCodes,
            stock,
            sale_price,
            regular_price,
            SubCategory,
            customProperties = {},
            images = []
        } = req.body

        console.log("req.body", req.body);

        if (!title || !slug || !short_description || !regular_price || !sale_price || !category || !SubCategory || !images || !tags || !stock) {
            return next(new ValidationError("All fields are required!"));
        }

        if (!req.seller.id) {
            return next(new AuthError("Only seller can create products!"));
        }

        const slugChecking = await prisma.products.findUnique({
            where: { slug }
        });

        if (slugChecking) {
            return next(new ValidationError("Slug already exist! Please use a different slug!"));
        }

        const newProduct = await prisma.products.create({
            data: {
                title,
                short_description,
                detailed_description,
                warranty,
                cashOnDelivery: cash_on_delivery,
                slug,
                shopId: req.seller?.Shop?.id!,
                tags: Array.isArray(tags) ? tags : tags.split(","),
                brand,
                video_url,
                category,
                subCategory: SubCategory,
                colors: colors || [],
                discount_codes: discountCodes ? discountCodes.map((codeId: string) => codeId) : [],
                sizes: sizes || [],
                stock: parseInt(stock),
                sale_price: parseFloat(sale_price),
                regular_price: parseFloat(regular_price),
                custom_properties: customProperties || {},
                custom_specifications: custom_specifications || {},
                images: {
                    create: images.filter((img: any) => img && img.fileId && img.file_url).map((img: any) => ({
                        file_id: img.fileId,
                        url: img.file_url
                    }))
                }
            },
            include: { images: true }
        });

        res.status(201).json({
            success: true,
            newProduct,
        })

    } catch (error) {
        next(error);
    }
}

//get logged in seller products
export const getShopProducts = async (req: any, res: Response, next: NextFunction) => {
    try {

        const product = await prisma.products.findMany({
            where: {
                shopId: req?.seller?.Shop?.id,
            },
            include: {
                images: true
            }
        });

        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        return next(error);
    }
}

//delete product 
export const deleteProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const sellerId = req?.seller?.Shop?.id

        const product = await prisma.products.findUnique({
            where: { id: productId },
            select: { id: true, shopId: true, isDeleted: true }
        })

        if (!product) {
            return next(new ValidationError("Product not found"));
        }

        if (product.shopId !== sellerId) {
            return next(new ValidationError("Unauthorized action"));
        }

        if (product.isDeleted) {
            return next(new ValidationError("Product is already deleted"));
        }

        const deleteProduct = await prisma.products.update({
            where: { id: productId },
            data: {
                isDeleted: true,
                deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            }
        })

        return res.status(200).json({
            message: "Product is scheduled for deletion in 24 hours. Your can restore it within this time",
            deletedAt: deleteProduct.deletedAt

        })

    } catch (error) {
        return next(error);
    }
}

// Restore Product
export const restoreProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const sellerId = req?.seller?.Shop?.id

        const product = await prisma.products.findUnique({
            where: { id: productId },
            select: { id: true, shopId: true, isDeleted: true }
        })

        if (!product) {
            return next(new ValidationError("Product not found"));
        }

        if (product.shopId !== sellerId) {
            return next(new ValidationError("Unauthorized action"));
        }

        if (!product.isDeleted) {
            return res.status(400).json({ message: "Product is not in deleted state" });
        }

        await prisma.products.update({
            where: { id: productId },
            data: {
                isDeleted: false,
                deletedAt: null,
            }
        })

        return res.status(200).json({
            message: "Product successfully Restored",

        })

    } catch (error) {
        return next(error);
    }
}

// get All products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const type = req.query.type;

        const baseFilter = {
            // OR: [{
            //     starting_date: null,
            // }, {
            //     ending_date: null
            // }]
        }

        const orderBy: Prisma.productsOrderByWithRelationInput =
            type === 'latest'
                ? { createdAt: "desc" as Prisma.SortOrder }
                : { totalSales: "desc" as Prisma.SortOrder };

        const [products, total, top10Products] = await Promise.all([
            prisma.products.findMany({
                skip,
                take: limit,
                include: {
                    images: true,
                    Shop: true,
                },
                where: baseFilter,
                orderBy: {
                    totalSales: 'desc'
                }
            }),
            prisma.products.count({ where: baseFilter }),
            prisma.products.findMany({
                take: 10,
                where: baseFilter,
                orderBy,
            })
        ])

        console.log("Products", products);

        res.status(200).json({
            products,
            top10By: type === 'latest' ? 'latest' : 'topSales',
            top10Products,
            total,
            currentPage: page,
            totalPage: Math.ceil(total / limit),
        })

    } catch (error) {
        return next(error);
    }
}