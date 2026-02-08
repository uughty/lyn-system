export async function getMenuItems() {
  const res = await fetch("/api/menu"); // <--- relative path
  if (!res.ok) throw new Error("Failed to fetch menu items");
  return res.json();
}

export async function getCategories() {
  const res = await fetch("/api/categories"); // <--- relative path
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}
