use std::{
    fmt::{Debug, Display},
    fs::File,
    io::Write,
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
