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

const orderIds = [
  '6650a2d8f1ab3f08c7d91a11',
  '6650a2d8f1ab3f08c7d91a12',
  '6650a2d8f1ab3f08c7d91a13',
  '6650a2d8f1ab3f08c7d91a14',
  '6650a2d8f1ab3f08c7d91a15',
];

const baseDate = new Date('2026-05-20T10:00:00.000Z').getTime();

export const mockOrders = {
  orders: orderIds.map((id, i) => {
    const items = [
      {
        productId: `prod-${i + 1}-a`,
        quantity: 1 + (i % 2),
        price: 1499 + i * 120,
        product: {
          title: `Premium Tee ${i + 1}`,
          images: [{ url: 'https://ik.imagekit.io/pratyaksh/products/watch.png?updatedAt=1748449614783' }],
        },
        selectedOptions: {
          color: i % 2 === 0 ? '#0f172a' : '#2563eb',
        },
      },
      {
        productId: `prod-${i + 1}-b`,
        quantity: 1,
        price: 899 + i * 80,
        product: {
          title: `Daily Essential ${i + 1}`,
          images: [{ url: 'https://ik.imagekit.io/pratyaksh/products/watch.png?updatedAt=1748449614783' }],
        },
        selectedOptions: {},
      },
    ];

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = i % 2 === 0 ? 150 : 0;
    const total = subtotal - discountAmount;

    return {
      id,
      user: {
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
      },
      status: i % 2 === 0 ? 'Paid' : 'Pending',
      deliveryStatus: ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'][Math.min(i, 4)],
      createdAt: new Date(baseDate - i * 86400000).toISOString(),
      totalPrice: total,
      total,
      discountAmount,
      couponCode: discountAmount > 0 ? { public_name: 'SAVE150' } : null,
      shippingAddress: {
        name: `Customer ${i + 1}`,
        street: `${120 + i}, MG Road`,
        city: 'Bengaluru',
        zip: `5600${i + 1}`,
        country: 'India',
      },
      items,
    };
  }),
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
