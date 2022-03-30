use std::cmp::{Ordering};
use near_sdk::{AccountId};
use near_sdk::collections::{LookupMap};
use validator::Validate;
use std::collections::HashSet;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::collections::{UnorderedSet};

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

    pub is_like:bool,
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
               is_following:false,
               is_like:false,
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
                result.is_following=Profile::is_profile_followind(
                    &autors_followers,
                    &account_id,
                    &_asked_account_id
                );

                result.is_like=Profile::is_profile_liked(
                    &autors_likes,
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
                    is_like:false,
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
        return Profile{
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

    pub fn is_profile_liked(
        autors_likes: &LookupMap<AccountId, HashSet<AccountId>>, 
        sourse_account_id: &AccountId,
        asked_account_id: &AccountId)->bool
    {
        match autors_likes.get(&sourse_account_id)
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

    pub fn is_profile_followind(
        autors_followers: &LookupMap<AccountId, HashSet<AccountId>>, 
        sourse_account_id: &AccountId,
        asked_account_id: &AccountId)->bool
    {
        match autors_followers.get(&sourse_account_id)
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
        match dictionary.get(&sourse_account_id)
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

                    dictionary.insert(&sourse_account_id, &value);
                }
            },
            None =>
            {
                let mut _fitst_record:HashSet<AccountId>=HashSet::new();
                _fitst_record.insert(target_account_id.to_string());
                dictionary.insert(&sourse_account_id, &_fitst_record);
            }
        }
    }
} 

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
///структура для статистики
pub struct ProfileStat{
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
pub struct ProfilePriceStatMain
{
    pub on_sale: ProfilePriceStat,
    pub sold: ProfilePriceStat
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
pub struct ProfileStatCriterion{
    pub account_id:AccountId,
    pub criterion:Option<u32>
}


impl ProfileStatCriterion{

    pub fn __increment(sourse :u32,increment:u32,is_add:bool)->u32
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
        profiles_global_stat_sorted_vector:  &mut  LookupMap<u8, Vec<ProfileStatCriterion>>,
        user_id:&AccountId, 
        parameter:u8,
        value:u32
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
            //0 - кількість лайків аккаунту
            0=>{
                
                stat.likes_count=value;
            },
            //1 -кількість лайків токенів аккаунту
            1=>{
                stat.tokens_likes_count = value;
            },
            //2 - загальна ксть переглядів аккаунту
            2=>{
                stat.views_count=value;
            },
            //3 - загальна ксть переглядів токенів аккаунту
            3=>{
                stat.tokens_views_count=value;
            },
            //4 - загальна ксть токенів
            4=>{
                stat.tokens_count=value;
            },
            // 5 - к-сть підписників автора
            5=>{
                stat.followers_count=value;
            },
            // 6 -  к-сть токенів, де користувач - artist
            6=>{
                stat.tokens_count_as_artist=value;
            },
            _=>{}
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
        profiles_global_stat_sorted_vector:  &mut  LookupMap<u8, Vec<ProfileStatCriterion>>,
        user_id:&AccountId, 
        parameter:u8,
        increment:u32,
        need_add:bool
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
            
            let mut _value:u32=0;

            match parameter
            {
                //0 - кількість лайків аккаунту
                0=>{
                    
                    _value= ProfileStatCriterion::__increment(stat.likes_count,increment,need_add);
                },
                //1 -кількість лайків токенів аккаунту
                1=>{
                    _value=ProfileStatCriterion::__increment(stat.tokens_likes_count,increment,need_add);
                },
                //2 - загальна ксть переглядів аккаунту
                2=>{
                    _value=ProfileStatCriterion::__increment(stat.views_count,increment,need_add);
                },
                //3 - загальна ксть переглядів токенів аккаунту
                3=>{
                    _value=
                    ProfileStatCriterion::__increment(stat.tokens_views_count,increment,need_add);
                },
                //4 - загальна ксть токенів
                4=>{
                    _value=
                    ProfileStatCriterion::__increment(stat.tokens_count,increment,need_add);
                },
                // 5 - к-сть підписників автора
                5=>{
                    _value=ProfileStatCriterion::__increment(stat.followers_count,increment,need_add);
                },
                // 6 - к-сть токенів, де користувач - artist
                6=>{
                    _value=ProfileStatCriterion::__increment(stat.tokens_count_as_artist,increment,need_add);
                },
                _=>{}
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

        ///отримати дані по статистиці профілю
    pub fn profile_stat(
        profiles_global_stat: &LookupMap<AccountId, ProfileStat>,
        user_id:&AccountId
        )->ProfileStat
    {
        let stat:ProfileStat;
            
        match profiles_global_stat.get(&user_id.clone()) {
            Some(mut _profile_stat) => {stat=_profile_stat}
            None => {
                stat = ProfileStatCriterion::profile_stat_get_default();
            }
        }

        return  stat;
    }

    ///перевірити чи встановленні дефолтні значення статистистики для юзера
    pub fn profile_stat_check_for_default_stat(
        profiles_global_stat: &mut LookupMap<AccountId, ProfileStat>, 
        profiles_global_stat_sorted_vector:  &mut LookupMap<u8, Vec<ProfileStatCriterion>>,
        user_id: &AccountId)
        {
    
            //якшо по юзеру немає фільтрів
            if profiles_global_stat.get(&user_id.clone()).is_none() 
            {
                let stat = ProfileStatCriterion::profile_stat_get_default();
                profiles_global_stat.insert(&user_id, &stat);
            }

            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(0,user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(1,user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(2,user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(3,user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(4,user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(5,user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(6,user_id,profiles_global_stat_sorted_vector);
        }


        pub fn profile_stat_check_for_default_stat_one_parameter(
            parameter:u8,
            user_id:&AccountId,
            profiles_global_stat_sorted_vector:  &mut  LookupMap<u8, Vec<ProfileStatCriterion>>)
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


