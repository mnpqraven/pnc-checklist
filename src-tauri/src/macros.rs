#[macro_export]
macro_rules! enum_list {
    ( $x: expr, $($y: ident),*) => {
        {
            let str_to_enum = All::from_str($x).unwrap();
            match str_to_enum {
                $(All::$y => gen_vec::<$y>(),)*
            }
        }
    };
}