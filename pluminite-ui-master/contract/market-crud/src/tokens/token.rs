///токен
use crate::*;

pub type TokenId = String;
pub type Payout = HashMap<AccountId, U128>;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    pub owner_id: AccountId,
    pub approved_account_ids: HashMap<AccountId, U64>,
    pub next_approval_id: u64,
    
    // CUSTOM - fields
    pub royalty: HashMap<AccountId, u32>,
    pub token_type: Option<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonToken {
    pub token_id: TokenId,
    pub owner_id: AccountId,
    pub metadata: TokenMetadata,
    pub approved_account_ids: HashMap<AccountId, U64>,

    // CUSTOM - fields
    pub royalty: HashMap<AccountId, u32>,
    pub token_type: Option<String>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub struct SortedToken
{
    pub token_id: TokenId,
    pub criterion: Option<u128>
}

impl SortedToken
{
    pub fn cmp(&self, obj: &SortedToken) -> Ordering
    {
        if(self.criterion.is_none() && !obj.criterion.is_none())
        {
            return Ordering::Less;
        }

        if(self.criterion.is_none() && obj.criterion.is_none())
        {
            return Ordering::Equal;
        }

        if(!self.criterion.is_none() && obj.criterion.is_none())
        {
            return Ordering::Greater;
        }

        return self.criterion.cmp(&obj.criterion);
    }

    pub fn binary_search(k: &SortedToken, items: &Vec<SortedToken>) -> Option<usize> {
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
