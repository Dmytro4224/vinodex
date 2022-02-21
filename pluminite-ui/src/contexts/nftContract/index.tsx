import React, { Component } from 'react';
import * as nearAPI from 'near-api-js';

import { INftContract } from '../../utils';

import { IProfile } from '../../types/IProfile';

export const initialNftContractState = {
    nftContract: null
};
export const NftContractContext = React.createContext<INftContractContext>(initialNftContractState as INftContractContext);

export interface INftContractContext {
    nftContract: INftContract | null;
    getProfile: (accountId: string) => Promise<IProfile>;
    nft_tokens_by_filter: (catalog: string, page_index: number, page_size: number, sort: number) => Promise<Array<any>>;
}

interface INftContractContextProviderProps {
    nftContract: INftContract;
    children: any
}

export class NftContractContextProvider extends Component<INftContractContextProviderProps> implements INftContractContext {
    constructor(props: INftContractContextProviderProps) {
        super(props);
    }

    public nft_tokens_by_filter = (catalog: string, page_index: number, page_size: number, sort: number) => {
        return this.props.nftContract.nft_tokens_by_filter({ catalog, page_index, page_size, sort });
    }

    public get nftContract() {
        return this.props.nftContract;
    }

    public async getGem(id: string) {
        return this.nftContract.nft_token({ token_id: id });
    }

    public async getGems(fromIndex: number, limit: number) {
        this.nftContract.nft_tokens_from_end({
            from_index: fromIndex,
            limit
        });
    }

    public async getGemsForOwner(accountId: string, fromIndex: number, limit: number) {
        return this.nftContract.nft_tokens_for_owner({
            account_id: accountId,
            from_index: fromIndex,
            limit: Number(limit)
        });
    }

    public getProfile = async (accountId: string) => {
        return { name: 'user' };
        return this.nftContract.get_profile({
            account_id: accountId
        });
    }

    public render() {
        const value = {
            nftContract: this.nftContract,
            nft_tokens_by_filter: this.nft_tokens_by_filter,
            //getGem: this.getGem,
            //getGems: this.getGems,
            //getGemsForOwner,
            //getGemsForCreator,
            //getGemsBatch,
            //nftTransfer,
            //listForSale,
            //setProfile,
            getProfile: this.getProfile,
            //getSupplyForCreator,
            //getIsFreeMintAvailable,
        };

        return (
            <NftContractContext.Provider value={value}>
                {this.props.children}
            </NftContractContext.Provider>
        );
    }
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