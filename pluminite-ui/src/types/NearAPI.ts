export interface ITokensByFilter {
  page_index: number;
  page_size: number;
  catalog?: string | null;
  sort?: number;
  is_for_sale?: boolean | null;
  owner_id?: string | null;
  creator_id?: string | null;
  artist_id?: string | null;
  is_liked?: boolean | null;
  is_followed?: boolean | null;
  is_active_bid?: boolean | null;
  price_from?: string | null;
  price_to?: string | null;
  is_single?: boolean | null;
  collection_id?: string | null;
  account_id?: string | null | undefined;
  brand?: string | null;
  style?: string | null;
  year?: string | null;
  bottle_size?: string | null;
  sale_filter?: SaleFilterTokens | null;
}

export enum SaleFilterTokens {
  notSale = 0,
  fix = 1,
  auction = 2,
  fixAndAuction = 3
}

export enum UserTypes {
  all = 0,
  artist = 1,
  creator = 2
}
