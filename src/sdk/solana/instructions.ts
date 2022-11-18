import { AnchorProvider, BN, Idl, Program, Wallet, web3 } from '@project-serum/anchor';
import * as anchor from "anchor-copy";
import * as idl from './idl/kana_sol_bridge.json';
import 'dotenv/config';
import { CHAIN_ID_APTOS, hexToUint8Array } from 'wormhole-copy';
import { PublicKey } from '@solana/web3.js';
import {
    connection,
    coreBridgeConfig,
    coreBridgeFeeCollector,
    tokenBridgeAuthoritySigner,
    tokenBridgeConfigAcc,
    tokenBridgeCustodySigner,
    tokenBridgeEmitter,
    tokenBridgeSequenceKey,
    wormholeCoreBridge,
    wormholeTokenBridge,
} from './constants';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import {
    deriveClaimKey,
    deriveEndpointKey,
    deriveMintAuthorityKey,
    derivePostedVaaKey,
    deriveWrappedMetaKey,
} from './utils';

let programId = new web3.PublicKey('Cd7s4ZnVjAu2qLbZ9fJjBhmvwCwvNuNRFEqKWC7LKN2a');
//@ts-ignore
const provider = new anchor.Provider(null, null, {
    skipPreflight: false,
  });
let program = new Program(idl as Idl, programId, new AnchorProvider(connection, new anchor.Wallet(new web3.Keypair()), {}));

export const transferNativeInstruction = async (
    payer: web3.PublicKey,
    mint: PublicKey,
    ancillaryKeypair: web3.PublicKey,
    transferMsgKey: web3.PublicKey
) => {
    const tokenBridgeMintCustody = findProgramAddressSync([mint.toBuffer()], wormholeTokenBridge)[0];

    let tx = await program.methods
        .transferTokens(
            new BN(0.5 * 10 ** 9) as any,
            Buffer.from(hexToUint8Array('df28397d0d3fe76ee8f2481e1ef522c6a3d9af888d582b1dd1baae73f8ce4031')) as any,
            CHAIN_ID_APTOS
        )
        .accounts({
            payer: payer,
            systemProgram: web3.SystemProgram.programId,
            xmintTokenMint: mint,
            xmintAtaAccount: ancillaryKeypair,
            tokenBridgeMintCustody: tokenBridgeMintCustody,
            tokenBridgeAuthoritySigner: tokenBridgeAuthoritySigner,
            tokenBridgeCustodySigner: tokenBridgeCustodySigner,
            coreBridgeConfig: coreBridgeConfig,
            xmintTransferMsgKey: transferMsgKey,
            tokenBridgeEmitter: tokenBridgeEmitter,
            tokenBridgeSequenceKey: tokenBridgeSequenceKey,
            coreBridgeFeeCollector: coreBridgeFeeCollector,
            clock: web3.SYSVAR_CLOCK_PUBKEY,
            coreBridge: wormholeCoreBridge,
            tokenBridge: wormholeTokenBridge,
            splProgram: TOKEN_PROGRAM_ID,
            tokenBridgeConfig: tokenBridgeConfigAcc,
            rentAccount: web3.SYSVAR_RENT_PUBKEY,
        })
        .preInstructions([
            web3.ComputeBudgetProgram.requestUnits({
                units: 300000,
                additionalFee: 0,
            }),
        ])
        .instruction();
    return tx;
};

export const claimWrappedAsset = async (payer: web3.PublicKey, parsed: any, mint: web3.PublicKey) => {
    let tx = await program.methods
        .claimWrappedAsset()
        .accounts({
            payer: payer,
            tokenBridgeConfig: tokenBridgeConfigAcc,
            postedVaaKey: derivePostedVaaKey(wormholeCoreBridge, parsed.hash),
            tokenClaim: deriveClaimKey(
                wormholeTokenBridge,
                parsed.emitterAddress,
                parsed.emitterChain,
                parsed.sequence
            ),
            endpoint: deriveEndpointKey(wormholeTokenBridge, parsed.emitterChain, parsed.emitterAddress),
            toAccount: new web3.PublicKey(parsed.to),
            feeAccount: new web3.PublicKey(parsed.to),
            tokenMint: mint,
            metaKey: deriveWrappedMetaKey(wormholeTokenBridge, mint),
            mintAuthorityKey: deriveMintAuthorityKey(wormholeTokenBridge),
            rentAccount: web3.SYSVAR_RENT_PUBKEY,
            systemProgram: web3.SystemProgram.programId,
            splProgram: TOKEN_PROGRAM_ID,
            coreBridge: wormholeCoreBridge,
            tokenBridge: wormholeTokenBridge,
        })
        .preInstructions([
            web3.ComputeBudgetProgram.requestUnits({
                units: 300000,
                additionalFee: 0,
            }),
        ])
        .instruction();
    return tx;
};
