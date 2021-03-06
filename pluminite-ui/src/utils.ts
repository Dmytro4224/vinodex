import * as nearAPI from 'near-api-js';
import { getConfig } from './config';
import { NftMethods } from './constants/contractMethods';
import { ICurrentUser } from './types/ICurrentUser';
import { IProfile } from './types/IProfile';
import { ITokenResponseItem } from './types/ITokenResponseItem';
import { IAuthorResponseItem } from './types/IAuthorResponseItem';
import { ITokensByFilter, UserTypes } from './types/NearAPI';

const nearConfig = getConfig(process.env.NODE_ENV || 'production');

export type INftContract = nearAPI.Contract & {
    nft_token: ({ token_id }: { token_id: string }) => void;
    nft_tokens_from_end: ({ from_index, limit }: { from_index: number, limit: number }) => void;
    nft_tokens_for_owner: ({ account_id, from_index, limit }: { account_id: string, from_index: number, limit: number }) => void;
    get_profile: ({ account_id, asked_account_id }: { account_id: string, asked_account_id: string | null }) => Promise<IProfile>;
    set_profile: ({ profile: { bio, name, image, email, account_id, cover_image } }: { profile: { bio: string, name: string, image: string, email: string, account_id: string, cover_image: string } }, gas: string, deposit?: string) => Promise<IProfile>;
    authors_by_filter: ({ parameter, is_reverse, page_index, page_size, user_type, asked_account_id }: { parameter: string, is_reverse: boolean, page_index: number, page_size: number, user_type: UserTypes, asked_account_id:string }) => Promise<Array<IAuthorResponseItem>>;
    followed_authors_for_account: ({ account_id, page_index, page_size }: { account_id: string, page_index: number, page_size: number }) => Promise<Array<IAuthorResponseItem>>;
    nft_tokens_by_filter: (data: ITokensByFilter) => Promise<Array<ITokenResponseItem>>;
    my_purchases: ({ catalog, page_index, page_size, account_id}: { catalog: string | null, page_index: number, page_size: number, account_id: string}) => Promise<any>;
    sale_history_by_token: ({ token_id, page_index, page_size, asked_account_id}: { token_id: string, page_index: number, page_size: number, asked_account_id: string }) => Promise<Array<any>>;
    token_owners_history: ({ token_id, page_index, page_size, asked_account_id}: { token_id: string, page_index: number, page_size: number, asked_account_id: string }) => Promise<Array<any>>;
    nft_token_get: ({ token_id, account_id }: { token_id: string, account_id: string}) => Promise<ITokenResponseItem>;
    sale_get: ({ token_id, with_bids, asked_account_id }: { token_id: string, with_bids: boolean, asked_account_id: string}) => Promise<any>;
    sale_create: ({ token_id, sale_type, price, start_date, end_date }: { token_id: string, sale_type: number, price?: string, start_date?: any, end_date?: any }, gas: string, deposit?: string) => Promise<any>;
    sale_offer: ({ token_id, time, offer} : { token_id: string, time: any, offer?: string}, gas: string, price?: string) => Promise<any>;
  sale_remove: ({ token_id }: { token_id: string }, gas: string, deposit?: string) => Promise<any>;
  sale_set_is_closed: ({ token_id, is_closed }: { token_id: string, is_closed: boolean }, gas: string, deposit?: string) => Promise<any>;
    sale_auction_init_transfer: ({ token_id, time }: { token_id: string, time: number }, gas: string, price?: string) => Promise<any>;
    nft_tokens_catalogs: () => Promise<Array<any>>;
  like_artist_account: ({ account_id }: { account_id: string }, gas: string, deposit?: string) => Promise<any>;
    minting_accounts_add: ({account_id }: {account_id: string}) => Promise<any>;
    minting_accounts_remove: ({account_id }: {account_id: string}) => Promise<any>;
  token_set_like: ({ token_id }: { token_id: string }, gas: string, deposit?: string) => Promise<any>;
  collection_set_like: ({ collection_id }: { collection_id: string }, gas: string, deposit?: string) => Promise<any>;
    collection_set_view: ({ collection_id }: { collection_id: string }) => Promise<any>;
    nft_mint: (data: any) => Promise<any>;
  follow_artist_account: ({ account_id }: { account_id: string }, gas: string, deposit?: string) => Promise<any>;
  view_artist_account: ({ account_id }: { account_id: string }) => Promise<any>;
  token_set_view: ({ token_id }: { token_id: string }) => Promise<any>;
  collection_add: ({ name, description, profile_photo, cover_photo, time }: { name: string, description: string, profile_photo: string, cover_photo: string, time: number }, gas: string, deposit?: string) => Promise<any>;
  collection_update: ({ collection_id, name, description, profile_photo, cover_photo }: { collection_id: string, name?: string, description?: string, profile_photo?: string, cover_photo?: string }, gas: string, deposit?: string) => Promise<any>;
    nft_collections: ({ page_index, page_size, account_id, with_tokens, collection_owner }: { page_index: number, page_size: number, account_id: string | null, with_tokens: boolean, collection_owner: string | null }) => Promise<any>;
    collection_get: ({collection_id, account_id, with_tokens } : { collection_id: string, account_id: string | null, with_tokens: boolean }) => Promise<any>;
  collection_token_add: ({ collection_id, token_id }: { collection_id: string, token_id: string }, gas: string, deposit?: string) => Promise<any>;
  collection_token_remove: ({ token_id }: { token_id: string }, gas: string, deposit?: string) => Promise<any>;
    profile_get_stat: ({ account_id } : { account_id: string }) => Promise<any>;
    collection_get_stat: ({ collection_id } : { collection_id: string }) => Promise<any>;
};

// Initialize contract & set global variables
export async function initContracts() {
  // Initialize connection to the NEAR testnet
  const near = await nearAPI.connect({ deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() }, ...nearConfig });

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  const walletConnection = new nearAPI.WalletConnection(near, null);

  // Load in account data
  let currentUser: ICurrentUser | null = null;
  if (walletConnection.getAccountId()) {
    currentUser = {
      walletAddress: null,
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  //console.log('currentUser is: ', currentUser);

  // Initializing our contract APIs by contract name and configuration
  const nftContract = await new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: [...NftMethods.viewMethods],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: [...NftMethods.changeMethods],
      // Sender is the account ID to initialize transactions.
      //@ts-ignore
      sender: walletConnection.getAccountId(),
    }
  ) as INftContract;

  return {
    nftContract,
    currentUser,
    nearConfig,
    walletConnection,
    near,
  };
}
