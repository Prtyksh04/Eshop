export const mockUser = {
  id: "mock-user-id",
  name: "Mock User",
  email: "user@vendora.com",
  role: "user",
  phone_number: "+1234567890",
  avatar: { url: "https://ik.imagekit.io/pratyaksh/products/watch.png?updatedAt=1748449614783" },
};

export const mockProducts = {
  products: Array.from({ length: 12 }).map((_, i) => ({
    id: `user-prod-${i}`,
    name: `Vendora Product ${i + 1}`,
    description: "Premium user product for showcase",
    price: 59.99,
    discountPrice: 49.99,
    stock: 50,
    category: "Gadgets",
    images: [{ url: "https://ik.imagekit.io/pratyaksh/products/watch.png?updatedAt=1748449614783" }],
    slug: `vendora-product-${i}`,
    shop: { name: "Vendora Flagship" },
    ratings: 4.5,
    reviews: [],
    createdAt: new Date().toISOString(),
  })),
  totalPages: 1,
};

export const mockProductDetails = {
  product: {
    id: `user-prod-1`,
    name: `Vendora Product 1`,
    description: "Premium user product for showcase. This is a very detailed description of the product.",
    price: 59.99,
    discountPrice: 49.99,
    stock: 50,
    category: "Gadgets",
    images: [{ url: "https://ik.imagekit.io/pratyaksh/products/watch.png?updatedAt=1748449614783" }],
    slug: `vendora-product-1`,
    shop: { name: "Vendora Flagship", avatar: { url: "https://ik.imagekit.io/pratyaksh/products/watch.png?updatedAt=1748449614783" } },
    ratings: 4.5,
    reviews: [],
    createdAt: new Date().toISOString(),
  }
};

export const mockWishlist = {
  wishlist: [
    { id: "wish-1", product: mockProducts.products[0] },
    { id: "wish-2", product: mockProducts.products[1] },
  ],
  totalPages: 1,
};

export const mockCart = {
  cart: [
    { id: "cart-1", product: mockProducts.products[0], quantity: 1 },
  ],
  totalPrice: 49.99,
};

export const userMockRouter = (url: string) => {
  if (url.includes("/api/logged-in-user")) return { user: mockUser };
  if (url.includes("/get-all-products") || url.includes("products")) return mockProducts;
  if (url.includes("/get-product")) return mockProductDetails;
  if (url.includes("/wishlist")) return mockWishlist;
  if (url.includes("/cart")) return mockCart;
  if (url.includes("/top-shops")) return { shops: [] };
  if (url.includes("/get-all-events")) return { events: [] };
  
  return { success: true };
};
