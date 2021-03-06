use crate::*;
use near_sdk::json_types::{ValidAccountId, U64};
use near_sdk::{ext_contract, env, log, Gas, PromiseResult};

const GAS_FOR_NFT_APPROVE: Gas = 25_000_000_000_000;
const GAS_FOR_RESOLVE_TRANSFER: Gas = 10_000_000_000_000;
const GAS_FOR_NFT_TRANSFER_CALL: Gas = 25_000_000_000_000 + GAS_FOR_RESOLVE_TRANSFER;
const NO_DEPOSIT: Balance = 0;

pub trait NonFungibleTokenCore {
    fn nft_transfer(
        &mut self,
        receiver_id: ValidAccountId,
        token_id: TokenId,
        approval_id: Option<U64>,
        memo: Option<String>,
    );

    fn nft_transfer_payout(
        &mut self,
        receiver_id: String,
        token_id: TokenId,
        memo: Option<String>,
        balance: Option<u128>,
        max_len_payout: Option<u32>,
        sender_id: Option<String>
    ) -> Option<Payout>;

    /// Returns `true` if the token was transferred from the sender's account.
    fn nft_transfer_call(
        &mut self,
        receiver_id: ValidAccountId,
        token_id: TokenId,
        approval_id: Option<U64>,
        memo: Option<String>,
        msg: String,
    );

    fn nft_approve(&mut self, token_id: TokenId, account_id: ValidAccountId, sale_conditions: U128);

    fn nft_revoke(&mut self, token_id: TokenId, account_id: ValidAccountId);

    fn nft_revoke_all(&mut self, token_id: TokenId);

    fn nft_total_supply(&self) -> U64;

    fn nft_token(&self, token_id: TokenId) -> Option<JsonToken>;
    fn nft_token_for_account(&self, token_id: &TokenId, account_id: Option<AccountId>)->Option<JsonToken>;

    fn get_token_likes_count(&self, token_id: &TokenId) -> usize;
    fn get_token_views_count(&self, token_id: &TokenId) -> usize;

    //check if the passed in account has access to approve the token ID
	fn nft_is_approved(
        &self,
        token_id: TokenId,
        approved_account_id: AccountId,
        approval_id: Option<u64>,
    ) -> bool;
}

#[ext_contract(ext_non_fungible_approval_receiver)]
trait NonFungibleTokenApprovalsReceiver {
    fn nft_on_approve(
        &mut self,
        token_id: TokenId,
        owner_id: AccountId,
        approval_id: u64,
        sale_conditions: U128
    );
}

// TODO: create nft_on_revoke

#[ext_contract(ext_self)]
trait NonFungibleTokenResolver {
    fn nft_resolve_transfer(
        &mut self,
        owner_id: AccountId,
        receiver_id: AccountId,
        approved_account_ids: HashMap<AccountId, U64>,
        token_id: TokenId,
    ) -> bool;
}

trait NonFungibleTokenResolver {
    fn nft_resolve_transfer(
        &mut self,
        owner_id: AccountId,
        receiver_id: AccountId,
        approved_account_ids: HashMap<AccountId, U64>,
        token_id: TokenId,
    ) -> bool;
}

#[near_bindgen]
impl NonFungibleTokenCore for Contract {
    #[payable]
    fn nft_transfer(
        &mut self,
        receiver_id: ValidAccountId,
        token_id: TokenId,
        approval_id: Option<U64>,
        memo: Option<String>,
    ) {
        assert_one_yocto();

        let token_data = self.nft_token(token_id.clone());
        // if let Some(token_data_unwrapped) = token_data {
        //     assert!(token_data_unwrapped.approved_account_ids.len() == 0, "Token already approved on a marketplace. Abort");
        // }

        let sender_id = env::predecessor_account_id();
        let previous_token = self.internal_transfer(
            &sender_id,
            receiver_id.as_ref(),
            &token_id,
            memo
        );
        if self.use_storage_fees {
            refund_approved_account_ids(
                previous_token.owner_id.clone(),
                &previous_token.approved_account_ids,
            );
        }
    }

    // CUSTOM - this method is included for marketplaces that respect royalties
    #[payable]
    fn nft_transfer_payout(
        &mut self,
        receiver_id: String,
        token_id: TokenId,
        memo: Option<String>,
        balance: Option<u128>,
        max_len_payout: Option<u32>,
        mut sender_id : Option<String>
    ) -> Option<Payout> {

        if sender_id.is_none()
        {
            sender_id = Some(env::predecessor_account_id());
        }
        
        let previous_token = self.internal_transfer(
            &sender_id.unwrap(),
            &receiver_id,
            &token_id,
            memo
        );
        if self.use_storage_fees {
            refund_approved_account_ids(
                previous_token.owner_id.clone(),
                &previous_token.approved_account_ids,
            );
        }

        let payout = if let Some(balance) = balance {
            let balance_u128 = u128::from(balance);
            let mut payout: Payout = HashMap::new();
            
            let token_meta_data = self.token_metadata_by_id.get(&token_id).expect("No token metadata");
            let for_creator: u128 = balance_u128 / 100 * token_meta_data.percentage_for_creator as u128;
            let for_artist: u128 = balance_u128 / 100 * token_meta_data.percentage_for_artist as u128;
            
            
            payout.insert(self.creator_per_token.get(&token_id).unwrap(), U128(for_creator));
            payout.insert(token_meta_data.artist, U128(for_artist));

            Some(payout)
        } else {
            None
        };

        payout
    }

    #[payable]
    fn nft_transfer_call(
        &mut self,
        receiver_id: ValidAccountId,
        token_id: TokenId,
        approval_id: Option<U64>,
        memo: Option<String>,
        msg: String
    ) 
    {
        assert_one_yocto();
        let sender_id = env::predecessor_account_id();
        let previous_token = self.internal_transfer(
            &sender_id,
            receiver_id.as_ref(),
            &token_id,
            memo
        );
        
        ext_self::nft_resolve_transfer(
            previous_token.owner_id,
            receiver_id.into(),
            previous_token.approved_account_ids,
            token_id,
            &env::current_account_id(),
            NO_DEPOSIT,
            GAS_FOR_RESOLVE_TRANSFER,
        );
    }

    #[payable]
    fn nft_approve(&mut self, token_id: TokenId, account_id: ValidAccountId, sale_conditions: U128) {
        if self.use_storage_fees {
            assert_at_least_one_yocto();
        } else {
            assert_one_yocto();
        }

        let account_id: AccountId = account_id.into();

        let mut token = self.tokens_by_id.get(&token_id).expect("Token not found");

        assert_eq!(
            &env::predecessor_account_id(),
            &token.owner_id,
            "Predecessor must be the token owner."
        );

        let approval_id = token.next_approval_id;
        let is_new_approval = token
            .approved_account_ids
            .insert(account_id.clone(), approval_id.into())
            .is_none();

        if self.use_storage_fees {
            let storage_used = if is_new_approval {
                bytes_for_approved_account_id(&account_id)
            } else {
                0
            };

            token.next_approval_id += 1;
            self.tokens_by_id.insert(&token_id, &token);

            refund_deposit(storage_used);
        }
        else{
            token.next_approval_id += 1;
            self.tokens_by_id.insert(&token_id, &token);
        }

        ext_non_fungible_approval_receiver::nft_on_approve(
            token_id,
            token.owner_id,
            approval_id,
            sale_conditions,
            &account_id, //contract account we're calling
            NO_DEPOSIT, //NEAR deposit we attach to the call
            env::prepaid_gas() - GAS_FOR_NFT_APPROVE, //GAS we're attaching
        ).as_return(); // Returning this promise

        // if let Some(msg) = msg {

        //     // CUSTOM - add token_type to msg
        //     let mut final_msg = msg;
        //     let token_type = token.token_type;
        //     if let Some(token_type) = token_type {
        //         final_msg.insert_str(final_msg.len() - 1, &format!(",\"token_type\":\"{}\"", token_type));
        //     }

        //     ext_non_fungible_approval_receiver::nft_on_approve(
        //         token_id,
        //         token.owner_id,
        //         approval_id,
        //         final_msg,
        //         &account_id,
        //         NO_DEPOSIT,
        //         env::prepaid_gas() - GAS_FOR_NFT_APPROVE,
        //     )
        //         .as_return(); // Returning this promise
        // }
    }

    //check if the passed in account has access to approve the token ID
	fn nft_is_approved(
        &self,
        token_id: TokenId,
        approved_account_id: AccountId,
        approval_id: Option<u64>,
    ) -> bool {
        //get the token object from the token_id
        let token = self.tokens_by_id.get(&token_id).expect("No token");

        //get the approval number for the passed in account ID
		let approval = token.approved_account_ids.get(&approved_account_id);

        //if there was some approval ID found for the account ID
        if let Some(approval) = approval {
            //if a specific approval_id was passed into the function
			if let Some(approval_id) = approval_id {
                //return if the approval ID passed in matches the actual approval ID for the account
				approval_id == (*approval).0
            //if there was no approval_id passed into the function, we simply return true
			} else {
				true
			}
        //if there was no approval ID found for the account ID, we simply return false
		} else {
			false
		}
    }

    #[payable]
    fn nft_revoke(&mut self, token_id: TokenId, account_id: ValidAccountId) {
        assert_one_yocto();
        let mut token = self.tokens_by_id.get(&token_id).expect("Token not found");
        let predecessor_account_id = env::predecessor_account_id();
        assert_eq!(&predecessor_account_id, &token.owner_id);
        if token
            .approved_account_ids
            .remove(account_id.as_ref())
            .is_some()
        {
            if self.use_storage_fees {
                refund_approved_account_ids_iter(predecessor_account_id, [account_id.into()].iter());
            }
            self.tokens_by_id.insert(&token_id, &token);
        }
    }

    #[payable]
    fn nft_revoke_all(&mut self, token_id: TokenId) {
        assert_one_yocto();
        let mut token = self.tokens_by_id.get(&token_id).expect("Token not found");
        let predecessor_account_id = env::predecessor_account_id();
        assert_eq!(&predecessor_account_id, &token.owner_id);
        if !token.approved_account_ids.is_empty() {
            if self.use_storage_fees {
                refund_approved_account_ids(predecessor_account_id, &token.approved_account_ids);
            }
            token.approved_account_ids.clear();
            self.tokens_by_id.insert(&token_id, &token);
        }
    }

    fn nft_total_supply(&self) -> U64 {
        self.token_metadata_by_id.len().into()
    }

    fn nft_token(&self, token_id: TokenId) -> Option<JsonToken> {
        return self.nft_token_for_account(&token_id, None);
    }

    fn nft_token_for_account(&self, token_id: &TokenId, account_id: Option<AccountId>)
     -> Option<JsonToken> {
        if let Some(token) = self.tokens_by_id.get(token_id) {
            let mut metadata = self.token_metadata_by_id.get(token_id).unwrap();
            metadata.likes_count = self.get_token_likes_count(token_id) as u64;
            metadata.views_count = self.get_token_views_count(token_id) as u64;

            let mut _is_liked = false;
            let mut _is_viewed = false;

            match account_id.clone()
            {
                Some(account_id) =>
                {
                    if let Some(_users_like_list) = self.tokens_users_likes.get(token_id)
                    {
                        _is_liked = _users_like_list.contains(&account_id);
                    }

                    if let Some(_users_views_list) = self.tokens_users_views.get(token_id)
                    {
                        _is_viewed = _users_views_list.contains(&account_id);
                    }
                },
                None => {}
            }

            Some(JsonToken {
                token_id: token_id.clone(),
                owner_id: token.owner_id,
                creator_id: self.creator_per_token.get(&token_id).unwrap_or(String::from("")),
                metadata,
                royalty: token.royalty,
                approved_account_ids: token.approved_account_ids,
                token_type: token.token_type,
                is_liked: _is_liked,
                is_viewed: _is_viewed,
                sale : self.sale_get(&token_id, account_id.clone(), false),
                collection: self.collection_get_by_token(&token_id, &account_id)
            })
        } else {
            None
        }
    }

    fn get_token_likes_count(&self, token_id: &TokenId) -> usize
    {
        match self.tokens_users_likes.get(token_id)
        {
            Some(set) =>
            {
                return set.len();
            },
            None =>
            {
                return 0;
            }
        }
    }

    fn get_token_views_count(&self, token_id: &TokenId) -> usize
    {
        // match self.tokens_users_views.get(token_id)
        // {
        //     Some(set) =>
        //     {
        //         return set.len();
        //     },
        //     None =>
        //     {
        //         return 0;
        //     }
        // }

        match self.token_stat.get(token_id)
        {
            Some(_stat) =>
            {
                return _stat.views_count as usize;
            },
            None =>
            {
                return 0;
            }
        }
    }
}

#[near_bindgen]
impl NonFungibleTokenResolver for Contract {
    #[private]
    fn nft_resolve_transfer(
        &mut self,
        owner_id: AccountId,
        receiver_id: AccountId,
        approved_account_ids: HashMap<AccountId, U64>,
        token_id: TokenId,
    ) -> bool {
        // Whether receiver wants to return token back to the sender, based on `nft_on_transfer`
        // call result.
        if let PromiseResult::Successful(value) = env::promise_result(0) {
            if let Ok(return_token) = near_sdk::serde_json::from_slice::<bool>(&value) {
                if !return_token {
                    // Token was successfully received.

                    if self.use_storage_fees {
                        refund_approved_account_ids(owner_id, &approved_account_ids);
                    }
                    return true;
                }
            }
        }

        let mut token = if let Some(token) = self.tokens_by_id.get(&token_id) {
            if token.owner_id != receiver_id {
                // The token is not owner by the receiver anymore. Can't return it.
                if self.use_storage_fees {
                    refund_approved_account_ids(owner_id, &approved_account_ids);
                }
                return true;
            }
            token
        } else {
            // The token was burned and doesn't exist anymore.
            if self.use_storage_fees {
                refund_approved_account_ids(owner_id, &approved_account_ids);
            }
            return true;
        };

        log!("Return {} from @{} to @{}", token_id, receiver_id, owner_id);

        self.internal_remove_token_from_owner(&receiver_id, &token_id);
        self.internal_add_token_to_owner(&owner_id, &token_id);
        token.owner_id = owner_id;
        if self.use_storage_fees {
            refund_approved_account_ids(receiver_id, &token.approved_account_ids);
        }
        token.approved_account_ids = approved_account_ids;
        self.tokens_by_id.insert(&token_id, &token);

        false
    }
}
