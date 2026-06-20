use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error::GridError,
    events::TournamentCreated,
    state::{PaymentType, PlatformState, Tournament, TournamentStatus},
};

#[derive(Accounts)]
pub struct CreateTournament<'info> {
    #[account(
        mut,
        seeds = [PLATFORM_SEED],
        bump = platform.bump,
        constraint = !platform.paused @ GridError::PlatformPaused
    )]
    pub platform: Account<'info, PlatformState>,

    #[account(
        init,
        payer = organizer,
        space = 8 + Tournament::LEN,
        seeds = [
            TOURNAMENT_SEED,
            organizer.key().as_ref(),
            platform.tournament_count.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub tournament: Account<'info, Tournament>,

    #[account(mut)]
    pub organizer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateTournament>,
    title: String,
    game: String,
    entry_fee: u64,
    max_players: u16,
    payout_bps: Vec<u16>,
    payment_type: PaymentType,
    payment_mint: Pubkey,
) -> Result<()> {
    require!(title.len() <= MAX_TITLE_LEN, GridError::TitleTooLong);
    require!(game.len() <= MAX_GAME_LEN, GridError::GameNameTooLong);
    require!(entry_fee > 0, GridError::InvalidEntryFee);
    require!(max_players > 1, GridError::InvalidMaxPlayers);
    require!((max_players as usize) <= MAX_PLAYERS, GridError::TooManyPlayers);
    require!(payout_bps.len() > 0, GridError::InvalidPayoutSplit);
    require!(payout_bps.len() <= MAX_WINNERS, GridError::TooManyWinners);

    let total_bps: u32 = payout_bps
        .iter()
        .try_fold(0u32, |acc, bps| {
            acc.checked_add(*bps as u32).ok_or(GridError::MathOverflow)
        })?;

    require!(
        total_bps == BPS_DENOMINATOR as u32,
        GridError::InvalidPayoutSplit
    );

    if payment_type == PaymentType::Sol {
        require!(payment_mint == Pubkey::default(), GridError::InvalidPaymentType);
    }

    if payment_type == PaymentType::Spl {
        require!(payment_mint != Pubkey::default(), GridError::InvalidPaymentType);
    }

    let platform = &mut ctx.accounts.platform;
    let tournament = &mut ctx.accounts.tournament;
    let clock = Clock::get()?;

    let tournament_id = platform.tournament_count;

    tournament.organizer = ctx.accounts.organizer.key();
    tournament.tournament_id = tournament_id;
    tournament.title = title.clone();
    tournament.game = game;
    tournament.entry_fee = entry_fee;
    tournament.max_players = max_players;
    tournament.current_players = 0;
    tournament.payment_mint = payment_mint;
    tournament.payment_type = payment_type;
    tournament.status = TournamentStatus::Open;
    tournament.prize_pool = 0;
    tournament.players = Vec::new();
    tournament.winners = Vec::new();
    tournament.payout_bps = payout_bps;
    tournament.created_at = clock.unix_timestamp;
    tournament.bump = ctx.bumps.tournament;

    platform.tournament_count = platform
        .tournament_count
        .checked_add(1)
        .ok_or(GridError::MathOverflow)?;

    emit!(TournamentCreated {
        tournament: tournament.key(),
        organizer: tournament.organizer,
        tournament_id,
        title,
    });

    Ok(())
}