use std::cmp::Ordering;
use near_sdk::{AccountId};
use near_sdk::collections::{LookupMap};
use validator::Validate;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

#[derive(Debug, Clone, BorshDeserialize, BorshSerialize, Serialize, Deserialize,Validate)]
#[serde(crate = "near_sdk::serde")]
pub struct Profile {
    ///коротка інфа
    pub bio: String,
    //ім'я юзера
    pub name:String,
    ///фотка
    pub image: String,
    ///електропошта
    #[validate(email)]
    pub email:String,
    pub account_id:AccountId
}
impl Profile {
    ///Отримати дані профілю для юзера AccountId
    pub fn get_profile(profiles: &mut LookupMap<AccountId, Profile>, account_id: AccountId) -> Option<Profile> {
        let account_id: AccountId = account_id.into();
        return profiles.get(&account_id);
    }

    pub fn get_default_data(account_id: AccountId) -> Profile{
        return Profile{
            account_id:account_id,
            bio:String::from(""),
            email:String::from(""),
            image:String::from("https://thumbs.dreamstime.com/b/default-avatar-thumb-6599242.jpg"),
            name:String::from("")
        }
    }

    ///перевірити чи є запис про профіль, якшо нема - додати дефолтний
    pub fn check_default(profiles: &mut LookupMap<AccountId, Profile>, account_id: &AccountId){
        let _profile=Profile::get_profile(profiles, account_id.clone());
        if _profile.is_none(){
            profiles.insert(
                &account_id, 
                &Profile::get_default_data(account_id.clone())
            );
        }
    }


    pub fn set_profile_bio(profiles: &mut LookupMap<AccountId, Profile>,value:String, account_id: &AccountId){
        Profile::check_default(profiles,account_id);

        let mut _profile=Profile::get_profile(profiles, account_id.clone()).unwrap();
        _profile.bio=value.clone();
        profiles.insert(&account_id, &_profile);
    }

    pub fn set_profile_image(profiles: &mut LookupMap<AccountId, Profile>,value:String, account_id: &AccountId){
        Profile::check_default(profiles,account_id);

        let mut _profile=Profile::get_profile(profiles, account_id.clone()).unwrap();
        _profile.image=value.clone();
        profiles.insert(&account_id, &_profile);
    }

    pub fn set_profile_name(profiles: &mut LookupMap<AccountId, Profile>,value:String, account_id: &AccountId){
        Profile::check_default(profiles,account_id);

        let mut _profile=Profile::get_profile(profiles, account_id.clone()).unwrap();
        _profile.name=value.clone();
        profiles.insert(&account_id, &_profile);
    }

    pub fn set_profile_email(profiles: &mut LookupMap<AccountId, Profile>,value:String, account_id: &AccountId){
        Profile::check_default(profiles,account_id);

        let mut _profile=Profile::get_profile(profiles, account_id.clone()).unwrap();
        _profile.email=value.clone();
        profiles.insert(&account_id, &_profile);
    }

    pub fn set_profile_account_id(profiles: &mut LookupMap<AccountId, Profile>,value:String, account_id: &AccountId){
        Profile::check_default(profiles,account_id);

        let mut _profile=Profile::get_profile(profiles, account_id.clone()).unwrap();
        _profile.account_id=value.clone();
        profiles.insert(&account_id, &_profile);
    }

    ///Встановити дані профілю
    pub fn set_profile(profiles: &mut LookupMap<AccountId, Profile>, profile: Profile, account_id: &AccountId) {
        let mut _profile=Profile::get_profile(profiles, account_id.clone());
        profiles.insert(&account_id, &profile);
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
///4 - загальна ксть токенів
pub tokens_count: u32,
//5 - к-сть підписників автора
pub followers_count: u32,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub struct ProfileStatCriterion{
    pub account_id:AccountId,
    pub criterion:Option<u32>
}

impl ProfileStatCriterion{
    ///збільшити значення статистики
    pub  fn profile_stat_inc(
        profiles_global_stat: &mut LookupMap<AccountId, ProfileStat>, 
        profiles_global_stat_sorted_vector:  &mut  LookupMap<u8, Vec<ProfileStatCriterion>>,
        user_id:&AccountId, 
        parameter:u8)
        {
        let mut stat:ProfileStat;
    
        match profiles_global_stat.get(&user_id.clone()) {
            Some(mut _profile_stat) => {stat=_profile_stat}
            None => {
                stat=ProfileStat{
                    likes_count:0,
                     tokens_likes_count: 0,
                     views_count: 0,
                     tokens_views_count: 0,
                     tokens_count: 0,
                     followers_count: 0
                };
            }
        }
            
        let mut _criterion:u32=0;

            match parameter
            {
                //0 - кількість лайків аккаунту
                0=>{
                    stat.likes_count=stat.likes_count+1;
                    _criterion=stat.likes_count;
                },
                //1 -кількість лайків токенів аккаунту
                1=>{
                    stat.tokens_likes_count=stat.tokens_likes_count+1;
                    _criterion=stat.tokens_likes_count;
                },
                //2 - загальна ксть переглядів аккаунту
                2=>{
                    stat.views_count=stat.views_count+1;
                    _criterion=stat.views_count;
                },
                //3 - загальна ксть переглядів токенів аккаунту
                3=>{
                    stat.tokens_views_count=stat.tokens_views_count+1;
                    _criterion=stat.tokens_views_count;
                },
                //4 - загальна ксть токенів
                4=>{
                    stat.tokens_count=stat.tokens_count+1;
                    _criterion=stat.tokens_count;
                },
                // 5 - к-сть підписників автора
                5=>{
                    stat.followers_count=stat.followers_count+1;
                    _criterion=stat.followers_count;
                },
                _=>{}
            }

            let _sorted_list_item = profiles_global_stat_sorted_vector.get(&parameter);

            let _sort_element=ProfileStatCriterion {
                account_id: user_id.to_string(),
                criterion:Some(_criterion)
            };

            //якшо ще немає сортування для цього параметру
            // створюємо запис
            if !_sorted_list_item.is_some() || _sorted_list_item.is_none(){
                let mut _insert_vec:Vec<ProfileStatCriterion>=Vec::new();
                _insert_vec.push(
                    _sort_element
                );

                profiles_global_stat_sorted_vector.insert(&parameter,&_insert_vec);
            }
            //якшо вже шось є, пробуємо відсортувати 
            else{
                let mut _vector=profiles_global_stat_sorted_vector.get(&parameter).unwrap();
                //видаляємо старий елемент
                let _current_position = _vector.iter().position(|x|x.account_id  == user_id.to_string());
                
                if !_current_position.is_none()
                {
                    _vector.remove(_current_position.unwrap());
    
                    //сортуємо і шукаємо нову позицію
                    let _new_position=ProfileStatCriterion::binary_search(&_sort_element,&_vector);
                    
                    match _new_position
                    {
                            Some(_new_position)=> _vector.insert(_new_position,_sort_element),
                            None=> _vector.push(_sort_element)
                    }
                    
                }else{

                    _vector.push(_sort_element);
                }
                //вставляємо
                profiles_global_stat_sorted_vector.insert(&parameter, &_vector);
            }
            //===========================

            profiles_global_stat.insert(&user_id, &stat);
        }

///перевірити чи встановленні дефолтні значення статистистики для юзера
pub fn profile_stat_check_for_default_stat(
    profiles_global_stat: &mut LookupMap<AccountId, ProfileStat>, 
    profiles_global_stat_sorted_vector:  &mut  LookupMap<u8, Vec<ProfileStatCriterion>>,
    user_id:&AccountId){
 
        //якшо по юзеру немає фільтрів
        if profiles_global_stat.get(&user_id.clone()).is_none() {
                let stat=ProfileStat{
                    likes_count:0,
                     tokens_likes_count: 0,
                     views_count: 0,
                     tokens_views_count: 0,
                     tokens_count: 0,
                     followers_count: 0
                };
                profiles_global_stat.insert(&user_id, &stat);
            }

            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(0,&user_id,profiles_global_stat_sorted_vector);
            
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(1,&user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(2,&user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(3,&user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(4,&user_id,profiles_global_stat_sorted_vector);
            ProfileStatCriterion::profile_stat_check_for_default_stat_one_parameter(5,&user_id,profiles_global_stat_sorted_vector);
    }


        pub fn profile_stat_check_for_default_stat_one_parameter(
    parameter:u8,
    user_id:&AccountId,
    profiles_global_stat_sorted_vector:  &mut  LookupMap<u8, Vec<ProfileStatCriterion>>)
    {
       
        let mut _vector
        = profiles_global_stat_sorted_vector.get(&parameter);

        if _vector.is_none()
        {
            let mut _empty_vector:Vec<ProfileStatCriterion>=Vec::new();
            _empty_vector.push(
                 ProfileStatCriterion{
                                     account_id:user_id.to_string(),
                                     criterion:Some(0)
             });
             profiles_global_stat_sorted_vector.insert(&parameter,&_empty_vector);
          

        }else{

            let mut _new_vector 
            = profiles_global_stat_sorted_vector.get(&parameter).unwrap();

            let _current_position 
            = _new_vector.iter().position(|x|x.account_id  == user_id.to_string());
            
            if _current_position.is_none()
            {
                _new_vector.push(
                    ProfileStatCriterion{
                    account_id:user_id.to_string(),
                    criterion:Some(0)
                });
                profiles_global_stat_sorted_vector.insert(&parameter,&_new_vector);
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