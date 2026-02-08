export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  isAvailable?: boolean;  // ✅ ADD THIS LINE
}

export interface Category {
  id: string;
  name: string;
}
