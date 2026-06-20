use anchor_lang::prelude::*;
use crate::constants::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PaymentType {
    Sol,
    Spl,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TournamentStatus {
    Open,
    Active,
    Completed,
    Cancelled,
}

#[account]
pub struct Tournament {
    pub organizer: Pubkey,
    pub tournament_id: u64,
    pub title: String,
    pub game: String,
    pub entry_fee: u64,
    pub max_players: u16,
    pub current_players: u16,
    pub payment_mint: Pubkey,
    pub payment_type: PaymentType,
    pub status: TournamentStatus,
    pub prize_pool: u64,
    pub players: Vec<Pubkey>,
    pub winners: Vec<Pubkey>,
    pub payout_bps: Vec<u16>,
    pub created_at: i64,
    pub bump: u8,
}

impl Tournament {
    pub const LEN: usize =
        32 + // organizer
        8 + // tournament_id
        (4 + MAX_TITLE_LEN) + // title
        (4 + MAX_GAME_LEN) + // game
        8 + // entry_fee
        2 + // max_players
        2 + // current_players
        32 + // payment_mint
        1 + // payment_type
        1 + // status
        8 + // prize_pool
        (4 + (MAX_PLAYERS * 32)) + // players
        (4 + (MAX_WINNERS * 32)) + // winners
        (4 + (MAX_WINNERS * 2)) + // payout_bps
        8 + // created_at
        1; // bump
}