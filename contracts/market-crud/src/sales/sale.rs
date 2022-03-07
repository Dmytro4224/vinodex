use crate::*;
use near_sdk::promise_result_as_success;

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

//Структура однієї ставки на аукціоні
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SaleBid
{
    pub account_id: AccountId,
    pub date: u128,
    pub price: u128
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
    pub bids : Option<Vec<SaleBid>>
}

#[near_bindgen]
impl Contract {
    
    //removes a sale from the market. 
    #[private]
    pub fn sale_remove_inner(&mut self, token_id: &String) -> Sale
    {
        return self.sales_active.remove(token_id).expect("No sale");
    }

    pub fn sale_remove(&mut self, token_id: String) -> Sale
    {
        let token = self.tokens_by_id.get(&token_id).expect("Token not found");
        
        assert_eq!(token.owner_id, env::predecessor_account_id(), "Forbidden");

        return self.sale_remove_inner(&token_id);
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

        let bids : Option<Vec<SaleBid>>;

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
                bids = None;

                self.tokens_resort(token_id.clone(), 5, Some(num_price));
            },
            2 | 3 =>
            {
                bids = Some(Vec::new());

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
                bids: bids
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
            bids: sale.bids
        });

        self.tokens_resort(token_id.clone(), 5, Some(price.0));
    }

    //place an offer on a specific sale. The sale will go through as long as your deposit is greater than or equal to the list price
    #[payable]
    pub fn sale_offer(&mut self, token_id: String, offer: Option<U128>, time: u128) {
        //get the attached deposit and make sure it's greater than 0
        let deposit = env::attached_deposit();
        assert!(deposit > 0, "Attached deposit must be greater than 0");

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
                assert!(deposit <= price.0, "Attached deposit must be greater than or equal to the current price: {:?}", price);

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
                let price : u128;
                let mut  bids = sale.bids.unwrap();

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

                if bids.len() == 0
                {
                    if price <= 0
                    {
                        panic!("Offer must be greater then 0");
                    }
                }
                else
                {
                    if price <= bids[bids.len() - 1].price
                    {
                        panic!("Offer must be greater then last offer");
                    }
                }

                bids.push(SaleBid
                {
                    account_id: buyer_id,
                    date: time,
                    price: price
                });

                sale.bids = Some(bids);
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
                    account_from: owner_id,
                    account_to: buyer_id,
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
                    account_from: owner_id,
                    account_to: buyer_id,
                    date: time,
                    price: U128(price),

                });
    
                self.sales_history_by_token_id.insert(&token_id, &history);
            }
        }
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
       1
        // //we'll keep track of how much the nft contract wants us to payout. Starting at the full price payed by the buyer
        // let mut remainder = price;
                        
        // //loop through the payout and subtract the values from the remainder. 
        // for &value in payout_object.values() {
        //     //checked sub checks for overflow or any errors and returns None if there are problems
        //     remainder = remainder.checked_sub(value.0)?;
        // }
        // //Check to see if the NFT contract sent back a faulty payout that requires us to pay more or too little. 
        // //The remainder will be 0 if the payout summed to the total price. The remainder will be 1 if the royalties
        // //we something like 3333 + 3333 + 3333. 
        // if remainder == 0 || remainder == 1 {
        //     //set the payout_option to be the payout because nothing went wrong
        //     Some(payout_object)
        // } else {
        //     //if the remainder was anything but 1 or 0, we return None
        //     None
        // }

        // // if the payout option was some payout, we set this payout variable equal to that some payout
        // let payout = if let Some(payout_option) = payout_option {
        //     payout_option
        // //if the payout option was None, we refund the buyer for the price they payed and return
        // } else {
        //     Promise::new(buyer_id).transfer(u128::from(price));
        //     // leave function and return the price that was refunded
        //     return price;
        // };

        // // NEAR payouts
        // for (receiver_id, amount) in payout {
        //     Promise::new(receiver_id).transfer(amount.0);
        // }

        // //return the price payout out
        // price
    }
}

