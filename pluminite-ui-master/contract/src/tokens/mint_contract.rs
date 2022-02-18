///випуск токену
use crate::*;

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: Option<TokenId>,
        metadata: TokenMetadata,
        perpetual_royalties: Option<HashMap<AccountId, u32>>,
        receiver_id: Option<ValidAccountId>,
        token_type: Option<TokenType>,
    ) {

        let mut final_token_id = format!("{}", self.token_metadata_by_id.len() + 1);
        if let Some(token_id) = token_id {
            final_token_id = token_id
        }

        let mut owner_id = env::predecessor_account_id();
        if let Some(receiver_id) = receiver_id {
            owner_id = receiver_id.into();
        }

        let pay_for_storage =  self.use_storage_fees || !self.is_free_mint_available(owner_id.clone());

        let initial_storage_usage = if pay_for_storage {
            env::storage_usage()
        }
        else {
            0
        };

        // CUSTOM - create royalty map
        let mut royalty = HashMap::new();
        let mut total_perpetual = 0;
        // user added perpetual_royalties (percentage paid with every transfer)
        if let Some(perpetual_royalties) = perpetual_royalties {
            assert!(perpetual_royalties.len() < 7, "Cannot add more than 6 perpetual royalty amounts");
            for (account, amount) in perpetual_royalties {
                royalty.insert(account, amount);
                total_perpetual += amount;
            }
        }
        // royalty limit for minter capped at 90%
        assert!(total_perpetual <= MINTER_ROYALTY_CAP, "Perpetual royalties cannot be more than 90%");

        // CUSTOM - enforce minting caps by token_type 
        if token_type.is_some() {
            let token_type = token_type.clone().unwrap();
            let cap = u64::from(*self.supply_cap_by_type.get(&token_type).expect("Token type must have supply cap."));
            let supply = u64::from(self.nft_supply_for_type(&token_type));
            assert!(supply < cap, "Cannot mint anymore of token type.");
            let mut tokens_per_type = self
                .tokens_per_type
                .get(&token_type)
                .unwrap_or_else(|| {
                    UnorderedSet::new(
                        StorageKey::TokensPerTypeInner {
                            token_type_hash: hash_account_id(&token_type),
                        }
                        .try_to_vec()
                        .unwrap(),
                    )
                });
            tokens_per_type.insert(&final_token_id);
            self.tokens_per_type.insert(&token_type, &tokens_per_type);
        }
        // END CUSTOM

        let token = Token {
            owner_id: owner_id.clone(),
            approved_account_ids: Default::default(),
            next_approval_id: 0,
            royalty,
            token_type,
        };
        assert!(
            self.tokens_by_id.insert(&final_token_id, &token).is_none(),
            "Token already exists"
        );
        self.token_metadata_by_id.insert(&final_token_id, &metadata);
        self.internal_add_token_to_owner(&token.owner_id, &final_token_id);

        match self.tokens_per_creator.get(&owner_id.clone()) {
            Some(mut tokens) => {
                tokens.insert(&final_token_id);
                self.tokens_per_creator.insert(&owner_id, &tokens);
            }
            None => {
                let mut tokens = UnorderedSet::new(
                    StorageKey::TokenPerCreatorInner {
                        account_id_hash: hash_account_id(&owner_id),
                    }
                        .try_to_vec()
                        .unwrap(),
                );
                tokens.insert(&final_token_id);
                self.tokens_per_creator.insert(&owner_id, &tokens);
            }
        }

        if pay_for_storage {
            let new_token_size_in_bytes = env::storage_usage() - initial_storage_usage;
            let required_storage_in_bytes =
                self.extra_storage_in_bytes_per_token + new_token_size_in_bytes;

            refund_deposit(required_storage_in_bytes);
        }

        //Оновлення словників фільтрів
        for i in 1..9
        {
            let mut filterDic = self.tokens_sorted.get(&i);

            let criterion :Option<u128>;

            match i
            {
                1 => criterion = metadata.starts_at,
                2 => criterion =  metadata.issued_at,
                3 => criterion = metadata.sold_at,
                4 => criterion = metadata.expires_at,
                5 => criterion = Some(metadata.price),
                7 => criterion = Some(0),
                8 => criterion = Some(0),
                _ => criterion = None
            }

            let key = SortedToken{token_id: final_token_id.clone(), criterion: criterion};

            if(filterDic.is_none())
            {
                let mut vector :Vec<SortedToken> = Vec::new();
                vector.push(key);

                self.tokens_sorted.insert(&i, &vector);
                continue;
            }

            if(criterion.is_none())
            {
                filterDic.unwrap().push(key);
                continue;
            }

            //Можливо додати лочку???

            let mut unwraped = filterDic.unwrap();

            let index = SortedToken::binary_search(&key, &unwraped);
            if(index.is_none())
            {
                unwraped.push(key);
                continue;
            }

            unwraped.insert(index.unwrap(), key);
        }
    }
}