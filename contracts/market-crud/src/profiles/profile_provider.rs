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
    pub email:String
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
///структура для статистики
pub struct ProfileStat{
///кількість лайків аккаунту
pub likes_count: u32,
///кількість лайків токенів аккаунту
pub tokens_likes_count: u32,
//загальна ксть переглядів аккаунту
pub views_count: u32,
//загальна ксть переглядів токенів аккаунту
pub tokens_views_count: u32,
///загальна ксть токенів
pub tokens_count: u32,
//к-сть підписників автора
pub followers_count: u32,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub struct ProfileStatCriterion{
    pub account_id:AccountId,
    pub criterion:Option<u32>
}

impl ProfileStatCriterion{
    pub  fn profile_stat_inc(
        profiles_global_stat: &mut LookupMap<AccountId, ProfileStat>, 
        profiles_global_stat_sorted_vector:  &mut  LookupMap<u8, Vec<ProfileStatCriterion>>,
        user_id:&AccountId, parameter:u8){

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
                    
                }else{

                    _vector.push(_sort_element);
                }
                //вставляємо
                profiles_global_stat_sorted_vector.insert(&parameter, &_vector);
            }
            //===========================




            profiles_global_stat.insert(&user_id, &stat);
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


