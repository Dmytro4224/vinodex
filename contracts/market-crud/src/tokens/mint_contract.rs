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
        sale: Option<Sale>
    ) 
    {
        let mut owner_id = env::predecessor_account_id();
        if !self.minting_account_ids.contains(&owner_id)
        {
            panic!("You do not have permission for minting");
        }

        if metadata.percentage_for_artist + metadata.percentage_for_creator + metadata.percentage_for_vinodex
         != 100
        {
            panic!("Total price percentage must be equal to 100");
        }

        let mut final_token_id = format!("{}", self.token_metadata_by_id.len() + 1);
        if let Some(token_id) = token_id {
            final_token_id = token_id
        }

        if let Some(receiver_id) = receiver_id {
            owner_id = receiver_id.into();
        }

        //0.1 near
        let required_deposit : u128 = (10 as u128).pow(23);
        if env::attached_deposit() < required_deposit
        {
            panic!("Need to attach at least 0.1 near");
        }

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

        match self.tokens_per_creator.get(&owner_id) {
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

        self.creator_per_token.insert(&final_token_id, &owner_id);

        match sale
        {
            Some(sale) =>
            {
                self.sale_create(final_token_id.clone(), sale.sale_type, sale.price, sale.start_date, sale.end_date);
            },
            None => {}
        }

        //Оновлення словників фільтрів
        for i in 1..9
        {
            let criterion :Option<u128>;

            match i
            {
                1 => criterion = metadata.starts_at,
                2 => criterion =  metadata.issued_at,
                3 => criterion = metadata.sold_at,
                4 => criterion = metadata.expires_at,
                5 => criterion = None,
                7 => criterion = Some(0),
                8 => criterion = Some(0),
                _ => criterion = None
            }

            self.tokens_resort(final_token_id.clone(), i, criterion);
        }

        //створюємо профіль, якшо нема
    
        let _profile_data=self.profiles.get(&owner_id);
        if _profile_data.is_none()
        {
            //дефолтні значення
            //виправити перед релізом!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            Profile::set_profile
            (
                &mut self.profiles,
                &Profile::get_default_data(owner_id.clone()),
                &owner_id
            );
        }

        //=
        // ProfileStatCriterion::profile_stat_check_for_default_stat(
        //      &mut self.profiles_global_stat,
        //     &mut self.profiles_global_stat_sorted_vector,
        //     &owner_id);
        //=======================================================

        //Кількість токенів creator
        ProfileStatCriterion::profile_stat_inc(
            &mut self.profiles_global_stat,
            &mut self.profiles_global_stat_sorted_vector,
            &owner_id,
            ProfileStatCriterionEnum::TokensCount,
            1,
            true);

        //Кількість токенів artist
        if !metadata.artist.trim().is_empty()
        {
            ProfileStatCriterion::profile_stat_inc(
                &mut self.profiles_global_stat,
                &mut self.profiles_global_stat_sorted_vector,
                &owner_id,
                ProfileStatCriterionEnum::TokensCountAsArtist,
                1,
                true);
        }
    }

    ///Дозволити акаунту випускати токени
    pub fn minting_accounts_add(&mut self, account_id: AccountId)
    {
        self.minting_account_ids.insert(&account_id);
    }

    ///Забрати в акаунта дозвіл на випуск токенів
    pub fn minting_accounts_remove(&mut self, account_id: AccountId)
    {
        self.minting_account_ids.remove(&account_id);
    }
}