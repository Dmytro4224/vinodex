use std::collections::HashMap;
use std::cmp::min;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, ValidAccountId, U64, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    assert_one_yocto, env, near_bindgen, AccountId, Balance, Gas, PanicOnDefault,
    Promise, CryptoHash, BorshStorageKey, StorageUsage,
};

use near_sdk::env::STORAGE_PRICE_PER_BYTE;
use std::collections::HashSet;
use std::cmp::Ordering;

extern crate serde_derive;

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

#[path = "sales/sale.rs"]
mod sales;
pub use crate::sales::*;

//=========Sales=================//

//GAS constants to attach to calls
const GAS_FOR_ROYALTIES: Gas = 115_000_000_000_000;
const GAS_FOR_NFT_TRANSFER: Gas = 15_000_000_000_000;

//constant used to attach 0 NEAR to a call
const NO_DEPOSIT: Balance = 0;

//the minimum storage to have a sale on the contract.
const STORAGE_PER_SALE: u128 = 1000 * STORAGE_PRICE_PER_BYTE;

//Creating custom types to use within the contract. This makes things more readable. 
pub type SalePriceInYoctoNear = U128;
pub type TokenId = String;
pub type FungibleTokenId = AccountId;
pub type ContractAndTokenId = String;

//===============================//



//тип токену
pub type TokenType = String;
//типи токенів
pub type TypeSupplyCaps = HashMap<TokenType, U64>;

pub const CONTRACT_ROYALTY_CAP: u32 = 1000;
pub const MINTER_ROYALTY_CAP: u32 = 9000;
//максимальна довжина імені користувача
pub const MAX_PROFILE_NAME_LENGTH: usize = 256;
//максимальна довжина опису профілю
pub const MAX_PROFILE_BIO_LENGTH: usize = 256;
//максимальна величина картинки
pub const MAX_PROFILE_IMAGE_LENGTH: usize = 256;


    //==================

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {

    //keep track of the storage that accounts have payed
    pub storage_deposits: LookupMap<AccountId, Balance>,


    //токени власника
    pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,
    //токени автора
    pub tokens_per_creator: LookupMap<AccountId, UnorderedSet<TokenId>>,
    //хто створювач нового токена
    pub creator_per_token: LookupMap<TokenId, AccountId>,
    //токени по ідентифікатру
    pub tokens_by_id: LookupMap<TokenId, Token>,
    //метадані токену по ідентифікатору токена
    pub token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,
    //власник
    pub owner_id: AccountId,

    //Вподобання токенів
    pub tokens_users_likes: LookupMap<TokenId, HashSet<AccountId>>,

    //Перегляд токенів
    pub tokens_users_views: LookupMap<TokenId, HashSet<AccountId>>,


    //мій список токенів, яким я поставив лайки
    pub my_tokens_likes: LookupMap<AccountId, HashSet<TokenId>>,
    //список токенів, на які я підписався
    pub my_tokens_followed: LookupMap<AccountId, HashSet<TokenId>>,



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

    // The storage size in bytes for one account.
    pub extra_storage_in_bytes_per_token: StorageUsage,
    //метадані нфтшки
    pub metadata: LazyOption<NFTMetadata>,

    // CUSTOM fields
    pub supply_cap_by_type: TypeSupplyCaps,
    //токени по типу
    pub tokens_per_type: LookupMap<TokenType, UnorderedSet<TokenId>>,
    pub token_types_locked: UnorderedSet<TokenType>,

    //кмісійні
    pub contract_royalty: u32,

    pub profiles: LookupMap<AccountId, Profile>,

    //загальна статистика по користувачу
    pub profiles_global_stat: LookupMap<AccountId, ProfileStat>,


    //likes_count: 0 - кількість лайків аккаунту
    //tokens_likes_count: 1 -кількість лайків токенів аккаунту
    //pub views_count: 2 - загальна ксть переглядів аккаунту
    //pub tokens_views_count: 3 - загальна ксть переглядів токенів аккаунту
    //pub tokens_count: 4 - загальна ксть токенів
    //followers_count: 5 - к-сть підписників автора
    //total_likes_count: 6 - загальна ксть  лайків аккаунт+токени
    //total_views_count: 7 - загальна ксть  переглядів аккаунт+токени
    pub profiles_global_stat_sorted_vector:  LookupMap<u8, Vec<ProfileStatCriterion>>,
    //==========================================================

    //чи брати плату за зберігання інфи з юзера
    pub use_storage_fees: bool,
    //к-сть безплатних токенів для юзера
    pub free_mints: u64,
    pub version: u16,


  //===========лакйи, фоловери, перегляди авторів======
  //список користувачів, яким сподобався аккаунт AccountId
  pub autors_likes: LookupMap<AccountId, HashSet<AccountId>>,
  //список користувачів, які дивилися аккаунт AccountId
  pub autors_views: LookupMap<AccountId, HashSet<AccountId>>,
  //список користувачів, які відстежуються аккаунт AccountId
  pub autors_followers: LookupMap<AccountId, HashSet<AccountId>>,
  //===========мої лакйи, фоловери, перегляди авторів======
  //мій список користувачів, яким я поставив лайки
  pub my_authors_likes: LookupMap<AccountId, HashSet<AccountId>>,
  //аккаунти, які я переглянув
  pub my_autors_views: LookupMap<AccountId, HashSet<AccountId>>,
  //список аккаунтів, на які я підписався
  pub my_autors_followed: LookupMap<AccountId, HashSet<AccountId>>,


    //================sales==========================//

     //Токени, виставлені на продаж
    pub sales_active: UnorderedMap<TokenId, Sale>,

    //Історія продажу токенів
    pub sales_history_by_token_id: LookupMap<TokenId, Vec<SaleHistory>>,

    //Токени які продаються на аукціоні, і по ним користувач зробив ставку
    pub my_bids_active: LookupMap<AccountId, UnorderedSet<TokenId>>,

    //Історія продажів користувача
    pub my_sales: LookupMap<AccountId, Vec<MySaleHistory>>,

    //Історія покупок користувача
    pub my_purchases: LookupMap<AccountId, Vec<MySaleHistory>>,

    //================sales==========================//



  }

// Helper structure to for keys of the persistent collections.
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
    ProfilesGlobalStatSortedVector,
    AutorsLikes,
    AutorsViews,
    AutorsFollowers,
    MyAuthorsLikes,
    MyAutorsViews,
    MyAutorsFollowed,
    MyTokensLikes,
    MyTokensFollowed,
    SalesActive,
    SalesHistoryByTokenId,
    StorageDeposit,
    MySales,
    MyPurchases,
    MyBidsActive,
    MyBidsActiveSet { account_id_hash: CryptoHash },
    CreatorPerToken
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
            creator_per_token: LookupMap::new(StorageKey::CreatorPerToken.try_to_vec().unwrap()),
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
            autors_likes:LookupMap::new (StorageKey::AutorsLikes.try_to_vec().unwrap()),
            autors_views:LookupMap::new (StorageKey::AutorsViews.try_to_vec().unwrap()),
            autors_followers:LookupMap::new (StorageKey::AutorsFollowers.try_to_vec().unwrap()),
            my_authors_likes:LookupMap::new (StorageKey::MyAuthorsLikes.try_to_vec().unwrap()),
            my_autors_views:LookupMap::new (StorageKey::MyAutorsViews.try_to_vec().unwrap()),
            my_autors_followed:LookupMap::new (StorageKey::MyAutorsFollowed.try_to_vec().unwrap()),
            my_tokens_likes:LookupMap::new (StorageKey::MyTokensLikes.try_to_vec().unwrap()),
            my_tokens_followed:LookupMap::new (StorageKey::MyTokensFollowed.try_to_vec().unwrap()),
            sales_active:UnorderedMap::new (StorageKey::SalesActive.try_to_vec().unwrap()),
            sales_history_by_token_id:LookupMap::new (StorageKey::SalesHistoryByTokenId.try_to_vec().unwrap()),
            storage_deposits:LookupMap::new (StorageKey::StorageDeposit.try_to_vec().unwrap()),
            my_sales:LookupMap::new (StorageKey::MySales.try_to_vec().unwrap()),
            my_purchases:LookupMap::new (StorageKey::MyPurchases.try_to_vec().unwrap()),
            my_bids_active:LookupMap::new (StorageKey::MyBidsActive.try_to_vec().unwrap()),
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
            profiles_global_stat_sorted_vector:  LookupMap<u8, Vec<ProfileStatCriterion>>,
            profiles_global_stat: LookupMap<AccountId, ProfileStat>,
            autors_likes: LookupMap<AccountId, HashSet<AccountId>>,
            autors_views: LookupMap<AccountId, HashSet<AccountId>>,
            autors_followers: LookupMap<AccountId, HashSet<AccountId>>,
            my_authors_likes: LookupMap<AccountId, HashSet<AccountId>>,
            my_autors_views: LookupMap<AccountId, HashSet<AccountId>>,
            my_autors_followed: LookupMap<AccountId, HashSet<AccountId>>,
            my_tokens_likes: LookupMap<AccountId, HashSet<TokenId>>,
            my_tokens_followed: LookupMap<AccountId, HashSet<TokenId>>,
            sales_active: UnorderedMap<TokenId, Sale>,
            sales_history_by_token_id: LookupMap<TokenId, Vec<SaleHistory>>,
            storage_deposits: LookupMap<AccountId, Balance>,
            my_sales: LookupMap<AccountId, Vec<MySaleHistory>>,
            my_purchases: LookupMap<AccountId, Vec<MySaleHistory>>,
            my_bids_active: LookupMap<AccountId, UnorderedSet<TokenId>>,
            creator_per_token: LookupMap<TokenId, AccountId>
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
            profiles_global_stat: old_contract.profiles_global_stat,
            autors_likes: old_contract.autors_likes,
            autors_views: old_contract.autors_views,
            autors_followers: old_contract.autors_followers,
            my_authors_likes: old_contract.my_authors_likes,
            my_autors_views: old_contract.my_autors_views,
            my_autors_followed: old_contract.my_autors_followed,
            my_tokens_likes: old_contract.my_tokens_likes,
            my_tokens_followed: old_contract.my_tokens_followed,
            sales_active: old_contract.sales_active,
            sales_history_by_token_id: old_contract.sales_history_by_token_id,
            storage_deposits: old_contract.storage_deposits,
            my_sales: old_contract.my_sales,
            my_purchases: old_contract.my_purchases,
            my_bids_active: old_contract.my_bids_active,
            creator_per_token: old_contract.creator_per_token
        }
    }

    pub fn get_version(&self) -> u16 {
        self.version
    }

    pub fn get_version1(&self) -> u16 {
        123
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

    // CUSTOM - setters for owner

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
        }
    }

    pub fn unlock_token_types(&mut self, token_types: Vec<String>) {
        for token_type in &token_types {
            self.token_types_locked.remove(&token_type);
        }
    }

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

    //Отримати дані профілю для юзера AccountId
    pub fn get_profile(&self, account_id: AccountId, asked_account_id: Option<AccountId>) -> Option<JsonProfile> {
        let account_id: AccountId = account_id.into();
        //return self.profiles.get(&account_id).unwrap_or(Profile::get_default_data(account_id.clone()));
        return Profile::get_full_profile(
            &self.profiles, 
            &account_id, 
            &asked_account_id, 
            &self.autors_likes, 
            &self.autors_followers, 
            &self.tokens_per_owner,
            true);
    }

    //Встановити дані профілю
    pub fn set_profile(&mut self, mut profile: Profile)
    {
        assert!(
            profile.bio.len() < MAX_PROFILE_BIO_LENGTH,
            "Profile bio length is too long. Max length is {}",MAX_PROFILE_NAME_LENGTH
        );

        assert!(
            profile.image.len() < MAX_PROFILE_IMAGE_LENGTH,
            "Profile image length is too long. Max length is {}",MAX_PROFILE_NAME_LENGTH
        );

        assert!(
            profile.name.len() <MAX_PROFILE_NAME_LENGTH,
            "User name length is too long. Max length is {}",MAX_PROFILE_NAME_LENGTH
        );

        let predecessor_account_id = env::predecessor_account_id();

        profile.account_id=predecessor_account_id;

        Profile::set_profile(&mut self.profiles,
            &profile,
            &env::predecessor_account_id());
    }

    //лайкнути карточку користувача
    // працює дзеркально: лайк або ставиться/або знімається
    pub fn like_artist_account(&mut self,account_id:AccountId)
    {
        let predecessor_account_id = env::predecessor_account_id();

        //додаємо запис до списку лайків аккаунту, який лайкнули
        Profile::set_profile_like(
            &mut self.autors_likes,
            &account_id,
            &predecessor_account_id
        );

        //додаємо запис до списку мого списку лайків
        Profile::add_profile_to_my_like_list(
            &mut self.my_authors_likes,
            &predecessor_account_id,
            &account_id
        );

        //збільнуємо статистику лайків
        ProfileStatCriterion::set_profile_stat_val(
            &mut self.profiles_global_stat,
            &mut self.profiles_global_stat_sorted_vector,
            &account_id,
            0,
            Profile::get_profile_like_count(
               &mut self.autors_likes,
                &account_id
            )
        );
    }


    //поставити помітку про відвідання карточки користувача
    pub fn view_artist_account(&mut self, account_id:AccountId) {
        let predecessor_account_id = env::predecessor_account_id();

        Profile::set_profile_view (
            &mut self.autors_views,
            &account_id,
            &predecessor_account_id
        );

        let _new_val=ProfileStatCriterion::profile_stat(
            &self.profiles_global_stat,
            &account_id).views_count+1;

                //змінюємо статистику переглядів
                ProfileStatCriterion::set_profile_stat_val(
                    &mut self.profiles_global_stat,
                    &mut self.profiles_global_stat_sorted_vector,
                    &account_id,
                    2,
                    _new_val
                );
    }

      //додати користувача до стписку відстеження
      // працює дзеркально: ставить або знімає
    pub fn follow_artist_account(&mut self, account_id:AccountId){
        let predecessor_account_id = env::predecessor_account_id();

        //додаємо запис до списку підписників аккаунту, на який підписалися
        Profile::set_profile_follow(
            &mut self.autors_followers,
            &account_id,
            &predecessor_account_id
        );

        //додаємо запис до списку мого списку лайків
        Profile::add_profile_to_my_followers_list(
            &mut self.my_autors_followed,
            &predecessor_account_id,
            &account_id
        );

        //збільнуємо статистику лайків
        ProfileStatCriterion::set_profile_stat_val(
           &mut self.profiles_global_stat,
           &mut self.profiles_global_stat_sorted_vector,
            &account_id,
            5,
            Profile::get_profile_followers_count(
                &mut self.autors_followers,
                &account_id
            )
        );
    }


    //Allows users to deposit storage. This is to cover the cost of storing sale objects on the contract
    //Optional account ID is to users can pay for storage for other people.
    #[payable]
    pub fn storage_deposit(&mut self, account_id: Option<AccountId>) {
        //get the account ID to pay for storage for
        let storage_account_id = account_id 
            //convert the valid account ID into an account ID
            .map(|a| a.into())
            //if we didn't specify an account ID, we simply use the caller of the function
            .unwrap_or_else(env::predecessor_account_id);

        //get the deposit value which is how much the user wants to add to their storage
        let deposit = env::attached_deposit();

        //make sure the deposit is greater than or equal to the minimum storage for a sale
        assert!(
            deposit >= STORAGE_PER_SALE,
            "Requires minimum deposit of {}",
            STORAGE_PER_SALE
        );

        //get the balance of the account (if the account isn't in the map we default to a balance of 0)
        let mut balance: u128 = self.storage_deposits.get(&storage_account_id).unwrap_or(0);
        //add the deposit to their balance
        balance += deposit;
        //insert the balance back into the map for that account ID
        self.storage_deposits.insert(&storage_account_id, &balance);
    }

    //Allows users to withdraw any excess storage that they're not using. Say Bob pays 0.01N for 1 sale
    //Alice then buys Bob's token. This means bob has paid 0.01N for a sale that's no longer on the marketplace
    //Bob could then withdraw this 0.01N back into his account. 
    #[payable]
    pub fn storage_withdraw(&mut self) {
        //make sure the user attaches exactly 1 yoctoNEAR for security purposes.
        //this will redirect them to the NEAR wallet (or requires a full access key). 
        assert_one_yocto();

        //Порахувати скільки за токен використовується місьця в системі

        // //the account to withdraw storage to is always the function caller
        // let owner_id = env::predecessor_account_id();
        // //get the amount that the user has by removing them from the map. If they're not in the map, default to 0
        // let mut amount = self.storage_deposits.remove(&owner_id).unwrap_or(0);
        
        // //how many sales is that user taking up currently. This returns a set
        // let sales = self.by_owner_id.get(&owner_id);
        // //get the length of that set. 
        // let len = sales.map(|s| s.len()).unwrap_or_default();
        // //how much NEAR is being used up for all the current sales on the account 
        // let diff = u128::from(len) * STORAGE_PER_SALE;

        // //the excess to withdraw is the total storage paid - storage being used up.
        // amount -= diff;

        // //if that excess to withdraw is > 0, we transfer the amount to the user.
        // if amount > 0 {
        //     Promise::new(owner_id.clone()).transfer(amount);
        // }
        // //we need to add back the storage being used up into the map if it's greater than 0.
        // //this is so that if the user had 500 sales on the market, we insert that value here so
        // //if those sales get taken down, the user can then go and withdraw 500 sales worth of storage.
        // if diff > 0 {
        //     self.storage_deposits.insert(&owner_id, &diff);
        // }
    }

    /// views
    //return the minimum storage for 1 sale
    pub fn storage_minimum_balance(&self) -> U128 {
        U128(STORAGE_PER_SALE)
    }

    //return how much storage an account has paid for
    pub fn storage_balance_of(&self, account_id: AccountId) -> U128 {
        U128(self.storage_deposits.get(&account_id).unwrap_or(0))
    }
}
