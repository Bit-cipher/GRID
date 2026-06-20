use anchor_lang::prelude::*;

#[event]
pub struct PlatformInitialized {
    pub admin: Pubkey,
    pub platform_fee_bps: u16,
    pub treasury: Pubkey,
}

#[event]
pub struct PlayerProfileCreated {
    pub player: Pubkey,
}

#[event]
pub struct TournamentCreated {
    pub tournament: Pubkey,
    pub organizer: Pubkey,
    pub tournament_id: u64,
    pub title: String,
}

#[event]
pub struct PlayerJoined {
    pub tournament: Pubkey,
    pub player: Pubkey,
    pub amount: u64,
}

#[event]
pub struct TournamentFinalized {
    pub tournament: Pubkey,
    pub winners: Vec<Pubkey>,
    pub prize_pool: u64,
}