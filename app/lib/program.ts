"use client";

import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, clusterApiUrl } from "@solana/web3.js";

import idl from "../idl/grid.json";
import type { Grid } from "../types/grid";

export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export function getProvider(wallet: anchor.Wallet) {
  return new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
}

export function getProgram(wallet: anchor.Wallet): Program<Grid> {
  const provider = getProvider(wallet);

  return new Program<Grid>(idl as Grid, provider);
}