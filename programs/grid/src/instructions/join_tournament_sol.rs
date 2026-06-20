use anchor_lang::prelude::*;
use anchor_lang::system_program;

use crate::{
    constants::*,
    error::GridError,
    events::PlayerJoined,
    state::{PaymentType, PlayerRegistration, Tournament, TournamentStatus},
};

#[derive(Accounts)]
pub struct JoinTournamentSol<'info> {
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

    #[account(
        init,
        payer = player,
        space = 8 + PlayerRegistration::LEN,
        seeds = [
            REGISTRATION_SEED,
            tournament.key().as_ref(),
            player.key().as_ref()
        ],
        bump
    )]
    pub player_registration: Account<'info, PlayerRegistration>,

    /// CHECK: Program-owned SOL vault PDA.
    #[account(
    init_if_needed,
    payer = player,
    space = 8,
    seeds = [SOL_VAULT_SEED, tournament.key().as_ref()],
    bump
)]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub player: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<JoinTournamentSol>) -> Result<()> {
    let tournament = &mut ctx.accounts.tournament;
    let registration = &mut ctx.accounts.player_registration;
    let clock = Clock::get()?;

    require!(
        tournament.payment_type == PaymentType::Sol,
        GridError::InvalidPaymentType
    );

    require!(
        tournament.status == TournamentStatus::Open,
        GridError::TournamentNotOpen
    );

    require!(
        tournament.current_players < tournament.max_players,
        GridError::TournamentFull
    );

    let transfer_accounts = system_program::Transfer {
        from: ctx.accounts.player.to_account_info(),
        to: ctx.accounts.sol_vault.to_account_info(),
    };

    let transfer_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info().key(),
        transfer_accounts,
    );

    system_program::transfer(transfer_ctx, tournament.entry_fee)?;

    registration.tournament = tournament.key();
    registration.player = ctx.accounts.player.key();
    registration.paid_amount = tournament.entry_fee;
    registration.joined_at = clock.unix_timestamp;
    registration.refunded = false;
    registration.bump = ctx.bumps.player_registration;

    tournament.players.push(ctx.accounts.player.key());
    tournament.current_players = tournament
        .current_players
        .checked_add(1)
        .ok_or(GridError::MathOverflow)?;

    tournament.prize_pool = tournament
        .prize_pool
        .checked_add(tournament.entry_fee)
        .ok_or(GridError::MathOverflow)?;

    emit!(PlayerJoined {
        tournament: tournament.key(),
        player: ctx.accounts.player.key(),
        amount: tournament.entry_fee,
    });

    Ok(())
}
