use crate::*;

//Структура зберігання історію продажу токенів
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SaleHistory {
    //owner of the sale
    pub account_from: AccountId,
    //reciever of token
    pub account_to: AccountId,
    //sale price in yoctoNEAR that the token is listed for
    pub price: U128,
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
    //sale price in yoctoNEAR that the token is listed for
    pub price: U128,
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
    pub date: u128,
    pub price: u128,
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
        return self.sales_active.remove(token_id).expect("No sale");
    }

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
                    for i in 0..sale.bids.len()
                    {
                        sale_json.bids.push(SaleBidJson
                        {
                            price: sale.bids[i].price,
                            date: sale.bids[i].date,
                            account: Profile::get_full_profile(
                                &self.profiles,
                                &sale.bids[i].account_id,
                                &asked_account_id,
                                &self.autors_likes,
                                &self.autors_followers,
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
                            price: sale.bids[i].price,
                            date: sale.bids[i].date,
                            account: Profile::get_full_profile(
                                &self.profiles,
                                &sale.bids[i].account_id,
                                &asked_account_id,
                                &self.autors_likes,
                                &self.autors_followers,
                                true
                            )
                        });
                    }
                }
            }
        }
        
        return Some(sale_json);
    }

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
    }

    #[private]
    pub fn hash_account_id(account_id: &AccountId) -> CryptoHash {
        //get the default hash
        let mut hash = CryptoHash::default();
        //we hash the account ID and return it
        hash.copy_from_slice(&env::sha256(account_id.as_bytes()));
        hash
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

        self.tokens_resort(token_id.clone(), 5, Some(price.0));
    }

    //Закрити/відкрити ставки по аукціону
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
        assert!(deposit > 0, "Attached deposit must be greater than 0");

        let token = self.nft_token(token_id.clone()).expect("Token not found");

        let sale = self.sales_active.get(&token_id).expect("Token is not for sale");
        if sale.sale_type != 2 && sale.sale_type != 3
        {
            panic!("Sale is not on auction");
        }

        if !sale.is_closed
        {
            panic!("Sale is not closed");
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
                assert!(deposit < price.0, "Attached deposit must be greater than or equal to the current price: {:?}", price);

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
                if sale.is_closed
                {
                    panic!("Auction is closed for new bids");
                }

                let price : u128;

                if sale.sale_type == 2
                {
                    if sale.start_date.unwrap() > time
                    {
                        panic!("Sale is not active yet");
                    }

                    if sale.end_date.unwrap() < time
                    {
                        panic!("Sale is closed");
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

                sale.bids.push(SaleBid
                {
                    account_id: buyer_id,
                    date: time,
                    price: price
                });

                self.sales_active.insert(&token_id, &sale);

                self.tokens_resort(token_id.clone(), 5, Some(price));
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
        );

        //after the transfer payout has been initiated, we resolve the promise by calling our own resolve_purchase function. 
        //resolve purchase will take the payout object returned from the nft_transfer_payout and actually pay the accounts
        self.resolve_purchase(
            buyer_id.clone(), //the buyer and price are passed in incase something goes wrong and we need to refund the buyer
            price,
            payout
        );

        match self.sales_history_by_token_id.get(&token_id)
        {
            Some(mut history) =>
            {
                history.push(SaleHistory
                {
                    account_from: owner_id.clone(),
                    account_to: buyer_id.clone(),
                    date: time,
                    price: U128(price),

                });

                self.sales_history_by_token_id.insert(&token_id, &history);
            },
            None =>
            {
                let mut history : Vec<SaleHistory> = Vec::new();

                history.push(SaleHistory
                {
                    account_from: owner_id.clone(),
                    account_to: buyer_id.clone(),
                    date: time,
                    price: U128(price),

                });
    
                self.sales_history_by_token_id.insert(&token_id, &history);
            }
        }

        match self.my_sales.get(&owner_id)
        {
            Some(mut sales) =>
            {
                sales.push(MySaleHistory
                {
                    account: buyer_id.clone(),
                    token_id: token_id.clone(),
                    date: time,
                    price: U128(price),
                });

                self.my_sales.insert(&owner_id, &sales);
            },
            None =>
            {
                let mut sales : Vec<MySaleHistory> = Vec::new();

                sales.push(MySaleHistory
                {
                    account: buyer_id.clone(),
                    token_id: token_id.clone(),
                    date: time,
                    price: U128(price),
                });
    
                self.my_sales.insert(&owner_id, &sales);
            }
        }

        match self.my_purchases.get(&buyer_id)
        {
            Some(mut purchases) =>
            {
                purchases.push(MySaleHistory
                {
                    account: owner_id.clone(),
                    token_id: token_id.clone(),
                    date: time,
                    price: U128(price),
                });

                self.my_purchases.insert(&buyer_id, &purchases);
            },
            None =>
            {
                let mut purchases : Vec<MySaleHistory> = Vec::new();

                purchases.push(MySaleHistory
                {
                    account: owner_id.clone(),
                    token_id: token_id.clone(),
                    date: time,
                    price: U128(price),
                });
    
                self.my_purchases.insert(&buyer_id, &purchases);
            }
        }

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
}

