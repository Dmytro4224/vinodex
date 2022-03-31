use crate::*;

#[path = "../helpers/converters.rs"]
mod converters;

use converters::Transliteration;

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Collection {
    pub name: String,
    pub description: String,
    pub profile_photo: String,
    pub cover_photo: String,
    pub is_active: bool,
    pub owner_id: AccountId,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CollectionJson {
    pub name: String,
    pub description: String,
    pub profile_photo: String,
    pub cover_photo: String,
    pub is_active: bool,
    pub owner: Option<JsonProfile>,
    pub tokens: Vec<JsonToken>,
    pub collection_id: String,
    pub likes_count: u64,
    pub views_count: u64,
    pub tokens_count: u64,

    pub is_liked: bool,
    pub is_viewed: bool
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CollectionJsonWithoutTokens {
    pub name: String,
    pub description: String,
    pub profile_photo: String,
    pub cover_photo: String,
    pub is_active: bool,
    pub owner: Option<JsonProfile>,
    pub collection_id: String,
    pub likes_count: u64,
    pub views_count: u64,
    pub tokens_count: u64,

    pub is_liked: bool,
    pub is_viewed: bool
}

#[near_bindgen]
impl Contract {
    //Створити нову колекцію
    #[payable]
    pub fn collection_add(
        &mut self,
        name: String,
        description: String,
        profile_photo: String,
        cover_photo: String,
        time: u128,
    ) {
        if name.len() < 3 || name.len() > 100 {
            panic!("name length must be between 3 and 100");
        }
        let collection_id = self.collection_id_generate(&name, time);

        self.collections.insert(
            &collection_id,
            &Collection {
                name: name,
                description: description,
                profile_photo: profile_photo,
                cover_photo: cover_photo,
                is_active: true,
                owner_id: env::predecessor_account_id(),
            },
        );
    }

    //Отримати колекцію
    pub fn collection_get(
        &self,
        collection_id: &String,
        account_id: &Option<AccountId>,
        with_tokens: bool,
    ) -> Option<CollectionJson> {
        match self.collections.get(collection_id) {
            Some(collection) => {
                let mut tokens: Vec<JsonToken> = Vec::new();

                if with_tokens {
                    match self.collection_tokens.get(collection_id) {
                        Some(token_ids) => {
                            tokens = token_ids
                                .iter()
                                .map(|x| {
                                    self.nft_token_for_account(&x, account_id.clone()).unwrap()
                                })
                                .collect::<Vec<JsonToken>>();
                        }
                        None => {}
                    }
                }

                let likes_count: u64;
                let  views_count: u64;

                match self.collection_likes.get(&collection_id) 
                {
                    Some(likes) => 
                    {
                        likes_count = likes.len();
                    }
                    None => 
                    {
                        likes_count = 0;
                    }
                }

                match self.collection_views.get(&collection_id) 
                {
                    Some(views) => 
                    {
                        views_count = views.len();
                    }
                    None => 
                    {
                        views_count = 0;
                    }
                }

                let tokens_count : u64;

                match self.collection_tokens.get(&collection_id)
                {
                    Some(list) =>
                    {
                        tokens_count = list.len();
                    },
                    None =>
                    {
                        tokens_count = 0;
                    }
                }

                let mut _is_liked = false;
                let mut _is_viewed = false;

                match account_id
                {
                    Some(account_id) =>
                    {
                        if let Some(likes) = self.collection_likes.get(collection_id)
                        {
                            _is_liked = likes.contains(&account_id);
                        }

                        if let Some(views) = self.collection_views.get(collection_id)
                        {
                            _is_viewed = views.contains(&account_id);
                        }
                    },
                    None => {}
                }

                return Some(CollectionJson {
                    collection_id: collection_id.clone(),
                    name: collection.name,
                    description: collection.description,
                    profile_photo: collection.profile_photo,
                    cover_photo: collection.cover_photo,
                    is_active: collection.is_active,
                    owner: Profile::get_full_profile(
                        &self.profiles,
                        &collection.owner_id,
                        account_id,
                        &self.autors_likes,
                        &self.autors_followers,
                        &self.autors_views,
                        &self.tokens_per_owner,
                        true,
                    ),
                    tokens: tokens,
                    likes_count: likes_count,
                    views_count: views_count,
                    tokens_count: tokens_count,

                    is_liked: _is_liked,
                    is_viewed: _is_viewed
                });
            }
            None => {
                return None;
            }
        }
    }

    pub fn nft_collections(
        &self,
        //пагінація
        page_index: u64,
        //ксть елементів на сторінкі
        page_size: u64,
        account_id: Option<AccountId>,
        with_tokens: bool,
    ) -> Vec<Option<CollectionJson>> {
        // let start_index = (page_index - 1) * page_size;
        // let end_index = page_index * page_size;

        let skip;

        if page_index == 1 {
            skip = 0;
        } else {
            skip = (page_index - 1) * page_size;
        }

        return self
            .collections
            .keys()
            .skip(skip as usize)
            .take(page_size as usize)
            .map(|x| self.collection_get(&x, &account_id, with_tokens))
            .collect();
    }

    pub fn collection_get_by_token(&self, token_id: &TokenId, account_id: &Option<AccountId>) -> Option<CollectionJsonWithoutTokens> 
    {
        match self.collection_per_token.get(&token_id) {
            Some(collection_id) => {
                match self.collection_get(&collection_id, account_id, false)
                {
                    Some(collection) =>
                    {
                        return Some(CollectionJsonWithoutTokens {
                            collection_id: collection_id.clone(),
                            name: collection.name,
                            description: collection.description,
                            profile_photo: collection.profile_photo,
                            cover_photo: collection.cover_photo,
                            is_active: collection.is_active,
                            owner: collection.owner,
                            likes_count: collection.likes_count,
                            views_count: collection.views_count,
                            tokens_count: collection.tokens_count,

                            is_liked: collection.is_liked,
                            is_viewed: collection.is_viewed
                        });
                    },
                    None => {}
                }
            }
            None => {}
        }

        return None;
    }

    #[payable]
    pub fn collection_update(
        &mut self,
        collection_id: String,
        name: Option<String>,
        description: Option<String>,
        profile_photo: Option<String>,
        cover_photo: Option<String>,
    ) {
        let collection = self.collections.get(&collection_id);

        match collection {
            Some(mut collection) => {
                // if collection.owner_id != env::predecessor_account_id()
                // {
                //     panic!("Only owner can update collection");
                // }

                match name {
                    Some(name) => {
                        if name.len() < 3 || name.len() > 100 {
                            panic!("name length must be between 3 and 100");
                        }

                        collection.name = name;
                    }
                    None => {}
                }

                match description {
                    Some(description) => {
                        collection.description = description;
                    }
                    None => {}
                }

                match profile_photo {
                    Some(profile_photo) => {
                        collection.profile_photo = profile_photo;
                    }
                    None => {}
                }

                match cover_photo {
                    Some(cover_photo) => {
                        collection.cover_photo = cover_photo;
                    }
                    None => {}
                }

                self.collections.insert(&collection_id, &collection);
            }
            None => {
                panic!("collection not found");
            }
        }
    }

    #[payable]
    pub fn collection_token_add(&mut self, collection_id: String, token_id: String) {
        if self.collections.get(&collection_id).is_none() {
            panic!("collection not found");
        }

        if self.tokens_by_id.get(&token_id).is_none() {
            panic!("token not found");
        }

        match self.collection_per_token.get(&token_id) {
            Some(current_collection_id) => {
                match self.collection_tokens.get(&current_collection_id) {
                    Some(mut tokens) => {
                        // let pos = tokens.iter().position(|x| x.eq(&token_id));

                        // if let Some(position) = pos
                        // {
                        //     tokens.remove(position);
                        // }

                        tokens.remove(&token_id);

                        self.collection_tokens
                            .insert(&current_collection_id, &tokens);
                    }
                    None => {}
                }
            }
            None => {}
        }

        self.collection_per_token.insert(&token_id, &collection_id);

        match self.collection_tokens.get(&collection_id) {
            Some(mut tokens) => {
                tokens.insert(&token_id);
                self.collection_tokens.insert(&collection_id, &tokens);
            }
            None => {
                let mut tokens = UnorderedSet::new(
                    StorageKey::CollectionOfTokensSet {
                        collection_id_hash: hash_account_id(&collection_id),
                    }
                    .try_to_vec()
                    .unwrap(),
                );

                tokens.insert(&token_id);
                self.collection_tokens.insert(&collection_id, &tokens);
            }
        }
    }

    #[payable]
    pub fn collection_token_remove(&mut self, token_id: String) {
        match self.collection_per_token.remove(&token_id) {
            Some(collection_id) => {
                match self.collection_tokens.get(&collection_id) {
                    Some(mut tokens) => {
                        // let pos = tokens.iter().position(|x| x.eq(&token_id));

                        // if let Some(position) = pos
                        // {
                        //     tokens.remove(position);
                        // }

                        tokens.remove(&token_id);

                        self.collection_tokens.insert(&collection_id, &tokens);
                    }
                    None => {}
                }
            }
            None => {}
        }
    }

    #[private]
    pub fn collection_id_generate(&self, name: &String, time: u128) -> String {
        let mut collection_id = Transliteration::transliterate_string(name);

        if self.collections.get(&collection_id).is_none() {
            return collection_id;
        }

        collection_id.push_str("-");

        let mut collection_id_new: String;

        for i in 1..101 as u8 {
            collection_id_new = collection_id.clone();
            collection_id_new.push_str(&(i.to_string()));

            if self.collections.get(&collection_id_new).is_none() {
                return collection_id_new;
            }
        }

        collection_id_new = collection_id.clone();
        collection_id_new.push_str(&(time.to_string()));

        if self.collections.get(&collection_id_new).is_none() {
            return collection_id_new;
        }

        panic!("could not generate unique collection_id for this name");
    }

    // поставити лайк колекції
    pub fn collection_set_like(&mut self, collection_id: String) {
        let user_id = env::predecessor_account_id();
        match self.collection_likes.get(&collection_id) {
            Some(mut likes) => {
                if likes.contains(&user_id) {
                    likes.remove(&user_id);
                } else {
                    likes.insert(&user_id);
                }

                self.collection_likes.insert(&collection_id, &likes);
            }
            None => {
                let mut unordered_set_of_likes: UnorderedSet<AccountId> =
                    UnorderedSet::new(StorageKey::CollectionLikes.try_to_vec().unwrap());

                unordered_set_of_likes.insert(&user_id);

                self.collection_likes
                    .insert(&collection_id, &unordered_set_of_likes);
            }
        }
    }

    // поставити перегляд колекції
    pub fn collection_set_view(&mut self, collection_id: String) {
        let user_id = env::predecessor_account_id();

        match self.collection_views.get(&collection_id) {
            Some(mut views) => {
                if !views.contains(&user_id) {
                    views.insert(&user_id);
                }

                self.collection_views.insert(&collection_id, &views);
            }
            None => {
                let mut unordered_set_of_views: UnorderedSet<AccountId> =
                    UnorderedSet::new(StorageKey::CollectionViews.try_to_vec().unwrap());
                unordered_set_of_views.insert(&user_id);

                self.collection_views
                    .insert(&collection_id, &unordered_set_of_views);
            }
        }
    }
}
