use crate::*;

#[near_bindgen]
impl Contract {
    ///Отримати дані профілю для юзера AccountId
    pub fn get_profile(&self, account_id: ValidAccountId) -> Option<Profile> {
        let account_id: AccountId = account_id.into();
        self.profiles.get(&account_id)
    }

    ///Встановити дані профілю
    pub fn set_profile(&mut self, profile: Profile) {
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
        Profile::set_profile(&mut self.profiles,account_id);
    }
}