///Метадані токенів
use crate::*;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct NFTMetadata {
    pub spec: String,              // required, essentially a version like "nft-1.0.0"
    pub name: String,              // required, ex. "Mosaics"
    pub symbol: String,            // required, ex. "MOSIAC"
    pub icon: Option<String>,      // Data URL
    pub base_uri: Option<String>, // Centralized gateway known to have reliable access to decentralized storage assets referenced by `reference` or `media` URLs
    pub reference: Option<String>, // URL to a JSON file with more info
    pub reference_hash: Option<Base64VecU8>, // Base64-encoded sha256 hash of JSON from reference field. Required if `reference` is included.
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenMetadata {
    pub title: Option<String>, // ex. "Arch Nemesis: Mail Carrier" or "Parcel #5055"
    pub description: Option<String>, // free-form description
    pub media: Option<String>, // URL to associated media, preferably to decentralized, content-addressed storage
    pub media_hash: Option<Base64VecU8>, // Base64-encoded sha256 hash of content referenced by the `media` field. Required if `media` is included.
    pub copies: Option<U64>, // number of copies of this set of metadata in existence when token was minted.
    pub issued_at: Option<u128>, // utc timestamp datetime when token was issued or minted
    pub expires_at: Option<u128>, // utc timestamp datetime when token expires
    pub starts_at: Option<u128>, // utc timestamp datetime when token starts being valid
    pub updated_at: Option<u128>, // utc timestamp datetime when token was last updated
    pub sold_at: Option<u128>, // utc timestamp datetime when token was sold
    pub extra: Option<String>, // anything extra the NFT wants to store on-chain. Can be stringified JSON.
    pub reference: Option<String>, // URL to an off-chain JSON file with more info.
    pub reference_hash: Option<Base64VecU8>, // Base64-encoded sha256 hash of JSON from reference field. Required if `reference` is included.
    pub views_count: u64, //кількість переглядів
    pub likes_count: u64, //кількість вподобань
    pub price: u128 // ціна токена
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TestMeta
{
    pub title: String,
    pub description: Option<String>
}

pub trait NonFungibleTokenMetadata {
    fn nft_metadata(&self) -> NFTMetadata;
}

#[near_bindgen]
impl NonFungibleTokenMetadata for Contract {
    fn nft_metadata(&self) -> NFTMetadata {
        self.metadata.get().unwrap()
    }
}

//Керуючий елемент для вподобань та переглядів токенів
#[near_bindgen]
impl Contract {
    pub fn token_setLike(&mut self, token_id: TokenId)
    {
        assert!(
            self.tokens_by_id.get(&token_id).is_none(),
            "token_setLike: token not found"
        );

        let user_id = env::predecessor_account_id();

        let tokenLikes = self.tokens_users_likes.get(&token_id);

        if(tokenLikes.is_none())
        {
            let mut hashSet: HashSet<String> = HashSet::new();
            hashSet.insert(user_id);

            self.tokens_users_likes.insert(&token_id, &hashSet);
        }
        else
        {
            let mut unwrappedTokenLikes = tokenLikes.unwrap();

            if(unwrappedTokenLikes.contains(&user_id))
            {
                unwrappedTokenLikes.remove(&user_id);
            }
            else
            {
                unwrappedTokenLikes.insert(user_id);
            }
        }
    }

    pub fn token_setView(&mut self, token_id: TokenId)
    {
        assert!(
            self.tokens_by_id.get(&token_id).is_none(),
            "token_setView: token not found"
        );

        let user_id = env::predecessor_account_id();

        let tokenViews = self.tokens_users_views.get(&token_id);

        if(tokenViews.is_none())
        {
            let mut hashSet: HashSet<String> = HashSet::new();
            hashSet.insert(user_id);

            self.tokens_users_views.insert(&token_id, &hashSet);
        }
        else
        {
            let mut unwrappedTokenViews = tokenViews.unwrap();

            if(!unwrappedTokenViews.contains(&user_id))
            {
                unwrappedTokenViews.insert(user_id);
            }
        }
    }
}