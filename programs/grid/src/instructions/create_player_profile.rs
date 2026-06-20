use anchor_lang::prelude::*;

use crate::{
    constants::*,
    events::PlayerProfileCreated,
    state::PlayerProfile,
};

#[derive(Accounts)]
pub struct CreatePlayerProfile<'info> {
    #[account(
        init,
        payer = player,
        space = 8 + PlayerProfile::LEN,
        seeds = [PROFILE_SEED, player.key().as_ref()],
        bump
    )]
    pub player_profile: Account<'info, PlayerProfile>,

    #[account(mut)]
    pub player: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreatePlayerProfile>) -> Result<()> {
    let profile = &mut ctx.accounts.player_profile;
    let clock = Clock::get()?;

    profile.player = ctx.accounts.player.key();
    profile.tournaments_played = 0;
    profile.wins = 0;
    profile.earnings = 0;
    profile.trophies = 0;
    profile.created_at = clock.unix_timestamp;
    profile.bump = ctx.bumps.player_profile;

    emit!(PlayerProfileCreated {
        player: profile.player,
    });

    Ok(())
}