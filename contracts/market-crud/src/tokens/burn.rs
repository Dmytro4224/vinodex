use crate::*;

/// CUSTOM - owner can burn a locked token for a given user, reducing the enumerable->nft_supply_for_type
#[near_bindgen]
impl Contract {
    #[payable]
    pub fn nft_burn(
        &mut self,
        token_id: TokenId,
    ) {
        match self.tokens_by_id.get(&token_id)
        {
            Some(token) =>
            {
                if token.owner_id != env::predecessor_account_id()
                {
                    panic!("forbidden");
                }

                let mut tokens_per_owner = self.tokens_per_owner.get(&token.owner_id).unwrap();
                tokens_per_owner.remove(&token_id);
                self.tokens_per_owner.insert(&token.owner_id, &tokens_per_owner);

                let creator = creator_per_token.get(&token_id).unwrap();

                let mut tokens_per_creator = self.tokens_per_creator.get(&creator).unwrap();
                tokens_per_creator.remove(&token_id);
                self.tokens_per_creator.insert(&creator, &tokens_per_creator);

                self.creator_per_token.remove(&token_id);
                self.tokens_by_id.remove(&token_id);
                self.token_metadata_by_id.remove(&token_id);

                self.tokens_users_likes.remove(&token_id);
                self.tokens_users_views.remove(&token_id);

                let tokens_per_type = self.tokens_per_type.get(&token.token_type).unwrap();
                tokens_per_type.remove(&token_id);
                self.tokens_per_type.insert(&token.token_type, &tokens_per_type);

                match self.sales_active.remove(&token_id)
                {
                    Some(sale) =>
                    {
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
                    },
                    None => {}
                }

                match self.collection_per_token.remove(&token_id)
                {
                    Some(collection_id) =>
                    {
                        let mut collection_tokens = self.collection_tokens.get(&collection_id).unwrap();
                        collection_tokens.remove(&token_id);
                        self.collection_tokens.insert(&collection_id, &collection_tokens);
                    },
                    None => {}
                }

                for i in 1..9
                {
                    let mut sorted = self.tokens_sorted.get(&i).unwrap();

                    if let Some(index) = sorted.iter().position(|x| x.token_id.eq(&token_id))
                    {
                        sorted.remove(index);
                        self.tokens_sorted.insert(&i, sorted);
                    }
                }

            },
            None => {}
        }
    }
}