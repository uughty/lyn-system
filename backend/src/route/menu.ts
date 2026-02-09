// File: src/routes/menu.ts
import prisma from "../lib/prisma";

export async function getMenuItems() {
  return await prisma.menuItem.findMany({
    where: { isAvailable: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategories() {
  return await prisma.category.findMany({
    include: { menuItems: true },
    orderBy: { name: "asc" },
  });
}
