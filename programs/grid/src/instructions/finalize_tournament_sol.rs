use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error::GridError,
    events::TournamentFinalized,
    state::{PaymentType, PlayerProfile, Tournament, TournamentStatus},
};

#[derive(Accounts)]
#[instruction(winners: Vec<Pubkey>)]
pub struct FinalizeTournamentSol<'info> {
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

    /// CHECK: Program-owned SOL vault PDA.
    #[account(
    mut,
    seeds = [SOL_VAULT_SEED, tournament.key().as_ref()],
    bump
)]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub organizer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<FinalizeTournamentSol>, winners: Vec<Pubkey>) -> Result<()> {
    let tournament = &mut ctx.accounts.tournament;

    require!(
        tournament.payment_type == PaymentType::Sol,
        GridError::InvalidPaymentType
    );

    require!(
        tournament.status != TournamentStatus::Completed,
        GridError::TournamentAlreadyCompleted
    );

    require!(
        tournament.status == TournamentStatus::Open
            || tournament.status == TournamentStatus::Active,
        GridError::TournamentNotOpen
    );

    require!(
        ctx.accounts.organizer.key() == tournament.organizer,
        GridError::UnauthorizedOrganizer
    );

    require!(
        winners.len() == tournament.payout_bps.len(),
        GridError::WinnerPayoutMismatch
    );

    require!(winners.len() <= MAX_WINNERS, GridError::TooManyWinners);

    for winner in winners.iter() {
        require!(
            tournament.players.contains(winner),
            GridError::WinnerNotRegistered
        );
    }

    let vault_info = ctx.accounts.sol_vault.to_account_info();
    let prize_pool = tournament.prize_pool;

    for (index, winner_key) in winners.iter().enumerate() {
        let payout_bps = tournament.payout_bps[index] as u64;

        let payout_amount = prize_pool
            .checked_mul(payout_bps)
            .ok_or(GridError::MathOverflow)?
            .checked_div(BPS_DENOMINATOR as u64)
            .ok_or(GridError::MathOverflow)?;

        let winner_account = ctx
            .remaining_accounts
            .get(index)
            .ok_or(GridError::InvalidWinnerAccount)?;

        require!(
            winner_account.key() == *winner_key,
            GridError::InvalidWinnerAccount
        );

        **ctx.accounts.sol_vault.try_borrow_mut_lamports()? = ctx
            .accounts
            .sol_vault
            .lamports()
            .checked_sub(payout_amount)
            .ok_or(GridError::MathOverflow)?;

        **winner_account.try_borrow_mut_lamports()? = winner_account
            .lamports()
            .checked_add(payout_amount)
            .ok_or(GridError::MathOverflow)?;

        if let Some(profile_account) = ctx.remaining_accounts.get(winners.len() + index) {
            if let Ok(mut profile) = Account::<PlayerProfile>::try_from(profile_account) {
                if profile.player == *winner_key {
                    profile.wins = profile.wins.checked_add(1).ok_or(GridError::MathOverflow)?;
                    profile.earnings = profile
                        .earnings
                        .checked_add(payout_amount)
                        .ok_or(GridError::MathOverflow)?;
                    profile.trophies = profile
                        .trophies
                        .checked_add(1)
                        .ok_or(GridError::MathOverflow)?;
                }
            }
        }
    }

    tournament.winners = winners.clone();
    tournament.status = TournamentStatus::Completed;

    emit!(TournamentFinalized {
        tournament: tournament.key(),
        winners,
        prize_pool,
    });

    Ok(())
}
