import { MyFile } from "../models/myfile.model";

export interface InterfaceProduct {
    id: number;
    name: string;
    price: number;
    description: string;
    productImage: MyFile;
    mainImage: MyFile;
    images: MyFile[];
}

export interface InterfaceProductToUpdate {
  id: number;
  name: string;
  description: string;
  price: number;
  productImage: MyFile;
  images: MyFile[];
  brand?: string;
  category?: string[];
  // ... autres champs
}