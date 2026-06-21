import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Grid } from "../target/types/grid";
import {
  PublicKey,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
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

  const entryFee = new anchor.BN(0.01 * LAMPORTS_PER_SOL);

  let platformPda: PublicKey;
  let tournamentPda: PublicKey;
  let solVaultPda: PublicKey;
  let playerOneProfilePda: PublicKey;
  let playerTwoProfilePda: PublicKey;
  let playerOneRegistrationPda: PublicKey;
  let playerTwoRegistrationPda: PublicKey;

  console.log("GRID Program ID:", program.programId.toBase58());
  console.log("Organizer:", organizer.publicKey.toBase58());

  it("Airdrops SOL to test players", async () => {
    for (const player of [playerOne, playerTwo]) {
      const sig = await provider.connection.requestAirdrop(
        player.publicKey,
        0.5 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig, "confirmed");
    }

    const balance = await provider.connection.getBalance(playerOne.publicKey);

    console.log("Player One:", playerOne.publicKey.toBase58());
    console.log("Player Two:", playerTwo.publicKey.toBase58());
    console.log("Player One Balance:", balance / LAMPORTS_PER_SOL, "SOL");

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

    console.log("Platform PDA:", platformPda.toBase58());
    console.log("Platform Admin:", platform.admin.toBase58());
    console.log("Platform initialized successfully");

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

    const profile = await program.account.playerProfile.fetch(
      playerOneProfilePda
    );

    console.log("Player One Profile PDA:", playerOneProfilePda.toBase58());
    console.log("Player Two Profile PDA:", playerTwoProfilePda.toBase58());
    console.log("Player profiles created successfully");

    assert.equal(profile.player.toBase58(), playerOne.publicKey.toBase58());
    assert.equal(profile.wins.toNumber(), 0);
  });

  it("Creates a SOL tournament", async () => {
    const platformBefore = await program.account.platformState.fetch(
      platformPda
    );
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

    console.log("Tournament PDA:", tournamentPda.toBase58());
    console.log("SOL Vault PDA:", solVaultPda.toBase58());
    console.log("Tournament Title:", tournament.title);
    console.log("Game:", tournament.game);
    console.log(
      "Entry Fee:",
      tournament.entryFee.toNumber() / LAMPORTS_PER_SOL,
      "SOL"
    );
    console.log("Max Players:", tournament.maxPlayers);
    console.log("Tournament created successfully");

    assert.equal(
      tournament.organizer.toBase58(),
      organizer.publicKey.toBase58()
    );
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

    console.log("Players Joined:", tournament.currentPlayers);
    console.log(
      "Prize Pool:",
      tournament.prizePool.toNumber() / LAMPORTS_PER_SOL,
      "SOL"
    );
    console.log("Vault Balance:", vaultBalance / LAMPORTS_PER_SOL, "SOL");
    console.log("Both players joined and entry fees were escrowed");

    assert.equal(tournament.currentPlayers, 2);
    assert.equal(
      tournament.prizePool.toString(),
      entryFee.mul(new anchor.BN(2)).toString()
    );
    assert(vaultBalance >= entryFee.mul(new anchor.BN(2)).toNumber());
  });

  it("Finalizes tournament and pays winner", async () => {
    const winnerBalanceBefore = await provider.connection.getBalance(
      playerOne.publicKey
    );

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
    const winnerBalanceAfter = await provider.connection.getBalance(
      playerOne.publicKey
    );
    const vaultBalance = await provider.connection.getBalance(solVaultPda);

    console.log("Winner:", playerOne.publicKey.toBase58());
    console.log(
      "Winner Balance Before:",
      winnerBalanceBefore / LAMPORTS_PER_SOL,
      "SOL"
    );
    console.log(
      "Winner Balance After:",
      winnerBalanceAfter / LAMPORTS_PER_SOL,
      "SOL"
    );
    console.log("Tournament Status:", tournament.status);
    console.log("Remaining Vault Balance:", vaultBalance / LAMPORTS_PER_SOL, "SOL");
    console.log("Tournament finalized and winner paid automatically");

    assert.deepEqual(tournament.status, { completed: {} });
    assert.equal(
      tournament.winners[0].toBase58(),
      playerOne.publicKey.toBase58()
    );
    assert(vaultBalance > 0);
    assert(vaultBalance < LAMPORTS_PER_SOL / 1000);
    assert(winnerBalanceAfter > winnerBalanceBefore);
  });
    
    it("Cancels tournament and lets player claim SOL refund", async () => {
  const platformBefore = await program.account.platformState.fetch(platformPda);
  const tournamentId = platformBefore.tournamentCount;

  const [cancelTournamentPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(TOURNAMENT_SEED),
      organizer.publicKey.toBuffer(),
      tournamentId.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );

  const [cancelVaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(SOL_VAULT_SEED), cancelTournamentPda.toBuffer()],
    program.programId
  );

  const [cancelRegistrationPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(REGISTRATION_SEED),
      cancelTournamentPda.toBuffer(),
      playerOne.publicKey.toBuffer(),
    ],
    program.programId
  );

  await program.methods
    .createTournament(
      "Cancelled FIFA Cup",
      "FIFA",
      entryFee,
      2,
      [10000],
      { sol: {} },
      PublicKey.default
    )
    .accounts({
      platform: platformPda,
      tournament: cancelTournamentPda,
      organizer: organizer.publicKey,
      systemProgram: SystemProgram.programId,
    } as any)
    .rpc();

  await program.methods
    .joinTournamentSol()
    .accounts({
      tournament: cancelTournamentPda,
      playerRegistration: cancelRegistrationPda,
      solVault: cancelVaultPda,
      player: playerOne.publicKey,
      systemProgram: SystemProgram.programId,
    } as any)
    .signers([playerOne])
    .rpc();

  const playerBalanceBeforeRefund = await provider.connection.getBalance(
    playerOne.publicKey
  );

  await program.methods
    .cancelTournament()
    .accounts({
      tournament: cancelTournamentPda,
      organizer: organizer.publicKey,
    } as any)
    .rpc();

  await program.methods
    .claimRefundSol()
    .accounts({
      tournament: cancelTournamentPda,
      playerRegistration: cancelRegistrationPda,
      solVault: cancelVaultPda,
      player: playerOne.publicKey,
    } as any)
    .signers([playerOne])
    .rpc();

  const tournament = await program.account.tournament.fetch(cancelTournamentPda);
  const registration = await program.account.playerRegistration.fetch(
    cancelRegistrationPda
  );
  const playerBalanceAfterRefund = await provider.connection.getBalance(
    playerOne.publicKey
  );
  const vaultBalance = await provider.connection.getBalance(cancelVaultPda);

  console.log("Cancelled Tournament PDA:", cancelTournamentPda.toBase58());
  console.log("Refund Player:", playerOne.publicKey.toBase58());
  console.log(
    "Player Balance Before Refund:",
    playerBalanceBeforeRefund / LAMPORTS_PER_SOL,
    "SOL"
  );
  console.log(
    "Player Balance After Refund:",
    playerBalanceAfterRefund / LAMPORTS_PER_SOL,
    "SOL"
  );
  console.log("Refunded:", registration.refunded);
  console.log("Remaining Vault Rent:", vaultBalance / LAMPORTS_PER_SOL, "SOL");
  console.log("Tournament cancelled and player refunded successfully");

  assert.deepEqual(tournament.status, { cancelled: {} });
  assert.equal(registration.refunded, true);
  assert.equal(tournament.prizePool.toNumber(), 0);
  assert(playerBalanceAfterRefund > playerBalanceBeforeRefund);
  assert(vaultBalance > 0);
  assert(vaultBalance < LAMPORTS_PER_SOL / 1000);
});
});