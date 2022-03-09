const NftMethods = {
  viewMethods: [
    "nft_token",
    "nft_tokens",
    "nft_tokens_from_end",
    "nft_tokens_for_owner",
    "nft_tokens_for_creator",
    "nft_tokens_batch",
    "nft_tokens_by_filter",
    "nft_tokens_catalogs",
    "nft_token_get",
    "sale_get",
    "sale_history",
    "authors_by_filter",
    "get_profile",
    "nft_supply_for_creator",
    "is_free_mint_available",
  ],
  changeMethods: [
    "nft_approve",
    "nft_mint",
    "set_profile",
    "nft_transfer",
    "like_artist_account",
    "follow_artist_account",
    "view_artist_account",
    "token_set_like",
  ],
};

export default NftMethods;
