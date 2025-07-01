import { User } from "./user.model";

export interface Category{
    id: number,
    title: string,
    slug: string
}

export interface SubCategory{
    id: number,
    title: string,
    slug: string,
    type: string,
    category: Category,
    user: User
}

export class SubCategory {
  id: number = -1;
  title: string = '';
  slug: string = '';
  type: string = '';
  category!: Category;
  user!: User;
}