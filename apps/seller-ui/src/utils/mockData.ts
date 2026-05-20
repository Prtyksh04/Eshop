export const mockSellerUser = {
  id: "mock-seller-id",
  name: "Mock Seller",
  email: "seller@vendora.com",
  role: "seller",
  shopId: "mock-shop-id",
  Shop: {
    id: "mock-shop-id",
    name: "Vendora Official Shop",
    description: "Premium items",
    avatar: { url: "https://ik.imagekit.io/pratyaksh/products/watch.png?updatedAt=1748449614783" },
  }
};

export const mockProducts = {
  products: Array.from({ length: 8 }).map((_, i) => ({
    id: `seller-prod-${i}`,
    name: `Seller Product ${i + 1}`,
    description: "High quality seller product",
    price: 49.99,
    discountPrice: 39.99,
    stock: 100,
    category: "Fashion",
    images: [{ url: "https://ik.imagekit.io/pratyaksh/products/watch.png?updatedAt=1748449614783" }],
    slug: `seller-product-${i}`,
    createdAt: new Date().toISOString(),
  })),
  totalPages: 1,
};

export const mockOrders = {
  orders: Array.from({ length: 5 }).map((_, i) => ({
    id: `seller-order-${i}`,
    user: { name: `Customer ${i + 1}`, email: `customer${i+1}@example.com` },
    totalPrice: 120.00,
    status: "Processing",
    createdAt: new Date().toISOString(),
  })),
  totalPages: 1,
};

export const mockDiscountCodes = {
  discountCodes: [
    { id: "code-1", code: "SAVE10", discountPercentage: 10, isActive: true },
    { id: "code-2", code: "SUMMER20", discountPercentage: 20, isActive: true }
  ],
  totalPages: 1
}

export const sellerMockRouter = (url: string) => {
  if (url.includes("/api/logged-in-seller")) return { seller: mockSellerUser };
  if (url.includes("/get-all-products") || url.includes("products")) return mockProducts;
  if (url.includes("/get-seller-orders") || url.includes("orders")) return mockOrders;
  if (url.includes("/discount-codes")) return mockDiscountCodes;
  
  return { success: true };
};
