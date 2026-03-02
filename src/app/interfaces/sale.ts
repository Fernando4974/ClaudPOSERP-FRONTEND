import { User } from "./user";

export interface newSale{
  total: number,
  status?: string,
  items: itemSale[]
}
export interface itemSale{
  productId:string,
  quantity:number,
  priceAtSale: number
}
export interface GetAllSales {
  id: string,
  total: number,
  status: string,
  createdAt: string,
  userId: string,
}
export interface Sale {
  id: string;
  total: number;
  iva: number;
  status: 'pending' | 'completed' | 'cancelled'; // Tipado literal para mayor seguridad
  createdAt: Date | string; // Date si lo transformas en el front, string si viene directo de JSON

  // Relaciones cruciales según tu Entity
  items: SaleItem[];
  user?: User;
}
export interface SaleItem {
  id: string;
  title:string;
  productId: string;
  quantity: number;
  priceAtSale: number;
  // Opcional: si quieres calcular el subtotal en el front
  subtotal?: number;
}
