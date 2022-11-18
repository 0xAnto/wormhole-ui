import {
  assertChain,
  ChainId,
  ChainName,
  CHAIN_ID_APTOS,
  coalesceChainId,
  getAssetFullyQualifiedType,
  getTypeFromExternalAddress,
  isValidAptosType,
} from "@certusone/wormhole-sdk";
import { _parseVAAAlgorand } from "@certusone/wormhole-sdk/lib/cjs/algorand";
import { AptosClient, Types } from "aptos";
import { parseUnits } from "ethers/lib/utils";

export const completeTransferAndRegister = async (
  client: AptosClient,
  tokenBridgeAddress: string,
  transferVAA: Uint8Array
): Promise<Types.EntryFunctionPayload> => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");

  const parsedVAA = _parseVAAAlgorand(transferVAA);
  if (!parsedVAA.FromChain || !parsedVAA.Contract || !parsedVAA.ToChain) {
    throw new Error("VAA does not contain required information");
  }

  if (parsedVAA.ToChain !== CHAIN_ID_APTOS) {
    throw new Error("Transfer is not destined for Aptos");
  }

  assertChain(parsedVAA.FromChain);
  const assetType =
    parsedVAA.FromChain === CHAIN_ID_APTOS
      ? await getTypeFromExternalAddress(
          client,
          tokenBridgeAddress,
          parsedVAA.Contract
        )
      : getAssetFullyQualifiedType(
          tokenBridgeAddress,
          coalesceChainId(parsedVAA.FromChain),
          parsedVAA.Contract
        );
  if (!assetType) throw new Error("Invalid asset address.");

  return {
    function: `0x62fdfe47c9c37227be1f885e79be827be292fe1833ac63a2fe2c2c16c55ecb12::kana_bridge::complete_token_transfer`,
    type_arguments: [assetType],
    arguments: [transferVAA],
  };
};

export const transferTokenAptos = (
  tokenBridgeAddress: string,
  fullyQualifiedType: string,
  amount: string,
  recipientChain: ChainId | ChainName,
  recipient: Uint8Array,
  relayerFee: string,
  nonce: number
): Types.EntryFunctionPayload => {
  if (!tokenBridgeAddress) throw new Error("Need token bridge address.");
  if (!isValidAptosType(fullyQualifiedType)) {
    throw new Error("Invalid qualified type");
  }

  const recipientChainId = coalesceChainId(recipientChain);
  let transfer_amount = parseUnits(amount.toString(), 8);
  return {
    function: `0x62fdfe47c9c37227be1f885e79be827be292fe1833ac63a2fe2c2c16c55ecb12::kana_bridge::init_transfer_tokens`,
    type_arguments: [fullyQualifiedType],
    arguments: [
      transfer_amount.toBigInt(),
      recipientChainId,
      recipient,
      relayerFee,
      nonce,
    ],
  };
};
