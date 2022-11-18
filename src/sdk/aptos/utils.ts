import { account, client } from "./constants";

export const signTxAptos = async (payload: any) => {
  const txnRequest = await client.generateTransaction(
    account.address(),
    payload,
    {
      max_gas_amount: "50000",
      gas_unit_price: "100",
    }
  );
  let txn = await client.signTransaction(account, txnRequest);
  let submit = await client.submitTransaction(txn);
  let result = await client.waitForTransactionWithResult(submit.hash);
  return result;
};

export const getAptBalUsdc = async () => {
  const bal = await client.getAccountResource(
    "0xdf28397d0d3fe76ee8f2481e1ef522c6a3d9af888d582b1dd1baae73f8ce4031",
    "0x1::coin::CoinStore<0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68::devnet_coins::DevnetUSDC>"
  );
  //@ts-ignore
  let res = bal.data.coin.value / 10 ** 8;
  return res;
};

export const getAptBal = async () => {
  const bal = await client.getAccountResource(
    "0xdf28397d0d3fe76ee8f2481e1ef522c6a3d9af888d582b1dd1baae73f8ce4031",
    "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
  );
  //@ts-ignore
  let res = bal.data.coin.value / 10 ** 8;
  return res;
};
