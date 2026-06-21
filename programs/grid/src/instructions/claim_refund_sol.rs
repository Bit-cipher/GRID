use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error::GridError,
    state::{PaymentType, PlayerRegistration, Tournament, TournamentStatus},
};

#[derive(Accounts)]
pub struct ClaimRefundSol<'info> {
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
        mut,
        seeds = [
            REGISTRATION_SEED,
            tournament.key().as_ref(),
            player.key().as_ref()
        ],
        bump = player_registration.bump,
        constraint = player_registration.player == player.key(),
        constraint = player_registration.tournament == tournament.key()
    )]
    pub player_registration: Account<'info, PlayerRegistration>,

    /// CHECK: Program-owned SOL vault PDA.
    #[account(
        mut,
        seeds = [SOL_VAULT_SEED, tournament.key().as_ref()],
        bump
    )]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub player: Signer<'info>,
}

pub fn handler(ctx: Context<ClaimRefundSol>) -> Result<()> {
    let tournament = &mut ctx.accounts.tournament;
    let registration = &mut ctx.accounts.player_registration;

    require!(
        tournament.payment_type == PaymentType::Sol,
        GridError::InvalidPaymentType
    );

    require!(
        tournament.status == TournamentStatus::Cancelled,
        GridError::TournamentNotCompleted
    );

    require!(!registration.refunded, GridError::PlayerAlreadyJoined);

    let refund_amount = registration.paid_amount;

    **ctx.accounts.sol_vault.try_borrow_mut_lamports()? = ctx
        .accounts
        .sol_vault
        .lamports()
        .checked_sub(refund_amount)
        .ok_or(GridError::MathOverflow)?;

    **ctx.accounts.player.try_borrow_mut_lamports()? = ctx
        .accounts
        .player
        .lamports()
        .checked_add(refund_amount)
        .ok_or(GridError::MathOverflow)?;

    registration.refunded = true;

    tournament.prize_pool = tournament
        .prize_pool
        .checked_sub(refund_amount)
        .ok_or(GridError::MathOverflow)?;

    Ok(())
}