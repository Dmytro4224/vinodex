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

impl ProfileStat{
    pub  fn profile_stat_inc(profiles_global_stat: &mut LookupMap<AccountId, ProfileStat>, userId:&AccountId, parameter:u8){

        let mut stat:ProfileStat;
    
        match profiles_global_stat.get(&userId.clone()) {
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
            
            match parameter
            {
                //0 - кількість лайків аккаунту
                0=>{
                    stat.likes_count=stat.likes_count+1;
                },
                //1 -кількість лайків токенів аккаунту
                1=>{
                    stat.tokens_likes_count=stat.tokens_likes_count+1;
                },
                //2 - загальна ксть переглядів аккаунту
                2=>{
                    stat.views_count=stat.views_count+1;
                },
                //3 - загальна ксть переглядів токенів аккаунту
                3=>{
                    stat.tokens_views_count=stat.tokens_views_count+1;
                },
                //4 - загальна ксть токенів
                4=>{
                    stat.tokens_count=stat.tokens_count+1;
                },
                // 5 - к-сть підписників автора
                5=>{
                    stat.followers_count=stat.followers_count+1;
                },
                _=>{}
            }
            
            profiles_global_stat.insert(&userId, &stat);
        }

}

