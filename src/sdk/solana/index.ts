import { CHAIN_ID_APTOS, getOriginalAssetSol, hexToUint8Array, postVaaSolanaWithRetry, transferFromSolana } from "@certusone/wormhole-sdk";
import { getBridgeFeeIx } from "wormhole-copy/lib/esm/solana/getBridgeFeeIx";
import { web3 } from "@project-serum/anchor";
import {
  AccountLayout,
  createCloseAccountInstruction,
  createInitializeAccountInstruction,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "token-copy";
import { PublicKey, sendAndConfirmRawTransaction } from "@solana/web3.js";
import { parseUnits } from "ethers/lib/utils";
import {
  connection,
  wormholeCoreBridge,
  wormholeTokenBridge,
} from "./constants";
import { claimWrappedAsset, transferNativeInstruction } from "./instructions";
import { createApproveAuthoritySignerInstruction, deriveWrappedMintKey } from "./utils";
import { parseTokenTransferVaa } from "wormhole-copy";

export const solanaTransferIX = async (
  amount: number,
  payer: web3.Keypair,
  mint: web3.PublicKey
) => {
  let originAsset = await getOriginalAssetSol(
    connection, wormholeTokenBridge.toString(), mint.toString())
  let asset_mint = deriveWrappedMintKey(wormholeTokenBridge, CHAIN_ID_APTOS, originAsset.assetAddress)
  if (mint.toString() != "So11111111111111111111111111111111111111112") {
    console.log("entering non native transfer")
    let tokendecimal = await connection.getTokenSupply(mint)
    let transfer_amount = parseUnits(amount.toString(), tokendecimal.value.decimals)
    const fromAddress = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      asset_mint,
      payer.publicKey,
      undefined
    );

    let ix2 = await transferFromSolana(
      connection,
      wormholeCoreBridge.toString(),
      wormholeTokenBridge.toString(),
      payer.publicKey.toString(),
      fromAddress.address.toString(),
      mint.toString(),
      transfer_amount.toBigInt(),
      hexToUint8Array("df28397d0d3fe76ee8f2481e1ef522c6a3d9af888d582b1dd1baae73f8ce4031"),
      'aptos',
      originAsset.assetAddress,
      22,
      payer.publicKey,
      parseUnits("0" || "0", 8).toBigInt()
    )
    ix2.partialSign(
      payer,
      // transferMsgKey
    );
    const txid = await connection.sendRawTransaction(ix2.serialize(), { "skipPreflight": true });
    console.log(txid)
    return txid
  } else {
    let transfer_amount = parseUnits(amount.toString(), 9);

    const ancillaryKeypair = web3.Keypair.generate();
    const createAncillaryAccountIx = web3.SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: ancillaryKeypair.publicKey,
      lamports: 4061600, //spl token accounts need rent exemption
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID,
    });

    //Send in the amount of SOL which we want converted to wSOL
    const initialBalanceTransferIx = web3.SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      lamports: Number(transfer_amount.toBigInt()),
      toPubkey: ancillaryKeypair.publicKey,
    });

    //Initialize the account as a WSOL account, with the original payerAddress as owner
    const initAccountIx = await createInitializeAccountInstruction(
      ancillaryKeypair.publicKey,
      mint,
      payer.publicKey
    );

    const transferIx = await getBridgeFeeIx(
      connection,
      wormholeCoreBridge.toString(),
      payer.publicKey.toString()
    );

    const approvalIx = createApproveAuthoritySignerInstruction(
      wormholeTokenBridge,
      ancillaryKeypair.publicKey,
      payer.publicKey,
      transfer_amount.toBigInt()
    );
    const transferMsgKey = new web3.Keypair();

    const transfernativeIx = await transferNativeInstruction(
      payer.publicKey,
      mint,
      ancillaryKeypair.publicKey,
      transferMsgKey.publicKey
    );

    const closeAccountIx = createCloseAccountInstruction(
      ancillaryKeypair.publicKey, //account to close
      payer.publicKey, //Remaining funds destination
      payer.publicKey //authority
    );
    const { blockhash } = await connection.getLatestBlockhash();
    const transaction = new web3.Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer.publicKey;
    transaction.add(
      createAncillaryAccountIx,
      initialBalanceTransferIx,
      initAccountIx,
      transferIx,
      approvalIx,
      transfernativeIx,
      closeAccountIx
    );
    transaction.partialSign(payer, transferMsgKey, ancillaryKeypair);
    const txid = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: true,
    });
    return txid;
  }



};

export const solanaClaimIx = async (
  payer: web3.Keypair,
  vaaBytes: any,
  mint: PublicKey
) => {
  await postVaaSolanaWithRetry(
    connection, // Solana Mainnet Connection
    async (transaction) => {
      transaction.partialSign(payer);
      return transaction;
    }, //Solana Wallet Signer
    wormholeCoreBridge.toString(),
    payer.publicKey.toString(),
    Buffer.from(vaaBytes),
    5
  );
  await new Promise((r) => setTimeout(r, 20000));
  const parsed = parseTokenTransferVaa(vaaBytes);
  let clainIx = await claimWrappedAsset(payer.publicKey, parsed, mint);
  let hash = await connection.getLatestBlockhash();
  let manualTransaction = new web3.Transaction({
    recentBlockhash: hash.blockhash,
    feePayer: payer.publicKey,
  });
  manualTransaction.add(clainIx);
  manualTransaction.partialSign(payer);
  const txid = await sendAndConfirmRawTransaction(
    connection,
    manualTransaction.serialize(),
    { skipPreflight: true }
  );
  return txid;
};
