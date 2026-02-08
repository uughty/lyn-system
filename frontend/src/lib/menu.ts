// src/lib/menu.ts
import { Category, MenuItem } from "@/types/menu";

// Fetch all menu items from backend
export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const res = await fetch("http://localhost:3001/menu-items", {
      cache: "no-store", // optional: ensures fresh data
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch menu items: ${res.status} ${res.statusText}`);
    }

    const data: MenuItem[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return []; // return empty array to prevent frontend crash
  }
}

// Fetch all categories from backend
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch("http://localhost:3001/categories", {
      cache: "no-store", // optional
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
    }

    const data: Category[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // return empty array to prevent frontend crash
  }
}
