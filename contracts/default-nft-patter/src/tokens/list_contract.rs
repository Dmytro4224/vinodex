use crate::*;

#[path = "../helpers/converters.rs"]
mod converters;

use converters::Converter;

#[near_bindgen]
impl Contract {

    pub fn nft_tokens(
        &self,
        from_index: Option<U128>, 
        limit: Option<u64>,
        account_id:Option<AccountId>) -> Vec<JsonToken> {
        let keys = self.token_metadata_by_id.keys_as_vector();
        let start = u128::from(from_index.unwrap_or(U128(0)));

        keys.iter()
            .skip(start as usize)
            .take(limit.unwrap_or(0) as usize)
            .map(|token_id| self.nft_token_for_account(&token_id, account_id.clone()).unwrap())
            .collect()
    }

    pub fn nft_tokens_keys(&self, from_index: Option<U128>, limit: Option<u64>) -> Vec<String> {
        let keys = self.token_metadata_by_id.keys_as_vector();
        let start = u128::from(from_index.unwrap_or(U128(0)));
        keys.iter()
            .skip(start as usize)
            .take(limit.unwrap_or(0) as usize)
            .collect()
    }

    pub fn nft_tokens_batch(
        &self,
        token_ids: Vec<String>,
    ) -> Vec<JsonToken> {
        let mut tmp = vec![];
        for i in 0..token_ids.len() {
            tmp.push(self.nft_token(token_ids[i].clone()).unwrap());
        }
        tmp
    }
    

    pub fn nft_tokens_catalogs(&self) -> Vec<String>
    {
        let mut result : Vec<String> = Vec::new();

        self.supply_cap_by_type.keys().for_each(|x| {
            result.push(x.clone());
        });

        return result;
    }

    pub fn nft_tokens_sorted(&self, sort : u8) -> Vec<SortedToken>
    {
        return self.tokens_sorted.get(&sort).unwrap_or(Vec::new());
    }

    pub fn nft_tokens_sorted_fix(&mut self, sort : u8)
    {
        match self.tokens_sorted.get(&sort)
        {
            Some(mut list) =>
            {
                let mut tokens: HashSet<String> = HashSet::new();

                let mut i = 0;

                while i < list.len()
                {
                    if tokens.contains(&list[i].token_id)
                    {
                        list.remove(i);
                    }
                    else
                    {
                        tokens.insert(list[i].token_id.clone());

                        i = i + 1;
                    }
                }


                self.tokens_sorted.insert(&sort, &list);
            },
            None => {}
        }
    }

    pub fn nft_tokens_sorted_fix_all(&mut self)
    {
        for i in 1..9
        {
            self.nft_tokens_sorted_fix(i);
        }
    }

    pub fn nft_tokens_sorted_get_token_ids(&self, sort: u8) -> usize
    {
        match self.tokens_sorted.get(&sort)
        {
            Some(list) =>
            {
                return list.len();
            },
            None =>
            {
                return 0;
            }
        }
    }

    ///??-?????? ?????????????? ???????? token_type
    pub fn nft_supply_for_type(
        &self,
        token_type: &String,
    ) -> U64 {
        let tokens_per_type = 
        self.tokens_per_type.get(&token_type);
        
        if let Some(tokens_per_type) = tokens_per_type {
            U64(tokens_per_type.len())
        } else {
            U64(0)
        }
    }

    #[private]
    fn check_filter_in_set(&self, set: &Option<HashSet<String>>, value: &String, contains: Option<bool>) -> bool
    {
        match contains
        {
            Some(contains) =>
            {
                match set
                {
                    Some(set) =>
                    {
                        return set.contains(value) == contains;
                    },
                    None =>
                    {
                        if contains
                        {
                            return false;
                        }
                        else
                        {
                            return true;
                        }
                    }
                }
            },
            None => 
            {
                return true;
            }
        }
    }

    #[private]
    fn check_unordered_set(&self, set: &Option<UnorderedSet<String>>, value: &String, check: Option<bool>) -> bool
    {
        match check
        {
            Some(check) =>
            {
                match set
                {
                    Some(set) =>
                    {
                        return check == set.contains(value);
                    },
                    None =>
                    {
                        if check
                        {
                            return false;
                        }
                        else
                        {
                            return true;
                        }
                    }
                }
            },
            None =>
            {
                return true;
            }
        }
    }

    #[private]
    fn check_filter_in_map(&self, map: &UnorderedMap<String, Sale>, key: &String, contains: Option<bool>) -> bool
    {
        match contains
        {
            Some(contains) =>
            {
                let value = map.get(key);

                if (value.is_none() && contains)
                    || (value.is_some() && !contains)
                {
                    return false;
                }
            },
            None => {}
        }

        return true;
    }

    #[private]
    fn check_price(&self, token_id: &TokenId, price_from: Option<U128>, price_to: Option<U128>) -> bool
    {
        if price_from.is_some() || price_to.is_some()
        {
            match self.sales_active.get(token_id)
            {
                Some(sale) =>
                {
                    let price: u128;

                    if sale.sale_type == 1
                    {
                        price = sale.price.unwrap().0;
                    }
                    else
                    {
                        if sale.bids.len() == 0
                        {
                            return false;
                        }

                        price = sale.bids[sale.bids.len() - 1].price;
                    }

                    if (price_from.is_some() && price < price_from.unwrap().0)
                        || (price_to.is_some() && price > price_to.unwrap().0)
                    {
                        return false;
                    }
                },
                None =>
                {
                    return false;
                }
            }
        }
        
        return true;
    }

    fn check_copies(&self, token_id: &TokenId, is_single: Option<bool>) -> bool
    {
        match is_single
        {
            Some(is_single) =>
            {
                let copies : Option<U64>;

                match self.token_metadata_by_id.get(token_id)
                {
                    Some(meta) =>
                    {
                        copies = meta.copies;
                    },
                    None =>
                    {
                        copies = None;
                    }
                }

                if is_single
                {
                    if copies.unwrap_or(U64(1)).0 > 1 
                    {
                        return false;
                    }
                }
                else
                {
                    if copies.unwrap_or(U64(0)).0 < 2
                    {
                        return false;
                    }
                }
            },
            None => {}
        }

        return true;
    }

    pub fn nft_tokens_for_type(
        &self,
        token_type: String,
        from_index: U64,
        limit: u64,
    ) -> Vec<JsonToken> {
        let mut tmp = vec![];
        let tokens_per_type 
        = self.tokens_per_type.get(&token_type);

        let tokens = 
        if let Some(tokens_per_type) = tokens_per_type 
        {
            tokens_per_type
        } 
        else 
        {
            return vec![];
        };

        let keys = tokens.as_vector();

        let start = u64::from(from_index);
        
        let end = min(start + limit, keys.len());
        
        for i in start..end 
        {
            tmp.push(
                self.nft_token(keys.get(i).unwrap()).unwrap()
            );
        }
        tmp
    }
    
    // ///???????????????? ?????????????? ???? ??????????????
    // pub fn nft_tokens_by_filter(
    //     &self,
    //     // ?????????????? ?????? null|none
    //     catalog: Option<String>,
    //    // order by ????????
    //     sort: u8, 
    //     //??????????????????
    //     page_index: u64,
    //     //???????? ?????????????????? ???? ????????????????
    //     page_size: u64,
    //     account_id:Option<AccountId>
    // ) ->Vec<JsonToken> 
    // {
    //     let token_ids : HashSet<String>;

    //     let mut skip = 0;
    //     if page_index > 1
    //     {
    //         skip = (page_index - 1) * page_size;
    //     }

    //     if catalog.is_some()
    //     {
    //         let tokens = self.tokens_per_type.get(&catalog.unwrap());
    //         if tokens.is_none()
    //         {
    //             return Vec::new();
    //         }

    //         token_ids = Converter::vec_string_to_hash_set(&tokens.unwrap().to_vec());
    //     }
    //     else
    //     {
    //         token_ids = Converter::vec_string_to_hash_set(&self.nft_tokens_keys(Some(U128::from(0)), Some(self.token_metadata_by_id.len())));
    //     }

    //     let mut available_amount = token_ids.len() as i64 - skip as i64;

    //     if available_amount <= 0
    //     {
    //         return Vec::new();
    //     }

    //     if available_amount > page_size as i64
    //     {
    //         available_amount = page_size as i64;
    //     }
       
    //     let mut is_reverse : bool = false;
    //     let sorted : Vec<SortedToken>;

    //     let mut result : Vec<JsonToken> = Vec::new();

    //     match sort
    //     {
    //         9 =>
    //         {
    //             sorted = self.tokens_sorted.get(&5).unwrap_or(Vec::new());
    //             is_reverse = true;
    //         },
    //         10 =>
    //         {
    //             sorted = self.tokens_sorted.get(&2).unwrap_or(Vec::new());
    //             is_reverse = true;
    //         }
    //         _ =>
    //         {
    //             sorted = self.tokens_sorted.get(&sort).unwrap_or(Vec::new());
    //         }
    //     }

    //     if sorted.len() < skip as usize
    //     {
    //         return Vec::new();
    //     }

    //     let limit = available_amount as usize;
    //     let mut stop = false;

    //     if is_reverse
    //     {
    //         let mut start_index = token_ids.len() as i64 - skip as i64 - 1;

    //         //while start_index > end_index && !stop
    //         while result.len() < limit && !stop
    //         {
    //             let _index = start_index as usize;
    //             let _token = sorted.get(_index);

    //             match _token
    //             {
    //                 Some(_token) =>
    //                 {
    //                     if token_ids.contains(&_token.token_id)
    //                     {
    //                         match self.nft_token_for_account
    //                         (
    //                             &_token.token_id,
    //                             account_id.clone()
    //                         )
    //                         {
    //                             Some(res) =>
    //                             {
    //                                 result.push(res);
    //                             },
    //                             None =>
    //                             {
    //                                 continue;
    //                             }
    //                         }
    //                     }
    //                 },
    //                 None =>
    //                 {
    //                     stop = true;
    //                 }
    //             }

    //             start_index = start_index - 1;
    //         }
    //     }
    //     else
    //     {
    //         //while skip < skip + available_amount as u64 && !stop
    //         while result.len() < limit && !stop
    //         {
    //             let _index = skip as usize;
    //             let _token = sorted.get(_index);

    //             match _token
    //             {
    //                 Some(_token) =>
    //                 {
    //                     if token_ids.contains(&_token.token_id)
    //                     {
    //                         match self.nft_token_for_account
    //                         (
    //                             &_token.token_id,
    //                             account_id.clone()
    //                         )
    //                         {
    //                             Some(res) =>
    //                             {
    //                                 result.push(res);
    //                             },
    //                             None =>
    //                             {
    //                                 continue;
    //                             }
    //                         }
    //                     }
    //                 },
    //                 None =>
    //                 {
    //                     stop = true;
    //                 }
    //             }

    //             skip = skip + 1;
    //         }
    //     }

    //     return result;
    // }

    ///???????????????? ?????????????? ???? ??????????????
    pub fn nft_tokens_by_filter(
        &self,
        // ?????????????? ?????? null|none
        catalog: Option<String>,
       // order by ????????
        sort: u8, 
        //??????????????????
        page_index: u64,
        //???????? ?????????????????? ???? ????????????????
        page_size: u64,
        account_id:Option<AccountId>,
        is_for_sale: Option<bool>,
        owner_id: Option<AccountId>,
        creator_id: Option<AccountId>,
        is_liked: Option<bool>,
        is_followed: Option<bool>,
        is_active_bid: Option<bool>,
        price_from: Option<U128>,
        price_to: Option<U128>,
        is_single: Option<bool>
    ) ->Vec<JsonToken> 
    {

        let token_ids : HashSet<String>;
        let tokens_per_owner : Option<UnorderedSet<TokenId>>;
        let tokens_per_creator : Option<UnorderedSet<TokenId>>;
        let check_owner : Option<bool>;
        let check_creator : Option<bool>;

        if owner_id.is_some()
        {
            match self.tokens_per_owner.get(&owner_id.unwrap())
            {
                Some(value) =>
                {
                    tokens_per_owner = Some(value);
                },
                None =>
                {
                    return Vec::new();
                }
            }

            check_owner = Some(true);
        }
        else
        {
            tokens_per_owner = None;
            check_owner = None;
        }

        if creator_id.is_some()
        {
            match self.tokens_per_creator.get(&creator_id.unwrap())
            {
                Some(value) =>
                {
                    tokens_per_creator = Some(value);
                },
                None =>
                {
                    return Vec::new();
                }
            }

            check_creator = Some(true);
        }
        else
        {
            tokens_per_creator = None;
            check_creator = None;
        }

        let mut skip = 0;
        if page_index > 1
        {
            skip = (page_index - 1) * page_size;
        }

        if catalog.is_some()
        {
            let tokens = self.tokens_per_type.get(&catalog.unwrap());
            if tokens.is_none()
            {
                return Vec::new();
            }

            token_ids = Converter::vec_string_to_hash_set(&tokens.unwrap().to_vec());
        }
        else
        {
            token_ids = Converter::vec_string_to_hash_set(&self.nft_tokens_keys(Some(U128::from(0)), Some(self.token_metadata_by_id.len())));
        }

        let mut available_amount = token_ids.len() as i64 - skip as i64;

        if available_amount <= 0
        {
            return Vec::new();
        }

        if available_amount > page_size as i64
        {
            available_amount = page_size as i64;
        }
       
        let mut is_reverse : bool = false;
        let sorted : Vec<SortedToken>;

        let mut result : Vec<JsonToken> = Vec::new();

        match sort
        {
            9 =>
            {
                sorted = self.tokens_sorted.get(&5).unwrap_or(Vec::new());
                is_reverse = true;
            },
            10 =>
            {
                sorted = self.tokens_sorted.get(&2).unwrap_or(Vec::new());
                is_reverse = true;
            }
            _ =>
            {
                sorted = self.tokens_sorted.get(&sort).unwrap_or(Vec::new());
            }
        }

        if sorted.len() < skip as usize
        {
            return Vec::new();
        }

        let limit = available_amount as usize;
        let mut stop = false;

        let my_likes : Option<HashSet<String>>;
        let my_follows : Option<HashSet<String>>;
        let my_bids : Option<UnorderedSet<TokenId>>;

        match account_id.clone()
        {
            Some(account_id) =>
            {
                my_likes = self.my_tokens_likes.get(&account_id);
                my_follows = self.my_tokens_followed.get(&account_id);
                my_bids = self.my_bids_active.get(&account_id);
            },
            None =>
            {
                my_likes = None;
                my_follows = None;
                my_bids = None;
            }
        }

        if is_reverse
        {
            let mut start_index = token_ids.len() as i64 - skip as i64 - 1;

            //while start_index > end_index && !stop
            while result.len() < limit && !stop
            {
                let _index = start_index as usize;
                let _token = sorted.get(_index);

                start_index = start_index - 1;

                match _token
                {
                    Some(_token) =>
                    {
                        if token_ids.contains(&_token.token_id)
                        {
                            if !self.check_unordered_set(&tokens_per_owner, &_token.token_id, check_owner)
                            {
                                continue;
                            }

                            if !self.check_unordered_set(&tokens_per_creator, &_token.token_id, check_creator)
                            {
                                continue;
                            }

                            if !self.check_unordered_set(&my_bids, &_token.token_id, is_active_bid)
                            {
                                continue;
                            }

                            if !self.check_filter_in_map(&self.sales_active, &_token.token_id, is_for_sale)
                            {
                                continue;
                            }

                            if !self.check_filter_in_set(&my_likes, &_token.token_id, is_liked)
                            {
                                continue;
                            }

                            if !self.check_filter_in_set(&my_follows, &_token.token_id, is_followed)
                            {
                                continue;
                            }

                            if !self.check_price(&_token.token_id, price_from, price_to)
                            {
                                continue;
                            }

                            if !self.check_copies(&_token.token_id, is_single)
                            {
                                continue;
                            }

                            match self.nft_token_for_account
                            (
                                &_token.token_id,
                                account_id.clone()
                            )
                            {
                                Some(res) =>
                                {
                                    result.push(res);
                                },
                                None =>
                                {
                                    continue;
                                }
                            }
                        }
                    },
                    None =>
                    {
                        stop = true;
                    }
                }
            }
        }
        else
        {
            //while skip < skip + available_amount as u64 && !stop
            while result.len() < limit && !stop
            {
                let _index = skip as usize;
                let _token = sorted.get(_index);

                skip = skip + 1;

                match _token
                {
                    Some(_token) =>
                    {
                        if token_ids.contains(&_token.token_id)
                        {
                            if !self.check_unordered_set(&tokens_per_owner, &_token.token_id, check_owner)
                            {
                                continue;
                            }

                            if !self.check_unordered_set(&tokens_per_creator, &_token.token_id, check_creator)
                            {
                                continue;
                            }

                            if !self.check_unordered_set(&my_bids, &_token.token_id, is_active_bid)
                            {
                                continue;
                            }

                            if !self.check_filter_in_map(&self.sales_active, &_token.token_id, is_for_sale)
                            {
                                continue;
                            }

                            if !self.check_filter_in_set(&my_likes, &_token.token_id, is_liked)
                            {
                                continue;
                            }

                            if !self.check_filter_in_set(&my_follows, &_token.token_id, is_followed)
                            {
                                continue;
                            }

                            if !self.check_price(&_token.token_id, price_from, price_to)
                            {
                                continue;
                            }

                            if !self.check_copies(&_token.token_id, is_single)
                            {
                                continue;
                            }

                            match self.nft_token_for_account
                            (
                                &_token.token_id,
                                account_id.clone()
                            )
                            {
                                Some(res) =>
                                {
                                    result.push(res);
                                },
                                None =>
                                {
                                    continue;
                                }
                            }
                        }
                    },
                    None =>
                    {
                        stop = true;
                    }
                }
            }
        }

        return result;
    }

    ///?????????????? ?????????????? ?????????????? ????????????????????????
    pub fn my_purchases(
        &self,
        // ?????????????? ?????? null|none
        catalog: Option<String>,
        //??????????????????
        page_index: u64,
        //???????? ?????????????????? ???? ????????????????
        page_size: u64,
        account_id:AccountId
    ) ->Vec<MySaleHistoryJson> 
    {
        let token_ids : HashSet<String>;

        let mut skip = 0;
        if page_index > 1
        {
            skip = (page_index - 1) * page_size;
        }

        if catalog.is_some()
        {
            let tokens = self.tokens_per_type.get(&catalog.unwrap());
            if tokens.is_none()
            {
                return Vec::new();
            }

            token_ids = Converter::vec_string_to_hash_set(&tokens.unwrap().to_vec());
        }
        else
        {
            token_ids = Converter::vec_string_to_hash_set(&self.nft_tokens_keys(Some(U128::from(0)), Some(self.token_metadata_by_id.len())));
        }

        let mut available_amount = token_ids.len() as i64 - skip as i64;

        if available_amount <= 0
        {
            return Vec::new();
        }

        if available_amount > page_size as i64
        {
            available_amount = page_size as i64;
        }
       
        let mut result : Vec<MySaleHistoryJson> = Vec::new();

        let limit = available_amount as usize;
        let mut stop = false;

        match self.my_purchases.get(&account_id)
        {
            Some(my_purchases) =>
            {
                while result.len() < limit && !stop
                {
                    let _index = skip as usize;
                    let item = my_purchases.get(_index);

                    match item
                    {
                        Some(item) =>
                        {
                            if token_ids.contains(&item.token_id)
                            {
                                result.push(MySaleHistoryJson
                                {
                                    price: item.price,
                                    date: item.date,
                                    account: Profile::get_full_profile(
                                        &self.profiles,
                                        &item.account,
                                        &Some(account_id.clone()),
                                        &self.autors_likes,
                                        &self.autors_followers,
                                        &self.tokens_per_owner,
                                        true
                                    ),
                                    token: self.nft_token_for_account
                                    (
                                        &item.token_id,
                                        Some(account_id.clone())
                                    )
                                });
                            }
                        },
                        None =>
                        {
                            stop = true;
                        }
                    }

                    skip = skip + 1;
                }
            },
            None => {}
        }

        return result;
    }

    ///?????????????? ?????????????? ?????????????? ????????????????????????
    pub fn my_sales(
        &self,
        // ?????????????? ?????? null|none
        catalog: Option<String>,
        //??????????????????
        page_index: u64,
        //???????? ?????????????????? ???? ????????????????
        page_size: u64,
        account_id:AccountId
    ) ->Vec<MySaleHistoryJson> 
    {
        let token_ids : HashSet<String>;

        let mut skip = 0;
        if page_index > 1
        {
            skip = (page_index - 1) * page_size;
        }

        if catalog.is_some()
        {
            let tokens = self.tokens_per_type.get(&catalog.unwrap());
            if tokens.is_none()
            {
                return Vec::new();
            }

            token_ids = Converter::vec_string_to_hash_set(&tokens.unwrap().to_vec());
        }
        else
        {
            token_ids = Converter::vec_string_to_hash_set(&self.nft_tokens_keys(Some(U128::from(0)), Some(self.token_metadata_by_id.len())));
        }

        let mut available_amount = token_ids.len() as i64 - skip as i64;

        if available_amount <= 0
        {
            return Vec::new();
        }

        if available_amount > page_size as i64
        {
            available_amount = page_size as i64;
        }
       
        let mut result : Vec<MySaleHistoryJson> = Vec::new();

        let limit = available_amount as usize;
        let mut stop = false;

        match self.my_sales.get(&account_id)
        {
            Some(my_sales) =>
            {
                while result.len() < limit && !stop
                {
                    let _index = skip as usize;
                    let item = my_sales.get(_index);

                    match item
                    {
                        Some(item) =>
                        {
                            if token_ids.contains(&item.token_id)
                            {
                                result.push(MySaleHistoryJson
                                {
                                    price: item.price,
                                    date: item.date,
                                    account: Profile::get_full_profile(
                                        &self.profiles,
                                        &item.account,
                                        &Some(account_id.clone()),
                                        &self.autors_likes,
                                        &self.autors_followers,
                                        &self.tokens_per_owner,
                                        true
                                    ),
                                    token: self.nft_token_for_account
                                    (
                                        &item.token_id,
                                        Some(account_id.clone())
                                    )
                                });
                            }
                        },
                        None =>
                        {
                            stop = true;
                        }
                    }

                    skip = skip + 1;
                }
            },
            None => {}
        }

        return result;
    }
    
    ///???????????????? ???????? ???? ????????????
    pub fn nft_token_get(
        &self,
        // id ????????????
        token_id: TokenId,
        account_id:Option<AccountId>
    ) -> JsonToken 
    {
        return self.nft_token_for_account(&token_id, account_id).unwrap();
    }
    

    pub fn nft_supply_for_owner(
        &self,
        account_id: AccountId,
    ) -> U128 {
        let tokens_owner = self.tokens_per_owner.get(&account_id);
        if let Some(tokens_owner) = tokens_owner {
            U128(tokens_owner.len() as u128)
        } else {
            U128(0)
        }
    }

    ///???????????? ????????????????
    pub fn nft_tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<JsonToken> {
        let tokens_owner = self.tokens_per_owner.get(&account_id);

        let tokens = if let Some(tokens_owner) = tokens_owner 
        {
            tokens_owner
        } 
        else 
        {
            return vec![];
        };

        let keys = tokens.as_vector();
        let start = u128::from(from_index.unwrap_or(U128(0)));
        keys.iter()
            .skip(start as usize)
            .take(limit.unwrap_or(0) as usize)
            .map(|token_id| self.nft_token_for_account(&token_id, Some(account_id.clone())).unwrap())
            .collect()
    }

    pub fn nft_liked_for_account(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<Option<JsonToken>> 
    {
        if let Some(_liked_tokens)=self.my_tokens_likes.get(&account_id){

            let keys:Vec<TokenId> = _liked_tokens.into_iter().collect();
            let start = u128::from(from_index.unwrap_or(U128(0)));
            keys.iter()
                .skip(start as usize)
                .take(limit.unwrap_or(0) as usize)
                .map(|token_id| self.nft_token_for_account(&token_id, Some(account_id.clone())))
                .collect()

        }
        else
        {
            return vec![];
        }
    }

    //?????????????? ??????????????
    pub fn authors_by_storage_para(&self,parameter: u8)->Vec<ProfileStatCriterion>{
        return self.profiles_global_stat_sorted_vector.get(&parameter).unwrap();
    }

    pub fn authors_clear(&mut self)
    {
        self.profiles_global_stat_sorted_vector = LookupMap::new (StorageKey::ProfilesGlobalStatSortedVector.try_to_vec().unwrap());
    }

    pub fn sale_history(&self, 
        token_id: TokenId,
        //??????????????????
        page_index: u64,
        //???????? ?????????????????? ???? ????????????????
        page_size: u64,
        asked_account_id:Option<AccountId>) -> Vec<SaleHistoryJson>
    {
        match self.sales_history_by_token_id.get(&token_id)
        {
            Some(history) =>
            {
                if history.len() == 0
                {
                    return Vec::new();
                }

                let mut start_index : i64 = 0;

                if page_index > 1
                {
                    start_index = (page_index as i64 - 1) * page_size as i64;
                }

                let history_len = history.len() as i64;
                if start_index >= history_len
                {
                    return Vec::new();
                }

                let mut end_index = start_index + page_size as i64;
                if end_index > history_len
                {
                    end_index = history_len;
                }

                let mut result : Vec<SaleHistoryJson> = Vec::new();

                for i in start_index..end_index
                {
                    let _index = i as usize;

                    let item = history.get(_index);
                    if item.is_none()
                    {
                        break;
                    }

                    let item_unwrapped = item.unwrap();

                    result.push(SaleHistoryJson
                    {
                        account_from: Profile::get_full_profile(
                            &self.profiles,
                            &item_unwrapped.account_from,
                            &asked_account_id,
                            &self.autors_likes,
                            &self.autors_followers,
                            &self.tokens_per_owner,
                            true
                        ),
                        account_to: Profile::get_full_profile(
                            &self.profiles,
                            &item_unwrapped.account_to,
                            &asked_account_id,
                            &self.autors_likes,
                            &self.autors_followers,
                            &self.tokens_per_owner,
                            true
                        ),
                        price: item_unwrapped.price,
                        date: item_unwrapped.date
                    });
                }

                return result;
            },
            None =>
            {
                return Vec::new();
            }
        }
    }

    pub fn token_owners_history(&self, 
        token_id: TokenId,
        //??????????????????
        page_index: u64,
        //???????? ?????????????????? ???? ????????????????
        page_size: u64,
        asked_account_id:Option<AccountId>) -> Vec<JsonProfile>
    {
        let mut result : Vec<JsonProfile> = Vec::new();

        if page_index <= 1
        {
            match self.creator_per_token.get(&token_id)
            {
                Some(creator) =>
                {
                    let res = Profile::get_full_profile(
                        &self.profiles,
                        &creator,
                        &asked_account_id,
                        &self.autors_likes,
                        &self.autors_followers,
                        &self.tokens_per_owner,
                        true
                    );

                    if res.is_some()
                    {
                        result.push(res.unwrap());
                    }
                },
                None => {}
            }
        }

        match self.sales_history_by_token_id.get(&token_id)
        {
            Some(history) =>
            {
                if history.len() == 0
                {
                    return result;
                }

                let mut start_index : i64 = 0;

                if page_index > 1
                {
                    start_index = (page_index as i64 - 1) * page_size as i64;
                    if start_index > 0
                    {
                        start_index = start_index - 1;
                    }
                }

                let history_len = history.len() as u64;
                if start_index >= history_len as i64
                {
                    return result;
                }

                let mut i = start_index as u64;

                while result.len() < page_size as usize
                    && i < history_len
                {
                    let _index = i as usize;

                    let item = history.get(_index);
                    if item.is_none()
                    {
                        break;
                    }

                    let item_unwrapped = item.unwrap();
                    let res = Profile::get_full_profile(
                        &self.profiles,
                        &item_unwrapped.account_to,
                        &asked_account_id,
                        &self.autors_likes,
                        &self.autors_followers,
                        &self.tokens_per_owner,
                        true
                    );

                    if res.is_some()
                    {
                        result.push(res.unwrap());
                    }

                    i = i + 1;
                }

                return result;
            },
            None => {}
        }
            
        return result;
    }


    //???????????? ??????????????
    pub fn authors_by_filter(
        &self,
        //???? ???????? ??????????????????
        parameter: u8, 
       // true = asc
       is_reverse: bool, 
        //??????????????????
        page_index: u64,
        //???????? ?????????????????? ???? ????????????????
        page_size: u64,
        asked_account_id:Option<AccountId>
    ) ->Vec<Option<JsonProfile>> {

        if !self.profiles_global_stat_sorted_vector.contains_key(&parameter)
        {
            return Vec::new();
        }

        let authors_ids : Vec<ProfileStatCriterion>;
        let mut skip = 0;
        if page_index >= 1
        {
            skip = (page_index - 1) * page_size;
        }

        authors_ids=self.profiles_global_stat_sorted_vector.get(&parameter).unwrap_or(Vec::new());

        let mut available_amount = authors_ids.len() as i64 - skip as i64;

        if available_amount <= 0
        {
            return Vec::new();
        }

        if available_amount > page_size as i64
        {
            available_amount = page_size as i64;
        }
       
        if authors_ids.len() < skip as usize
        {
            return Vec::new();
        }

        let mut result : Vec<Option<JsonProfile>> = Vec::new();

        if is_reverse
        {
            let start_index = authors_ids.len() as i64 - skip as i64;
            let end_index = start_index - available_amount;

            for i in (end_index..start_index).rev()
            {
                let _index = i as usize;
                let _author_id=authors_ids.get(_index);
                    
                if _author_id.is_some() && !_author_id.is_none()
                {
                  result.push (
                    Profile::get_full_profile(
                        &self.profiles,
                        &_author_id.unwrap().account_id,
                        &asked_account_id,
                        &self.autors_likes,
                        &self.autors_followers,
                        &self.tokens_per_owner,
                        true
                    ));
                }
            }
        }
        else
        {
            for i in skip..skip + available_amount as u64
            {
                let _index = i as usize;
                let _author_id = authors_ids.get(_index);

                if !_author_id.is_some() || _author_id.is_none()
                {
                    continue;
                }

                result.push (
                    Profile::get_full_profile(
                        &self.profiles,
                        &_author_id.unwrap().account_id,
                        &asked_account_id,
                        &self.autors_likes,
                        &self.autors_followers,
                        &self.tokens_per_owner,
                        true
                  ));
            }
        }

        return result;
    }

    ///???????????? ???????????????????? ??????????????
    pub fn liked_authors_for_account(
        &self,
        account_id: AccountId,
        //??????????????????
        page_index: u64,
        //???????? ?????????????????? ???? ????????????????
        page_size: u64
    ) ->Vec<Option<JsonProfile>> {

        if !self.my_authors_likes.contains_key(&account_id)
        {
            return Vec::new();
        }

        let _accoutn_id=Some(account_id.clone());
        let authors_ids : Vec<AccountId>;
        let mut skip = 0;
        if page_index >= 1
        {
            skip = (page_index - 1) * page_size;
        }

        authors_ids=(self.my_authors_likes.get(&account_id).unwrap_or(HashSet::new())).into_iter().collect();

        let mut available_amount = authors_ids.len() as i64 - skip as i64;

        if available_amount <= 0
        {
            return Vec::new();
        }

        if available_amount > page_size as i64
        {
            available_amount = page_size as i64;
        }
       
        if authors_ids.len() < skip as usize
        {
            return Vec::new();
        }

        let mut result : Vec<Option<JsonProfile>> = Vec::new();

       
            for i in skip..skip + available_amount as u64
            {
                let _index = i as usize;
                let _author_id = authors_ids.get(_index);

                if !_author_id.is_some() || _author_id.is_none()
                {
                    continue;
                }

                result.push (
                    Profile::get_full_profile(
                        &self.profiles,
                        &_author_id.unwrap(),
                        &_accoutn_id,
                        &self.autors_likes,
                        &self.autors_followers,
                        &self.tokens_per_owner,
                        true
                  ));
            }
        

        return result;
    }


    ///???????????? ??????????????, ?????? ????????????????????????????????
    pub fn followed_authors_for_account(
        &self,
        account_id: AccountId,
        //??????????????????
        page_index: u64,
        //???????? ?????????????????? ???? ????????????????
        page_size: u64
    ) ->Vec<Option<JsonProfile>> 
    {
        if !self.my_autors_followed.contains_key(&account_id)
        {
            return Vec::new();
        }

        let _accoutn_id=Some(account_id.clone());
        let authors_ids : Vec<AccountId>;
        let mut skip = 0;
        if page_index >= 1
        {
            skip = (page_index - 1) * page_size;
        }

        authors_ids=(self.my_autors_followed.get(&account_id).unwrap_or(HashSet::new())).into_iter().collect();

        let mut available_amount = authors_ids.len() as i64 - skip as i64;

        if available_amount <= 0
        {
            return Vec::new();
        }

        if available_amount > page_size as i64
        {
            available_amount = page_size as i64;
        }
       
        if authors_ids.len() < skip as usize
        {
            return Vec::new();
        }

        let mut result : Vec<Option<JsonProfile>> = Vec::new();
       
        for i in skip..skip + available_amount as u64
        {
            let _index = i as usize;
            let _author_id = authors_ids.get(_index);

            match _author_id
            {
                Some(author_id) =>
                {
                    result.push
                    (
                        Profile::get_full_profile
                        (
                            &self.profiles,
                            &author_id,
                            &_accoutn_id,
                            &self.autors_likes,
                            &self.autors_followers,
                            &self.tokens_per_owner,
                            true
                        )
                    );
                },
                None =>
                {
                    continue;
                }
            }
        }
        
        return result;
    }
}
