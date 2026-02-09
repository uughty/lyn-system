import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const menuItems = await prisma.menuItem.findMany();
  console.log(menuItems);
}

main();
