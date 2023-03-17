use std::{
    fmt::{Debug, Display},
    fs::{self, File},
    io::Write,
    path::Path,
};
use strum::{Display, EnumIter, EnumString, IntoEnumIterator};
use ts_rs::TS;

#[derive(Debug, EnumIter, EnumString, Display, TS)]
#[ts(export, export_to = "bindings/enums/")]
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
    SlotPlacement,
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
    Slot,
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
pub(super) fn gen_vec_pretty<T>() -> Vec<String>
where
    T: IntoEnumIterator + Debug + Display,
{
    let mut list: Vec<String> = Vec::new();
    for item in T::iter() {
        list.push(item.to_string())
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
/// creates a binding file containing invoke keys to be used in the frontend
/// invoke key should be written as Camel_Snake_Case
pub fn write_index_keys(invoke_key: &str, path: &str) -> Result<(), Box<dyn std::error::Error>> {
    let mut buffer = File::create(path).unwrap();
    let mut export_payload: Vec<String> = Vec::new();

    let fmt_export_const = |a: &str| format!("export const {} = {{", a);
    let fmt_args = |a: &str| format!("  {}: \"{}\",", a.to_uppercase(), a);
    let fmt_export_type =
        |a: &str, b: &str| format!("}} as const;\nexport type {} = keyof typeof {};", a, b);

    let (key_type, key_enum) = (invoke_key.replace('_', ""), invoke_key.to_uppercase());

    // occupy payload
    export_payload.push(fmt_export_const(&key_enum));
    get_invoke_fns()
        .iter()
        .for_each(|item| export_payload.push(fmt_args(item)));
    export_payload.push(fmt_export_type(&key_type, &key_enum));

    write!(buffer, "{}", export_payload.join("\n"))?;
    Ok(())
}

#[allow(dead_code)]
/// write a ts binding of an enum table with the following format;
/// ```typescript
/// export const ENUM_NAME = {
/// Key: "Key"
/// } as const;
/// export type EnumName = keyof typeof ENUM_NAME;
/// ```
///
/// * `enum_name`: name of the enum in Camel_Snake case
pub fn write_enum_table<T>(enum_name: &str)  -> Result<(), &'static str> where T: IntoEnumIterator + Display{
        let mut buffer = String::new();
        let path = format!("bindings/{}.ts", enum_name.to_uppercase());
        let fmt_first = format!("export const {} = {{\n", enum_name.to_uppercase());
        let fmt_last = format!("}} as const;\n export type {} = keyof typeof {};", enum_name.replace('_',""), enum_name.to_uppercase());

        buffer.push_str(&fmt_first);
        for name in T::iter() {
            buffer.push_str(&format!("  {}: \"{}\",\n", name, name))
        }
        buffer.push_str(&fmt_last);
        fs::write(path, buffer).unwrap();
    Ok(())
}

/// get the tauri commands in `main.rs` as a vector
fn get_invoke_fns() -> Vec<String> {
    let main_path: &Path = Path::new(&"src/main.rs");
    let main_payload = fs::read_to_string(main_path).expect("main.rs should be accessible");
    let mut res: Vec<String> = Vec::new();
    let patternmatch = "tauri::generate_handler!";

    let left_ind = main_payload
        .find(patternmatch)
        .expect("\"tauri::generate_handler!\" not found")
        + patternmatch.len();

    let block: String = main_payload.chars().skip(left_ind).collect();

    let right_ind = main_payload
        .chars()
        .skip(left_ind)
        .enumerate()
        .find(|(index, ch)| *ch == ']' && brackets_are_balanced(&block[0..=*index]))
        .map(|(index, _)| index);
    let b: String = block.chars().take(right_ind.unwrap()).collect();

    for line in b.lines() {
        if line.trim().starts_with(|ch: char| ch.is_ascii_lowercase()) {
            res.push(line.trim().trim_matches(',').to_string());
        }
    }
    res
}
