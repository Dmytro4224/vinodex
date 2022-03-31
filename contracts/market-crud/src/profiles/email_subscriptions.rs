use crate::*;

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EmailSubscription {
    pub email: String,
    pub page: String,
    pub time: u128
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EmailSubscriptionJson {
    pub email: String,
    pub account: JsonProfile,
    pub page: String,
    pub time: u128
}

#[near_bindgen]
impl Contract 
{

    //Додати емейл підписку
    #[payable]
    pub fn email_subscirptions_add(
        &mut self,
        email: String, 
        page: String,
        time: u128
        ) 
    {
        if email.len() < 1 || email.len() > 320
        {
            panic!("email must have length between 1 and 320 characters");
        }

        if page.len() < 1 || page.len() > 256
        {
            panic!("page name must have length between 1 and 256 characters");
        }

        let account_id = env::predecessor_account_id();

        match self.email_subscriptions.get(&account_id)
        {
            Some(mut list) =>
            {
                if list.iter().position(|x| x.email.eq(&email)).is_none()
                {
                    list.push(EmailSubscription
                    {
                        email: email,
                        page: page,
                        time: time
                    });

                    self.email_subscriptions.insert(&account_id, &list);
                }
            },
            None =>
            {
                let mut list = Vec::new();

                list.push(EmailSubscription
                {
                    email: email,
                    page: page,
                    time: time
                });

                self.email_subscriptions.insert(&account_id, &list);
            }
        }
    }

    //Відмовитись від емейл підписки
    #[payable]
    pub fn email_subscirptions_remove(
        &mut self,
        email: String
        ) 
    {
        let account_id = env::predecessor_account_id();

        match self.email_subscriptions.get(&account_id)
        {
            Some(mut list) =>
            {
                if let Some(index) = list.iter().position(|x| x.email.eq(&email))
                {
                    list.remove(index);
                    self.email_subscriptions.insert(&account_id, &list);
                }
            },
            None => {}
        }
    }

    //Список підписаних
    pub fn email_subscruptions_load(
        &self,
        //пагінація
        page_index: u64,
        //ксть елементів на сторінкі
        page_size: u64,
        //Хто викликає метод
        account_id: Option<AccountId>
        ) -> Vec<EmailSubscriptionJson> 
    {
        // let start_index = (page_index - 1) * page_size;
        // let end_index = page_index * page_size;

        let skip;

        if page_index == 1
        {
            skip = 0;
        }
        else
        {
            skip = (page_index - 1) * page_size;
        }

        let mut result :Vec<EmailSubscriptionJson> = Vec::new();

        let mut skiped_count = 0;
        let keys : Vec<String> = self.email_subscriptions.keys().collect();

        for i in 0..keys.len()
        {
            let current_account_id = keys.get(i).unwrap();

            match self.email_subscriptions.get(&keys[i])
            {
                Some(list) =>
                {
                    for j in 0..list.len()
                    {
                        if skiped_count < skip
                        {
                            skiped_count = skiped_count + 1;
                            continue;
                        }

                        let item = list.get(j).unwrap();

                        result.push(EmailSubscriptionJson
                        {
                            email: item.email.clone(),
                            page: item.page.clone(),
                            time: item.time,
                            account: Profile::get_full_profile(
                                &self.profiles,
                                &current_account_id,
                                &account_id,
                                &self.autors_likes,
                                &self.autors_followers,
                                &self.autors_views,
                                &self.tokens_per_owner,
                                true
                            ).unwrap()
                        });

                        if result.len() == page_size as usize
                        {
                            break;
                        }
                    }
                },
                None =>
                {
                    continue;
                }
            }

            if result.len() == page_size as usize
            {
                break;
            }
        }

        return result;
    }

    //Список підписаних поштових адресів обраного користувача
    pub fn email_subscruptions_load_mine(
        &self,
        //Хто викликає метод
        account_id: AccountId
        ) -> Vec<EmailSubscription> 
    {
        match self.email_subscriptions.get(&account_id)
        {
            Some(list) =>
            {
                return list;
            },
            None =>
            {
                return Vec::new();
            }
        }
    }
}