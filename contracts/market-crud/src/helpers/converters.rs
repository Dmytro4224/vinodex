use std::collections::HashMap;
use std::collections::HashSet;
use std::iter::FromIterator;

pub struct Converter {}

impl Converter {
    pub fn vec_string_to_hash_set(data: &Vec<String>) -> HashSet<String> {
        HashSet::from_iter(data.iter().cloned())
    }
}

pub struct TransliterationMap {
    pub map: HashMap<String, String>,
}

impl TransliterationMap {
    // Ініціалізація та заповнення мапи букв для транслітерації
    pub fn fill() -> TransliterationMap {
        let mut letters = HashMap::new();
        // insert lowercases
        letters.insert(String::from("а"), String::from("a"));
        letters.insert(String::from("б"), String::from("b"));
        letters.insert(String::from("в"), String::from("v"));
        letters.insert(String::from("г"), String::from("g"));
        letters.insert(String::from("ґ"), String::from("g"));
        letters.insert(String::from("д"), String::from("d"));
        letters.insert(String::from("е"), String::from("e"));
        letters.insert(String::from("є"), String::from("e"));
        letters.insert(String::from("ё"), String::from("e"));
        letters.insert(String::from("ж"), String::from("zh"));
        letters.insert(String::from("з"), String::from("z"));
        letters.insert(String::from("и"), String::from("i"));
        letters.insert(String::from("і"), String::from("i"));
        letters.insert(String::from("ї"), String::from("ji"));
        letters.insert(String::from("й"), String::from("j"));
        letters.insert(String::from("к"), String::from("k"));
        letters.insert(String::from("л"), String::from("l"));
        letters.insert(String::from("м"), String::from("m"));
        letters.insert(String::from("н"), String::from("n"));
        letters.insert(String::from("о"), String::from("o"));
        letters.insert(String::from("п"), String::from("p"));
        letters.insert(String::from("р"), String::from("r"));
        letters.insert(String::from("с"), String::from("s"));
        letters.insert(String::from("т"), String::from("t"));
        letters.insert(String::from("у"), String::from("u"));
        letters.insert(String::from("ф"), String::from("f"));
        letters.insert(String::from("х"), String::from("h"));
        letters.insert(String::from("ц"), String::from("ct"));
        letters.insert(String::from("ч"), String::from("ch"));
        letters.insert(String::from("ш"), String::from("sh"));
        letters.insert(String::from("щ"), String::from("sh`"));
        letters.insert(String::from("ъ"), String::from("`"));
        letters.insert(String::from("ы"), String::from("i"));
        letters.insert(String::from("ь"), String::from("`"));
        letters.insert(String::from("э"), String::from("e"));
        letters.insert(String::from("ю"), String::from("ju"));
        letters.insert(String::from("я"), String::from("ya"));
        // insert uppercases
        letters.insert(String::from("А"), String::from("A"));
        letters.insert(String::from("Б"), String::from("B"));
        letters.insert(String::from("В"), String::from("V"));
        letters.insert(String::from("Г"), String::from("G"));
        letters.insert(String::from("Ґ"), String::from("G"));
        letters.insert(String::from("Д"), String::from("D"));
        letters.insert(String::from("Е"), String::from("E"));
        letters.insert(String::from("Є"), String::from("E"));
        letters.insert(String::from("Ё"), String::from("E"));
        letters.insert(String::from("Ж"), String::from("Zh"));
        letters.insert(String::from("З"), String::from("Z"));
        letters.insert(String::from("И"), String::from("I"));
        letters.insert(String::from("І"), String::from("I"));
        letters.insert(String::from("Ї"), String::from("Ji"));
        letters.insert(String::from("Й"), String::from("J"));
        letters.insert(String::from("К"), String::from("K"));
        letters.insert(String::from("Л"), String::from("L"));
        letters.insert(String::from("М"), String::from("M"));
        letters.insert(String::from("Н"), String::from("N"));
        letters.insert(String::from("О"), String::from("O"));
        letters.insert(String::from("П"), String::from("P"));
        letters.insert(String::from("Р"), String::from("R"));
        letters.insert(String::from("С"), String::from("S"));
        letters.insert(String::from("Т"), String::from("T"));
        letters.insert(String::from("У"), String::from("U"));
        letters.insert(String::from("Ф"), String::from("F"));
        letters.insert(String::from("Х"), String::from("H"));
        letters.insert(String::from("Ц"), String::from("Ct"));
        letters.insert(String::from("Ч"), String::from("Ch"));
        letters.insert(String::from("Ш"), String::from("Sh"));
        letters.insert(String::from("Щ"), String::from("Sh`"));
        letters.insert(String::from("Ъ"), String::from("`"));
        letters.insert(String::from("Ы"), String::from("I"));
        letters.insert(String::from("Ь"), String::from("`"));
        letters.insert(String::from("Э"), String::from("E"));
        letters.insert(String::from("Ю"), String::from("Ju"));
        letters.insert(String::from("Я"), String::from("Ya"));

        let tm = TransliterationMap { map: letters };

        tm
    }

    // Транслітерація рядка
    pub fn transliterate_string(
        transliterationMap: TransliterationMap,
        mut input: &String,
    ) -> String {
        let mut result: String = "".to_string();

        for c in input.chars() {
            let inckeck = String::from(c);

            if transliterationMap.map.contains_key(&inckeck) {
                match transliterationMap.map.get(&inckeck) {
                    Some(val) => result.push_str(val),
                    None => result.push('_'),
                }
            } else {
                match &inckeck.parse::<f64>() {
                    Ok(val) => result.push_str(&val.to_string()),
                    Err(why) => result.push('_'),
                }
            }
        }
        result
    }
}
