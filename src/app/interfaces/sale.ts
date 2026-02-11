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
