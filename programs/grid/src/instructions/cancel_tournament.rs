use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error::GridError,
    state::{Tournament, TournamentStatus},
};

#[derive(Accounts)]
pub struct CancelTournament<'info> {
    #[account(
        mut,
        seeds = [
            TOURNAMENT_SEED,
            tournament.organizer.as_ref(),
            tournament.tournament_id.to_le_bytes().as_ref()
        ],
        bump = tournament.bump
    )]
    pub tournament: Account<'info, Tournament>,

    #[account(mut)]
    pub organizer: Signer<'info>,
}

pub fn handler(ctx: Context<CancelTournament>) -> Result<()> {
    let tournament = &mut ctx.accounts.tournament;

    require!(
        ctx.accounts.organizer.key() == tournament.organizer,
        GridError::UnauthorizedOrganizer
    );

    require!(
        tournament.status == TournamentStatus::Open
            || tournament.status == TournamentStatus::Active,
        GridError::TournamentNotOpen
    );

    tournament.status = TournamentStatus::Cancelled;

    Ok(())
}