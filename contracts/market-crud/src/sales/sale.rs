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
    //market contract's approval ID to transfer the token on behalf of the owner
    pub approval_id: u64,
    //actual token ID for sale
    pub token_id: String,
    //sale price in yoctoNEAR that the token is listed for
    pub price: SalePriceInYoctoNear,
}

//Структура однієї ставки на аукціоні
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SaleBid
{
    pub account_id: AccountId,
    pub date: u128,
    pub price: SalePriceInYoctoNear
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
    pub price: Option<SalePriceInYoctoNear>,

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
    pub fn remove_sale(&mut self, token_id: String) {

        let token = self.nft_token(token_id.clone());

        if token.is_none()
        {
            panic!("Token not found");
        }

        let account_id = env::predecessor_account_id();

        assert_eq!(token.unwrap().owner_id, account_id, "Must be token owner");

        self.sales_active.remove(&token_id).expect("No sale");
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
    pub fn update_price(
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
    }

    // //place an offer on a specific sale. The sale will go through as long as your deposit is greater than or equal to the list price
    // #[payable]
    // pub fn offer(&mut self, nft_contract_id: AccountId, token_id: String) {
    //     //get the attached deposit and make sure it's greater than 0
    //     let deposit = env::attached_deposit();
    //     assert!(deposit > 0, "Attached deposit must be greater than 0");

    //     //convert the nft_contract_id from a AccountId to an AccountId
    //     let contract_id: AccountId = nft_contract_id.into();
    //     //get the unique sale ID (contract + DELIMITER + token ID)
    //     let contract_and_token_id = format!("{}{}{}", contract_id, DELIMETER, token_id);
        
    //     //get the sale object from the unique sale ID. If the sale doesn't exist, panic.
    //     let sale = self.sales.get(&contract_and_token_id).expect("No sale");
        
    //     //get the buyer ID which is the person who called the function and make sure they're not the owner of the sale
    //     let buyer_id = env::predecessor_account_id();
    //     assert_ne!(sale.owner_id, buyer_id, "Cannot bid on your own sale.");
        
    //     //get the u128 price of the token (dot 0 converts from U128 to u128)
    //     let price = sale.sale_conditions.0;

    //     //make sure the deposit is greater than the price
    //     assert!(deposit >= price, "Attached deposit must be greater than or equal to the current price: {:?}", price);

    //     //process the purchase (which will remove the sale, transfer and get the payout from the nft contract, and then distribute royalties) 
    //     self.process_purchase(
    //         contract_id,
    //         token_id,
    //         U128(deposit),
    //         buyer_id,
    //     );
    // }

    // //private function used when a sale is purchased. 
    // //this will remove the sale, transfer and get the payout from the nft contract, and then distribute royalties
    // #[private]
    // pub fn process_purchase(
    //     &mut self,
    //     nft_contract_id: AccountId,
    //     token_id: String,
    //     price: U128,
    //     buyer_id: AccountId,
    // ) -> Promise {
    //     //get the sale object by removing the sale
    //     let sale = self.internal_remove_sale(nft_contract_id.clone(), token_id.clone());

    //     //initiate a cross contract call to the nft contract. This will transfer the token to the buyer and return
    //     //a payout object used for the market to distribute funds to the appropriate accounts.
    //     ext_contract::nft_transfer_payout(
    //         buyer_id.clone(), //purchaser (person to transfer the NFT to)
    //         token_id, //token ID to transfer
    //         sale.approval_id, //market contract's approval ID in order to transfer the token on behalf of the owner
    //         "payout from market".to_string(), //memo (to include some context)
    //         /*
    //             the price that the token was purchased for. This will be used in conjunction with the royalty percentages
    //             for the token in order to determine how much money should go to which account. 
    //         */
    //         price,
	// 		10, //the maximum amount of accounts the market can payout at once (this is limited by GAS)
    //         nft_contract_id, //contract to initiate the cross contract call to
    //         1, //yoctoNEAR to attach to the call
    //         GAS_FOR_NFT_TRANSFER, //GAS to attach to the call
    //     )
    //     //after the transfer payout has been initiated, we resolve the promise by calling our own resolve_purchase function. 
    //     //resolve purchase will take the payout object returned from the nft_transfer_payout and actually pay the accounts
    //     .then(ext_self::resolve_purchase(
    //         buyer_id, //the buyer and price are passed in incase something goes wrong and we need to refund the buyer
    //         price,
    //         env::current_account_id(), //we are invoking this function on the current contract
    //         NO_DEPOSIT, //don't attach any deposit
    //         GAS_FOR_ROYALTIES, //GAS attached to the call to payout royalties
    //     ))
    // }

    // /*
    //     private method used to resolve the promise when calling nft_transfer_payout. This will take the payout object and 
    //     check to see if it's authentic and there's no problems. If everything is fine, it will pay the accounts. If there's a problem,
    //     it will refund the buyer for the price. 
    // */
    // #[private]
    // pub fn resolve_purchase(
    //     &mut self,
    //     buyer_id: AccountId,
    //     price: U128,
    // ) -> U128 {
    //     // checking for payout information returned from the nft_transfer_payout method
    //     let payout_option = promise_result_as_success().and_then(|value| {
    //         //if we set the payout_option to None, that means something went wrong and we should refund the buyer
    //         near_sdk::serde_json::from_slice::<Payout>(&value)
    //             //converts the result to an optional value
    //             .ok()
    //             //returns None if the none. Otherwise executes the following logic
    //             .and_then(|payout_object| {
    //                 //we'll check if length of the payout object is > 10 or it's empty. In either case, we return None
    //                 if payout_object.payout.len() > 10 || payout_object.payout.is_empty() {
    //                     env::log_str("Cannot have more than 10 royalties");
    //                     None
                    
    //                 //if the payout object is the correct length, we move forward
    //                 } else {
    //                     //we'll keep track of how much the nft contract wants us to payout. Starting at the full price payed by the buyer
    //                     let mut remainder = price.0;
                        
    //                     //loop through the payout and subtract the values from the remainder. 
    //                     for &value in payout_object.payout.values() {
    //                         //checked sub checks for overflow or any errors and returns None if there are problems
    //                         remainder = remainder.checked_sub(value.0)?;
    //                     }
    //                     //Check to see if the NFT contract sent back a faulty payout that requires us to pay more or too little. 
    //                     //The remainder will be 0 if the payout summed to the total price. The remainder will be 1 if the royalties
    //                     //we something like 3333 + 3333 + 3333. 
    //                     if remainder == 0 || remainder == 1 {
    //                         //set the payout_option to be the payout because nothing went wrong
    //                         Some(payout_object.payout)
    //                     } else {
    //                         //if the remainder was anything but 1 or 0, we return None
    //                         None
    //                     }
    //                 }
    //             })
    //     });

    //     // if the payout option was some payout, we set this payout variable equal to that some payout
    //     let payout = if let Some(payout_option) = payout_option {
    //         payout_option
    //     //if the payout option was None, we refund the buyer for the price they payed and return
    //     } else {
    //         Promise::new(buyer_id).transfer(u128::from(price));
    //         // leave function and return the price that was refunded
    //         return price;
    //     };

    //     // NEAR payouts
    //     for (receiver_id, amount) in payout {
    //         Promise::new(receiver_id).transfer(amount.0);
    //     }

    //     //return the price payout out
    //     price
    // }
}

