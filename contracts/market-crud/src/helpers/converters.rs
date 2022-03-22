use std::collections::HashSet;
use std::iter::FromIterator;
use near_sdk::collections::{LookupMap, UnorderedSet};

pub type TokenId = String;

pub struct Converter {}

impl Converter {
    pub fn vec_string_to_hash_set(data: &Vec<String>) -> HashSet<String> {
        HashSet::from_iter(data.iter().cloned())
    }
}

pub struct Transliteration {}

impl Transliteration {
    // Ініціалізація та заповнення мапи букв для транслітерації
    fn transliterate_char<'life>(c: char) -> &'life str
    {
        return match c
        {
            'а' => "a",
            'б' => "b",
            'в' => "v",
            'г' => "g",
            'ґ' => "g",
            'д' => "d",
            'е' => "e",
            'є' => "e",
            'ё' => "e",
            'ж' => "zh",
            'з' => "z",
            'и' => "i",
            'і' => "i",
            'ї' => "ji",
            'й' => "j",
            'к' => "k",
            'л' => "l",
            'м' => "m",
            'н' => "n",
            'о' => "o",
            'п' => "p",
            'р' => "r",
            'с' => "s",
            'т' => "t",
            'у' => "u",
            'ф' => "f",
            'х' => "h",
            'ц' => "ct",
            'ч' => "ch",
            'ш' => "sh",
            'щ' => "sh`",
            'ъ' => "`",
            'ы' => "i",
            'ь' => "`",
            'э' => "e",
            'ю' => "ju",
            'я' => "ya",
            'А' => "A",
            'Б' => "B",
            'В' => "V",
            'Г' => "G",
            'Ґ' => "G",
            'Д' => "D",
            'Е' => "E",
            'Є' => "E",
            'Ё' => "E",
            'Ж' => "ZH",
            'З' => "Z",
            'И' => "I",
            'І' => "I",
            'Ї' => "JI",
            'Й' => "J",
            'К' => "K",
            'Л' => "L",
            'М' => "M",
            'Н' => "N",
            'О' => "O",
            'П' => "P",
            'Р' => "R",
            'С' => "S",
            'Т' => "T",
            'У' => "U",
            'Ф' => "F",
            'Х' => "H",
            'Ц' => "CT",
            'Ч' => "CH",
            'Ш' => "SH",
            'Щ' => "SH",
            'Ъ' => "`",
            'Ы' => "I",
            'Ь' => "`",
            'Э' => "E",
            'Ю' => "JU",
            'Я' => "YA",
            _ => "_"
        }
    }

    // Транслітерація рядка
    fn transliterate_string(
        input: &String
    ) -> String {
        let mut result: String = "".to_string();

        for c in input.chars() {
            result.push_str(Transliteration::transliterate_char(c));
        }

        return result;
    }

    fn collection_id_generate(name: &String, collections: &LookupMap<String, UnorderedSet<TokenId>>) -> String
    {
        let mut collection_id = Transliteration::transliterate_string(name);

        if !collections.contains_key(&collection_id)
        {
            return collection_id;
        }

        collection_id.push_str("-");

        for i in 1..101 as u8
        {
            let mut collection_id_new = collection_id.clone();
            collection_id_new.push_str(&(i.to_string()));

            if !collections.contains_key(&collection_id_new)
            {
                return collection_id_new;
            }
        }

        panic!("collection_id depth error");
    }
}
