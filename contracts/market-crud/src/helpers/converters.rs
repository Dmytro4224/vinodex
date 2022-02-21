use std::collections::HashSet;
use std::iter::FromIterator;

pub struct Converter {}

impl Converter
{
    pub fn vec_string_to_hash_set(data: &Vec<String>) -> HashSet<String> {
        HashSet::from_iter(data.iter().cloned())
    }
}

