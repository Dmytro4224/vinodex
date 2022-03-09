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
    ///чи поставив лайк той, хто переглядає
    pub is_like:bool,

    pub sale: Option<SaleJson>
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub struct SortedToken
{
    pub token_id: TokenId,
    pub criterion: Option<u128>
}

pub trait Resort
{
    fn tokens_resort(&mut self, token_id: TokenId, sort: u8, criterion: Option<u128>);
}

impl Resort for Contract
{
    fn tokens_resort(&mut self, token_id: TokenId, sort: u8, criterion: Option<u128>)
    {
        let key = SortedToken{token_id: token_id, criterion: criterion};

        match self.tokens_sorted.get(&sort) {
            Some(mut tokens) => {

                if criterion.is_none()
                {
                    tokens.push(key);
                    self.tokens_sorted.insert(&sort, &tokens);

                    return;
                }

                let index = SortedToken::binary_search(&key, &tokens);
                if index.is_none()
                {
                    tokens.push(key);
                    self.tokens_sorted.insert(&sort, &tokens);

                    return;
                }

                tokens.insert(index.unwrap(), key);
                self.tokens_sorted.insert(&sort, &tokens);
            }
            None => {
                let mut vector :Vec<SortedToken> = Vec::new();
                vector.push(key);

                self.tokens_sorted.insert(&sort, &vector);
            }
        }
    }
}

impl SortedToken
{
    pub fn cmp(&self, obj: &SortedToken) -> Ordering
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
