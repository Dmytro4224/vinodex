use crate::*;

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Collection {
    pub name: String,
    pub description: String,
    pub profile_photo: String,
    pub cover_photo: String,
    pub is_active: bool
}

#[near_bindgen]
impl Contract 
{
    pub fn collection_add(
        &self,
        name: String, 
        description: String,
        profile_photo: String,
        cover_photo: String) 
    {
        if name.len() < 3 || name.len() > 100
        {
            panic!("name length must be between 3 and 100");
        }
    }
}