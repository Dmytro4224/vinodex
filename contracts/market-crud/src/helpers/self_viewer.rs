use crate::*;

use near_sdk::ext_contract;

pub const VIEW_DEPOSIT: Balance = 1_000_000;
pub const VIEW_GAS: Gas = 5_000_000_000_000;

#[ext_contract(ext_viewer)]
trait Viewer 
{
    fn collection_set_view(&self, collection_id : String);
    fn token_set_view(&self, token_id : TokenId);
    fn view_artist_account(&self, account_id : AccountId);
}

// #[near_bindgen]
// impl Contract
// {
//     pub fn test(&self)
//     {
//         ext_viewer::collection_set_view(&collection_id, self.owner_id.clone(), )
//     }
// }