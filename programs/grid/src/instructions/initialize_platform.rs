use anchor_lang::prelude::*;

use crate::{
    constants::*,
    error::GridError,
    events::PlatformInitialized,
    state::PlatformState,
};

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + PlatformState::LEN,
        seeds = [PLATFORM_SEED],
        bump
    )]
    pub platform: Account<'info, PlatformState>,

    #[account(mut)]
    pub admin: Signer<'info>,

    /// CHECK: Treasury can be any wallet that receives future platform fees.
    pub treasury: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializePlatform>, platform_fee_bps: u16) -> Result<()> {
    require!(platform_fee_bps <= BPS_DENOMINATOR, GridError::InvalidPlatformFee);

    let platform = &mut ctx.accounts.platform;

    platform.admin = ctx.accounts.admin.key();
    platform.tournament_count = 0;
    platform.platform_fee_bps = platform_fee_bps;
    platform.treasury = ctx.accounts.treasury.key();
    platform.paused = false;
    platform.bump = ctx.bumps.platform;

    emit!(PlatformInitialized {
        admin: platform.admin,
        platform_fee_bps,
        treasury: platform.treasury,
    });

    Ok(())
}