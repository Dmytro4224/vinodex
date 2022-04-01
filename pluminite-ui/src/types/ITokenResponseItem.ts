
export interface IMetaData{
  copies: string;
  description: string;
  expires_at: string;
  extra: any;
  issued_at: string;
  likes_count: number;
  media: string;
  media_hash: string;
  price: number;
  reference: any;
  reference_hash: string;
  sold_at: string;
  starts_at: string;
  title: string;
  updated_at: string;
  views_count: number;
  artist: string;
  year: string;
  style: string;
  specification: string;
  characteristics: string;
  bottle_size: string;
  percentage_for_artist: number;
  percentage_for_creator: number;
  percentage_for_vinodex: number;
  additional_photos: any;
}

export interface IRoyalty{

}

export interface ITokenResponseItem {
  approved_account_ids: Array<any>;
  metadata: IMetaData;
  owner_id: string;
  creator_id: string;
  royalty: any;
  token_id: string;
  token_type: string;
  is_liked: boolean;
  is_viewed: boolean;
  sale: any;
}
