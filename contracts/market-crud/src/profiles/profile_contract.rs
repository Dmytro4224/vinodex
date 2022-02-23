use crate::*;

#[path = "profiles/profile_provider.rs"]
mod profile_provider;
pub use crate::profile_provider::*;

#[near_bindgen]
impl Contract {
    ///Отримати дані профілю для юзера AccountId
    pub fn get_profile(&self, account_id: ValidAccountId) -> Option<Profile> {
        let account_id: AccountId = account_id.into();
        self.profiles.get(&account_id)
    }

    ///Встановити дані профілю
    pub fn set_profile(&mut self, profile: Profile)-> Result<(), E> {
        assert!(
            profile.bio.len() < MAX_PROFILE_BIO_LENGTH,
            "Profile bio length is too long. Max length is {}",MAX_PROFILE_NAME_LENGTH
        );

        assert!(
            profile.image.len() < MAX_PROFILE_IMAGE_LENGTH,
            "Profile image length is too long. Max length is {}",MAX_PROFILE_NAME_LENGTH
        );

        assert!(
            profile.name.len() < MAX_PROFILE_NAME_LENGTH,
            "User name length is too long. Max length is {}",MAX_PROFILE_NAME_LENGTH
        );
        
        let predecessor_account_id = env::predecessor_account_id();

        profile.account_id=predecessor_account_id;

        Profile::set_profile(&mut self.profiles,
            profile,
            account_id);

        return  Ok(());
    }

    ///лайкнути карточку користувача
    /// працює дзеркально: лайк або ставиться/або знімається
    pub fn like_artist_account(accountId:AccountId)->Result<(), E>
    {
        let predecessor_account_id = env::predecessor_account_id();  

        //додаємо запис до списку лайків аккаунту, який лайкнули
        profile_provider::set_profile_like(
            &self.autors_likes,
            accountId,
            predecessor_account_id
        );

        //додаємо запис до списку мого списку лайків
        profile_provider::add_profile_to_my_like_list(
            &self.my_authors_likes,
            predecessor_account_id,
            accountId
        );

        ///збільнуємо статистику лайків
        ProfileStatCriterion::set_profile_stat_val(
            self.profiles_global_stat,
            self.profiles_global_stat_sorted_vector,
            accountId,
            0,
            profile_provider::get_profile_like_count(
                self.autors_likes,
                accountId
            )
        );

        return  Ok();
    }

    
    ///поставити помітку про відвідання карточки користувача
    pub fn view_artist_account(accountId:AccountId)->Result<(), E>{
        let predecessor_account_id = env::predecessor_account_id();  

        profile_provider::set_profile_view (
            &self.autors_views,
            accountId,
            predecessor_account_id
        );

        ///змінюємо статистику переглядів
        ProfileStatCriterion::set_profile_stat_val(
            self.profiles_global_stat,
            self.profiles_global_stat_sorted_vector,
            accountId,
            2,
            profile_provider::profile_stat(self.profiles_global_stat,accountId).views_count+1
        );

        return  Ok();
    }

      ///додати користувача до стписку відстеження
      /// працює дзеркально: ставить або знімає
    pub fn follow_artist_account(accountId:AccountId)->Result<(), E>{
        let predecessor_account_id = env::predecessor_account_id();  

        //додаємо запис до списку підписників аккаунту, на який підписалися
        profile_provider::set_profile_follow(
            &self.autors_followers,
            accountId,
            predecessor_account_id
        );

        //додаємо запис до списку мого списку лайків
        profile_provider::add_profile_to_my_followers_list_list(
            &self.my_autors_followers,
            predecessor_account_id,
            accountId
        );

        ///збільнуємо статистику лайків
        ProfileStatCriterion::set_profile_stat_val(
            self.profiles_global_stat,
            self.profiles_global_stat_sorted_vector,
            accountId,
            5,
            profile_provider::get_profile_followers_count_count(
                self.autors_followers,
                accountId
            )
        );

        return  Ok();
    }

}