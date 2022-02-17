use std::collections::HashMap;
use std::cmp::min;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, ValidAccountId, U64, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, CryptoHash, PanicOnDefault, Promise, StorageUsage,
};
/**для регексу */
extern crate regex;
use regex::Regex;
/**для регексу */

use crate::internal::*;
pub use crate::metadata::*;
pub use crate::mint::*;
pub use crate::nft_core::*;
pub use crate::token::*;
pub use crate::enumerable::*;

mod internal;
mod metadata;
mod mint;
mod nft_core;
mod token;
mod enumerable;

near_sdk::setup_alloc!();

#[derive(Debug, Clone, BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct HomePageFilter {
///тип вибірки:all (default=null), top10 = 0, popular = 1, new = 1
    pub  list_type :Option<u8>,
    ///тип сортування при виводі
    /// Recently Listed = 0
    ///Recently Created = 1
    ///Ending Soon = 2
    ///Price: Low to High = 3
    ///Price: High to Low =4
    ///Highest Last Sale=5
    ///Most Viewed=6
    ///Most Favorited=7
    ///Oldest=8
    pub sort:u8,
    ///тип каталогу, до якого належить токен
    pub catalog:u8
}


