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
