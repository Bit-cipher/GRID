import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Grid } from "../target/types/grid";
import { PublicKey, SystemProgram, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";

describe("grid", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Grid as Program<Grid>;

  const organizer = provider.wallet as anchor.Wallet;
  const playerOne = Keypair.generate();
  const playerTwo = Keypair.generate();

  const PLATFORM_SEED = "platform";
  const TOURNAMENT_SEED = "tournament";
  const SOL_VAULT_SEED = "sol_vault";
  const PROFILE_SEED = "profile";
  const REGISTRATION_SEED = "registration";

  const entryFee = new anchor.BN(0.1 * LAMPORTS_PER_SOL);

  let platformPda: PublicKey;
  let tournamentPda: PublicKey;
  let solVaultPda: PublicKey;
  let playerOneProfilePda: PublicKey;
  let playerTwoProfilePda: PublicKey;
  let playerOneRegistrationPda: PublicKey;
  let playerTwoRegistrationPda: PublicKey;

  it("Airdrops SOL to test players", async () => {
    for (const player of [playerOne, playerTwo]) {
      const sig = await provider.connection.requestAirdrop(
        player.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig, "confirmed");
    }

    const balance = await provider.connection.getBalance(playerOne.publicKey);
    assert(balance > 0);
  });

  it("Initializes platform", async () => {
    [platformPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(PLATFORM_SEED)],
      program.programId
    );

    await program.methods
      .initializePlatform(0)
      .accounts({
        platform: platformPda,
        admin: organizer.publicKey,
        treasury: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .rpc();

    const platform = await program.account.platformState.fetch(platformPda);

    assert.equal(platform.admin.toBase58(), organizer.publicKey.toBase58());
    assert.equal(platform.tournamentCount.toNumber(), 0);
    assert.equal(platform.platformFeeBps, 0);
    assert.equal(platform.paused, false);
  });

  it("Creates player profiles", async () => {
    [playerOneProfilePda] = PublicKey.findProgramAddressSync(
      [Buffer.from(PROFILE_SEED), playerOne.publicKey.toBuffer()],
      program.programId
    );

    [playerTwoProfilePda] = PublicKey.findProgramAddressSync(
      [Buffer.from(PROFILE_SEED), playerTwo.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .createPlayerProfile()
      .accounts({
        playerProfile: playerOneProfilePda,
        player: playerOne.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([playerOne])
      .rpc();

    await program.methods
      .createPlayerProfile()
      .accounts({
        playerProfile: playerTwoProfilePda,
        player: playerTwo.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([playerTwo])
      .rpc();

    const profile = await program.account.playerProfile.fetch(playerOneProfilePda);

    assert.equal(profile.player.toBase58(), playerOne.publicKey.toBase58());
    assert.equal(profile.wins.toNumber(), 0);
  });

  it("Creates a SOL tournament", async () => {
    const platformBefore = await program.account.platformState.fetch(platformPda);
    const tournamentId = platformBefore.tournamentCount;

    [tournamentPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(TOURNAMENT_SEED),
        organizer.publicKey.toBuffer(),
        tournamentId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    [solVaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(SOL_VAULT_SEED), tournamentPda.toBuffer()],
      program.programId
    );

    await program.methods
      .createTournament(
        "Campus FIFA Cup",
        "FIFA",
        entryFee,
        2,
        [10000],
        { sol: {} },
        PublicKey.default
      )
      .accounts({
        platform: platformPda,
        tournament: tournamentPda,
        organizer: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .rpc();

    const tournament = await program.account.tournament.fetch(tournamentPda);

    assert.equal(tournament.organizer.toBase58(), organizer.publicKey.toBase58());
    assert.equal(tournament.title, "Campus FIFA Cup");
    assert.equal(tournament.game, "FIFA");
    assert.equal(tournament.entryFee.toString(), entryFee.toString());
    assert.equal(tournament.maxPlayers, 2);
    assert.equal(tournament.currentPlayers, 0);
    assert.equal(tournament.prizePool.toNumber(), 0);
  });

  it("Allows players to join with SOL", async () => {
    [playerOneRegistrationPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(REGISTRATION_SEED),
        tournamentPda.toBuffer(),
        playerOne.publicKey.toBuffer(),
      ],
      program.programId
    );

    [playerTwoRegistrationPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(REGISTRATION_SEED),
        tournamentPda.toBuffer(),
        playerTwo.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .joinTournamentSol()
      .accounts({
        tournament: tournamentPda,
        playerRegistration: playerOneRegistrationPda,
        solVault: solVaultPda,
        player: playerOne.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([playerOne])
      .rpc();

    await program.methods
      .joinTournamentSol()
      .accounts({
        tournament: tournamentPda,
        playerRegistration: playerTwoRegistrationPda,
        solVault: solVaultPda,
        player: playerTwo.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([playerTwo])
      .rpc();

    const tournament = await program.account.tournament.fetch(tournamentPda);
    const vaultBalance = await provider.connection.getBalance(solVaultPda);

    assert.equal(tournament.currentPlayers, 2);
    assert.equal(tournament.prizePool.toString(), entryFee.mul(new anchor.BN(2)).toString());
assert(vaultBalance >= entryFee.mul(new anchor.BN(2)).toNumber());  });

  it("Finalizes tournament and pays winner", async () => {
    const winnerBalanceBefore = await provider.connection.getBalance(playerOne.publicKey);

    await program.methods
      .finalizeTournamentSol([playerOne.publicKey])
      .accounts({
        tournament: tournamentPda,
        solVault: solVaultPda,
        organizer: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .remainingAccounts([
        {
          pubkey: playerOne.publicKey,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: playerOneProfilePda,
          isWritable: true,
          isSigner: false,
        },
      ])
      .rpc();

    const tournament = await program.account.tournament.fetch(tournamentPda);
    const winnerBalanceAfter = await provider.connection.getBalance(playerOne.publicKey);
    const vaultBalance = await provider.connection.getBalance(solVaultPda);
    const profile = await program.account.playerProfile.fetch(playerOneProfilePda);

    assert.deepEqual(tournament.status, { completed: {} });
    assert.equal(tournament.winners[0].toBase58(), playerOne.publicKey.toBase58());
    assert(vaultBalance > 0);
    assert(vaultBalance < LAMPORTS_PER_SOL / 1000);
    assert(winnerBalanceAfter > winnerBalanceBefore);
    
  });
});