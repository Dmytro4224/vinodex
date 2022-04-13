use crate::*;

#[path = "../helpers/converters.rs"]
mod converters;
use converters::Transliteration;

#[path = "../helpers/self_viewer.rs"]
mod self_viewer;
use self_viewer::*;

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Collection {
    pub name: String,
    pub description: String,
    pub profile_photo: String,
    pub cover_photo: String,
    pub is_active: bool,
    pub owner_id: AccountId,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CollectionJson {
    pub name: String,
    pub description: String,
    pub profile_photo: String,
    pub cover_photo: String,
    pub is_active: bool,
    pub owner: Option<JsonProfile>,
    pub tokens: Vec<JsonToken>,
    pub collection_id: String,
    pub likes_count: u64,
    pub views_count: u64,
    pub tokens_count: u64,

    pub is_liked: bool,
    pub is_viewed: bool
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CollectionJsonWithoutTokens {
    pub name: String,
    pub description: String,
    pub profile_photo: String,
    pub cover_photo: String,
    pub is_active: bool,
    pub owner: Option<JsonProfile>,
    pub collection_id: String,
    pub likes_count: u64,
    pub views_count: u64,
    pub tokens_count: u64,

    pub is_liked: bool,
    pub is_viewed: bool
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CollectionStatJson {
    pub likes_count: u64,
    pub views_count: u64,
    pub tokens_count: u64,
    pub prices : PriceStatMainJson
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct CollectionStat {
    pub views_count: u64,
    pub prices : PriceStatMain
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub enum CollectionStatCriterionEnum
{
    OnSaleLowestPrice,
    OnSaleHighestPrice,
    OnSaleNewestPrice,
    OnSaleTotalPrice,
    SoldLowestPrice,
    SoldHighestPrice,
    SoldNewestPrice,
    SoldTotalPrice,
    ViewsCount
}

#[near_bindgen]
impl Contract {
    //Створити нову колекцію
    #[payable]
    pub fn collection_add(
        &mut self,
        name: String,
        description: String,
        profile_photo: String,
        cover_photo: String,
        time: u128,
    ) {
        if name.len() < 3 || name.len() > 100 {
            panic!("name length must be between 3 and 100");
        }
        let collection_id = self.collection_id_generate(&name, time);

        self.collections.insert(
            &collection_id,
            &Collection {
                name: name,
                description: description,
                profile_photo: profile_photo,
                cover_photo: cover_photo,
                is_active: true,
                owner_id: env::predecessor_account_id(),
            },
        );

        let account_id = env::predecessor_account_id();

        self.collection_creator.insert(&collection_id, &account_id);

        match self.collections_per_creator.get(&account_id) {
            Some(mut collections) => 
            {
                collections.insert(&collection_id);
                self.collections_per_creator.insert(&account_id, &collections);
            }
            None => 
            {
                let mut collections = UnorderedSet::new(
                    StorageKey::CollectionPerCreatorInner {
                        account_id_hash: hash_account_id(&account_id),
                    }
                        .try_to_vec()
                        .unwrap(),
                );

                collections.insert(&collection_id);
                self.collections_per_creator.insert(&account_id, &collections);
            }
        } 
    }

    //Отримати колекцію
    pub fn collection_get(
        &self,
        collection_id: &String,
        account_id: &Option<AccountId>,
        with_tokens: bool
    ) -> Option<CollectionJson> {
        match self.collections.get(collection_id) {
            Some(collection) => {
                let mut tokens: Vec<JsonToken> = Vec::new();

                if with_tokens {
                    match self.collection_tokens.get(collection_id) {
                        Some(token_ids) => {
                            tokens = token_ids
                                .iter()
                                .map(|x| {
                                    self.nft_token_for_account(&x, account_id.clone()).unwrap()
                                })
                                .collect::<Vec<JsonToken>>();
                        }
                        None => {}
                    }
                }

                let likes_count: u64;
                let  views_count: u64;

                let mut _is_liked = false;
                let mut _is_viewed = false;

                match self.collection_likes.get(collection_id) 
                {
                    Some(likes) => 
                    {
                        likes_count = likes.len() as u64;

                        if let Some(account_id) = account_id
                        {
                            _is_liked = likes.contains(account_id);
                        }
                    }
                    None => 
                    {
                        likes_count = 0;
                    }
                }

                match self.collections_global_stat.get(collection_id) 
                {
                    Some(stat) => 
                    {
                        views_count = stat.views_count;

                        if let Some(account_id) = account_id
                        {
                            match self.collection_views.get(collection_id) 
                            {
                                Some(views) =>
                                {
                                    _is_viewed = views.contains(account_id);
                                },
                                None => {}
                            }
                        }
                    }
                    None => 
                    {
                        views_count = 0;
                    }
                }

                let tokens_count : u64;

                match self.collection_tokens.get(&collection_id)
                {
                    Some(list) =>
                    {
                        tokens_count = list.len();
                    },
                    None =>
                    {
                        tokens_count = 0;
                    }
                }

                return Some(CollectionJson {
                    collection_id: collection_id.clone(),
                    name: collection.name,
                    description: collection.description,
                    profile_photo: collection.profile_photo,
                    cover_photo: collection.cover_photo,
                    is_active: collection.is_active,
                    owner: self.get_full_profile(
                        &collection.owner_id,
                        account_id,
                        true,
                    ),
                    tokens: tokens,
                    likes_count: likes_count,
                    views_count: views_count,
                    tokens_count: tokens_count,

                    is_liked: _is_liked,
                    is_viewed: _is_viewed
                });
            }
            None => {
                return None;
            }
        }
    }

    pub fn nft_collections(
        &self,
        //пагінація
        page_index: u64,
        //ксть елементів на сторінкі
        page_size: u64,
        account_id: Option<AccountId>,
        collection_owner: Option<AccountId>,
        with_tokens: bool,
    ) -> Vec<Option<CollectionJson>> {
        // let start_index = (page_index - 1) * page_size;
        // let end_index = page_index * page_size;

        let skip;

        if page_index == 1 {
            skip = 0;
        } else {
            skip = (page_index - 1) * page_size;
        }

        let check_owner : bool;
        let collection_owner_unw : AccountId;

        if collection_owner.is_some()
        {
            check_owner = true;
            collection_owner_unw = collection_owner.unwrap();
        }
        else
        {
            check_owner = false;
            collection_owner_unw = String::from("");
        }

        let keys : Vec<String> = self.collections.keys().collect();

        let mut res :Vec<Option<CollectionJson>> = Vec::new();

        for i in skip..skip + page_size
        {
            match keys.get(i as usize)
            {
                Some(collection_id) =>
                {
                    if check_owner && self.collection_creator.get(&collection_id).unwrap() != collection_owner_unw
                    {
                        continue;
                    }

                    res.push(self.collection_get(&collection_id, &account_id, with_tokens));
                },
                None =>
                {
                    break;
                }
            }
        }

        return res;
    }

    pub fn collection_get_by_token(&self, token_id: &TokenId, account_id: &Option<AccountId>) -> Option<CollectionJsonWithoutTokens> 
    {
        match self.collection_per_token.get(&token_id) {
            Some(collection_id) => {
                match self.collection_get(&collection_id, account_id, false)
                {
                    Some(collection) =>
                    {
                        return Some(CollectionJsonWithoutTokens {
                            collection_id: collection_id.clone(),
                            name: collection.name,
                            description: collection.description,
                            profile_photo: collection.profile_photo,
                            cover_photo: collection.cover_photo,
                            is_active: collection.is_active,
                            owner: collection.owner,
                            likes_count: collection.likes_count,
                            views_count: collection.views_count,
                            tokens_count: collection.tokens_count,

                            is_liked: collection.is_liked,
                            is_viewed: collection.is_viewed
                        });
                    },
                    None => {}
                }
            }
            None => {}
        }

        return None;
    }

    #[payable]
    pub fn collection_update(
        &mut self,
        collection_id: String,
        name: Option<String>,
        description: Option<String>,
        profile_photo: Option<String>,
        cover_photo: Option<String>,
    ) {
        let collection = self.collections.get(&collection_id);

        match collection {
            Some(mut collection) => {
                // if collection.owner_id != env::predecessor_account_id()
                // {
                //     panic!("Only owner can update collection");
                // }

                match name {
                    Some(name) => {
                        if name.len() < 3 || name.len() > 100 {
                            panic!("name length must be between 3 and 100");
                        }

                        collection.name = name;
                    }
                    None => {}
                }

                match description {
                    Some(description) => {
                        collection.description = description;
                    }
                    None => {}
                }

                match profile_photo {
                    Some(profile_photo) => {
                        collection.profile_photo = profile_photo;
                    }
                    None => {}
                }

                match cover_photo {
                    Some(cover_photo) => {
                        collection.cover_photo = cover_photo;
                    }
                    None => {}
                }

                self.collections.insert(&collection_id, &collection);
            }
            None => {
                panic!("collection not found");
            }
        }
    }

    #[payable]
    pub fn collection_token_add(&mut self, collection_id: String, token_id: String) {
        if self.collections.get(&collection_id).is_none() {
            panic!("collection not found");
        }

        if self.tokens_by_id.get(&token_id).is_none() {
            panic!("token not found");
        }

        match self.collection_per_token.get(&token_id) {
            Some(current_collection_id) => {
                match self.collection_tokens.get(&current_collection_id) {
                    Some(mut tokens) => {
                        // let pos = tokens.iter().position(|x| x.eq(&token_id));

                        // if let Some(position) = pos
                        // {
                        //     tokens.remove(position);
                        // }

                        tokens.remove(&token_id);

                        self.collection_tokens
                            .insert(&current_collection_id, &tokens);
                    }
                    None => {}
                }
            }
            None => {}
        }

        self.collection_per_token.insert(&token_id, &collection_id);

        match self.collection_tokens.get(&collection_id) {
            Some(mut tokens) => {
                tokens.insert(&token_id);
                self.collection_tokens.insert(&collection_id, &tokens);
            }
            None => {
                let mut tokens = UnorderedSet::new(
                    StorageKey::CollectionOfTokensSet {
                        collection_id_hash: hash_account_id(&collection_id),
                    }
                    .try_to_vec()
                    .unwrap(),
                );

                tokens.insert(&token_id);
                self.collection_tokens.insert(&collection_id, &tokens);
            }
        }

        match self.sales_active.get(&token_id)
        {
            Some(sale) =>
            {
                let price : u128;

                match sale.sale_type
                {
                    1 =>
                    {
                        price = sale.price.unwrap().0;
                    },
                    2 | 3 =>
                    {
                        let bids_len = sale.bids.len();
                        if bids_len > 0
                        {
                            price = sale.bids.get(bids_len - 1).unwrap().price;
                        }
                        else
                        {
                            price = 0;
                        }
                    },
                    _ => 
                    {
                        panic!("sale type not implemented");
                    }
                }

                self.collection_stat_price_check_and_change(&collection_id, price, false);
            },
            None => {}
        }
    }

    pub fn collection_get_stat(&self, collection_id: String) -> CollectionStatJson
    {
        let stat: CollectionStat;
        match self.collections_global_stat.get(&collection_id)
        {
            Some(_stat) =>
            {
                stat = _stat.clone();
            },
            None =>
            {
                stat = self.collection_get_stat_default();
            }
        }

        let likes_count: u64;

        match self.collection_likes.get(&collection_id) 
        {
            Some(likes) => 
            {
                likes_count = likes.len() as u64;
            }
            None => 
            {
                likes_count = 0;
            }
        }

        let tokens_count : u64;

        match self.collection_tokens.get(&collection_id)
        {
            Some(list) =>
            {
                tokens_count = list.len();
            },
            None =>
            {
                tokens_count = 0;
            }
        }

        return CollectionStatJson
        {
            likes_count: likes_count,
            tokens_count: tokens_count,
            views_count: stat.views_count,
            prices: PriceStatMainJson
            {
                on_sale: PriceStatJson
                {
                    lowest_price: U128(stat.prices.on_sale.lowest_price),
                    highest_price: U128(stat.prices.on_sale.highest_price),
                    newest_price: U128(stat.prices.on_sale.newest_price),
                    total_price: U128(stat.prices.on_sale.total_price)
                },
                sold: PriceStatJson
                {
                    lowest_price: U128(stat.prices.sold.lowest_price),
                    highest_price: U128(stat.prices.sold.highest_price),
                    newest_price: U128(stat.prices.sold.newest_price),
                    total_price: U128(stat.prices.sold.total_price)
                }
            }
        };
    }

    #[payable]
    pub fn collection_token_remove(&mut self, token_id: String) {
        match self.collection_per_token.remove(&token_id) {
            Some(collection_id) => {
                match self.collection_tokens.get(&collection_id) {
                    Some(mut tokens) => {
                        tokens.remove(&token_id);

                        self.collection_tokens.insert(&collection_id, &tokens);

                        let creator = self.creator_per_token.get(&token_id).unwrap();
                        let artist = self.token_metadata_by_id.get(&token_id).unwrap().artist;
                        let collection_id = self.collection_per_token.get(&token_id);

                        self.recount_price_stat(&creator, &artist, &collection_id);
                    }
                    None => {}
                }
            }
            None => {}
        }
    }

    #[private]
    pub fn collection_id_generate(&self, name: &String, time: u128) -> String {
        let mut collection_id = Transliteration::transliterate_string(name);

        if self.collections.get(&collection_id).is_none() {
            return collection_id;
        }

        collection_id.push_str("-");

        let mut collection_id_new: String;

        for i in 1..101 as u8 {
            collection_id_new = collection_id.clone();
            collection_id_new.push_str(&(i.to_string()));

            if self.collections.get(&collection_id_new).is_none() {
                return collection_id_new;
            }
        }

        collection_id_new = collection_id.clone();
        collection_id_new.push_str(&(time.to_string()));

        if self.collections.get(&collection_id_new).is_none() {
            return collection_id_new;
        }

        panic!("could not generate unique collection_id for this name");
    }

    // поставити лайк колекції
    #[payable]
    pub fn collection_set_like(&mut self, collection_id: String) {
        let user_id = env::predecessor_account_id();

        let mut hash_set : HashSet<String>;

        match self.collection_likes.get_mut(&collection_id) 
        {
            Some(likes) => 
            {
                if likes.contains(&user_id) 
                {
                    likes.remove(&user_id);
                } 
                else 
                {
                    likes.insert(user_id.clone());
                }

                hash_set = likes.clone();

                //self.collection_likes.insert(collection_id.clone(), likes.clone());
            }
            None => 
            {
                // let mut likes = HashSet::new();

                // likes.insert(user_id.clone());

                // self.collection_likes.insert(collection_id.clone(), likes);

                hash_set = HashSet::new();

                hash_set.insert(user_id.clone());
            }
        }

        self.collection_likes.insert(collection_id.clone(), hash_set);
    }

    // поставити перегляд колекції
    #[payable]
    pub fn collection_set_view(&mut self, collection_id: &String) {
        let user_id = env::predecessor_account_id();

        let mut hash_set : HashSet<String>;

        match self.collection_views.get_mut(collection_id) 
        {
            Some(views) => 
            {
                if !views.contains(&user_id) 
                {
                    views.insert(user_id.clone());

                    //self.collection_views.insert(collection_id.clone(), *views);
                }

                hash_set = views.clone();
            }
            None => 
            {
                // let mut views = HashSet::new();

                // views.insert(user_id.clone());

                //self.collection_views.insert(collection_id.clone(), views);

                hash_set = HashSet::new();

                hash_set.insert(user_id.clone());
            }
        }

        self.collection_views.insert(collection_id.clone(), hash_set);

        self.set_collection_stat_val
        (
            &collection_id,
            CollectionStatCriterionEnum::ViewsCount,
            None
        );
    }

    pub fn collection_get_stat_default(&self) -> CollectionStat
    {
        return CollectionStat
        {
            prices: PriceStatMain
            {
                on_sale: ProfileStatCriterion::price_stat_get_default(),
                sold: ProfileStatCriterion::price_stat_get_default()
            },
            views_count: 0
        };
    }


    ///змінити статистику по цінам для створювача на нове значення, якщо умова задовольняється
    #[private]
    pub fn collection_stat_price_check_and_change
    (
        &mut self,
        collection_id: &String, 
        price: u128,
        is_sold: bool
    )
    {
        let mut stat : CollectionStat;

        match self.collections_global_stat.get(collection_id) 
        {
            Some(_stat) => 
            {
                stat = _stat.clone();
            },
            None => 
            {
                stat = self.collection_get_stat_default();
            }
        }   
        
        if is_sold
        {
            if price < stat.prices.sold.lowest_price || stat.prices.sold.lowest_price == 0
            {
                self.set_collection_stat_val
                (
                    collection_id,
                    CollectionStatCriterionEnum::SoldLowestPrice,
                    Some(price)
                );
            }

            if price > stat.prices.sold.highest_price
            {
                self.set_collection_stat_val
                (
                    collection_id,
                    CollectionStatCriterionEnum::SoldHighestPrice,
                    Some(price)
                );
            }

            self.set_collection_stat_val
            (
                collection_id,
                CollectionStatCriterionEnum::SoldNewestPrice,
                Some(price)
            );

            self.set_collection_stat_val
            (
                collection_id,
                CollectionStatCriterionEnum::SoldTotalPrice,
                Some(stat.prices.sold.total_price + price)
            );
        }
        else
        {
            if price < stat.prices.on_sale.lowest_price || stat.prices.on_sale.lowest_price == 0
            {
                self.set_collection_stat_val
                (
                    collection_id,
                    CollectionStatCriterionEnum::OnSaleLowestPrice,
                    Some(price)
                );
            }

            if price > stat.prices.on_sale.highest_price
            {
                self.set_collection_stat_val
                (
                    collection_id,
                    CollectionStatCriterionEnum::OnSaleHighestPrice,
                    Some(price)
                );
            }

            self.set_collection_stat_val
            (
                collection_id,
                CollectionStatCriterionEnum::OnSaleNewestPrice,
                Some(price)
            );

            self.set_collection_stat_val
            (
                collection_id,
                CollectionStatCriterionEnum::OnSaleTotalPrice,
                Some(stat.prices.on_sale.lowest_price + price)
            );
        }
    }

    //встановити значення параметру статистики
    #[private]
    pub fn set_collection_stat_val
    (
        &mut self,
        collection_id: &String, 
        parameter: CollectionStatCriterionEnum,
        value: Option<u128>
    )
    {
        let mut stat : CollectionStat;

        match self.collections_global_stat.get(collection_id) 
        {
            Some(_stat) => 
            {
                stat = _stat.clone();
            },
            None => 
            {
                stat = self.collection_get_stat_default();
            }
        }   
            
        match parameter
        {
            //найнижча ціна токену, який знаходиться на продажі
            CollectionStatCriterionEnum::OnSaleLowestPrice =>
            {
                stat.prices.on_sale.lowest_price = value.unwrap();
            },
            //найвища ціна токену, який знаходиться на продажі
            CollectionStatCriterionEnum::OnSaleHighestPrice =>
            {
                stat.prices.on_sale.highest_price = value.unwrap();
            },
            //ціна найновішого токену, який знаходиться на продажі
            CollectionStatCriterionEnum::OnSaleNewestPrice =>
            {
                stat.prices.on_sale.newest_price = value.unwrap();
            },
            //сума всії токенів, який знаходиться на продажі
            CollectionStatCriterionEnum::OnSaleTotalPrice =>
            {
                stat.prices.on_sale.total_price = value.unwrap();
            },
            //найнижча ціна проданого токену
            CollectionStatCriterionEnum::SoldLowestPrice =>
            {
                stat.prices.sold.lowest_price = value.unwrap();
            },
            //найвища ціна проданого токену
            CollectionStatCriterionEnum::SoldHighestPrice =>
            {
                stat.prices.sold.highest_price = value.unwrap();
            },
            //ціна останнього проданого токену
            CollectionStatCriterionEnum::SoldNewestPrice =>
            {
                stat.prices.sold.newest_price = value.unwrap();
            },
            //загальна ціна всіх проданих токенів
            CollectionStatCriterionEnum::SoldTotalPrice =>
            {
                stat.prices.sold.total_price = value.unwrap();
            },
            //загальна кількість переглядів
            CollectionStatCriterionEnum::ViewsCount =>
            {
                stat.views_count += 1;
            }
        }

        self.collections_global_stat.insert(collection_id.clone(), stat);
    }
}
