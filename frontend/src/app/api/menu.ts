// frontend/src/api/menu.ts
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId?: string;
  category?: { name: string };
}

export interface Category {
  id: string;
  name: string;
}

const mockMenuItems: MenuItem[] = [
  { id: "1", name: "Pilau", description: "Spiced rice with coastal flavors", price: 850, imageUrl: "/pilau.jpg", categoryId: "rice" },
  { id: "2", name: "Biryani", description: "Chicken biryani with saffron", price: 950, categoryId: "rice" },
  { id: "3", name: "Samaki", description: "Grilled fish", price: 1200, categoryId: "fish" },
];

const mockCategories: Category[] = [
  { id: "rice", name: "Rice Dishes" },
  { id: "fish", name: "Seafood" },
  { id: "meat", name: "Meat" },
];

export async function getMenuItems(): Promise<MenuItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMenuItems;
}

export async function getCategories(): Promise<Category[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCategories;
}
