use std::cmp::{Ordering};
use near_sdk::{AccountId};
use near_sdk::collections::{LookupMap};
use validator::Validate;
use std::collections::HashSet;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::collections::{UnorderedSet};
use near_sdk::json_types::{Base64VecU8, ValidAccountId, U128, U64};

#[derive(Debug, Clone, BorshDeserialize, BorshSerialize, Serialize, Deserialize,Validate)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonProfile {
    ///коротка інфа
    pub bio: String,
    //ім'я юзера
    pub name:String,
    ///фотка
    pub image: String,
    //Друга фотка (як в колекції)
    pub cover_image: String,
    ///електропошта
    #[validate(email)]
    pub email:String,
    pub account_id:AccountId,
    
    pub is_following:bool,
    pub followers_count:u32,

    pub is_liked : bool,
    pub is_viewed : bool,

    pub likes_count:u32,
    pub items_count:u32
}

#[derive(Debug, Clone, BorshDeserialize, BorshSerialize, Serialize, Deserialize,Validate)]
#[serde(crate = "near_sdk::serde")]
pub struct Profile {
    ///коротка інфа
    pub bio: String,
    //ім'я юзера
    pub name:String,
    ///фотка
    pub image: String,
    //Друга фотка (як в колекції)
    pub cover_image: String,
    ///електропошта
    #[validate(email)]
    pub email:String,
    pub account_id:AccountId
}

impl Profile {
    ///Отримати дані профілю для юзера AccountId
    pub fn get_profile_inner(profiles: &mut LookupMap<AccountId, Profile>, account_id: AccountId) -> Option<Profile> {
        let account_id: AccountId = account_id.into();
        return profiles.get(&account_id);
    }



    pub fn get_full_profile(
        profiles: &LookupMap<AccountId, Profile>,
        account_id: &AccountId,
        asked_account_id: &Option<AccountId>,
        autors_likes: &LookupMap<AccountId, HashSet<AccountId>>, 
        autors_followers: &LookupMap<AccountId, HashSet<AccountId>>,
        autors_views: &LookupMap<AccountId, HashSet<AccountId>>,
        autors_tokens: &LookupMap<AccountId, UnorderedSet<String>>,
        default_if_none: bool
       ) -> Option<JsonProfile> {
       let account_id: AccountId = account_id.into();

       if let Some(_profile) = profiles.get(&account_id) {
           let mut result=JsonProfile 
           {
               account_id:_profile.account_id,
               bio:_profile.bio,
               name:_profile.name,
               image:_profile.image,
               cover_image:_profile.cover_image,
               email:_profile.email,
               is_following :false,
               is_liked :false,
               is_viewed :false,
               followers_count:Profile::get_profile_followers_count(&autors_followers,&account_id),
               likes_count:Profile::get_profile_like_count(&autors_likes,&account_id),
               items_count: 0
           };

           if let Some(tokens) = autors_tokens.get(&account_id)
           {
                result.items_count = tokens.len() as u32;
           }

           if let Some(_asked_account_id)=asked_account_id
           {
                result.is_following=Profile::is_profile_checked(
                    &autors_followers,
                    &account_id,
                    &_asked_account_id
                );

                result.is_liked = Profile::is_profile_checked(
                    &autors_likes,
                    &account_id,
                    &_asked_account_id);

                result.is_viewed = Profile::is_profile_checked(
                    &autors_views,
                    &account_id,
                    &_asked_account_id);
           }

           return  Some(result);
           }
        
        else 
        {
            if default_if_none
            {
                return Some(JsonProfile
                {
                    account_id: account_id,
                    bio: String::from(""),
                    name: String::from(""),
                    image: String::from(""),
                    cover_image: String::from(""),
                    email: String::from(""),
                    is_following:false,
                    is_liked:false,
                    is_viewed:false,
                    followers_count: 0,
                    likes_count: 0,
                    items_count: 0
                });
            }
            else
            {
                return  None;
            }
       }
   }
    pub fn get_default_data(account_id: AccountId) -> Profile{
        return Profile
        {
            account_id:account_id,
            bio:String::from(""),
            email:String::from(""),
            image:String::from("https://thumbs.dreamstime.com/b/default-avatar-thumb-6599242.jpg"),
            cover_image:String::from(""),
            name:String::from("")
        }
    }


    ///перевірити чи є запис про профіль, якшо нема - додати дефолтний
    pub fn check_default(profiles: &mut LookupMap<AccountId, Profile>, account_id: &AccountId){
        let _profile=Profile::get_profile_inner(profiles, account_id.clone());
        if _profile.is_none(){
            profiles.insert(
                &account_id, 
                &Profile::get_default_data(account_id.clone())
            );
        }
    }


    pub fn set_profile_bio(profiles: &mut LookupMap<AccountId, Profile>,value:String, account_id: &AccountId){
        Profile::check_default(profiles,account_id);

        let mut _profile=Profile::get_profile_inner(profiles, account_id.clone()).unwrap();
        _profile.bio=value.clone();
        profiles.insert(&account_id, &_profile);
    }

    pub fn set_profile_image(profiles: &mut LookupMap<AccountId, Profile>,value:String, account_id: &AccountId){
        Profile::check_default(profiles,account_id);

        let mut _profile=Profile::get_profile_inner(profiles, account_id.clone()).unwrap();
        _profile.image=value.clone();
        profiles.insert(&account_id, &_profile);
    }

    pub fn set_profile_name(profiles: &mut LookupMap<AccountId, Profile>,value:String, account_id: &AccountId){
        Profile::check_default(profiles,account_id);

        let mut _profile=Profile::get_profile_inner(profiles, account_id.clone()).unwrap();
        _profile.name=value.clone();
        profiles.insert(&account_id, &_profile);
    }

    pub fn set_profile_email(profiles: &mut LookupMap<AccountId, Profile>,value:String, account_id: &AccountId){
        Profile::check_default(profiles,account_id);

        let mut _profile=Profile::get_profile_inner(profiles, account_id.clone()).unwrap();
        _profile.email=value.clone();
        profiles.insert(&account_id, &_profile);
    }

    pub fn set_profile_account_id(profiles: &mut LookupMap<AccountId, Profile>,value:String, account_id: &AccountId){
        Profile::check_default(profiles,account_id);

        let mut _profile=Profile::get_profile_inner(profiles, account_id.clone()).unwrap();
        _profile.account_id=value.clone();
        profiles.insert(&account_id, &_profile);
    }

    ///Встановити дані профілю
    pub fn set_profile(profiles: &mut LookupMap<AccountId, Profile>, 
        profile: &Profile, 
        account_id: &AccountId) 
    {
        //let mut _profile=Profile::get_profile_inner(profiles, account_id.clone());
        profiles.insert(&account_id, profile);
    }


    ///поставити лайк юзеру
    pub fn set_profile_like(
        autors_likes:&mut LookupMap<AccountId, HashSet<AccountId>>, 
        sourse_account_id: &AccountId,
        target_account_id: &AccountId){

            Profile::change_dictionary_state(
                autors_likes,
                sourse_account_id,
                target_account_id,
            true
            );

    }

    ///кількість поставлених лайків
    pub fn get_profile_like_count(
     autors_likes: &LookupMap<AccountId, HashSet<AccountId>>, 
     account_id: &AccountId)->u32
     {
        match autors_likes.get(&account_id)
        {
            Some(likes) =>
            {
                return likes.len() as u32;
            },
            None =>
            {
                return 0 as u32;
            }
        }
    }

    ///кількість людей, які підписалися на автора
    pub fn get_profile_followers_count(
        autors_followers: &LookupMap<AccountId, HashSet<AccountId>>, 
        account_id: &AccountId)->u32
    {
        match autors_followers.get(&account_id)
        {
            Some(follows) =>
            {
                return follows.len() as u32;
            },
            None =>
            {
                return 0 as u32;
            }
        }
    }

    pub fn is_profile_checked(
        source: &LookupMap<AccountId, HashSet<AccountId>>, 
        sourse_account_id: &AccountId,
        asked_account_id: &AccountId)->bool
    {
        match source.get(&sourse_account_id)
        {
            Some(tmp) =>
            {
                if tmp.contains(asked_account_id)
                {
                    return true;
                }

                return false;
            },
            None =>
            {
                return false;
            }
        }
    }

    ///поставити відмітку, хто відвідував сторінку користувачем
    pub fn set_profile_view(
        autors_view:&mut LookupMap<AccountId, HashSet<AccountId>>, 
        sourse_account_id: &AccountId,
        target_account_id: &AccountId)
    {

        Profile::change_dictionary_state(
            autors_view,
            sourse_account_id,
            target_account_id,
        false
        );
    }

    ///Додати користувача в список відстеження
    pub fn set_profile_follow(
        autors_following_list:&mut LookupMap<AccountId, HashSet<AccountId>>, 
        sourse_account_id: &AccountId,
        target_account_id: &AccountId)
    {
        Profile::change_dictionary_state(
            autors_following_list,
            sourse_account_id,
            target_account_id,
        true
        );
    }

    ///додати юзера до мого списку вподобань
    pub fn add_profile_to_my_like_list(
        my_authors_likes:&mut LookupMap<AccountId, HashSet<AccountId>>, 
        my_account_id: &AccountId,
        like_account_id: &AccountId)
    {

        Profile::change_dictionary_state(
            my_authors_likes,
            my_account_id,
            like_account_id,
        true
        );
    }

    pub fn add_profile_to_my_followers_list(
        my_autors_followers:&mut LookupMap<AccountId, HashSet<AccountId>>, 
        my_account_id: &AccountId,
        follower_account_id: &AccountId){

            Profile::change_dictionary_state(
                my_autors_followers,
                my_account_id,
                follower_account_id,
            true
            );
    }

    pub fn change_dictionary_state(
        dictionary:&mut LookupMap<AccountId, HashSet<AccountId>>, 
        //аккаунт, до якого відноситься помітка
        sourse_account_id: &AccountId,
        //аккаунт, який робить помітку
        target_account_id: &AccountId,
        //вказує на те, чи потрібно робити зворотню дію: чек-анчек
        need_reverse:bool)
    {
        match dictionary.get(sourse_account_id)
        {
            Some(mut value) =>
            {
                if need_reverse
                {
                    if value.contains(target_account_id)
                    {
                        value.remove(target_account_id);
                    }
                    else
                    {
                        value.insert(target_account_id.clone());
                    }

                    dictionary.insert(sourse_account_id, &value);
                }
            },
            None =>
            {
                let mut _fitst_record:HashSet<AccountId>=HashSet::new();
                _fitst_record.insert(target_account_id.to_string());
                dictionary.insert(sourse_account_id, &_fitst_record);
            }
        }
    }
} 

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
///структура для статистики
pub struct ProfileStat
{
    ///0  - кількість лайків аккаунту
    pub likes_count: u32,
    ///1 - кількість лайків токенів аккаунту
    pub tokens_likes_count: u32,
    //2 - загальна ксть переглядів аккаунту
    pub views_count: u32,
    //3 - загальна ксть переглядів токенів аккаунту
    pub tokens_views_count: u32,
    ///4 - загальна ксть токенів, де користувач - creator
    pub tokens_count: u32,
    //5 - к-сть підписників автора
    pub followers_count: u32,
    //6 - к-сть токенів, де користувач - artist
    pub tokens_count_as_artist: u32,

    //поля попорядку 
    //on_sale 7 - 10
    //sold 11 - 14
    pub prices_as_creator: ProfilePriceStatMain,

    //on_sale 15 - 18
    //sold 19 - 22
    pub prices_as_artist: ProfilePriceStatMain,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
///структура для статистики
pub struct ProfileStatJson
{
    ///0  - кількість лайків аккаунту
    pub likes_count: u32,
    ///1 - кількість лайків токенів аккаунту
    pub tokens_likes_count: u32,
    //2 - загальна ксть переглядів аккаунту
    pub views_count: u32,
    //3 - загальна ксть переглядів токенів аккаунту
    pub tokens_views_count: u32,
    ///4 - загальна ксть токенів, де користувач - creator
    pub tokens_count: u32,
    //5 - к-сть підписників автора
    pub followers_count: u32,
    //6 - к-сть токенів, де користувач - artist
    pub tokens_count_as_artist: u32,

    //поля попорядку 
    //on_sale 7 - 10
    //sold 11 - 14
    pub prices_as_creator: ProfilePriceStatMainJson,

    //on_sale 15 - 18
    //sold 19 - 22
    pub prices_as_artist: ProfilePriceStatMainJson,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub struct ProfilePriceStatMain
{
    pub on_sale: ProfilePriceStat,
    pub sold: ProfilePriceStat
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub struct ProfilePriceStatMainJson
{
    pub on_sale: ProfilePriceStatJson,
    pub sold: ProfilePriceStatJson
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub struct ProfilePriceStatJson
{
    // найнижча ціна проданого токена
    pub lowest_price: U128,
    // найвища ціна проданого токена
    pub highest_price: U128,
    // ціна найновішого токену на продажі
    pub newest_price: U128,
    // сума всіх проданих
    pub total_price: U128,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub struct ProfilePriceStat
{
    // найнижча ціна проданого токена
    pub lowest_price: u128,
    // найвища ціна проданого токена
    pub highest_price: u128,
    // ціна найновішого токену на продажі
    pub newest_price: u128,
    // сума всіх проданих
    pub total_price: u128,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub struct ProfileStatCriterion
{
    pub account_id:AccountId,
    pub criterion:Option<u128>
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub enum ProfileStatCriterionEnum
{
    LikesCount,
    TokenLikesCount,
    ViewsCount,
    TokenViewsCount,
    TokensCount,
    FollowersCount,
    TokensCountAsArtist,
    OnSaleLowestPriceAsCreator,
    OnSaleHighestPriceAsCreator,
    OnSaleNewestPriceAsCreator,
    OnSaleTotalPriceAsCreator,
    SoldLowestPriceAsCreator,
    SoldHighestPriceAsCreator,
    SoldNewestPriceAsCreator,
    SoldTotalPriceAsCreator,
    OnSaleLowestPriceAsArtist,
    OnSaleHighestPriceAsArtist,
    OnSaleNewestPriceAsArtist,
    OnSaleTotalPriceAsArtist,
    SoldLowestPriceAsArtist,
    SoldHighestPriceAsArtist,
    SoldNewestPriceAsArtist,
    SoldTotalPriceAsArtist
}


impl ProfileStatCriterion
{

    pub fn __increment(sourse :u128, increment:u128, is_add:bool) -> u128
    {
        if sourse==0 && !is_add 
        { 
            return 0;
        }

        if is_add
        {
            return sourse+increment;
        }
        else
        {
            return sourse-increment;
        }

    }

    pub fn profile_price_stat_get_default() -> ProfilePriceStat
    {
        return ProfilePriceStat
        {
            lowest_price: 0,
            highest_price: 0,
            newest_price: 0,
            total_price: 0
        };
    }

    pub fn profile_stat_get_default() -> ProfileStat
    {
        return ProfileStat
        {
            likes_count:0,
            tokens_likes_count: 0,
            views_count: 0,
            tokens_views_count: 0,
            tokens_count: 0,
            followers_count: 0,
            tokens_count_as_artist: 0,
            prices_as_artist: ProfilePriceStatMain
            {
                on_sale: ProfileStatCriterion::profile_price_stat_get_default(),
                sold: ProfileStatCriterion::profile_price_stat_get_default()
            },
            prices_as_creator: ProfilePriceStatMain
            {
                on_sale: ProfileStatCriterion::profile_price_stat_get_default(),
                sold: ProfileStatCriterion::profile_price_stat_get_default()
            }
        };
    }

    //встановити значення параметру статистики
    pub fn set_profile_stat_val
    (
        profiles_global_stat: &mut LookupMap<AccountId, ProfileStat>, 
        profiles_global_stat_sorted_vector: &mut LookupMap<ProfileStatCriterionEnum, Vec<ProfileStatCriterion>>,
        user_id: &AccountId, 
        parameter: ProfileStatCriterionEnum,
        value: u128
    )
    {
        let mut stat:ProfileStat;
    
        match profiles_global_stat.get(user_id) 
        {
            Some(mut _profile_stat) => 
            {
                stat = _profile_stat
            }
            None => 
            {
                stat = ProfileStatCriterion::profile_stat_get_default();
            }
        }
            
        match parameter
        {
            //кількість лайків аккаунту
            ProfileStatCriterionEnum::LikesCount =>
            {
                stat.likes_count = value as u32;
            },
            //кількість лайків токенів аккаунту
            ProfileStatCriterionEnum::TokenLikesCount =>
            {
                stat.tokens_likes_count = value as u32;
            },
            //загальна ксть переглядів аккаунту
            ProfileStatCriterionEnum::ViewsCount =>
            {
                stat.views_count = value as u32;
            },
            //загальна ксть переглядів токенів аккаунту
            ProfileStatCriterionEnum::TokenViewsCount =>
            {
                stat.tokens_views_count = value as u32;
            },
            //загальна ксть токенів
            ProfileStatCriterionEnum::TokensCount =>
            {
                stat.tokens_count = value as u32;
            },
            // к-сть підписників автора
            ProfileStatCriterionEnum::FollowersCount =>
            {
                stat.followers_count = value as u32;
            },
            // к-сть токенів, де користувач - artist
            ProfileStatCriterionEnum::TokensCountAsArtist =>
            {
                stat.tokens_count_as_artist = value as u32;
            },
            //найнижча ціна токену, який знаходиться на продажі, користувач - creator
            ProfileStatCriterionEnum::OnSaleLowestPriceAsCreator =>
            {
                stat.prices_as_creator.on_sale.lowest_price = value;
            },
            //найвища ціна токену, який знаходиться на продажі, користувач - creator
            ProfileStatCriterionEnum::OnSaleHighestPriceAsCreator =>
            {
                stat.prices_as_creator.on_sale.highest_price = value;
            },
            //ціна найновішого токену, який знаходиться на продажі, користувач - creator
            ProfileStatCriterionEnum::OnSaleNewestPriceAsCreator =>
            {
                stat.prices_as_creator.on_sale.newest_price = value;
            },
            //сума всії токенів, який знаходиться на продажі, користувач - creator
            ProfileStatCriterionEnum::OnSaleTotalPriceAsCreator =>
            {
                stat.prices_as_creator.on_sale.total_price = value;
            },
            //найнижча ціна проданого токену, користувач - creator
            ProfileStatCriterionEnum::SoldLowestPriceAsCreator =>
            {
                stat.prices_as_creator.sold.lowest_price = value;
            },
            //найвища ціна проданого токену, користувач - creator
            ProfileStatCriterionEnum::SoldHighestPriceAsCreator =>
            {
                stat.prices_as_creator.sold.highest_price = value;
            },
            //ціна останнього проданого токену, користувач - creator
            ProfileStatCriterionEnum::SoldNewestPriceAsCreator =>
            {
                stat.prices_as_creator.sold.newest_price = value;
            },
            //загальна ціна всіх проданих токенів, користувач - creator
            ProfileStatCriterionEnum::SoldTotalPriceAsCreator =>
            {
                stat.prices_as_creator.sold.total_price = value;
            },
            //найнижча ціна токену, який знаходиться на продажі, користувач - artist
            ProfileStatCriterionEnum::OnSaleLowestPriceAsArtist =>
            {
                stat.prices_as_artist.on_sale.lowest_price = value;
            },
            //найвища ціна токену, який знаходиться на продажі, користувач - artist
            ProfileStatCriterionEnum::OnSaleHighestPriceAsArtist =>
            {
                stat.prices_as_artist.on_sale.highest_price = value;
            },
            //ціна найновішого токену, який знаходиться на продажі, користувач - artist
            ProfileStatCriterionEnum::OnSaleNewestPriceAsArtist =>
            {
                stat.prices_as_artist.on_sale.newest_price = value;
            },
            //сума всії токенів, який знаходиться на продажі, користувач - artist
            ProfileStatCriterionEnum::OnSaleTotalPriceAsArtist =>
            {
                stat.prices_as_artist.on_sale.total_price = value;
            },
            //найнижча ціна проданого токену, користувач - artist
            ProfileStatCriterionEnum::SoldLowestPriceAsArtist =>
            {
                stat.prices_as_artist.sold.lowest_price = value;
            },
            //найвища ціна проданого токену, користувач - artist
            ProfileStatCriterionEnum::SoldHighestPriceAsArtist =>
            {
                stat.prices_as_artist.sold.highest_price = value;
            },
            ProfileStatCriterionEnum::SoldNewestPriceAsArtist =>
            {
                stat.prices_as_artist.sold.newest_price = value;
            },
            ProfileStatCriterionEnum::SoldTotalPriceAsArtist =>
            {
                stat.prices_as_artist.sold.total_price = value;
            }
        }

        let _sorted_list_item = profiles_global_stat_sorted_vector.get(&parameter);

        let _sort_element=ProfileStatCriterion {
            account_id: user_id.to_string(),
            criterion:Some(value)
        };

        //якшо ще немає сортування для цього параметру
        // створюємо запис
        match _sorted_list_item
        {
            Some(mut _vector) =>
            {
                if let Some(_current_position) = _vector.iter().position(|x| x.account_id.eq(user_id)) {
                    _vector.remove(_current_position);
                }

                //сортуємо і шукаємо нову позицію
                let _new_position=ProfileStatCriterion::binary_search(&_sort_element,&_vector);
                    
                match _new_position
                {
                    Some(_new_position)=> _vector.insert(_new_position,_sort_element),
                    None=> _vector.push(_sort_element)
                }

                //вставляємо
                profiles_global_stat_sorted_vector.insert(&parameter, &_vector);
            },
            None =>
            {
                let mut _insert_vec:Vec<ProfileStatCriterion>=Vec::new();
                _insert_vec.push(
                    _sort_element
                );
    
                profiles_global_stat_sorted_vector.insert(&parameter,&_insert_vec);
            }
        }

        profiles_global_stat.insert(&user_id, &stat);
    }

    ///збільшити значення статистики
    pub fn profile_stat_inc
    (
        profiles_global_stat: &mut LookupMap<AccountId, ProfileStat>, 
        profiles_global_stat_sorted_vector:  &mut  LookupMap<ProfileStatCriterionEnum, Vec<ProfileStatCriterion>>,
        user_id: &AccountId, 
        parameter: ProfileStatCriterionEnum,
        increment: u128,
        need_add: bool
    )
    {
        let stat:ProfileStat;

        match profiles_global_stat.get(user_id) 
        {
            Some(mut _profile_stat) => 
            {
                stat = _profile_stat
            },
            None => 
            {
                stat = ProfileStatCriterion::profile_stat_get_default();
            }
        }        
        
        let mut _value: u128 = 0;

        match parameter
        {
            //кількість лайків аккаунту
            ProfileStatCriterionEnum::LikesCount =>
            {
                _value = ProfileStatCriterion::__increment(stat.likes_count as u128, increment, need_add);
            },
            //кількість лайків токенів аккаунту
            ProfileStatCriterionEnum::TokenLikesCount => 
            {
                _value = ProfileStatCriterion::__increment(stat.tokens_likes_count as u128, increment, need_add);
            },
            //загальна ксть переглядів аккаунту
            ProfileStatCriterionEnum::ViewsCount =>
            {
                _value = ProfileStatCriterion::__increment(stat.views_count as u128, increment, need_add);
            },
            //загальна ксть переглядів токенів аккаунту
            ProfileStatCriterionEnum::TokenViewsCount =>
            {
                _value = ProfileStatCriterion::__increment(stat.tokens_views_count as u128, increment, need_add);
            },
            //загальна ксть токенів
            ProfileStatCriterionEnum::TokensCount =>
            {
                _value = ProfileStatCriterion::__increment(stat.tokens_count as u128, increment, need_add);
            },
            //к-сть підписників автора
            ProfileStatCriterionEnum::FollowersCount =>
            {
                _value = ProfileStatCriterion::__increment(stat.followers_count as u128, increment, need_add);
            },
            // к-сть токенів, де користувач - artist
            ProfileStatCriterionEnum::TokensCountAsArtist =>
            {
                _value = ProfileStatCriterion::__increment(stat.tokens_count_as_artist as u128, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::OnSaleLowestPriceAsCreator =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_creator.on_sale.lowest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::OnSaleHighestPriceAsCreator =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_creator.on_sale.highest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::OnSaleNewestPriceAsCreator =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_creator.on_sale.newest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::OnSaleTotalPriceAsCreator =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_creator.on_sale.total_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::SoldLowestPriceAsCreator =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_creator.sold.lowest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::SoldHighestPriceAsCreator =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_creator.sold.highest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::SoldNewestPriceAsCreator =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_creator.sold.newest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::SoldTotalPriceAsCreator =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_creator.sold.total_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::OnSaleLowestPriceAsArtist =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_artist.on_sale.lowest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::OnSaleHighestPriceAsArtist =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_artist.on_sale.highest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::OnSaleNewestPriceAsArtist =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_artist.on_sale.newest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::OnSaleTotalPriceAsArtist =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_artist.on_sale.total_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::SoldLowestPriceAsArtist =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_artist.sold.lowest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::SoldHighestPriceAsArtist =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_artist.sold.highest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::SoldNewestPriceAsArtist =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_artist.sold.newest_price, increment, need_add);
            },
            // 
            ProfileStatCriterionEnum::SoldTotalPriceAsArtist =>
            {
                _value = ProfileStatCriterion::__increment(stat.prices_as_artist.sold.total_price, increment, need_add);
            }
        }

        ProfileStatCriterion::set_profile_stat_val
        (
            profiles_global_stat,
            profiles_global_stat_sorted_vector,
            user_id,
            parameter,
            _value
        );
    }

    ///змінити на нове значення, якщо умова задовольняється
    pub fn profile_stat_price_check_and_change
    (
        profiles_global_stat: &mut LookupMap<AccountId, ProfileStat>, 
        profiles_global_stat_sorted_vector:  &mut  LookupMap<ProfileStatCriterionEnum, Vec<ProfileStatCriterion>>,
        creator: &AccountId, 
        artist: &AccountId, 
        price: u128,
        is_sold: bool
    )
    {
        ProfileStatCriterion::profile_stat_price_check_and_change_for_creator(
            profiles_global_stat,
            profiles_global_stat_sorted_vector,
            creator,
            price,
            is_sold
        );

        ProfileStatCriterion::profile_stat_price_check_and_change_for_artist(
            profiles_global_stat,
            profiles_global_stat_sorted_vector,
            artist,
            price,
            is_sold
        );
    }

    ///змінити статистику по цінам для створювача на нове значення, якщо умова задовольняється
    pub fn profile_stat_price_check_and_change_for_creator
    (
        profiles_global_stat: &mut LookupMap<AccountId, ProfileStat>, 
        profiles_global_stat_sorted_vector:  &mut  LookupMap<ProfileStatCriterionEnum, Vec<ProfileStatCriterion>>,
        account_id: &AccountId, 
        price: u128,
        is_sold: bool
    )
    {
        let mut stat : ProfileStat;

        match profiles_global_stat.get(account_id) 
        {
            Some(_profile_stat) => 
            {
                stat = _profile_stat
            },
            None => 
            {
                stat = ProfileStatCriterion::profile_stat_get_default();
            }
        }   
        
        if is_sold
        {
            if price < stat.prices_as_creator.sold.lowest_price
            {
                ProfileStatCriterion::set_profile_stat_val
                (
                    profiles_global_stat,
                    profiles_global_stat_sorted_vector,
                    account_id,
                    ProfileStatCriterionEnum::SoldLowestPriceAsCreator,
                    price
                );
            }

            if price > stat.prices_as_creator.sold.highest_price
            {
                ProfileStatCriterion::set_profile_stat_val
                (
                    profiles_global_stat,
                    profiles_global_stat_sorted_vector,
                    account_id,
                    ProfileStatCriterionEnum::SoldHighestPriceAsCreator,
                    price
                );
            }

            ProfileStatCriterion::set_profile_stat_val
            (
                profiles_global_stat,
                profiles_global_stat_sorted_vector,
                account_id,
                ProfileStatCriterionEnum::SoldNewestPriceAsCreator,
                price
            );

            ProfileStatCriterion::set_profile_stat_val
            (
                profiles_global_stat,
                profiles_global_stat_sorted_vector,
                account_id,
                ProfileStatCriterionEnum::SoldTotalPriceAsCreator,
                stat.prices_as_creator.sold.total_price + price
            );
        }
        else
        {
            if price < stat.prices_as_creator.on_sale.lowest_price
            {
                ProfileStatCriterion::set_profile_stat_val
                (
                    profiles_global_stat,
                    profiles_global_stat_sorted_vector,
                    account_id,
                    ProfileStatCriterionEnum::OnSaleLowestPriceAsCreator,
                    price
                );
            }

            if price > stat.prices_as_creator.on_sale.highest_price
            {
                ProfileStatCriterion::set_profile_stat_val
                (
                    profiles_global_stat,
                    profiles_global_stat_sorted_vector,
                    account_id,
                    ProfileStatCriterionEnum::OnSaleHighestPriceAsCreator,
                    price
                );
            }

            ProfileStatCriterion::set_profile_stat_val
            (
                profiles_global_stat,
                profiles_global_stat_sorted_vector,
                account_id,
                ProfileStatCriterionEnum::OnSaleNewestPriceAsCreator,
                price
            );

            ProfileStatCriterion::set_profile_stat_val
            (
                profiles_global_stat,
                profiles_global_stat_sorted_vector,
                account_id,
                ProfileStatCriterionEnum::OnSaleTotalPriceAsCreator,
                stat.prices_as_creator.on_sale.total_price + price
            );
        }
    }


    ///змінити статистику по цінам для артиста на нове значення, якщо умова задовольняється
    pub fn profile_stat_price_check_and_change_for_artist
    (
        profiles_global_stat: &mut LookupMap<AccountId, ProfileStat>, 
        profiles_global_stat_sorted_vector:  &mut  LookupMap<ProfileStatCriterionEnum, Vec<ProfileStatCriterion>>,
        account_id: &AccountId, 
        price: u128,
        is_sold: bool
    )
    {
        let mut stat : ProfileStat;

        match profiles_global_stat.get(account_id) 
        {
            Some(_profile_stat) => 
            {
                stat = _profile_stat
            },
            None => 
            {
                stat = ProfileStatCriterion::profile_stat_get_default();
            }
        }   
        
        if is_sold
        {
            if price < stat.prices_as_artist.sold.lowest_price
            {
                ProfileStatCriterion::set_profile_stat_val
                (
                    profiles_global_stat,
                    profiles_global_stat_sorted_vector,
                    account_id,
                    ProfileStatCriterionEnum::SoldLowestPriceAsArtist,
                    price
                );
            }

            if price > stat.prices_as_artist.sold.highest_price
            {
                ProfileStatCriterion::set_profile_stat_val
                (
                    profiles_global_stat,
                    profiles_global_stat_sorted_vector,
                    account_id,
                    ProfileStatCriterionEnum::SoldHighestPriceAsArtist,
                    price
                );
            }

            ProfileStatCriterion::set_profile_stat_val
            (
                profiles_global_stat,
                profiles_global_stat_sorted_vector,
                account_id,
                ProfileStatCriterionEnum::SoldNewestPriceAsArtist,
                price
            );

            ProfileStatCriterion::set_profile_stat_val
            (
                profiles_global_stat,
                profiles_global_stat_sorted_vector,
                account_id,
                ProfileStatCriterionEnum::SoldTotalPriceAsArtist,
                stat.prices_as_artist.sold.total_price + price
            );
        }
        else
        {
            if price < stat.prices_as_artist.on_sale.lowest_price
            {
                ProfileStatCriterion::set_profile_stat_val
                (
                    profiles_global_stat,
                    profiles_global_stat_sorted_vector,
                    account_id,
                    ProfileStatCriterionEnum::OnSaleLowestPriceAsArtist,
                    price
                );
            }

            if price > stat.prices_as_artist.on_sale.highest_price
            {
                ProfileStatCriterion::set_profile_stat_val
                (
                    profiles_global_stat,
                    profiles_global_stat_sorted_vector,
                    account_id,
                    ProfileStatCriterionEnum::OnSaleHighestPriceAsArtist,
                    price
                );
            }

            ProfileStatCriterion::set_profile_stat_val
            (
                profiles_global_stat,
                profiles_global_stat_sorted_vector,
                account_id,
                ProfileStatCriterionEnum::OnSaleNewestPriceAsArtist,
                price
            );

            ProfileStatCriterion::set_profile_stat_val
            (
                profiles_global_stat,
                profiles_global_stat_sorted_vector,
                account_id,
                ProfileStatCriterionEnum::OnSaleTotalPriceAsArtist,
                stat.prices_as_artist.on_sale.total_price + price
            );
        }
    }

    ///отримати дані по статистиці профілю
    pub fn profile_stat(
        profiles_global_stat: &LookupMap<AccountId, ProfileStat>,
        user_id:&AccountId
        )->ProfileStatJson
    {
        let stat:ProfileStat;
            
        match profiles_global_stat.get(&user_id.clone()) {
            Some(mut _profile_stat) => {stat=_profile_stat}
            None => {
                stat = ProfileStatCriterion::profile_stat_get_default();
            }
        }

        return ProfileStatCriterion::profile_stat_to_json(stat);
    }

    ///отримати дані по статистиці профілю
    pub fn profile_stat_to_json(stat: ProfileStat) ->ProfileStatJson
    {
        return ProfileStatJson
        {
            likes_count: stat.likes_count,
            tokens_likes_count: stat.tokens_likes_count,
            views_count: stat.views_count,
            tokens_views_count: stat.tokens_views_count,
            tokens_count: stat.tokens_count,
            followers_count: stat.followers_count,
            tokens_count_as_artist: stat.tokens_count_as_artist,
            prices_as_creator: ProfilePriceStatMainJson
            {
                on_sale: ProfilePriceStatJson
                {
                    lowest_price: U128(stat.prices_as_creator.on_sale.lowest_price),
                    highest_price: U128(stat.prices_as_creator.on_sale.highest_price),
                    newest_price: U128(stat.prices_as_creator.on_sale.newest_price),
                    total_price: U128(stat.prices_as_creator.on_sale.total_price)
                },
                sold: ProfilePriceStatJson
                {
                    lowest_price: U128(stat.prices_as_creator.sold.lowest_price),
                    highest_price: U128(stat.prices_as_creator.sold.highest_price),
                    newest_price: U128(stat.prices_as_creator.sold.newest_price),
                    total_price: U128(stat.prices_as_creator.sold.total_price)
                }
            },
            prices_as_artist: ProfilePriceStatMainJson
            {
                on_sale: ProfilePriceStatJson
                {
                    lowest_price: U128(stat.prices_as_artist.on_sale.lowest_price),
                    highest_price: U128(stat.prices_as_artist.on_sale.highest_price),
                    newest_price: U128(stat.prices_as_artist.on_sale.newest_price),
                    total_price: U128(stat.prices_as_artist.on_sale.total_price)
                },
                sold: ProfilePriceStatJson
                {
                    lowest_price: U128(stat.prices_as_artist.sold.lowest_price),
                    highest_price: U128(stat.prices_as_artist.sold.highest_price),
                    newest_price: U128(stat.prices_as_artist.sold.newest_price),
                    total_price: U128(stat.prices_as_artist.sold.total_price)
                }
            }
        }
    }

    ///перевірити чи встановленні дефолтні значення статистистики для юзера
    pub fn profile_stat_check_for_default_stat(
        profiles_global_stat: &mut LookupMap<AccountId, ProfileStat>, 
        profiles_global_stat_sorted_vector:  &mut LookupMap<ProfileStatCriterionEnum, Vec<ProfileStatCriterion>>,
        user_id: &AccountId)
        {
    
            //якшо по юзеру немає фільтрів
            if profiles_global_stat.get(&user_id.clone()).is_none() 
            {
                let stat = ProfileStatCriterion::profile_stat_get_default();
                profiles_global_stat.insert(&user_id, &stat);
            }

            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::LikesCount, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::TokenLikesCount, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::ViewsCount, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::TokenViewsCount, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::TokensCount, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::FollowersCount, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::TokensCountAsArtist, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::OnSaleLowestPriceAsCreator, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::OnSaleHighestPriceAsCreator, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::OnSaleNewestPriceAsCreator, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::OnSaleTotalPriceAsCreator, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::SoldLowestPriceAsCreator, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::SoldHighestPriceAsCreator, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::SoldNewestPriceAsCreator, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::SoldTotalPriceAsCreator, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::OnSaleLowestPriceAsArtist, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::OnSaleHighestPriceAsArtist, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::OnSaleNewestPriceAsArtist, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::OnSaleTotalPriceAsArtist, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::SoldLowestPriceAsArtist, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::SoldHighestPriceAsArtist, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::SoldNewestPriceAsArtist, user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(ProfileStatCriterionEnum::SoldTotalPriceAsArtist, user_id,profiles_global_stat_sorted_vector);
        }


        pub fn profile_stat_check_for_default_stat_one_parameter(
            parameter:ProfileStatCriterionEnum,
            user_id:&AccountId,
            profiles_global_stat_sorted_vector:  &mut  LookupMap<ProfileStatCriterionEnum, Vec<ProfileStatCriterion>>)
        {
            match profiles_global_stat_sorted_vector.get(&parameter)
            {
                Some(mut _new_vector) =>
                {
                    let _current_position 
                    = _new_vector.iter().position(|x|x.account_id  == user_id.to_string());

                    if _current_position.is_none()
                    {
                        _new_vector.push(ProfileStatCriterion{
                            account_id:user_id.to_string(),
                            criterion:Some(0)
                        });

                        profiles_global_stat_sorted_vector.insert(&parameter,&_new_vector);
                    }
                },
                None =>
                {
                    let mut _empty_vector:Vec<ProfileStatCriterion>=Vec::new();
                    _empty_vector.push(
                        ProfileStatCriterion{
                                            account_id:user_id.to_string(),
                                            criterion:Some(0)
                    });
                    profiles_global_stat_sorted_vector.insert(&parameter,&_empty_vector);
                }
            }
        }

        pub fn cmp(&self, obj: &ProfileStatCriterion) -> Ordering
        {
            if self.criterion.is_none() && !obj.criterion.is_none()
            {
                return Ordering::Less;
            }

            if self.criterion.is_none() && obj.criterion.is_none()
            {
                return Ordering::Equal;
            }

            if !self.criterion.is_none() && obj.criterion.is_none()
            {
                return Ordering::Greater;
            }

            return self.criterion.cmp(&obj.criterion);
        }
        
        pub fn binary_search(k: &ProfileStatCriterion, items: &Vec<ProfileStatCriterion>) -> Option<usize> {
            let mut low: usize = 0;
            let mut high: usize = items.len();
        
            while low < high {
                let middle = (high + low) / 2;
                match items[middle].cmp(&k) {
                    Ordering::Equal => return Some(middle),
                    Ordering::Greater => high = middle,
                    Ordering::Less => low = middle + 1
                }
            }
            None
        }

    }