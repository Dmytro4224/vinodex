
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
}

export interface IRoyalty{

}

export interface IAuthorResponseItem {
  bio: string;
  email: string;
  image: string;
  name: string;
}