use anchor_lang::prelude::*;

pub const PLATFORM_SEED: &[u8] = b"platform";
pub const TOURNAMENT_SEED: &[u8] = b"tournament";
pub const SOL_VAULT_SEED: &[u8] = b"sol_vault";
pub const PROFILE_SEED: &[u8] = b"profile";
pub const REGISTRATION_SEED: &[u8] = b"registration";

pub const MAX_TITLE_LEN: usize = 64;
pub const MAX_GAME_LEN: usize = 32;
pub const MAX_PLAYERS: usize = 32;
pub const MAX_WINNERS: usize = 4;

pub const BPS_DENOMINATOR: u16 = 10_000;