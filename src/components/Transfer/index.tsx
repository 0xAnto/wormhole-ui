import {
  CHAIN_ID_SOLANA,
  CHAIN_ID_APTOS,
  getEmitterAddressSolana,
  getSignedVAAWithRetry,
  parseSequenceFromLogSolana,
  hexToUint8Array,
  getOriginalAssetAptos,
  uint8ArrayToHex,
  parseSequenceFromLogAptos,
  getForeignAssetSolana,
  createNonce,
} from "@certusone/wormhole-sdk";
import { getOrCreateAssociatedTokenAccount, transfer } from "token-copy";
import {
  Button,
  Container,
  FormLabel,
  Input,
  InputLabel,
  StepButton,
} from "@material-ui/core";
import { web3 } from "@project-serum/anchor";

import {
  client,
  aptos_Wormhole_token,
  apotos_wormhole_core,
} from "../../sdk/aptos/constants";
import {
  completeTransferAndRegister,
  transferTokenAptos,
} from "../../sdk/aptos/payload";
import { getAptBal, getAptBalUsdc, signTxAptos } from "../../sdk/aptos/utils";
import { solanaTransferIX, solanaClaimIx } from "../../sdk/solana";
import { hexZeroPad, parseUnits, zeroPad } from "ethers/lib/utils";
import {
  payer,
  connection,
  wormholeTokenBridge,
} from "../../sdk/solana/constants";
import { Types } from "aptos";
import { useState } from "react";
import axios from "axios";
// import * as aptos from 'aptos'
import {
  getRoutesForSwap,
  getSwapIx,
  getTokenByChainID,
} from "kana-aggregator-sdk";
import { getTokenbalance, tokenAccount } from "../../sdk/solana/utils";
const WalletClient = require("aptos-wallet-api/src/wallet-client");

function Transfer() {
  const [fromToken, setFromToken] = useState("Solana");
  const [toToken, setToToken] = useState("  Aptos ");
  // const [fromTokenSymbol, setFromTokenSymbol] = useState("Solana");
  const [tokenSymbolFrom, setTokenSymbolFrom] = useState("USDC");
  const [tokenSymbolTo, setTokenSymbolTo] = useState("APT");
  const [inputToken, setInputToken] = useState("");
  const [outputToken, setOutputToken] = useState("");
  const [aptToSol, setAptToSol] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState("started");
  const [firstHash, setfirstHash] = useState("");
  const [secondHash, setsecondHash] = useState("");
  const [swapHash, setSwapHash] = useState("");
  // const [balancebefor, setbalancebefor] = useState();
  const [balanceUsdcSol, setbalanceUsdcSol] = useState(0);
  const [balanceApt, setbalanceApt] = useState(0);
  const [balanceAptUsdc, setbalanceAptUsdc] = useState(0);

  let aptosSwapQuote = "https://ag.kanalabs.io/stage-devquote/swapQuote";
  let aptosSwapIx = "https://ag.kanalabs.io/stage-devix/swapInstruction";
  let aptosChainId = "aptos";
  let aptosNetworkId = 2;
  let inputCoin =
    "0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetUSDC";
  let outPutCoin = "0x1::aptos_coin::AptosCoin";

  const getAwapQuotes = async (
    tokenA: string,
    tokenB: string,
    Amount: number
  ) => {
    const response = await axios.get(aptosSwapQuote, {
      params: {
        chainId: aptosChainId,
        networkId: aptosNetworkId,
        inputCoin: tokenA,
        outputCoin: tokenB,
        inputAmount: Amount,
        slippage: 50,
      },
    });
    return response.data;
    // const response = await getRoutesForSwap(aptosChainId,aptosNetworkId,tokenA,tokenB,Amount,2)
    // return response
  };

  const getInstruction = async (route: any) => {
    const request = await axios.post(aptosSwapIx, {
      networkId: aptosNetworkId,
      chainId: aptosChainId,
      swapRoute: route,
    });
    return request.data;
    // const response = await getSwapIx(aptosNetworkId,aptosChainId,route,"",false)
    // return response
  };

  const changeChain = () => {
    if (!aptToSol) {
      setFromToken("Aptos");
      setToToken("Solana");
      setTokenSymbolFrom("USDC");
      setTokenSymbolTo("APT");
      setAptToSol(true);
    } else {
      setFromToken("Solana");
      setToToken("Aptos");
      setTokenSymbolFrom("APT");
      setTokenSymbolTo("USDC");
      setAptToSol(false);
    }
  };

  const transfer = async () => {
    if (aptToSol) {
      transferFromAptos();
      setIsStarted(true);
    } else {
      transferFromSolana();
      setIsStarted(true);
    }
  };
  // 0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T // wormhole usdc
  const transferFromSolana = async () => {
    setStatus("transfering devUSDC tokens from Solana to Aptos....");
    let transferFromsol = await solanaTransferIX(
      Number(inputToken),
      payer,
      new web3.PublicKey("CWCBymKJwrug2QKjv536bM1axAp3j7Qav8uu3gW84XNX")
    );
    setfirstHash(transferFromsol);
    await new Promise((r) => setTimeout(r, 20000)); //Time out to let block propogate
    setStatus("Completed transfer in solana......");
    let tx_object = await connection.getTransaction(transferFromsol);
    const emitterAddr = await getEmitterAddressSolana(
      wormholeTokenBridge.toString()
    );
    const seq = parseSequenceFromLogSolana(
      //@ts-ignore
      tx_object
    );
    const { vaaBytes } = await getSignedVAAWithRetry(
      ["https://wormhole-v2-testnet-api.certus.one"],
      CHAIN_ID_SOLANA,
      emitterAddr,
      seq
    );
    setStatus("vaabytes from Wormhole fetched.......");
    const ix = await completeTransferAndRegister(
      client,
      aptos_Wormhole_token,
      vaaBytes
    );
    setStatus("Transaction completed in Aptos......");
    let signTx = await signTxAptos(ix);
    await swapToNative();
    //@ts-ignore
    if (signTx.status == true) {
      setStatus("transaction completed in aptos......");
      setStatus("swap completed in aptos");
    } else {
      setStatus("transaction failed in aptos......");
      setsecondHash(signTx.hash);
      setIsCompleted(true);
      setIsStarted(false);
      setStatus("");
    }
    console.log(signTx.hash);
  };

  const getQuote = async () => {
    let swaproutes = await getAwapQuotes(
      inputCoin,
      outPutCoin,
      Number(inputToken) * 10 ** 8
    );
    console.log("Quote", swaproutes?.routes[0]);
    return swaproutes?.routes[0].outputAmount;
  };

  const swapToNative = async () => {
    console.log("calling swap native", inputToken);
    let swaproutes = await getAwapQuotes(
      inputCoin,
      outPutCoin,
      Number(inputToken) * 10 ** 8
    );

    setStatus("swap routes found and choosing optimal route.....");

    const getInstruction = async (route: any) => {
      const request = await axios.post(aptosSwapIx, {
        networkId: aptosNetworkId,
        chainId: aptosChainId,
        swapRoute: route,
      });
      return request.data;
      // const response = await getSwapIx(aptosNetworkId,aptosChainId,route,"",false)
      // return response
    };
    setStatus("Generating transaction instruction.....");
    let Instruction = await getInstruction(swaproutes?.routes[0]);
    let signTx = await signTxAptos(Instruction);
    setSwapHash(signTx.hash);
    //@ts-ignore
    if (signTx.status === true) {
      setStatus("Swap completed in aptos......");
      setsecondHash(signTx.hash);
      setIsCompleted(true);
      setIsStarted(false);
      setStatus("");
    } else {
      setStatus("Swap failed in aptos......");
      setsecondHash(signTx.hash);
      setIsCompleted(true);
      setIsStarted(false);
      setStatus("");
    }
  };

  const inputChanged = async (val: any) => {
    setInputToken(val);
    let outAmout = (await getQuote()) || "";

    setOutputToken(outAmout);
  };

  const transferFromAptos = async () => {
    setStatus("starting transfer from aptos....");
    let originalAsset = await getOriginalAssetAptos(
      client,
      aptos_Wormhole_token,
      "0x1::aptos_coin::AptosCoin"
    );
    let hexAddress = uint8ArrayToHex(originalAsset.assetAddress);
    const solanaMintKey = new web3.PublicKey(
      (await getForeignAssetSolana(
        connection,
        "DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe",
        CHAIN_ID_APTOS,
        hexToUint8Array(hexAddress)
      )) || ""
    );
    setStatus("solana mintkey obtained....");

    await new Promise((r) => setTimeout(r, 15000)); //Time out to let block propogate

    const recipientAddress = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      solanaMintKey,
      payer.publicKey,
      undefined
    );

    const aptos_transfer_ix = await transferTokenAptos(
      aptos_Wormhole_token,
      "0x1::aptos_coin::AptosCoin",
      inputToken.toString(),
      CHAIN_ID_SOLANA,
      Buffer.from(zeroPad(recipientAddress.address.toBytes(), 32)),
      "0",
      createNonce().readUInt32LE(0)
    );
    let signTx = await signTxAptos(aptos_transfer_ix);
    let result = (await client.waitForTransactionWithResult(
      signTx.hash
    )) as Types.UserTransaction;
    await new Promise((r) => setTimeout(r, 10000)); //Time out to let block propogate
    setStatus("completed aptos transfer......");
    setStatus(signTx.hash);
    setfirstHash(signTx.hash);

    const data = result.events.find(
      (e) =>
        e.type ===
        `0x5bc11445584a763c1fa7ed39081f1b920954da14e04b32440cba863d03e19625::state::WormholeMessage`
    )?.data;

    const sequence = await parseSequenceFromLogAptos(
      apotos_wormhole_core,
      result
    );

    const emitterAddress = hexZeroPad(
      `0x${parseInt(data?.sender).toString(16)}`,
      32
    ).substring(2);
    setStatus("got emmiter address.......");

    const { vaaBytes } = await getSignedVAAWithRetry(
      ["https://wormhole-v2-testnet-api.certus.one"],
      CHAIN_ID_APTOS,
      emitterAddress,
      sequence || ""
    );
    // const vaaBytess = await (
    //     await fetch(
    //         `https://wormhole-v2-testnet-api.certus.one/v1/signed_vaa/${CHAIN_ID_APTOS}/${emitterAddress}/${sequence}`
    //     )
    // ).json();

    // //@ts-ignore
    // console.log("vaaBytess ", vaaBytess);
    // //@ts-ignore
    // let vaa = hexToUint8Array(vaaBytess.vaaBytes)
    // console.log("vaabytes obtained........")

    let claimTX = await solanaClaimIx(payer, vaaBytes, solanaMintKey);
    setStatus("tokens claimed on solana");
    setsecondHash(claimTX);
    setIsCompleted(true);
    setIsStarted(false);

    setStatus("");

    console.log(claimTX);
  };

  const getBalances = async () => {
    let tokenAcc = await tokenAccount(
      new web3.PublicKey("CWCBymKJwrug2QKjv536bM1axAp3j7Qav8uu3gW84XNX")
    );

    let usdcSol = await getTokenbalance(tokenAcc);
    setbalanceUsdcSol(Number(usdcSol));
    let usdcApt = await getAptBalUsdc();
    setbalanceAptUsdc(Number(usdcApt));
    let aptBal = await getAptBal();
    setbalanceApt(Number(aptBal));
  };
  return (
    // <Container maxWidth="md">
    <div
      style={{
        margin: "auto",
        height: "100%",
        width: "50%",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* <StepButton onClick={() => transferFromSolana()}>
        transferFromSolana
      </StepButton> */}
      <FormLabel
        onClick={async () => await getBalances()}
        style={{
          background: "#fff",
          color: "#000",
          margin: "10px",
          padding: "5px",
        }}
      >
        Show Balance
      </FormLabel>
      <InputLabel style={{ margin: "10px", padding: "10px" }}>
        <b
          style={{
            background: "#000",
            color: "#fff",
            margin: "10px",
            padding: "5px",
          }}
        >
          Origin Chain {fromToken}
        </b>
      </InputLabel>
      <Input
        type="text"
        value={inputToken}
        onChange={async (e) => await inputChanged(e.target.value)}
        style={{
          background: "#000",
          color: "#fff",
          margin: "10px",
          padding: "5px",
        }}
      ></Input>
      <Button style={{ background: "#fff" }} onClick={() => changeChain()}>
        {tokenSymbolFrom}
      </Button>
      <p>USDC Balance in Solana {balanceUsdcSol}</p>

      <img
        src="https://app.kanalabs.io/static/media/swap.231a68e912754b345bb97aa5f4075da7.svg"
        style={{
          padding: "40px",
          margin: "auto",
          display: "flex",
        }}
        alt={"Interchange"}
        onClick={() => changeChain()}
      ></img>

      <InputLabel style={{ margin: "10px", padding: "10px" }}>
        {" "}
        <b
          style={{
            background: "#000",
            color: "#fff",
            margin: "10px",
            padding: "5px",
          }}
        >
          {" "}
          Destination Chain {toToken}
        </b>
      </InputLabel>
      <Input
        type="text"
        style={{
          background: "#000",
          color: "#fff",
          margin: "10px",
          padding: "5px",
        }}
        value={outputToken}
      ></Input>
      <Button style={{ background: "#fff" }} onClick={() => changeChain()}>
        {tokenSymbolTo}
      </Button>
      <p>USDC Balance in Aptos {balanceAptUsdc}</p>
      <p>APT Balance in Aptos {balanceApt}</p>
      <br></br>
      {isStarted && <h4>{status}</h4>}
      {isCompleted && (
        <>
          <h4>Origin Chain Txn Hash {firstHash}</h4>
          <h4>Destination Chain Txn Hash {secondHash}</h4>
          <h4>Swap Hash {swapHash}</h4>
        </>
      )}
      <Button
        onClick={() => transfer()}
        style={{
          background: "#fff",
          border: "1px solid black",
          padding: "10px",
          margin: "20px",
        }}
        fullWidth={true}
      >
        Transfer
      </Button>
    </div>
    // TransferContainer>
  );
}

export default Transfer;
