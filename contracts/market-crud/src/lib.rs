use std::collections::HashMap;
use std::cmp::min;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, ValidAccountId, U64, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, CryptoHash, PanicOnDefault, Promise, StorageUsage,
};
use std::collections::HashSet;
use std::cmp::Ordering;

#[macro_use]
extern crate serde_derive;

use serde_json::Result;

use crate::internal::*;

#[path = "tokens/metadata.rs"]
mod metadata;
pub use crate::metadata::*;

#[path = "tokens/mint_contract.rs"]
mod mint_contract;
pub use crate::mint_contract::*;

#[path = "tokens/list_contract.rs"]
mod list_contract;
pub use crate::list_contract::*;


#[path = "tokens/token.rs"]
mod token;
pub use crate::token::*;
pub use crate::profile::*;
pub use crate::nft_core::*;

mod internal;
mod nft_core;

#[path = "profiles/profile_provider.rs"]
mod profile;

///тип токену
pub type TokenType = String;
//типи токенів
pub type TypeSupplyCaps = HashMap<TokenType, U64>;

pub const CONTRACT_ROYALTY_CAP: u32 = 1000;
pub const MINTER_ROYALTY_CAP: u32 = 9000;
///максимальна довжина імені користувача
pub const MAX_PROFILE_NAME_LENGTH: usize = 256;
///максимальна довжина опису профілю
pub const MAX_PROFILE_BIO_LENGTH: usize = 256;
///максимальна величина картинки
pub const MAX_PROFILE_IMAGE_LENGTH: usize = 256;

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    ///токени власника
    pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,
    ///токени автора
    pub tokens_per_creator: LookupMap<AccountId, UnorderedSet<TokenId>>,
    ///токени по ідентифікатру
    pub tokens_by_id: LookupMap<TokenId, Token>,
    ///метадані токену по ідентифікатору токена
    pub token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,
    ///власник
    pub owner_id: AccountId,

    //Вподобання токенів
    pub tokens_users_likes: LookupMap<TokenId, HashSet<AccountId>>,

    //Перегляд токенів
    pub tokens_users_views: LookupMap<TokenId, HashSet<AccountId>>,

    //Токени впорядковані за фільтром(key - тип фільтру, value - впорядкований ліст)

    //1 - Recently Listed
    //2 - Recently Created (Oldest цей самий масив)
    //3 - Recently Sold
    //4 - Ending Soon
    //5 - Price Low to High (High to Low цей самий масив)
    //6 - Highest last sale
    //7 - Most viewed
    //8 - Most Favorited

    //9 - Price High to Low - пункт 5
    //10 - Oldest - пункт 2

    pub tokens_sorted: LookupMap<u8, Vec<SortedToken>>,

    /// The storage size in bytes for one account.
    pub extra_storage_in_bytes_per_token: StorageUsage,
    ///метадані нфтшки
    pub metadata: LazyOption<NFTMetadata>,

    /// CUSTOM fields
    pub supply_cap_by_type: TypeSupplyCaps,
    //токени по типу
    pub tokens_per_type: LookupMap<TokenType, UnorderedSet<TokenId>>,
    pub token_types_locked: UnorderedSet<TokenType>,
    
    ///кмісійні
    pub contract_royalty: u32,

    pub profiles: LookupMap<AccountId, Profile>,
   
    ///загальна статистика по користувачу
    pub profiles_global_stat: LookupMap<AccountId, ProfileStat>,
    
    
    //likes_count: 0 - кількість лайків аккаунту
    //tokens_likes_count: 1 -кількість лайків токенів аккаунту
    //pub views_count: 2 - загальна ксть переглядів аккаунту
    //pub tokens_views_count: 3 - загальна ксть переглядів токенів аккаунту
    //pub tokens_count: 4 - загальна ксть токенів
    //followers_count: 5 - к-сть підписників автора
    //total_likes_count: 6 - загальна ксть  лайків аккаунт+токени
    //total_views_count: 7 - загальна ксть  переглядів аккаунт+токени
    pub profiles_global_stat_sorted_vector:  LookupMap<u8, Vec<AccountId>>,
    //==========================================================
    
    ///чи брати плату за зберігання інфи з юзера
    pub use_storage_fees: bool,
    //к-сть безплатних токенів для юзера
    pub free_mints: u64,
    pub version: u16,
}

/// Helper structure to for keys of the persistent collections.
#[derive(BorshSerialize)]
pub enum StorageKey {
    TokensPerOwner,
    TokenPerOwnerInner { account_id_hash: CryptoHash },
    TokensPerCreator,
    TokenPerCreatorInner { account_id_hash: CryptoHash },
    TokensById,
    TokenMetadataById,
    NftMetadata,
    TokensPerType,
    TokensPerTypeInner { token_type_hash: CryptoHash },
    TokenTypesLocked,
    Profiles,
    TokensUsersLikes,
    TokensUsersViews,
    TokensSorted,
    ProfilesGlobalStat,
    ProfilesGlobalStatSortedVector
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: ValidAccountId,
               metadata: NFTMetadata,
               supply_cap_by_type: TypeSupplyCaps,
               use_storage_fees: bool,
               free_mints: u64,
               unlocked: Option<bool>,
    ) -> Self {
        let mut this = Self {
            tokens_per_owner: LookupMap::new(StorageKey::TokensPerOwner.try_to_vec().unwrap()),
            tokens_users_likes: LookupMap::new(StorageKey::TokensUsersLikes.try_to_vec().unwrap()),
            tokens_users_views: LookupMap::new(StorageKey::TokensUsersViews.try_to_vec().unwrap()),
            tokens_sorted: LookupMap::new(StorageKey::TokensSorted.try_to_vec().unwrap()),
            tokens_per_creator: LookupMap::new(StorageKey::TokensPerCreator.try_to_vec().unwrap()),
            tokens_by_id: LookupMap::new(StorageKey::TokensById.try_to_vec().unwrap()),
            token_metadata_by_id: UnorderedMap::new(
                StorageKey::TokenMetadataById.try_to_vec().unwrap(),
            ),
            owner_id: owner_id.into(),
            extra_storage_in_bytes_per_token: 0,
            metadata: LazyOption::new(
                StorageKey::NftMetadata.try_to_vec().unwrap(),
                Some(&metadata),
            ),
            supply_cap_by_type,
            tokens_per_type: LookupMap::new(StorageKey::TokensPerType.try_to_vec().unwrap()),
            token_types_locked: UnorderedSet::new(StorageKey::TokenTypesLocked.try_to_vec().unwrap()),
            contract_royalty: 0,
            profiles: LookupMap::new(StorageKey::Profiles.try_to_vec().unwrap()),
            use_storage_fees,
            free_mints,
            version: 0,
            profiles_global_stat:LookupMap::new(StorageKey::ProfilesGlobalStat.try_to_vec().unwrap()),
            profiles_global_stat_sorted_vector:LookupMap::new (StorageKey::ProfilesGlobalStatSortedVector.try_to_vec().unwrap()),
        };

        if unlocked.is_none() {
            // CUSTOM - tokens are locked by default
            for token_type in this.supply_cap_by_type.keys() {
                this.token_types_locked.insert(&token_type);
            }
        }

        this.measure_min_token_storage_cost();

        this
    }

    #[init(ignore_state)]
    pub fn migrate_state_1() -> Self {
        let migration_version: u16 = 1;
        assert_eq!(env::predecessor_account_id(), env::current_account_id(), "Private function");

        #[derive(BorshDeserialize)]
        struct OldContract {
            tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,
            tokens_users_likes: LookupMap<TokenId, HashSet<AccountId>>,
            tokens_users_views: LookupMap<TokenId, HashSet<AccountId>>,
            tokens_filtered: LookupMap<u8, Vec<SortedToken>>,
            tokens_per_creator: LookupMap<AccountId, UnorderedSet<TokenId>>,
            tokens_by_id: LookupMap<TokenId, Token>,
            token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,
            owner_id: AccountId,
            extra_storage_in_bytes_per_token: StorageUsage,
            metadata: LazyOption<NFTMetadata>,
            supply_cap_by_type: TypeSupplyCaps,
            tokens_per_type: LookupMap<TokenType, UnorderedSet<TokenId>>,
            token_types_locked: UnorderedSet<TokenType>,
            contract_royalty: u32,
            profiles: LookupMap<AccountId, Profile>,
            use_storage_fees: bool,
            profiles_global_stat_sorted_vector:  LookupMap<u8, Vec<AccountId>>,
            profiles_global_stat: LookupMap<AccountId, ProfileStat>,
        }

        let old_contract: OldContract = env::state_read().expect("Old state doesn't exist");

        Self {
            tokens_per_owner: old_contract.tokens_per_owner,
            tokens_users_likes: old_contract.tokens_users_likes,
            tokens_users_views: old_contract.tokens_users_views,
            tokens_sorted: old_contract.tokens_filtered,
            tokens_per_creator: old_contract.tokens_per_creator,
            tokens_by_id: old_contract.tokens_by_id,
            token_metadata_by_id: old_contract.token_metadata_by_id,
            owner_id: old_contract.owner_id,
            extra_storage_in_bytes_per_token: old_contract.extra_storage_in_bytes_per_token,
            metadata: old_contract.metadata,
            supply_cap_by_type: old_contract.supply_cap_by_type,
            tokens_per_type: old_contract.tokens_per_type,
            token_types_locked: old_contract.token_types_locked,
            contract_royalty: old_contract.contract_royalty,
            profiles: old_contract.profiles,
            use_storage_fees: old_contract.use_storage_fees,
            free_mints: 3,
            version: migration_version,
            profiles_global_stat_sorted_vector:old_contract.profiles_global_stat_sorted_vector,
            profiles_global_stat: old_contract.profiles_global_stat
        }
    }

    pub fn get_version(&self) -> u16 {
        self.version
    }

    pub fn tokens_sorted_get(&self, filter: u8) -> Option<Vec<SortedToken>>
    {
        return self.tokens_sorted.get(&filter);
    }

    pub fn set_use_storage_fees(&mut self, use_storage_fees: bool) {
        assert_eq!(env::predecessor_account_id(), env::current_account_id(), "Private function");
        self.use_storage_fees = use_storage_fees;
    }

    pub fn is_free_mint_available(&self, account_id: AccountId) -> bool {
        if !self.use_storage_fees {
            self.get_tokens_created(account_id) < self.free_mints
        } else {
            false
        }
    }

    pub fn get_tokens_created(&self, account_id: AccountId) -> u64 {
        match self.tokens_per_creator.get(&account_id) {
            Some(tokens_creator) => {
                tokens_creator.len()
            }
            None => {
                0
            }
        }
    }

    pub fn get_free_mints(&self) -> u64 {
        self.free_mints
    }

    pub fn get_use_storage_fees(&self) -> bool {
        self.use_storage_fees
    }
    
    ///Отримати дані профілю для юзера AccountId
    pub fn get_profile(&self, account_id: ValidAccountId) -> Option<Profile> {
        let account_id: AccountId = account_id.into();
        self.profiles.get(&account_id)
    }

    ///Встановити дані профілю
    pub fn set_profile(&mut self, profile: Profile) {
        assert!(
            profile.bio.len() < MAX_PROFILE_BIO_LENGTH,
            "Profile bio length is too long. Max length is {}",MAX_PROFILE_NAME_LENGTH
        );

        assert!(
            profile.image.len() < MAX_PROFILE_IMAGE_LENGTH,
            "Profile image length is too long. Max length is {}",MAX_PROFILE_NAME_LENGTH
        );

        assert!(
            profile.name.len() < MAX_PROFILE_NAME_LENGTH,
            "User name length is too long. Max length is {}",MAX_PROFILE_NAME_LENGTH
        );

        //регулярка для пошти
        //let email_regex = Regex::new(r"^([a-z0-9_+]([a-z0-9_+.]*[a-z0-9_+])?)@([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6})").unwrap();


        
        let predecessor_account_id = env::predecessor_account_id();

        self.profiles.insert(&predecessor_account_id, &profile);
    }
    
 
    fn measure_min_token_storage_cost(&mut self) {
        let initial_storage_usage = env::storage_usage();
        let tmp_account_id = "a".repeat(64);
        let u = UnorderedSet::new(
            StorageKey::TokenPerOwnerInner {
                account_id_hash: hash_account_id(&tmp_account_id),
            }
                .try_to_vec()
                .unwrap(),
        );
        self.tokens_per_owner.insert(&tmp_account_id, &u);

        let tokens_per_owner_entry_in_bytes = env::storage_usage() - initial_storage_usage;
        let owner_id_extra_cost_in_bytes = (tmp_account_id.len() - self.owner_id.len()) as u64;

        self.extra_storage_in_bytes_per_token =
            tokens_per_owner_entry_in_bytes + owner_id_extra_cost_in_bytes;

        self.tokens_per_owner.remove(&tmp_account_id);
    }

    /// CUSTOM - setters for owner

    pub fn set_contract_royalty(&mut self, contract_royalty: u32) {
        self.assert_owner();
        assert!(contract_royalty <= CONTRACT_ROYALTY_CAP, "Contract royalties limited to 10% for owner");
        self.contract_royalty = contract_royalty;
    }

    pub fn add_token_types(&mut self, supply_cap_by_type: TypeSupplyCaps, unlocked: Option<bool>) {
        self.assert_owner();
        for (token_type, hard_cap) in &supply_cap_by_type {
            if unlocked.is_none() {
                self.token_types_locked.insert(&token_type);
            }
            self.supply_cap_by_type.insert(token_type.to_string(), *hard_cap);

            // // // if token_type == "HipHopHeadsFirstEditionMedley" {
            // // //     let keys = self.token_metadata_by_id.keys_as_vector();
            // // //     for i in 0..keys.len() {
            // // //         let token_id = keys.get(i).unwrap();
            // // //         if let Some(token) = self.tokens_by_id.get(&token_id) {
            // // //             let mut token_2 = token;
            // // //             token_2.royalty.insert("edyoung.near".to_string(), 200);
            // // //             self.tokens_by_id.insert(&token_id, &token_2);
            // // //         }
            // // //     }
            // // // }
        }
    }

    

    pub fn unlock_token_types(&mut self, token_types: Vec<String>) {
        for token_type in &token_types {
            self.token_types_locked.remove(&token_type);
        }
    }

    /// CUSTOM - views

    pub fn get_contract_royalty(&self) -> u32 {
        self.contract_royalty
    }

    pub fn get_supply_caps(&self) -> TypeSupplyCaps {
        self.supply_cap_by_type.clone()
    }

    pub fn get_token_types_locked(&self) -> Vec<String> {
        self.token_types_locked.to_vec()
    }

    pub fn is_token_locked(&self, token_id: TokenId) -> bool {
        let token = self.tokens_by_id.get(&token_id).expect("No token");
        assert_eq!(token.token_type.is_some(), true, "Token must have type");
        let token_type = token.token_type.unwrap();
        self.token_types_locked.contains(&token_type)
    }
}
