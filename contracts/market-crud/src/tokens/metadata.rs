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
    pub media_hash: Option<String>, // Base64-encoded sha256 hash of content referenced by the `media` field. Required if `media` is included.
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
    pub price: u128, // ціна токена

    pub style: String, // стиль вина
    pub brand: String, // бренд
    pub year: String, // рік виробництва
    pub bottle_size: String, // об'єм плаяшки
    pub characteristics: String, //текст-табличка з характеристиками, буде штмл
    pub specification: String, // текст-табличка з характеристиками, буде штмл
    pub artist: AccountId, // це буде автор, тип: account_id 

    //далі вказуємо відсотки, шо кому і скільки будемо ділити при продажу, 0-100
    pub percentage_for_creator : u8,
    pub percentage_for_artist : u8,
    pub percentage_for_vinodex : u8,

    //Додаткові фото токену, media - головна фотка
    pub additional_photos: Vec<String>
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
    ///поставити лайк токену
    #[payable]
    pub fn token_set_like(&mut self, token_id: TokenId)
    {
        let user_id = env::predecessor_account_id();
        let likes_count: usize;
        
        match self.tokens_users_likes.get(&token_id) {
            Some(mut likes) => {

                if likes.contains(&user_id)
                {
                    likes.remove(&user_id);
                }
                else
                {
                    likes.insert(user_id);
                }

                likes_count = likes.len();

                self.tokens_users_likes.insert(&token_id, &likes);
            }
            None => {
                let mut hash_set: HashSet<String> = HashSet::new();
                hash_set.insert(user_id);

                likes_count = 1;

                self.tokens_users_likes.insert(&token_id, &hash_set);
            }
        }

        match self.my_tokens_likes.get(&env::predecessor_account_id())
        {
            Some (mut _my_liked_tokens) =>
            {
                if _my_liked_tokens.contains(&token_id)
                {
                    _my_liked_tokens.remove(&token_id);
                }
                else
                {
                    _my_liked_tokens.insert(token_id.clone());
                }
    
                self.my_tokens_likes.insert(&env::predecessor_account_id(), &_my_liked_tokens);
            },
            None =>
            {
                let mut hash_set: HashSet<String> = HashSet::new();
                hash_set.insert(token_id.clone());
                self.my_tokens_likes.insert(&env::predecessor_account_id(), &hash_set);
            }
        }

        ProfileStatCriterion::profile_stat_inc(
            &mut self.profiles_global_stat,
            &mut self.profiles_global_stat_sorted_vector,
            &env::predecessor_account_id(),
            ProfileStatCriterionEnum::TokenLikesCount,
            1,
            true);

        self.tokens_resort(token_id, 8, Some(likes_count as u128));
    }

    pub fn token_set_view(&mut self, token_id: TokenId)
    {
        let user_id = env::predecessor_account_id();
        let mut views_count: Option<u128> = None;

        match self.tokens_users_views.get(&token_id.clone()) 
        {
            Some(mut views) => 
            {
                if !views.contains(&user_id)
                {
                    views.insert(user_id);

                    views_count = Some(views.len() as u128);
                }

                self.tokens_users_views.insert(&token_id, &views);
            }
            None => 
            {
                let mut hash_set: HashSet<String> = HashSet::new();
                hash_set.insert(user_id);

                views_count = Some(1);

                self.tokens_users_views.insert(&token_id, &hash_set);
            }
        }

        ProfileStatCriterion::profile_stat_inc(
            &mut self.profiles_global_stat,
            &mut self.profiles_global_stat_sorted_vector,
            &self.creator_per_token.get(&token_id).unwrap(),
            ProfileStatCriterionEnum::TokenViewsCount,
            1,
            true);


        if views_count.is_some()
        {
            self.tokens_resort(token_id, 7, views_count);
        }
    }

}
