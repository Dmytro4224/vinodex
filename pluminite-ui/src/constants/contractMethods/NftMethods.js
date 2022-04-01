const NftMethods = {
  viewMethods: [
    'nft_token',
    'nft_tokens',
    'nft_tokens_from_end',
    'nft_tokens_for_owner',
    'nft_tokens_for_creator',
    'nft_tokens_batch',
    'nft_tokens_by_filter',
    'my_purchases',
    'nft_tokens_catalogs',
    'nft_token_get',
    'sale_get',
    'sale_history_by_token',
    'token_owners_history',
    'authors_by_filter',
    'followed_authors_for_account',
    'get_profile',
    'nft_supply_for_creator',
    'is_free_mint_available',
    'nft_collections',
    'collection_get',
    'profile_get_stat',
    'collection_get_stat',
  ],
  changeMethods: [
    'nft_approve',
    'nft_mint',
    'set_profile',
    'minting_accounts_add',
    'minting_accounts_remove',
    'sale_create',
    'sale_offer',
    'sale_remove',
    'sale_set_is_closed',
    'sale_auction_init_transfer',
    'nft_transfer',
    'like_artist_account',
    'follow_artist_account',
    'view_artist_account',
    'token_set_view',
    'token_set_like',
    'collection_set_like',
    'collection_set_view',
    'collection_add',
    'collection_update',
    'collection_token_add',
    'collection_token_remove',
  ],
};

export default NftMethods;
