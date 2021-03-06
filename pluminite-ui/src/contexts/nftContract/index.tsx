import React, { Component } from 'react';

import { INftContract } from '../../utils';

import { IProfile } from '../../types/IProfile';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';
import { APP } from '../../constants';
import { ITokensByFilter, UserTypes } from '../../types/NearAPI';

export const initialNftContractState = {
  nftContract: null,
};
export const NftContractContext = React.createContext<INftContractContext>(initialNftContractState as INftContractContext);

export interface INftContractContext {
  nftContract: INftContract | null;
  getProfile: (account_id: string) => Promise<IProfile>;
  set_profile: ({ profile: { bio, name, image, email, accountId, cover_image } }) => Promise<IProfile>;
  sale_create: (token_id: string, sale_type: number, price?: string, start_date?: any, end_date?: any) => Promise<any>;
  sale_offer: (token_id: string, time: any, offer?: string, price?: string) => Promise<any>;
  sale_remove: (token_id: string) => Promise<any>;
  sale_set_is_closed: (token_id: string, is_closed: boolean) => Promise<any>;
  sale_auction_init_transfer: (token_id: string, time: number, price?: string) => Promise<any>;
  like_artist_account: (account_id: string) => Promise<any>;
  minting_accounts_add: (account_id: string) => Promise<any>;
  minting_accounts_remove: (account_id: string) => Promise<any>;
  token_set_like: (token_id: string) => Promise<any>;
  collection_set_like: (collection_id: string) => Promise<any>;
  collection_set_view: (collection_id: string) => Promise<any>;
  follow_artist_account: (account_id: string) => Promise<any>;
  view_artist_account: (account_id: string) => Promise<any>;
  token_set_view: (token_id: string) => Promise<any>;
  nft_tokens_by_filter: (data: ITokensByFilter) => Promise<Array<any>>;
  my_purchases: (catalog: string | null, page_index: number, page_size: number, account_id: string) => Promise<any>;
  sale_history_by_token: (token_id: string, page_index: number, page_size: number) => Promise<Array<any>>;
  token_owners_history: (token_id: string, page_index: number, page_size: number) => Promise<Array<any>>;
  nft_tokens_catalogs: () => Promise<Array<any>>;
  nft_token_get: (token_id: string) => Promise<ITokenResponseItem>;
  sale_get: (token_id: string, with_bids: boolean) => Promise<any>;
  authors_by_filter: (parameter: string, is_reverse: boolean, page_index: number, page_size: number, user_type: UserTypes) => Promise<Array<any>>;
  followed_authors_for_account: (account_id: string, page_index: number, page_size: number) => Promise<Array<any>>;
  nft_mint: (data: any) => Promise<any>;
  collection_add: (name: string, description: string, profile_photo: string, cover_photo: string, time: number) => Promise<any>;
  collection_update: (collection_id: string, name?: string, description?: string, profile_photo?: string, cover_photo?: string) => Promise<any>;
  collection_token_add: (collection_id: string, token_id: string) => Promise<any>;
  collection_token_remove: (token_id: string) => Promise<any>;
  nft_collections: (page_index: number, page_size: number, account_id: string | null, with_tokens: boolean, collection_owner: string | null) => Promise<any>;
  collection_get: (collection_id: string, account_id: string | null, with_tokens: boolean) => Promise<any>;
  profile_get_stat: (account_id: string) => Promise<any>;
  collection_get_stat: (collection_id: string) => Promise<any>;
}

interface INftContractContextProviderProps {
  nftContract: INftContract;
  children: any;
}

export class NftContractContextProvider extends Component<INftContractContextProviderProps> implements INftContractContext {
  constructor(props: INftContractContextProviderProps) {
    super(props);
  }

  public get myAccountId() {
    return this.nftContract.account.accountId || '';
  }

  public authors_by_filter = (parameter: string, is_reverse: boolean, page_index: number, page_size: number, user_type: UserTypes) => {
    return this.props.nftContract.authors_by_filter({
      parameter,
      is_reverse,
      page_index,
      page_size,
      user_type,
      asked_account_id: this.myAccountId,
    });
  };

  public followed_authors_for_account = (account_id: string, page_index: number, page_size: number) => {
    return this.props.nftContract.followed_authors_for_account({
      account_id,
      page_index,
      page_size,
    });
  };

  public sale_history_by_token = (token_id: string, page_index: number, page_size: number) => {
    return this.props.nftContract.sale_history_by_token({ token_id, page_index, page_size, asked_account_id: this.myAccountId });
  };

  public token_owners_history = (token_id: string, page_index: number, page_size: number) => {
    return this.props.nftContract.token_owners_history({
      token_id,
      page_index,
      page_size,
      asked_account_id: this.myAccountId,
    });
  };

  public nft_tokens_by_filter = (data: ITokensByFilter): Promise<Array<any>> => {
    return this.props.nftContract.nft_tokens_by_filter({
      catalog: 'Wine', // data.catalog
      page_index: data.page_index,
      page_size: data.page_size,
      sort: data.sort || 7,
      is_for_sale: data.is_for_sale || null,
      owner_id: data.owner_id || null,
      creator_id: data.creator_id || null,
      artist_id: data.artist_id || null,
      is_liked: data.is_liked || null,
      is_followed: data.is_followed || null,
      is_active_bid: data.is_active_bid || null,
      price_from: data.price_from || null,
      price_to: data.price_to || null,
      is_single: data.is_single || null,
      collection_id: data.collection_id === '' ? data.collection_id : null,
      brand: data.brand || null,
      style: data.style || null,
      year: data.year || null,
      bottle_size: data.bottle_size || null,
      sale_filter: data.sale_filter || null,
      account_id: this.myAccountId
    });
  };

  public my_purchases = (catalog: string | null, page_index: number, page_size: number, account_id: string) => {
    return this.props.nftContract.my_purchases({
      catalog,
      page_index,
      page_size,
      account_id: this.myAccountId,
    });
  };

  public nft_tokens_catalogs = () => {
    return this.props.nftContract.nft_tokens_catalogs();
  };

  public nft_token_get = (token_id: string) => {
    return this.props.nftContract.nft_token_get({ token_id, account_id: this.myAccountId });
  };

  public sale_get = (token_id: string, with_bids: boolean) => {
    return this.props.nftContract.sale_get({ token_id, with_bids, asked_account_id: this.myAccountId });
  };

  public get nftContract() {
    return this.props.nftContract;
  }

  public async getGem(id: string) {
    return this.nftContract.nft_token({ token_id: id });
  }

  public async getGems(fromIndex: number, limit: number) {
    this.nftContract.nft_tokens_from_end({
      from_index: fromIndex,
      limit,
    });
  }

  public async getGemsForOwner(accountId: string, fromIndex: number, limit: number) {
    return this.nftContract.nft_tokens_for_owner({
      account_id: accountId,
      from_index: fromIndex,
      limit: Number(limit),
    });
  }

  public getProfile = async (accountId: string) => {
    return this.nftContract.get_profile({
      account_id: accountId,
      asked_account_id: this.myAccountId || null
    });
  };

  public set_profile = async ({ profile: { name, bio, image, email, accountId, cover_image } }) => {
    return this.nftContract.set_profile({
      profile: {
        bio: bio,
        name: name,
        image: image,
        cover_image: cover_image,
        email: email,
        account_id: accountId,
      },
    }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };

  public collection_add = async (name: string, description: string, profile_photo: string, cover_photo: string, time: number) => {
    return this.nftContract.collection_add({
      name,
      description,
      profile_photo,
      cover_photo,
      time
    }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };

  public collection_update = async (collection_id: string, name?: string, description?: string, profile_photo?: string, cover_photo?: string) => {
    return this.nftContract.collection_update({
      collection_id,
      name,
      description,
      profile_photo,
      cover_photo,
    }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };

  public collection_token_add = async (collection_id: string, token_id: string) => {
    return this.nftContract.collection_token_add({
      collection_id,
      token_id,
    }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };

  public collection_token_remove = async (token_id: string) => {
    return this.nftContract.collection_token_remove({
      token_id,
    }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };

  public nft_collections = async (page_index: number, page_size: number, account_id: string | null, with_tokens: boolean, collection_owner: string | null) => {
    return this.nftContract.nft_collections({
      page_index,
      page_size,
      account_id,
      with_tokens,
      collection_owner
    });
  };

  public profile_get_stat = async (account_id: string) => {
    return this.nftContract.profile_get_stat({
      account_id
    });
  };

  public collection_get_stat = async (collection_id: string) => {
    return this.nftContract.collection_get_stat({
      collection_id
    });
  };

  public collection_get = async (collection_id: string, account_id: string | null, with_tokens: boolean) => {
    return this.nftContract.collection_get({
      collection_id,
      account_id,
      with_tokens,
    });
  };

  public like_artist_account = async (accountId: string) => {
    return this.nftContract.like_artist_account({
      account_id: accountId,
    }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };

  public minting_accounts_add = async (accountId: string) => {
    return this.nftContract.minting_accounts_add({
      account_id: accountId,
    });
  };

  public minting_accounts_remove = async (accountId: string) => {
    return this.nftContract.minting_accounts_remove({
      account_id: accountId,
    });
  };

  public token_set_like = async (token_id: string) => {
    return this.nftContract.token_set_like({ token_id: token_id }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };

  public collection_set_like = async (collection_id: string) => {
    return this.nftContract.collection_set_like({ collection_id: collection_id }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };

  public collection_set_view = async (collection_id: string) => {
    return this.nftContract.collection_set_view({ collection_id: collection_id });
  };

  public sale_create = async (token_id: string, sale_type: number, price?: string, start_date?: any, end_date?: any) => {
    return this.nftContract.sale_create({
      token_id: token_id,
      sale_type: sale_type,
      ...(price && { price }),
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
    }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };
  public sale_offer = async (token_id: string, time: any, offer?: string, price?: string) => {
    return this.nftContract.sale_offer({
      token_id: token_id,
      time: time,
      ...(offer && { offer }),
    }, APP.PREPAID_GAS_LIMIT, price);
  };

  public sale_remove = async (token_id: string) => {
    return this.nftContract.sale_remove({
      token_id: token_id,
    }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };

  public sale_set_is_closed = async (token_id: string, is_closed: boolean) => {
    return this.nftContract.sale_set_is_closed({
      token_id,
      is_closed,
    }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };

  public sale_auction_init_transfer = async (token_id: string, time: number, price?: string) => {
    return this.nftContract.sale_auction_init_transfer({
      token_id,
      time,
    }, APP.PREPAID_GAS_LIMIT, price);
  };

  public view_artist_account = async (accountId: string) => {
    return this.nftContract.view_artist_account({
      account_id: accountId,
    });
  };

  public token_set_view = async (token_id: string) => {
    return this.nftContract.token_set_view({
      token_id: token_id,
    });
  };

  public follow_artist_account = async (accountId: string) => {
    return this.nftContract.follow_artist_account({
      account_id: accountId,
    }, APP.PREPAID_GAS_LIMIT, APP.DEFAULT_DEPOSIT);
  };

  public render() {
    const value: INftContractContext = {
      nftContract: this.nftContract,
      nft_tokens_by_filter: this.nft_tokens_by_filter,
      my_purchases: this.my_purchases,
      nft_tokens_catalogs: this.nft_tokens_catalogs,
      nft_token_get: this.nft_token_get,
      sale_get: this.sale_get,
      sale_history_by_token: this.sale_history_by_token,
      token_owners_history: this.token_owners_history,
      authors_by_filter: this.authors_by_filter,
      followed_authors_for_account: this.followed_authors_for_account,
      getProfile: this.getProfile,
      set_profile: this.set_profile,
      collection_add: this.collection_add,
      collection_update: this.collection_update,
      collection_token_add: this.collection_token_add,
      collection_token_remove: this.collection_token_remove,
      nft_collections: this.nft_collections,
      collection_get: this.collection_get,
      profile_get_stat: this.profile_get_stat,
      collection_get_stat: this.collection_get_stat,
      like_artist_account: this.like_artist_account,
      minting_accounts_add: this.minting_accounts_add,
      minting_accounts_remove: this.minting_accounts_remove,
      token_set_like: this.token_set_like,
      collection_set_like: this.collection_set_like,
      collection_set_view: this.collection_set_view,
      sale_create: this.sale_create,
      sale_offer: this.sale_offer,
      sale_remove: this.sale_remove,
      sale_set_is_closed: this.sale_set_is_closed,
      sale_auction_init_transfer: this.sale_auction_init_transfer,
      nft_mint: this.nft_mint,
      follow_artist_account: this.follow_artist_account,
      view_artist_account: this.view_artist_account,
      token_set_view: this.token_set_view,
      //getGem: this.getGem,
      //getGems: this.getGems,
      //getGemsForOwner,
      //getGemsForCreator,
      //getGemsBatch,
      //nftTransfer,
      //listForSale,
      //setProfile,
      //getSupplyForCreator,
      //getIsFreeMintAvailable,
    };

    return (
      <NftContractContext.Provider value={value}>
        {this.props.children}
      </NftContractContext.Provider>
    );
  }

  nft_mint = (data: any) => {
    return this.nftContract.nft_mint(data);
  };
}

/*
export const NftContractContextProvider = ({ nftContract, children }: { nftContract: Contract, children: any }) => {
  const getGem = useCallback(async (id) => nftContract.nft_token({ token_id: id }), [nftContract]);

  const getGems = useCallback(
    async (fromIndex, limit) =>
      nftContract.nft_tokens_from_end({
        from_index: fromIndex,
        limit,
      }),
    [nftContract]
  );

  const getGemsForOwner = useCallback(
    async (accountId, fromIndex, limit) => {
      return nftContract.nft_tokens_for_owner({
        account_id: accountId,
        from_index: fromIndex,
        limit: Number(limit),
      });
    },
    [nftContract]
  );

  const getGemsForCreator = useCallback(
    async (accountId, fromIndex, limit) => {
      return nftContract.nft_tokens_for_creator({
        account_id: accountId,
        from_index: fromIndex,
        limit: Number(limit),
      });
    },
    [nftContract]
  );

  const getIsFreeMintAvailable = useCallback(
    async (accountId) => {
      return nftContract.is_free_mint_available({
        account_id: accountId,
      });
    },
    [nftContract]
  );

  const getGemsBatch = useCallback(
    async (tokenIds) =>
      nftContract.nft_tokens_batch({
        token_ids: tokenIds,
      }),
    [nftContract]
  );

  const nftTransfer = useCallback(
    async (nftId, receiverId) => {
      localStorage.setItem(STORAGE.PAYABLE_METHOD_ITEM_NAME, PAYABLE_METHODS.NFT_TRANSFER);

      await nftContract.nft_transfer(
        {
          token_id: nftId,
          receiver_id: receiverId
        },
        APP.PREPAID_GAS_LIMIT,
        1
      );
    },
    [nftContract]
  );

  const listForSale = useCallback(
    async (nftId, price) => {
      localStorage.setItem(STORAGE.PAYABLE_METHOD_ITEM_NAME, PAYABLE_METHODS.LIST);

      await nftContract.nft_approve(
        {
          token_id: nftId,
          account_id: getMarketContractName(nftContract.contractId),
          msg: JSON.stringify({
            sale_conditions: [
              {
                price,
                ft_token_id: 'near',
              },
            ],
          }),
        },
        APP.PREPAID_GAS_LIMIT,
        1
      );
    },
    [nftContract]
  );

  const setProfile = useCallback(
    async (profile) => {
      await nftContract.account.signAndSendTransaction(nftContract.contractId, [
        transactions.functionCall(
          'set_profile',
          Buffer.from(
            JSON.stringify({
              profile,
            })
          ),
          APP.PREPAID_GAS_LIMIT_HALF
        ),
      ]);
    },
    [nftContract]
  );

  const getProfile = useCallback(
    async (account_id) =>
      nftContract.get_profile({
        account_id,
      }),
    [nftContract]
  );

  const getSupplyForCreator = useCallback(
    async (account_id) =>
      nftContract.nft_supply_for_creator({
        account_id,
      }),
    [nftContract]
  );

  const value = {
    nftContract,
    getGem,
    getGems,
    getGemsForOwner,
    getGemsForCreator,
    getGemsBatch,
    nftTransfer,
    listForSale,
    setProfile,
    getProfile,
    getSupplyForCreator,
    getIsFreeMintAvailable,
  };

  return <NftContractContext.Provider value={value}>{children}</NftContractContext.Provider>;
};

NftContractContextProvider.propTypes = {
  nftContract: PropTypes.shape({
    account: PropTypes.shape({
      signAndSendTransaction: PropTypes.func,
    }),
    contractId: PropTypes.string.isRequired,
    nft_token: PropTypes.func.isRequired,
    nft_tokens: PropTypes.func.isRequired,
    nft_tokens_for_owner: PropTypes.func.isRequired,
    nft_tokens_for_creator: PropTypes.func.isRequired,
    nft_tokens_batch: PropTypes.func.isRequired,
    nft_mint: PropTypes.func.isRequired,
    nft_approve: PropTypes.func.isRequired,
    get_profile: PropTypes.func.isRequired,
    nft_supply_for_creator: PropTypes.func.isRequired,
    is_free_mint_available: PropTypes.func.isRequired,
    nft_transfer: PropTypes.func.isRequired,
  }).isRequired,
  children: ReactChildrenTypeRequired,
};
*/
