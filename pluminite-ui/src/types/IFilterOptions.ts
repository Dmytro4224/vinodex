export interface IFilterOptions {
  brand: string | null;
  style: string | null;
  year: string | null;
  bottle_size: string | null;
  sort?: number | null,
  type?: boolean | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  collection_id?: string | null;
}
