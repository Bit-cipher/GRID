use anchor_lang::prelude::*;

#[account]
pub struct PlayerRegistration {
    pub tournament: Pubkey,
    pub player: Pubkey,
    pub paid_amount: u64,
    pub joined_at: i64,
    pub refunded: bool,
    pub bump: u8,
}

impl PlayerRegistration {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 1 + 1;
}