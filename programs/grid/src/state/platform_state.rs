use anchor_lang::prelude::*;

#[account]
pub struct PlatformState {
    pub admin: Pubkey,
    pub tournament_count: u64,
    pub platform_fee_bps: u16,
    pub treasury: Pubkey,
    pub paused: bool,
    pub bump: u8,
}

impl PlatformState {
    pub const LEN: usize = 32 + 8 + 2 + 32 + 1 + 1;
}