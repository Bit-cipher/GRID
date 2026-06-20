pub mod constants;
pub mod error;
pub mod events;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use error::*;
pub use events::*;
pub use instructions::*;
pub use state::*;

declare_id!("5FfK29L2jUZGYqwE4sGsyKJdJ4tDE2wrbpzzYdR5EUH");

#[program]
pub mod grid {
    use super::*;

    pub fn initialize_platform(
        ctx: Context<InitializePlatform>,
        platform_fee_bps: u16,
    ) -> Result<()> {
        instructions::initialize_platform::handler(ctx, platform_fee_bps)
    }

    pub fn create_player_profile(ctx: Context<CreatePlayerProfile>) -> Result<()> {
        instructions::create_player_profile::handler(ctx)
    }

    pub fn create_tournament(
        ctx: Context<CreateTournament>,
        title: String,
        game: String,
        entry_fee: u64,
        max_players: u16,
        payout_bps: Vec<u16>,
        payment_type: PaymentType,
        payment_mint: Pubkey,
    ) -> Result<()> {
        instructions::create_tournament::handler(
            ctx,
            title,
            game,
            entry_fee,
            max_players,
            payout_bps,
            payment_type,
            payment_mint,
        )
    }

    pub fn join_tournament_sol(ctx: Context<JoinTournamentSol>) -> Result<()> {
        instructions::join_tournament_sol::handler(ctx)
    }

    pub fn finalize_tournament_sol(
        ctx: Context<FinalizeTournamentSol>,
        winners: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::finalize_tournament_sol::handler(ctx, winners)
    }
}
