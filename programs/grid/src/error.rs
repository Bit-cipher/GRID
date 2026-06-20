use anchor_lang::prelude::*;

#[error_code]
pub enum GridError {
    #[msg("Platform is currently paused.")]
    PlatformPaused,

    #[msg("Invalid platform fee.")]
    InvalidPlatformFee,

    #[msg("Title is too long.")]
    TitleTooLong,

    #[msg("Game name is too long.")]
    GameNameTooLong,

    #[msg("Entry fee must be greater than zero.")]
    InvalidEntryFee,

    #[msg("Max players must be greater than one.")]
    InvalidMaxPlayers,

    #[msg("Too many players.")]
    TooManyPlayers,

    #[msg("Too many winners.")]
    TooManyWinners,

    #[msg("Payout basis points must sum to 10000.")]
    InvalidPayoutSplit,

    #[msg("Tournament is not open.")]
    TournamentNotOpen,

    #[msg("Tournament is not completed.")]
    TournamentNotCompleted,

    #[msg("Tournament is already full.")]
    TournamentFull,

    #[msg("Player already joined this tournament.")]
    PlayerAlreadyJoined,

    #[msg("Invalid payment type for this instruction.")]
    InvalidPaymentType,

    #[msg("Only the organizer can perform this action.")]
    UnauthorizedOrganizer,

    #[msg("Winner count does not match payout split count.")]
    WinnerPayoutMismatch,

    #[msg("Winner account does not match submitted winner address.")]
    InvalidWinnerAccount,

    #[msg("Winner must be a registered player.")]
    WinnerNotRegistered,

    #[msg("Tournament has already been finalized.")]
    TournamentAlreadyCompleted,

    #[msg("Math overflow.")]
    MathOverflow,
}