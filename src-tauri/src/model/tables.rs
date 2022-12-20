/// cost of skill level token
/// follow user-displayed slv so the 1st index will be 0 (slv always starts at 1)
pub const SLV_TOKEN: [u32; 10] = [0, 100, 200, 360, 560, 880, 1320, 1920, 2680, 3600];
pub const SLV_PIVOT: [u32; 10] = [0, 0, 0, 0, 0, 0, 0, 4, 8, 12];
pub const SLV_COIN: [u32; 10] = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 10000];