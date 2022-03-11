import React, { Component } from 'react';

import { INftContract } from '../../utils';

import { IProfile } from '../../types/IProfile';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';

export const initialNftContractState = {
  nftContract: null,
};
export const NftContractContext = React.createContext<INftContractContext>(initialNftContractState as INftContractContext);

export interface INftContractContext {
  nftContract: INftContract | null;
  getProfile: (account_id: string) => Promise<IProfile>;
  set_profile: ({ profile: { bio, name, image, email, accountId } }) => Promise<IProfile>;
  sale_create: (token_id: string, sale_type: number, price?: string, start_date?: any, end_date?: any) => Promise<any>;
  sale_remove: (token_id: string) => Promise<any>;
  like_artist_account: (account_id: string) => Promise<any>;
  token_set_like: (token_id: string) => Promise<any>;
  follow_artist_account: (account_id: string) => Promise<any>;
  view_artist_account: (account_id: string) => Promise<any>;
  nft_tokens_by_filter: (catalog: string | null, page_index: number, page_size: number, sort: number, is_for_sale?: boolean | null, owner_id?: string | null, is_liked?: boolean | null, is_followed?: boolean | null, is_active_bid?: boolean) => Promise<Array<any>>;
  sale_history: (token_id: string, page_index: number, page_size: number) => Promise<Array<any>>;
  token_owners_history: (token_id: string, page_index: number, page_size: number) => Promise<Array<any>>;
  nft_tokens_catalogs: () => Promise<Array<any>>;
  nft_token_get: (token_id: string) => Promise<ITokenResponseItem>;
  sale_get: (token_id: string, with_bids: boolean) => Promise<any>;
  authors_by_filter: (parameter: number, is_reverse: boolean, page_index: number, page_size: number) => Promise<Array<any>>;
  followed_authors_for_account: (account_id: string, page_index: number, page_size: number) => Promise<Array<any>>;
  nft_mint: (data: any) => Promise<any>;
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

  public authors_by_filter = (parameter: number, is_reverse: boolean, page_index: number, page_size: number) => {
    return this.props.nftContract.authors_by_filter({
      parameter,
      is_reverse,
      page_index,
      page_size,
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

  public sale_history = (token_id: string, page_index: number, page_size: number) => {
    return this.props.nftContract.sale_history({ token_id, page_index, page_size, asked_account_id: this.myAccountId });
  };

  public token_owners_history = (token_id: string, page_index: number, page_size: number) => {
    return this.props.nftContract.token_owners_history({
      token_id,
      page_index,
      page_size,
      asked_account_id: this.myAccountId,
    });
  };

  public nft_tokens_by_filter = (catalog: string | null, page_index: number, page_size: number, sort: number, is_for_sale?: boolean | null, owner_id?: string | null, is_liked?: boolean | null, is_followed?: boolean | null, is_active_bid?: boolean) => {
    return this.props.nftContract.nft_tokens_by_filter({
      catalog,
      page_index,
      page_size,
      sort,
      account_id: this.myAccountId,
      is_for_sale,
      owner_id,
      is_liked,
      is_active_bid,
    });
  };

  public nft_tokens_catalogs = () => {
    return this.props.nftContract.nft_tokens_catalogs();
  };

  public nft_token_get = (token_id: string) => {
    return this.props.nftContract.nft_token_get({ token_id });
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
    });
  };

  public set_profile = async ({ profile: { name, bio, image, email, accountId } }) => {
    return this.nftContract.set_profile({
      profile: {
        bio: bio,
        name: name,
        image: image,
        email: email,
        account_id: accountId,
      },
    });
  };

  public like_artist_account = async (accountId: string) => {
    return this.nftContract.like_artist_account({
      account_id: accountId,
    });
  };

  public token_set_like = async (token_id: string) => {
    return this.nftContract.token_set_like({ token_id: token_id });
  };

  public sale_create = async (token_id: string, sale_type: number, price?: string, start_date?: any, end_date?: any) => {
    return this.nftContract.sale_create({
      token_id: token_id,
      sale_type: sale_type,
      ...(price && { price }),
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
    });
  };

  public sale_remove = async (token_id: string) => {
    return this.nftContract.sale_remove({
      token_id: token_id,
    });
  };

  public view_artist_account = async (accountId: string) => {
    return this.nftContract.view_artist_account({
      account_id: accountId,
    });
  };

  public follow_artist_account = async (accountId: string) => {
    return this.nftContract.follow_artist_account({
      account_id: accountId,
    });
  };

  public render() {
    const value: INftContractContext = {
      nftContract: this.nftContract,
      nft_tokens_by_filter: this.nft_tokens_by_filter,
      nft_tokens_catalogs: this.nft_tokens_catalogs,
      nft_token_get: this.nft_token_get,
      sale_get: this.sale_get,
      sale_history: this.sale_history,
      token_owners_history: this.token_owners_history,
      authors_by_filter: this.authors_by_filter,
      followed_authors_for_account: this.followed_authors_for_account,
      getProfile: this.getProfile,
      set_profile: this.set_profile,
      like_artist_account: this.like_artist_account,
      token_set_like: this.token_set_like,
      sale_create: this.sale_create,
      sale_remove: this.sale_remove,
      nft_mint: this.nft_mint,
      follow_artist_account: this.follow_artist_account,
      view_artist_account: this.view_artist_account,
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
