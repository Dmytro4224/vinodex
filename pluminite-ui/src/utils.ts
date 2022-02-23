import * as nearAPI from 'near-api-js';
import { getConfig } from './config';

import { NftMethods, MarketMethods } from './constants/contractMethods';
import { APP } from './constants';
import { ICurrentUser } from './types/ICurrentUser';
import { IProfile } from './types/IProfile';
import { ITokenResponseItem } from './types/ITokenResponseItem';
import { IAuthorResponseItem } from './types/IAuthorResponseItem';

const nearConfig = getConfig(process.env.NODE_ENV || 'production');

//export const getMarketContractName = (nftContractName: string) => `market.${nftContractName}`;
export const getMarketContractName = 'vinodexmarket.testnet';

export type INftContract = nearAPI.Contract & {
    nft_token: ({ token_id }: { token_id: string }) => void;
    nft_tokens_from_end: ({ from_index, limit }: { from_index: number, limit: number }) => void;
    nft_tokens_for_owner: ({ account_id, from_index, limit }: { account_id: string, from_index: number, limit: number }) => void;
    get_profile: ({ account_id }: { account_id: string }) => Promise<IProfile>;

    authors_by_filter: ({ parameter, is_reverse, page_index, page_size }: { parameter: number, is_reverse: boolean, page_index: number, page_size: number }) => Promise<Array<IAuthorResponseItem>>;
    nft_tokens_by_filter: ({ catalog, page_index, page_size, sort }: { catalog: string, page_index: number, page_size: number, sort: number }) => Promise<Array<ITokenResponseItem>>;
    nft_token_get: ({ token_id }: { token_id: string}) => Promise<ITokenResponseItem>;
    nft_tokens_catalogs: () => Promise<Array<any>>;
    like_artist_account: ({ accountId }: { accountId: string }) => Promise<any>;
};

export type IMarketContract = nearAPI.Contract & {
    get_sale: ({ nft_contract_token }: { nft_contract_token: string }) => void;
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

    console.log('currentUser is: ', currentUser);

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

    console.log('nftContract ', nftContract);


   // Initializing our contract APIs by contract name and configuration
    const marketContract = await new nearAPI.Contract(
        walletConnection.account(),
        getMarketContractName,
        {
            // View methods are read only. They don't modify the state, but usually return some value.
            viewMethods: [...MarketMethods.viewMethods],
            // Change methods can modify the state. But you don't receive the returned value when called.
            changeMethods: [...MarketMethods.changeMethods],
            // Sender is the account ID to initialize transactions.

            //@ts-ignore
            sender: walletConnection.getAccountId(),
        }
    ) as IMarketContract;

 
    console.log('marketContract is', marketContract);


    return {
        nftContract,
        marketContract,
        currentUser,
        nearConfig,
        walletConnection,
        near,
    };
}

export function logout() {
//@ts-ignore
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.

  //@ts-ignore
  window.walletConnection.requestSignIn(nearConfig.contractName, APP.NAME);
}
