use std::{
    fmt::{Debug, Display},
    fs::{self, File},
    io::Write,
    path::Path,
};
use strum::{Display, EnumIter, EnumString, IntoEnumIterator};

#[derive(Debug, EnumIter, EnumString, Display)]
pub enum AllEnums {
    Class,
    Algorithm,
    Day,
    Bonus,
    AlgoMainStat,
    AlgoSubStat,
    AlgoCategory,
    NeuralExpansion,
    LoadoutType,
}
#[derive(Debug, EnumIter, EnumString, Display)]
pub enum AllStructs {
    AlgoPiece,
    AlgoSet,
    AlgoSlot,
    AlgorithmRequirement,
    Coin,
    Database,
    Exp,
    GrandResource,
    Level,
    LevelRequirement,
    Loadout,
    NeuralFragment,
    NeuralResourceRequirement,
    ResourceByDay,
    SkillCurrency,
    SkillResourceRequirement,
    Unit,
    UnitSkill,
    UserStore,
    WidgetResource,
    WidgetResourceRequirement,
    Keychain,
    KeychainTable,
    Locker,
}

/// Generate a string array containing field names in a rust enum
pub(super) fn gen_vec<T>() -> Vec<String>
where
    T: IntoEnumIterator + Debug,
{
    let mut list: Vec<String> = Vec::new();
    for item in T::iter() {
        list.push(format!("{:?}", item))
    }
    list
}

#[derive(EnumString, Display)]
pub enum Folder {
    #[strum(serialize = "enums")]
    Enums,
    #[strum(serialize = "structs")]
    Structs,
}
#[allow(dead_code)]
pub fn write_index_binding<T>(folder: Folder) -> std::io::Result<()>
where
    T: Display + IntoEnumIterator,
{
    let path = format!("bindings/{folder}/index.ts");
    let mut buffer = File::create(path).unwrap();
    for payload in T::iter() {
        let import_fmt = format!("import {{ {payload} }} from \"./{payload}\"\n");
        write!(buffer, "{}", import_fmt)?;
    }

    let payloads = T::iter()
        .map(|each| each.to_string())
        .collect::<Vec<String>>()
        .join(", ");
    let export_fmt = format!("export type {{ {payloads} }}");
    write!(buffer, "{}", export_fmt)?;
    Ok(())
}

enum Bracket {
    Open(char),
    Close(char),
}

impl Bracket {
    pub fn from_char(c: char) -> Option<Bracket> {
        match c {
            '{' | '[' | '(' => Some(Bracket::Open(c)),
            '}' => Some(Bracket::Close('{')),
            ']' => Some(Bracket::Close('[')),
            ')' => Some(Bracket::Close('(')),
            _ => None,
        }
    }
}
pub fn brackets_are_balanced(string: &str) -> bool {
    let mut brackets: Vec<char> = vec![];
    for c in string.chars() {
        match Bracket::from_char(c) {
            Some(Bracket::Open(char_bracket)) => {
                brackets.push(char_bracket);
            }
            Some(Bracket::Close(char_close_bracket)) => {
                if brackets.pop() != Some(char_close_bracket) {
                    return false;
                }
            }
            _ => {}
        }
    }
    brackets.is_empty()
}

#[allow(dead_code)]
pub fn write_index_keys() {
    let main_path: &Path = Path::new(&"src/main.rs");
    let t = fs::read_to_string(main_path).expect("main.rs should be accessible");
    // .invoke_handler to next closing square bracket
    let mut res: Vec<String> = Vec::new();

    let patternmatch = "tauri::generate_handler!";
    // WARN: unwrapping
    let left_ind = t
        .find(patternmatch)
        .expect("\"tauri::generate_handler!\" not found")
        + patternmatch.len();
    let block: String = t.chars().skip(left_ind).collect();
    let right_ind = t
        .chars()
        .skip(left_ind)
        .enumerate()
        .find(|(index, ch)| *ch == ']' && brackets_are_balanced(&block[0..=*index]));
    let b: String = block.chars().take(right_ind.unwrap().0).collect();

    for line in b.lines() {
        if line.trim().starts_with(|ch: char| ch.is_ascii_lowercase()) {
            res.push(line.trim().trim_matches(',').to_string());
        }
    }
    let fmt = |a: String| format!("{}: \"{}\",", a.to_uppercase(), a);
    let mut export_payload: Vec<String> = Vec::new();
    export_payload.push("export const INVOKE_KEYS = {".to_string());
    for item in res {
        export_payload.push(fmt(item));
    }
    export_payload.push("} as const".to_string());
    let key = "InvokeKeys".to_string();
    export_payload.push("export type InvokeKeys = keyof typeof INVOKE_KEYS".to_string());

    let a = export_payload.join("\n");

    dbg!(&a);
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn mainindex() {
        write_index_keys()
    }
}
