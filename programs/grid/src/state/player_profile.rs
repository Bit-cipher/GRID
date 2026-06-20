use anchor_lang::prelude::*;

#[account]
pub struct PlayerProfile {
    pub player: Pubkey,
    pub tournaments_played: u64,
    pub wins: u64,
    pub earnings: u64,
    pub trophies: u64,
    pub created_at: i64,
    pub bump: u8,
}

impl PlayerProfile {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 8 + 8 + 1;
}