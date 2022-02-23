use crate::*;

#[path = "../helpers/converters.rs"]
mod converters;

use converters::Converter;

#[near_bindgen]
impl Contract {

    pub fn nft_tokens(&self, from_index: Option<U128>, limit: Option<u64>) -> Vec<JsonToken> {
        let keys = self.token_metadata_by_id.keys_as_vector();
        let start = u128::from(from_index.unwrap_or(U128(0)));
        keys.iter()
            .skip(start as usize)
            .take(limit.unwrap_or(0) as usize)
            .map(|token_id| self.nft_token(token_id.clone()).unwrap())
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

    ///к-сть токенів типу token_type
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
    
///колекція токенів по фільтру
    pub fn nft_tokens_by_filter(
        &self,
        // каталог або null|none
        catalog: Option<String>,
       // order by шось
        sort: u8, 
        //пагінація
        page_index: u64,
        //ксть елементів на сторінкі
        page_size: u64,
    ) ->Vec<JsonToken> {

        let token_ids : HashSet<String>;
        let mut skip = 0;
        if page_index >= 1
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

        if is_reverse
        {
            let start_index = token_ids.len() as i64 - skip as i64;
            let end_index = start_index - available_amount;

            for i in (end_index..start_index).rev()
            {
                let _index = i as usize;

                if token_ids.contains(&sorted[_index].token_id)
                {
                    result.push(self.nft_token(sorted[_index].token_id.clone()).unwrap());
                }
            }
        }
        else
        {
            for i in skip..skip + available_amount as u64
            {
                let _index = i as usize;
                let _token = sorted.get(_index);
                if _token.is_none()
                {
                    continue;
                }

                if token_ids.contains(&_token.unwrap().token_id)
                {
                    result.push(self.nft_token(sorted[_index].token_id.clone()).unwrap());
                }
            }
        }

        return result;
    }
    
    

    ///отримати дані по токену
    pub fn nft_token_get(
        &self,
        // id токену
        token_id: TokenId,
    ) -> JsonToken {

        return self.nft_token(token_id).unwrap();
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

    ///токени власника
    pub fn nft_tokens_for_owner(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<JsonToken> {
        let tokens_owner = self.tokens_per_owner.get(&account_id);
        let tokens = if let Some(tokens_owner) = tokens_owner {
            tokens_owner
        } else {
            return vec![];
        };
        let keys = tokens.as_vector();
        let start = u128::from(from_index.unwrap_or(U128(0)));
        keys.iter()
            .skip(start as usize)
            .take(limit.unwrap_or(0) as usize)
            .map(|token_id| self.nft_token(token_id.clone()).unwrap())
            .collect()
    }


    pub fn nft_liked_for_account(
        &self,
        account_id: AccountId,
        from_index: Option<U128>,
        limit: Option<u64>,
    ) -> Vec<Option<JsonToken>> {

       
        if let Some(_liked_tokens)=self.my_tokens_likes.get(&account_id){

            let keys:Vec<TokenId> = _liked_tokens.into_iter().collect();
            let start = u128::from(from_index.unwrap_or(U128(0)));
            keys.iter()
                .skip(start as usize)
                .take(limit.unwrap_or(0) as usize)
                .map(|token_id| self.nft_token(token_id.clone()))
                .collect()

        }else{
            return vec![];
        }
    }

    

    //словник авторів
    pub fn authors_by_storage_para(&self,parameter: u8)->Vec<ProfileStatCriterion>{
        return self.profiles_global_stat_sorted_vector.get(&parameter).unwrap();
    }

    //списки авторів
    pub fn authors_by_filter(
        &self,
        //по чому сортувати
        parameter: u8, 
       // true = asc
       is_reverse: bool, 
        //пагінація
        page_index: u64,
        //ксть елементів на сторінкі
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
                        &self.autors_followers
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
                        &self.autors_followers
                  ));
            }
        }

        return result;
    }

    ///список улюблений авторів
    pub fn liked_authors_for_account(
        &self,
        account_id: AccountId,
        //пагінація
        page_index: u64,
        //ксть елементів на сторінкі
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
                        &self.autors_followers
                  ));
            }
        

        return result;
    }


    ///список авторів, які відслідковуються
    pub fn followed_authors_for_account(
        &self,
        account_id: AccountId,
        //пагінація
        page_index: u64,
        //ксть елементів на сторінкі
        page_size: u64
    ) ->Vec<Option<JsonProfile>> {

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
                        &self.autors_followers
                  ));
            }
        

        return result;
    }
}