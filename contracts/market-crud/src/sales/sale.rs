use crate::*;

#[path = "../helpers/converters.rs"]
mod converters;

use converters::Converter;

//Структура зберігання історію продажу токенів
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SaleHistory {
    //owner of the sale
    pub account_from: AccountId,
    //reciever of token
    pub account_to: AccountId,
    //token identifier
    pub token_id: TokenId,
    //sale price in yoctoNEAR that the token is listed for
    pub price: U128,
    // fixed/auction
    pub sale_type: u8,
    /// utc timestamp
    pub date: u128
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SaleHistoryJson {
    //owner of the sale
    pub account_from: Option<JsonProfile>,
    //reciever of token
    pub account_to: Option<JsonProfile>,
    //token object
    pub token: Option<JsonToken>,
    //sale price in yoctoNEAR that the token is listed for
    pub price: U128,
    // fixed/auction
    pub sale_type: u8,
    /// utc timestamp
    pub date: u128
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct MySaleHistory {
    //second user
    pub account: AccountId,
    //reciever of token
    pub token_id: TokenId,
    //sale price in yoctoNEAR that the token is listed for
    pub price: U128,
    /// utc timestamp
    pub date: u128
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct MySaleHistoryJson {
    //second user
    pub account: Option<JsonProfile>,
    //reciever of token
    pub token: Option<JsonToken>,
    //sale price in yoctoNEAR that the token is listed for
    pub price: U128,
    /// utc timestamp
    pub date: u128
}

//Структура однієї ставки на аукціоні
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SaleBid
{
    pub account_id: AccountId,
    pub date: u128,
    pub price: u128
}

//Структура однієї ставки на аукціоні
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SaleBidJson
{
    pub date: U128,
    pub price: U128,
    pub account: Option<JsonProfile>
}

impl Clone for SaleBid
{
    fn clone(&self) -> SaleBid
    {
        return SaleBid
        {
            account_id: self.account_id.clone(),
            date: self.date,
            price: self.price
        };
    }
}

//Токен виставлений на продаж, інформацію для продажу
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Sale {
    
    //1 - fixed price
    //2 - timed auction
    //3 - unlimited auction
    pub sale_type : u8,
    //sale price in yoctoNEAR that the token is listed for
    pub price: Option<U128>,

    // дата початку продажів
    pub start_date: Option<u128>,

    // дата завершення продажів
    pub end_date: Option<u128>,

    // ставки по аукціону
    pub bids : Vec<SaleBid>,

    //Признак, що аукціон закритий власником,
    //І останній покупець може забрати лот
    pub is_closed : bool
}

//Токен виставлений на продаж, інформацію для продажу
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SaleJson {
    
    //1 - fixed price
    //2 - timed auction
    //3 - unlimited auction
    pub sale_type : u8,
    //sale price in yoctoNEAR that the token is listed for
    pub price: Option<U128>,

    // дата початку продажів
    pub start_date: Option<u128>,

    // дата завершення продажів
    pub end_date: Option<u128>,

    // ставки по аукціону
    pub bids : Vec<SaleBidJson>,

    //Признак, що аукціон закритий власником,
    //І останній покупець може забрати лот
    pub is_closed : bool
}

#[near_bindgen]
impl Contract {
    
    //removes a sale from the market. 
    #[private]
    pub fn sale_remove_inner(&mut self, token_id: &TokenId) -> Sale
    {

        let sale = self.sales_active.remove(token_id).expect("No sale");

        let creator = self.creator_per_token.get(&token_id).unwrap();
        let artist = self.token_metadata_by_id.get(&token_id).unwrap().artist;
        let collection_id = self.collection_per_token.get(&token_id);

        self.recount_price_stat(&creator, &artist, &collection_id);

        return sale;
    }

    #[payable]
    pub fn sale_remove(&mut self, token_id: TokenId) -> Sale
    {
        let token = self.tokens_by_id.get(&token_id).expect("Token not found");
        
        assert_eq!(token.owner_id, env::predecessor_account_id(), "Forbidden");

        return self.sale_remove_inner(&token_id);
    }

    pub fn sale_get(&self, token_id: &TokenId, asked_account_id: Option<AccountId>, with_bids: bool) -> Option<SaleJson>
    {
        let sale_option = self.sales_active.get(&token_id);
        if sale_option.is_none()
        {
            return None;
        }

        let sale = sale_option.unwrap();
        let mut sale_json = SaleJson
        {
            sale_type: sale.sale_type,
            price: sale.price,
            start_date: sale.start_date,
            end_date: sale.end_date,
            is_closed: sale.is_closed,
            bids: Vec::new()
        };

        if sale.sale_type == 2 || sale.sale_type == 3
        {
            if sale.bids.len() > 0
            {
                if with_bids
                {
                    for i in (0..sale.bids.len()).rev()
                    {
                        sale_json.bids.push(SaleBidJson
                        {
                            price: U128(sale.bids[i].price),
                            date: U128(sale.bids[i].date),
                            account: self.get_full_profile(
                                &sale.bids[i].account_id,
                                &asked_account_id,
                                true
                            )
                        });
                    }
                }
                else
                {
                    let bids_len = sale.bids.len();

                    if bids_len > 0
                    {
                        let i = bids_len - 1;

                        sale_json.bids.push(SaleBidJson
                        {
                            price: U128(sale.bids[i].price),
                            date: U128(sale.bids[i].date),
                            account: self.get_full_profile(
                                &sale.bids[i].account_id,
                                &asked_account_id,
                                true
                            )
                        });
                    }
                }
            }
        }
        
        return Some(sale_json);
    }

    #[payable]
    pub fn sale_create(
        &mut self,
        token_id: TokenId,
        sale_type: u8,
        mut price: Option<U128>,
        mut start_date: Option<u128>,
        mut end_date: Option<u128>
    ) {
        //get the signer which is the person who initiated the transaction
        let signer_id = env::signer_account_id();
        let token = self.nft_token(token_id.clone()).expect("Token not found");

        //make sure the owner ID is the signer. 
        assert_eq!(
            token.owner_id,
            signer_id,
            "Forbidden"
        );

        let statistic_price: u128;

        match sale_type
        {
            1 =>
            {
                let num_price: u128;

                match price
                {
                    Some(pr) =>
                    {
                        num_price = pr.0;

                        if num_price <= 0
                        {
                            panic!("Price must be greater then 0");
                        }

                        statistic_price = pr.0;
                    },
                    None =>
                    {
                        panic!("Price is required");
                    }
                }

                start_date = None;
                end_date = None;

                self.tokens_resort(token_id.clone(), 5, Some(num_price));
            },
            2 | 3 =>
            {
                if sale_type == 2 
                    && (start_date.is_none() || end_date.is_none())
                {
                    panic!("Time limits are required");
                }

                price = None;
                statistic_price = 0;
            },
            _ =>
            {
                panic!("Not supported type");
            }
        }

        //let owner_paid_storage = self.storage_deposits.get(&signer_id).unwrap_or(0);
        
        //insert the key value pair into the sales map. Key is the unique ID. value is the sale object
        self.sales_active.insert(
            &token_id,
            &Sale {
                sale_type: sale_type,
                price : price,
                start_date: start_date,
                end_date: end_date,
                bids: Vec::new(),
                is_closed: false
           }
        );


        //====================Статистика по користувачу=========================//
        let creator = self.creator_per_token.get(&token_id).unwrap();
        let artist = self.token_metadata_by_id.get(&token_id).unwrap().artist;

        ProfileStatCriterion::profile_stat_price_check_and_change(
            &mut self.profiles_global_stat, 
            &mut self.profiles_global_stat_sorted_vector,
            &creator,
            &artist,
            statistic_price,
            Some(0),
            false
        );
        //====================Статистика по користувачу=========================//


        //====================Статистика по колекції=========================//
        if let Some(collection_id) = self.collection_per_token.get(&token_id)
        {
            self.collection_stat_price_check_and_change(&collection_id, statistic_price, false);
        }
        //====================Статистика по колекції=========================//
    }

    //updates the price for a sale on the market
    #[payable]
    pub fn sale_update_price(
        &mut self,
        token_id: String,
        price: U128,
    ) {
        let token = self.nft_token(token_id.clone());

        if token.is_none()
        {
            panic!("Token not found");
        }

        let account_id = env::predecessor_account_id();

        assert_eq!(token.unwrap().owner_id, account_id, "Must be token owner");
        
        
        //get the sale object from the unique sale ID. If there is no token, panic. 
        let sale = self.sales_active.get(&token_id).expect("No sale");
        assert_eq!(sale.sale_type, 1, "Can not update price of auction");

        self.sales_active.remove(&token_id).expect("No sale removed");

        self.sales_active.insert(&token_id, &Sale
        {
            sale_type: sale.sale_type,
            price: Some(price),
            start_date: sale.start_date,
            end_date: sale.end_date,
            bids: sale.bids,
            is_closed: sale.is_closed
        });

        let creator = self.creator_per_token.get(&token_id).unwrap();
        let artist = self.token_metadata_by_id.get(&token_id).unwrap().artist;
        let collection_id = self.collection_per_token.get(&token_id);

        self.recount_price_stat(&creator, &artist, &collection_id);

        self.tokens_resort(token_id.clone(), 5, Some(price.0));
    }

    //Закрити/відкрити ставки по аукціону
    #[payable]
    pub fn sale_set_is_closed(
        &mut self,
        token_id: String,
        is_closed: bool
    ) {
        let token = self.nft_token(token_id.clone());

        if token.is_none()
        {
            panic!("Token not found");
        }

        let account_id = env::predecessor_account_id();

        assert_eq!(token.unwrap().owner_id, account_id, "Must be token owner");
        
        //get the sale object from the unique sale ID. If there is no token, panic. 
        let sale = self.sales_active.get(&token_id).expect("No sale");

        if sale.is_closed == is_closed
        {
            panic!("Sale is already in selected state");
        }

        if sale.sale_type != 2 && sale.sale_type != 3
        {
            panic!("Only auction can be closed");
        }

        if is_closed && sale.bids.len() == 0
        {
            panic!("Can not close sale without bids");
        }

        self.sales_active.insert(&token_id, &Sale
        {
            sale_type: sale.sale_type,
            price: sale.price,
            start_date: sale.start_date,
            end_date: sale.end_date,
            bids: sale.bids,
            is_closed: is_closed
        });
    }

    //Забрати лот по аукціону (доступно тільки якщо він вже закритий)
    #[payable]
    pub fn sale_auction_init_transfer(
        &mut self,
        token_id: String,
        time: u128
    ) {
        //get the attached deposit and make sure it's greater than 0
        let deposit = env::attached_deposit();

        let token = self.nft_token(token_id.clone()).expect("Token not found");

        let sale = self.sales_active.get(&token_id).expect("Token is not for sale");
        if sale.sale_type != 2 && sale.sale_type != 3
        {
            panic!("Sale is not on auction");
        }

        // if !sale.is_closed
        // {
        //     panic!("Sale is not closed");
        // }

        if sale.sale_type == 2 && sale.end_date.unwrap() >= time
        {
            panic!("Auction is not finished yet");
        }

        //get the buyer ID which is the person who called the function and make sure they're not the owner of the sale
        let buyer_id = env::predecessor_account_id();
        
        let last_bid = sale.bids.get(sale.bids.len() - 1).expect("error");
        assert_eq!(last_bid.account_id, buyer_id, "forbidden");

        if deposit < last_bid.price
        {
            panic!("Attached deposit must be greater than or equal to the current price");
        }

        //process the purchase (which will remove the sale, transfer and get the payout from the nft contract, and then distribute royalties) 
        self.process_purchase(
            token_id,
            deposit,
            buyer_id,
            token.owner_id,
            time
        );
    }

    //place an offer on a specific sale. The sale will go through as long as your deposit is greater than or equal to the list price
    #[payable]
    pub fn sale_offer(&mut self, token_id: String, offer: Option<U128>, time: u128) {
        //get the attached deposit and make sure it's greater than 0
        let deposit = env::attached_deposit();

        let token = self.nft_token(token_id.clone()).expect("Token not found");

        let mut sale = self.sales_active.get(&token_id).expect("Token is not for sale");

        //get the buyer ID which is the person who called the function and make sure they're not the owner of the sale
        let buyer_id = env::predecessor_account_id();
        assert_ne!(token.owner_id, buyer_id, "Cannot buy your own token.");
        
        match sale.sale_type
        {
            1 =>
            {
                 //get the u128 price of the token (dot 0 converts from U128 to u128)
                let price = sale.price.unwrap();
                if deposit < price.0
                {
                    panic!("Attached deposit must be greater than or equal to the current price");
                }

                //process the purchase (which will remove the sale, transfer and get the payout from the nft contract, and then distribute royalties) 
                self.process_purchase(
                    token_id,
                    deposit,
                    buyer_id,
                    token.owner_id,
                    time
                );
            },
            2 | 3 =>
            {
                // if sale.is_closed
                // {
                //     panic!("Auction is closed for new bids");
                // }

                let price : u128;

                if sale.sale_type == 2
                {
                    if sale.start_date.unwrap() > time
                    {
                        panic!("Sale is not active yet");
                    }

                    if sale.end_date.unwrap() < time
                    {
                        panic!("Auction is closed for new bids");
                    }
                }
                
                if offer.is_none()
                {
                    panic!("Need offer");
                }

                price = offer.unwrap().0;

                if sale.bids.len() == 0
                {
                    if price <= 0
                    {
                        panic!("Offer must be greater then 0");
                    }
                }
                else
                {
                    if price <= sale.bids[sale.bids.len() - 1].price
                    {
                        panic!("Offer must be greater then last offer");
                    }
                }

                let previous_bid_price :Option<u128>;
                if sale.bids.len() == 0
                {
                    previous_bid_price = Some(0);
                }
                else
                {
                    previous_bid_price = Some(sale.bids.get(sale.bids.len() - 1).unwrap().price);
                }


                sale.bids.push(SaleBid
                {
                    account_id: buyer_id.clone(),
                    date: time,
                    price: price
                });

                self.sales_active.insert(&token_id, &sale);

                self.tokens_resort(token_id.clone(), 5, Some(price));

                match self.my_bids_active.get(&buyer_id)
                {
                    Some(mut bids) =>
                    {
                        if !bids.contains(&token_id)
                        {
                            bids.insert(&token_id);
                            self.my_bids_active.insert(&buyer_id, &bids);
                        }
                    },
                    None =>
                    {
                        let mut bids = UnorderedSet::new(
                            StorageKey::MyBidsActiveSet {
                                account_id_hash: hash_account_id(&buyer_id),
                            }
                                .try_to_vec()
                                .unwrap(),
                        );

                        bids.insert(&token_id);
                        self.my_bids_active.insert(&buyer_id, &bids);
                    }
                }

                //====================Статистика по користувачу=========================//
                let creator = self.creator_per_token.get(&token_id).unwrap();
                let artist = self.token_metadata_by_id.get(&token_id).unwrap().artist;

                ProfileStatCriterion::profile_stat_price_check_and_change(
                    &mut self.profiles_global_stat, 
                    &mut self.profiles_global_stat_sorted_vector,
                    &creator,
                    &artist,
                    price,
                    previous_bid_price,
                    false
                );
                //====================Статистика по користувачу=========================//


                //====================Статистика по колекції=========================//
                if let Some(collection_id) = self.collection_per_token.get(&token_id)
                {
                    self.collection_stat_price_check_and_change(&collection_id, price, false);
                }
                //====================Статистика по колекції=========================//
            },
            _ =>
            {
                panic!("Sale error");
            }
        }
    }

    //private function used when a sale is purchased. 
    //this will remove the sale, transfer and get the payout from the nft contract, and then distribute royalties
    #[private]
    pub fn process_purchase(
        &mut self,
        token_id: String,
        price: u128,
        buyer_id: AccountId,
        owner_id: AccountId,
        time: u128
    ) {
        //get the sale object by removing the sale
        let sale = self.sale_remove_inner(&token_id);

        //initiate a cross contract call to the nft contract. This will transfer the token to the buyer and return
        //a payout object used for the market to distribute funds to the appropriate accounts.
        let payout = self.nft_transfer_payout(
            buyer_id.clone(), //purchaser (person to transfer the NFT to)
            token_id.clone(), //token ID to transfer
            Some("payout from market".to_string()), //memo (to include some context)
            /*
                the price that the token was purchased for. This will be used in conjunction with the royalty percentages
                for the token in order to determine how much money should go to which account. 
            */
            Some(price),
			Some(10), //the maximum amount of accounts the market can payout at once (this is limited by GAS)
            Some(owner_id.clone())
        );

        //after the transfer payout has been initiated, we resolve the promise by calling our own resolve_purchase function. 
        //resolve purchase will take the payout object returned from the nft_transfer_payout and actually pay the accounts
        self.resolve_purchase(
            buyer_id.clone(), //the buyer and price are passed in incase something goes wrong and we need to refund the buyer
            price,
            payout
        );

        self.sales_history.push(&SaleHistory
        {
            account_from: owner_id.clone(),
            account_to: buyer_id.clone(),
            token_id: token_id.clone(),
            sale_type: sale.sale_type,
            date: time,
            price: U128(price)
        });

        let index = self.sales_history.len() - 1;

        match self.sales_history_by_token_id.get(&token_id)
        {
            Some(mut history) =>
            {
                history.push(index);

                self.sales_history_by_token_id.insert(&token_id, &history);
            },
            None =>
            {
                let mut history : Vec<u64> = Vec::new();

                history.push(index);
    
                self.sales_history_by_token_id.insert(&token_id, &history);
            }
        }

        match self.my_sales.get(&owner_id)
        {
            Some(mut sales) =>
            {
                sales.push(index);

                self.my_sales.insert(&owner_id, &sales);
            },
            None =>
            {
                let mut sales : Vec<u64> = Vec::new();

                sales.push(index);
    
                self.my_sales.insert(&owner_id, &sales);
            }
        }

        match self.my_purchases.get(&buyer_id)
        {
            Some(mut purchases) =>
            {
                purchases.push(index);

                self.my_purchases.insert(&buyer_id, &purchases);
            },
            None =>
            {
                let mut purchases : Vec<u64> = Vec::new();

                purchases.push(index);
    
                self.my_purchases.insert(&buyer_id, &purchases);
            }
        }

        if sale.sale_type == 2 || sale.sale_type == 3
        {
            for i in 0..sale.bids.len()
            {
                match self.my_bids_active.get(&sale.bids[i].account_id)
                {
                    Some(mut bids) =>
                    {
                        if bids.contains(&token_id)
                        {
                            bids.remove(&token_id);
                            self.my_bids_active.insert(&sale.bids[i].account_id, &bids);
                        }
                    },
                    None => {}
                }
            }
        }

        //====================Статистика по користувачу=========================//
        let creator = self.creator_per_token.get(&token_id).unwrap();
        let artist = self.token_metadata_by_id.get(&token_id).unwrap().artist;

        ProfileStatCriterion::profile_stat_price_check_and_change(
            &mut self.profiles_global_stat, 
            &mut self.profiles_global_stat_sorted_vector,
            &creator,
            &artist,
            price,
            None,
            true
        );
        
        //====================Статистика по користувачу=========================//

        let collection_id = self.collection_per_token.get(&token_id);

        self.recount_price_stat(&creator, &artist, &collection_id);

        //====================Статистика по колекції=========================//
        if let Some(collection_id) = collection_id
        {
            self.collection_stat_price_check_and_change(&collection_id, price, true);
        }
        //====================Статистика по колекції=========================//

        

        self.tokens_resort(token_id.clone(), 5, None);
    }

    /*
        private method used to resolve the promise when calling nft_transfer_payout. This will take the payout object and 
        check to see if it's authentic and there's no problems. If everything is fine, it will pay the accounts. If there's a problem,
        it will refund the buyer for the price. 
    */
    #[private]
    pub fn resolve_purchase(
        &mut self,
        buyer_id: AccountId,
        price: u128,
        payout: Option<HashMap<String, U128>>
    ) -> u128 {
        // if the payout option was some payout, we set this payout variable equal to that some payout
        let payout = if let Some(payout_option) = payout {
            payout_option
        //if the payout option was None, we refund the buyer for the price they payed and return
        } else {
            Promise::new(buyer_id).transfer(u128::from(price));
            // leave function and return the price that was refunded
            return price;
        };

        // NEAR payouts
        for (receiver_id, amount) in payout {
            Promise::new(receiver_id).transfer(amount.0);
        }

        //return the price payout out
        price
    }

    pub fn sales_history_test(
        &self
    ) -> Vec<SaleHistory> 
    {
        return self.sales_history.to_vec();
    }

    ///історія покупок токенів користувачем
    pub fn my_purchases(
        &self,
        // каталог або null|none
        catalog: Option<String>,
        //пагінація
        page_index: u64,
        //ксть елементів на сторінкі
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
                    let item_index = my_purchases.get(_index);

                    match item_index
                    {
                        Some(item_index) =>
                        {
                            let item = self.sales_history.get(item_index.clone()).unwrap();

                            if token_ids.contains(&item.token_id)
                            {
                                result.push(MySaleHistoryJson
                                {
                                    price: item.price,
                                    date: item.date,
                                    account: self.get_full_profile(
                                        &item.account_from,
                                        &Some(account_id.clone()),
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

    ///історія продажу токенів користувачем
    pub fn my_sales(
        &self,
        // каталог або null|none
        catalog: Option<String>,
        //пагінація
        page_index: u64,
        //ксть елементів на сторінкі
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
                    let item_index = my_sales.get(_index);

                    match item_index
                    {
                        Some(item_index) =>
                        {
                            let item = self.sales_history.get(*item_index).unwrap();

                            if token_ids.contains(&item.token_id)
                            {
                                result.push(MySaleHistoryJson
                                {
                                    price: item.price,
                                    date: item.date,
                                    account: self.get_full_profile(
                                        &item.account_to,
                                        &Some(account_id.clone()),
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

    //Історія продажів по конкретному токену
    pub fn sale_history_by_token(&self, 
        token_id: TokenId,
        //пагінація
        page_index: u64,
        //ксть елементів на сторінкі
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

                    match history.get(_index)
                    {
                        Some(item_index) =>
                        {
                            let item = self.sales_history.get(*item_index).unwrap();

                            result.push(SaleHistoryJson
                                {
                                    account_from: self.get_full_profile(
                                        &item.account_from,
                                        &asked_account_id,
                                        true
                                    ),
                                    account_to: self.get_full_profile(
                                        &item.account_to,
                                        &asked_account_id,
                                        true
                                    ),
                                    price: item.price,
                                    sale_type: item.sale_type,
                                    token: self.nft_token_for_account(&item.token_id, asked_account_id.clone()),
                                    date: item.date
                                });
                        },
                        None =>
                        {
                            break;
                        }
                    }
                }

                return result;
            },
            None =>
            {
                return Vec::new();
            }
        }
    }


    //Історія продажів
    pub fn sale_history(&self, 
        page_index: u64,
        //ксть елементів на сторінкі
        page_size: u64,
        asked_account_id: Option<AccountId>) -> Vec<SaleHistoryJson>
    {
        let mut result : Vec<SaleHistoryJson> = Vec::new();

        let mut start_index = self.sales_history.len() as i64 - ((page_index - 1) * page_size) as i64 - 1;

        if start_index < 0
        {
            return result;
        }

        while result.len() < page_size as usize
        {
            match self.sales_history.get(start_index as u64)
            {
                Some(item) =>
                {
                    result.push(SaleHistoryJson
                    {
                        account_from: self.get_full_profile(
                            &item.account_from,
                            &asked_account_id,
                            true
                        ),
                        account_to: self.get_full_profile(
                            &item.account_to,
                            &asked_account_id,
                            true
                        ),
                        price: item.price,
                        sale_type: item.sale_type,
                        token: self.nft_token_for_account(&item.token_id, asked_account_id.clone()),
                        date: item.date
                    });

                    start_index -= 1;
                },
                None =>
                {
                    break;
                }
            }
        }

        return result;
    }

    pub fn token_owners_history(&self, 
        token_id: TokenId,
        //пагінація
        page_index: u64,
        //ксть елементів на сторінкі
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
                    let res = self.get_full_profile(
                        &creator,
                        &asked_account_id,
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

                    match history.get(_index)
                    {
                        Some(item_index) =>
                        {
                            let item = self.sales_history.get(*item_index).unwrap();

                            result.push(self.get_full_profile(
                                &item.account_to,
                                &asked_account_id,
                                true
                            ).unwrap());
                        },
                        None =>
                        {
                            break;
                        }
                    }

                    i = i + 1;
                }

                return result;
            },
            None => {}
        }
            
        return result;
    }

    //Знайти ціну для статистики
    pub fn find_price(&self, source_type: u8, target_id: &String, is_lowest : bool) -> u128
    {
        let mut price : u128 = 0;
        let mut is_first = true;

        let source: Option<UnorderedSet<TokenId>>;

        match source_type
        {
            1 =>
            {
                source = self.tokens_per_creator.get(target_id);
            },
            2 =>
            {
                source = self.tokens_per_artist.get(target_id);
            },
            3 =>
            {
                source = self.collection_tokens.get(target_id);
            },
            _ =>
            {
                panic!("source type not implemented");
            }
        }

        match source
        {
            Some(tokens) =>
            {
                let sales : Vec<Option<SaleJson>> = tokens.iter().map(|x| self.sale_get(&x, None, false)).collect();

                for i in 0..sales.len()
                {
                    let sale = sales.get(i).unwrap();

                    match sale
                    {
                        Some(sale) =>
                        {
                            match sale.sale_type
                            {
                                1 =>
                                {
                                    let sale_price = sale.price.unwrap().0;

                                    if is_first
                                    {
                                        price = sale_price;
                                        is_first = false;
                                    }
                                    else if (is_lowest && sale_price < price)
                                    || (!is_lowest && sale_price > price)
                                    {
                                        price = sale_price;
                                    }
                                },
                                2 | 3 =>
                                {
                                    let bids_len = sale.bids.len();

                                    if bids_len == 0
                                    {
                                        continue;
                                    }

                                    let sale_price = sale.bids.get(bids_len - 1).unwrap().price.0;

                                    if is_first
                                    {
                                        price = sale_price;
                                        is_first = false;
                                    }
                                    else if (is_lowest && sale_price < price)
                                    || (!is_lowest && sale_price > price)
                                    {
                                        price = sale_price;
                                    }
                                },
                                _ =>
                                {
                                    continue;
                                }
                            }
                        },
                        None =>
                        {
                            continue;
                        }
                    }
                }
            },
            None => {}
        }

        return price;
    }
}