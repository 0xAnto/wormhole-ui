import { web3 } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import 'dotenv/config';

export const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
export const payer = web3.Keypair.fromSecretKey(bs58.decode("21XdSTKLSXcGVLsBp4kfCRTq4z4JHUd6ePBnqXy8WHsKyX5x4FcAtv44YFmZzdAmbUQUohmNrepULjtycuVErebY" || ''));

export const wormholeTokenBridge = new web3.PublicKey('DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe');
export const wormholeCoreBridge = new web3.PublicKey('3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5');
export const tokenBridgeAuthoritySigner = findProgramAddressSync(
    [Buffer.from('authority_signer')],
    wormholeTokenBridge
)[0];
export const tokenBridgeCustodySigner = findProgramAddressSync([Buffer.from('custody_signer')], wormholeTokenBridge)[0];
export const coreBridgeConfig = findProgramAddressSync([Buffer.from('Bridge')], wormholeCoreBridge)[0];
export const tokenBridgeEmitter = findProgramAddressSync([Buffer.from('emitter')], wormholeTokenBridge)[0];
export const tokenBridgeSequenceKey = findProgramAddressSync(
    [Buffer.from('Sequence'), tokenBridgeEmitter.toBuffer()],
    wormholeCoreBridge
)[0];
export const coreBridgeFeeCollector = findProgramAddressSync([Buffer.from('fee_collector')], wormholeCoreBridge)[0];
export const tokenBridgeConfigAcc = findProgramAddressSync([Buffer.from('config')], wormholeTokenBridge)[0];
