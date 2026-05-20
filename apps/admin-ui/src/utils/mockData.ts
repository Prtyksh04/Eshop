export const mockAdminUser = {
  id: "mock-admin-id",
  name: "Admin User",
  email: "admin@vendora.com",
  role: "admin",
};

export const mockUsers = {
  users: Array.from({ length: 10 }).map((_, i) => ({
    id: `user-${i}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: "user",
    createdAt: new Date().toISOString(),
  })),
  totalPages: 1,
};

export const mockProducts = {
  products: Array.from({ length: 10 }).map((_, i) => ({
    id: `prod-${i}`,
    name: `Mock Product ${i + 1}`,
    description: "A great product",
    price: 99.99,
    discountPrice: 89.99,
    stock: 50,
    category: "Electronics",
    images: [{ url: "https://ik.imagekit.io/pratyaksh/products/watch.png?updatedAt=1748449614783" }],
    shop: { name: "Mock Shop" },
    slug: `mock-product-${i}`,
    createdAt: new Date().toISOString(),
  })),
  totalPages: 1,
};

export const mockEvents = {
  events: [],
  totalPages: 1,
};

export const mockOrders = {
  orders: Array.from({ length: 5 }).map((_, i) => ({
    id: `order-${i}`,
    user: { name: `User ${i}` },
    totalPrice: 150.00,
    status: "Delivered",
    createdAt: new Date().toISOString(),
  })),
  totalPages: 1,
};

export const mockOrderDetails = {
    id: "order-1",
    user: { name: "User 1", email: "user1@example.com" },
    totalPrice: 150.00,
    status: "Delivered",
    shippingAddress: { city: "New York", country: "USA", street: "123 Main St", zip: "10001" },
    cartItems: [
        { product: { name: "Mock Product 1", images: [{ url: "https://ik.imagekit.io/pratyaksh/products/watch.png?updatedAt=1748449614783" }] }, quantity: 1, price: 150.00 }
    ],
    createdAt: new Date().toISOString(),
}

export const adminMockRouter = (url: string) => {
  if (url.includes("/api/logged-in-admin")) return { user: mockAdminUser };
  if (url.includes("/get-all-users")) return mockUsers;
  if (url.includes("/get-all-products")) return mockProducts;
  if (url.includes("/get-all-events")) return mockEvents;
  if (url.includes("/get-seller-orders") || url.includes("orders")) return mockOrders;
  if (url.includes("/get-order-details")) return mockOrderDetails;
  
  return { success: true };
};
