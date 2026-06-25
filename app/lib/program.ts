"use client";

import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import type { Grid } from "../types/grid";

import idl from "../idl/grid.json";

export const connection = new Connection(
  clusterApiUrl("devnet"),
  "confirmed"
);

export function getProvider(wallet: AnchorWallet) {
  return new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
}

export function getProgram(wallet: AnchorWallet) {
  const provider = getProvider(wallet);

  return new Program<Grid>(idl as Grid, provider);
}