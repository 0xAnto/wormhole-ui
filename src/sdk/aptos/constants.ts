import * as aptos from 'aptos';
import 'dotenv/config';

export const NODE_URL_TEST = 'https://fullnode.testnet.aptoslabs.com/v1';
export const client = new aptos.AptosClient(NODE_URL_TEST);
export const account = aptos.AptosAccount.fromAptosAccountObject({
    address: '0xdf28397d0d3fe76ee8f2481e1ef522c6a3d9af888d582b1dd1baae73f8ce4031',
    publicKeyHex: "0xcb9df23cf3094bc2ac1ec84b325a09f91e26d9ee88577c0128f692c0926715d7" || '',
    privateKeyHex: "0x26819e655d7f7c3388ecdfe22552884ae0b14be9ecafb7d42a3cdceb16359971" || '',
});

export const apotos_wormhole_core = '0x5bc11445584a763c1fa7ed39081f1b920954da14e04b32440cba863d03e19625';
export const aptos_Wormhole_token = '0x576410486a2da45eee6c949c995670112ddf2fbeedab20350d506328eefc9d4f';
