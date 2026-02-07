import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // -----------------------------
  // 1. Seed Categories
  // -----------------------------
  const categories = [
    { name: "African" },
    { name: "Continental" },
    { name: "Beverages" },
    { name: "Desserts" },
  ];

  for (const category of categories) {
    const exists = await prisma.category.findFirst({
      where: { name: category.name },
    });

    if (!exists) {
      await prisma.category.create({ data: category });
    }
  }

  console.log("✅ Categories seeded successfully");

  // -----------------------------
  // 2. Seed MenuItems
  // -----------------------------
  const menuItems = [
    {
      name: "Heritage Jollof Risotto",
      description: "Smoked jollof rice with African spices",
      price: 42,
      categoryName: "African",
      imageUrl: "../public/images/jallof.jpg",
    },
    {
      name: "Continental Grilled Chicken",
      description: "Served with mashed potatoes and vegetables",
      price: 55,
      categoryName: "Continental",
      imageUrl: "../public/images/grilled_chicken.jpg",
    },
    {
      name: "Chocolate Fudge Cake",
      description: "Rich chocolate dessert",
      price: 20,
      categoryName: "Desserts",
      imageUrl: "../public/images/chocolate_cake.jpg",
    },
    {
      name: "Mango Smoothie",
      description: "Fresh mango blended smoothie",
      price: 12,
      categoryName: "Beverages",
      imageUrl: "../public/images/mango_smoothie.jpg",
    },
  ];

  for (const item of menuItems) {
    const category = await prisma.category.findFirst({
      where: { name: item.categoryName },
    });

    if (!category) {
      throw new Error(`Category "${item.categoryName}" not found`);
    }

    const exists = await prisma.menuItem.findFirst({
      where: { name: item.name },
    });

    if (!exists) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          categoryId: category.id,
        },
      });
    }
  }

  console.log("✅ MenuItems seeded successfully");

  // -----------------------------
  // 3. Seed Admin User
  // -----------------------------
  const adminEmail = "admin@swahili-coastal.com";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await prisma.user.create({
      data: {
        name: "Site Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        phone: "+1 8167451565",
      },
    });
  }

  console.log("✅ Admin user seeded successfully");

  // -----------------------------
  // 4. Seed Customer Users
  // -----------------------------
  const customers = [
    {
      name: "John Doe",
      email: "john@example.com",
      password: "Customer@123",
      phone: "+1 5551234567",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: "Customer@123",
      phone: "+1 5559876543",
    },
  ];

  for (const customer of customers) {
    const exists = await prisma.user.findFirst({
      where: { email: customer.email },
    });

    if (!exists) {
      const hashedPassword = await bcrypt.hash(customer.password, 10);

      await prisma.user.create({
        data: {
          name: customer.name,
          email: customer.email,
          password: hashedPassword,
          role: "CUSTOMER",
          phone: customer.phone,
        },
      });
    }
  }

  console.log("✅ Customer users seeded successfully");

  // -----------------------------
  // 5. Seed Orders + OrderItems + Payments
  // -----------------------------
  const allCustomers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
  });

  const allMenuItems = await prisma.menuItem.findMany();

  if (allMenuItems.length < 2) {
    throw new Error("Not enough menu items to seed orders");
  }

  for (const customer of allCustomers) {
    // Prevent duplicate orders on reseed
    const existingOrder = await prisma.order.findFirst({
      where: { userId: customer.id },
    });

    if (existingOrder) continue;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        totalPrice: 0,
        status: "PENDING",
        deliveryAddress: "123 Main Street, Kansas City, MO",
      },
    });

    // Add items
    let orderTotal = 0;
    const selectedItems = allMenuItems.slice(0, 2);

    for (const item of selectedItems) {
      const quantity = 1;
      const lineTotal = item.price * quantity;
      orderTotal += lineTotal;

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          menuItemId: item.id,
          quantity,
          price: item.price,
        },
      });
    }

    // Update total
    await prisma.order.update({
      where: { id: order.id },
      data: { totalPrice: orderTotal },
    });

    // Create payment
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: orderTotal,
        paymentProvider: "M-Pesa",
        transactionRef: `TXN-${Date.now()}-${customer.id.slice(0, 6)}`,
        status: "SUCCESS",
        paidAt: new Date(),
      },
    });
  }

  console.log("✅ Orders, OrderItems, and Payments seeded successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
