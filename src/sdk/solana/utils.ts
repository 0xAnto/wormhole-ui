import { ChainId, CHAIN_ID_SOLANA, tryNativeToUint8Array } from "wormhole-copy";
import { web3 } from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import {
  createApproveInstruction,
  getOrCreateAssociatedTokenAccount,
} from "token-copy";
import {
  connection,
  payer,
  wormholeCoreBridge,
  wormholeTokenBridge,
} from "./constants";

export function derivePostedVaaKey(
  wormholeProgramId: web3.PublicKey,
  hash: Buffer
): web3.PublicKey {
  return findProgramAddressSync(
    [Buffer.from("PostedVAA"), hash],
    wormholeCoreBridge
  )[0];
}

export function deriveClaimKey(
  programId: web3.PublicKey,
  emitterAddress: Buffer | Uint8Array | string,
  emitterChain: number,
  sequence: bigint | number
): web3.PublicKey {
  const address =
    typeof emitterAddress == "string"
      ? Buffer.from(emitterAddress, "hex")
      : Buffer.from(emitterAddress);
  if (address.length != 32) {
    throw Error("address.length != 32");
  }
  const sequenceSerialized = Buffer.alloc(8);
  sequenceSerialized.writeBigInt64BE(
    typeof sequence == "number" ? BigInt(sequence) : sequence
  );
  return findProgramAddressSync(
    [
      address,
      (() => {
        const buf = Buffer.alloc(2);
        buf.writeUInt16BE(emitterChain as number);
        return buf;
      })(),
      sequenceSerialized,
    ],
    programId
  )[0];
}

export function deriveEndpointKey(
  tokenBridgeProgramId: web3.PublicKey,
  emitterChain: number | ChainId,
  emitterAddress: Buffer | Uint8Array | string
): web3.PublicKey {
  if (emitterChain == CHAIN_ID_SOLANA) {
    throw new Error(
      "emitterChain == CHAIN_ID_SOLANA cannot exist as foreign token bridge emitter"
    );
  }
  if (typeof emitterAddress == "string") {
    emitterAddress = tryNativeToUint8Array(
      emitterAddress,
      emitterChain as ChainId
    );
  }
  return findProgramAddressSync(
    [
      (() => {
        const buf = Buffer.alloc(2);
        buf.writeUInt16BE(emitterChain as number);
        return buf;
      })(),
      emitterAddress,
    ],
    tokenBridgeProgramId
  )[0];
}

export function deriveWrappedMetaKey(
  tokenBridgeProgramId: web3.PublicKey,
  mint: web3.PublicKey
): web3.PublicKey {
  return findProgramAddressSync(
    [Buffer.from("meta"), new web3.PublicKey(mint).toBuffer()],
    tokenBridgeProgramId
  )[0];
}

export function deriveMintAuthorityKey(
  tokenBridgeProgramId: web3.PublicKey
): web3.PublicKey {
  return findProgramAddressSync(
    [Buffer.from("mint_signer")],
    tokenBridgeProgramId
  )[0];
}

export function createApproveAuthoritySignerInstruction(
  tokenBridgeProgramId: web3.PublicKeyInitData,
  tokenAccount: web3.PublicKeyInitData,
  owner: web3.PublicKeyInitData,
  amount: number | bigint
) {
  return createApproveInstruction(
    new web3.PublicKey(tokenAccount),
    findProgramAddressSync(
      [Buffer.from("authority_signer")],
      wormholeTokenBridge
    )[0],
    new web3.PublicKey(owner),
    amount
  );
}

export const solGetBalance = async (payer: web3.PublicKey) => {
  let balance = await connection.getBalance(payer);
  return balance;
};
export const tokenAccount = async (asset_mint: web3.PublicKey) => {
  const fromAddress = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    asset_mint,
    payer.publicKey,
    undefined
  );
  return fromAddress.address;
};

export const getTokenbalance = async (tokenAccount: web3.PublicKey) => {
  let balance = await connection.getTokenAccountBalance(tokenAccount);
  return balance.value.uiAmount;
};

export function deriveWrappedMintKey(
  tokenBridgeProgramId: web3.PublicKey,
  tokenChain: number | ChainId,
  tokenAddress: Buffer | Uint8Array | string
): web3.PublicKey {
  if (tokenChain == CHAIN_ID_SOLANA) {
    throw new Error(
      "tokenChain == CHAIN_ID_SOLANA does not have wrapped mint key"
    );
  }
  if (typeof tokenAddress == "string") {
    tokenAddress = tryNativeToUint8Array(tokenAddress, tokenChain as ChainId);
  }
  return findProgramAddressSync(
    [
      Buffer.from("wrapped"),
      (() => {
        const buf = Buffer.alloc(2);
        buf.writeUInt16BE(tokenChain as number);
        return buf;
      })(),
      tokenAddress,
    ],
    tokenBridgeProgramId
  )[0];
}
