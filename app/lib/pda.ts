import { PublicKey } from "@solana/web3.js";
import {
  GRID_PROGRAM_ID,
  PLATFORM_SEED,
  TOURNAMENT_SEED,
  SOL_VAULT_SEED,
  PROFILE_SEED,
  REGISTRATION_SEED,
} from "./constants";

function u64ToBuffer(value: bigint | number) {
  let v = BigInt(value);
  const buffer = Buffer.alloc(8);

  for (let i = 0; i < 8; i++) {
    buffer[i] = Number(v & BigInt(0xff));
    v = v >> BigInt(8);
  }

  return buffer;
}

export function getPlatformPda() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PLATFORM_SEED)],
    GRID_PROGRAM_ID
  )[0];
}

export function getTournamentPda(
  organizer: PublicKey,
  tournamentId: bigint | number
) {
  const idBuffer = u64ToBuffer(tournamentId);

  return PublicKey.findProgramAddressSync(
    [Buffer.from(TOURNAMENT_SEED), organizer.toBuffer(), idBuffer],
    GRID_PROGRAM_ID
  )[0];
}

export function getSolVaultPda(tournament: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SOL_VAULT_SEED), tournament.toBuffer()],
    GRID_PROGRAM_ID
  )[0];
}

export function getPlayerProfilePda(player: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PROFILE_SEED), player.toBuffer()],
    GRID_PROGRAM_ID
  )[0];
}

export function getPlayerRegistrationPda(
  tournament: PublicKey,
  player: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(REGISTRATION_SEED), tournament.toBuffer(), player.toBuffer()],
    GRID_PROGRAM_ID
  )[0];
}