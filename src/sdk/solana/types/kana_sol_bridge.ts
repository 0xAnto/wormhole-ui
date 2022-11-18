export type KanaSolBridge = {
    version: '0.1.0';
    name: 'kana_sol_bridge';
    instructions: [
        {
            name: 'transferTokens';
            accounts: [
                {
                    name: 'payer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'xmintTokenMint';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'xmintAtaAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenBridgeMintCustody';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenBridgeAuthoritySigner';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenBridgeCustodySigner';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'coreBridgeConfig';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'xmintTransferMsgKey';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenBridgeEmitter';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenBridgeSequenceKey';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'coreBridgeFeeCollector';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'clock';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'coreBridge';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'splProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenBridgeConfig';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'rentAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenBridge';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'amount';
                    type: 'u64';
                },
                {
                    name: 'targetAddress';
                    type: {
                        array: ['u8', 32];
                    };
                },
                {
                    name: 'foreignChain';
                    type: 'u16';
                }
            ];
        },
        {
            name: 'claimNativeAsset';
            accounts: [
                {
                    name: 'payer';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'tokenBridgeConfig';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'postedVaaKey';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenClaim';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'endpoint';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'toAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'feeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenBridgeMintCustody';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'splProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenBridgeCustodySigner';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenBridge';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rentAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'coreBridge';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        },
        {
            name: 'claimWrappedAsset';
            accounts: [
                {
                    name: 'payer';
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: 'tokenBridgeConfig';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'postedVaaKey';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenClaim';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'endpoint';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'toAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'feeAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'metaKey';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'mintAuthorityKey';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rentAccount';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'coreBridge';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'splProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenBridge';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        }
    ];
    accounts: [
        {
            name: 'config';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'owner';
                        type: 'publicKey';
                    },
                    {
                        name: 'nonce';
                        type: 'u32';
                    }
                ];
            };
        },
        {
            name: 'redeemer';
            type: {
                kind: 'struct';
                fields: [];
            };
        },
        {
            name: 'mintInfo';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'mint';
                        type: 'publicKey';
                    }
                ];
            };
        },
        {
            name: 'emitterAddrAccount';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'emitterChain';
                        type: 'u16';
                    },
                    {
                        name: 'emitterAddress';
                        type: {
                            array: ['u8', 32];
                        };
                    }
                ];
            };
        }
    ];
    types: [
        {
            name: 'TransferWrappedData';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'nonce';
                        type: 'u32';
                    },
                    {
                        name: 'amount';
                        type: 'u64';
                    },
                    {
                        name: 'fee';
                        type: 'u64';
                    },
                    {
                        name: 'targetAddress';
                        type: {
                            array: ['u8', 32];
                        };
                    },
                    {
                        name: 'targetChain';
                        type: 'u16';
                    }
                ];
            };
        },
        {
            name: 'TransferNativeData';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'nonce';
                        type: 'u32';
                    },
                    {
                        name: 'amount';
                        type: 'u64';
                    },
                    {
                        name: 'fee';
                        type: 'u64';
                    },
                    {
                        name: 'targetAddress';
                        type: {
                            array: ['u8', 32];
                        };
                    },
                    {
                        name: 'targetChain';
                        type: 'u16';
                    }
                ];
            };
        },
        {
            name: 'CompleteNativeData';
            type: {
                kind: 'struct';
                fields: [];
            };
        },
        {
            name: 'Instruction';
            type: {
                kind: 'enum';
                variants: [
                    {
                        name: 'Initialize';
                    },
                    {
                        name: 'AttestToken';
                    },
                    {
                        name: 'CompleteNative';
                    },
                    {
                        name: 'CompleteWrapped';
                    },
                    {
                        name: 'TransferWrapped';
                    },
                    {
                        name: 'TransferNative';
                    },
                    {
                        name: 'RegisterChain';
                    },
                    {
                        name: 'CreateWrapped';
                    },
                    {
                        name: 'UpgradeContract';
                    },
                    {
                        name: 'CompleteNativeWithPayload';
                    },
                    {
                        name: 'CompleteWrappedWithPayload';
                    },
                    {
                        name: 'TransferWrappedWithPayload';
                    },
                    {
                        name: 'TransferNativeWithPayload';
                    }
                ];
            };
        }
    ];
    errors: [
        {
            code: 6000;
            name: 'CustomZeroError';
            msg: 'Solitare Custom(0)';
        }
    ];
};

export const IDL: KanaSolBridge = {
    version: '0.1.0',
    name: 'kana_sol_bridge',
    instructions: [
        {
            name: 'transferTokens',
            accounts: [
                {
                    name: 'payer',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'xmintTokenMint',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'xmintAtaAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenBridgeMintCustody',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenBridgeAuthoritySigner',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenBridgeCustodySigner',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'coreBridgeConfig',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'xmintTransferMsgKey',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'tokenBridgeEmitter',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenBridgeSequenceKey',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'coreBridgeFeeCollector',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'clock',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'coreBridge',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'splProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenBridgeConfig',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'rentAccount',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenBridge',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'amount',
                    type: 'u64',
                },
                {
                    name: 'targetAddress',
                    type: {
                        array: ['u8', 32],
                    },
                },
                {
                    name: 'foreignChain',
                    type: 'u16',
                },
            ],
        },
        {
            name: 'claimNativeAsset',
            accounts: [
                {
                    name: 'payer',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'tokenBridgeConfig',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'postedVaaKey',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenClaim',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'endpoint',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'toAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'feeAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenBridgeMintCustody',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'splProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenBridgeCustodySigner',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenBridge',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'rentAccount',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'coreBridge',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [],
        },
        {
            name: 'claimWrappedAsset',
            accounts: [
                {
                    name: 'payer',
                    isMut: false,
                    isSigner: true,
                },
                {
                    name: 'tokenBridgeConfig',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'postedVaaKey',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenClaim',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'endpoint',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'toAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'feeAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'metaKey',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'mintAuthorityKey',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'rentAccount',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'coreBridge',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'splProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenBridge',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [],
        },
    ],
    accounts: [
        {
            name: 'config',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'owner',
                        type: 'publicKey',
                    },
                    {
                        name: 'nonce',
                        type: 'u32',
                    },
                ],
            },
        },
        {
            name: 'redeemer',
            type: {
                kind: 'struct',
                fields: [],
            },
        },
        {
            name: 'mintInfo',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'mint',
                        type: 'publicKey',
                    },
                ],
            },
        },
        {
            name: 'emitterAddrAccount',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'emitterChain',
                        type: 'u16',
                    },
                    {
                        name: 'emitterAddress',
                        type: {
                            array: ['u8', 32],
                        },
                    },
                ],
            },
        },
    ],
    types: [
        {
            name: 'TransferWrappedData',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'nonce',
                        type: 'u32',
                    },
                    {
                        name: 'amount',
                        type: 'u64',
                    },
                    {
                        name: 'fee',
                        type: 'u64',
                    },
                    {
                        name: 'targetAddress',
                        type: {
                            array: ['u8', 32],
                        },
                    },
                    {
                        name: 'targetChain',
                        type: 'u16',
                    },
                ],
            },
        },
        {
            name: 'TransferNativeData',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'nonce',
                        type: 'u32',
                    },
                    {
                        name: 'amount',
                        type: 'u64',
                    },
                    {
                        name: 'fee',
                        type: 'u64',
                    },
                    {
                        name: 'targetAddress',
                        type: {
                            array: ['u8', 32],
                        },
                    },
                    {
                        name: 'targetChain',
                        type: 'u16',
                    },
                ],
            },
        },
        {
            name: 'CompleteNativeData',
            type: {
                kind: 'struct',
                fields: [],
            },
        },
        {
            name: 'Instruction',
            type: {
                kind: 'enum',
                variants: [
                    {
                        name: 'Initialize',
                    },
                    {
                        name: 'AttestToken',
                    },
                    {
                        name: 'CompleteNative',
                    },
                    {
                        name: 'CompleteWrapped',
                    },
                    {
                        name: 'TransferWrapped',
                    },
                    {
                        name: 'TransferNative',
                    },
                    {
                        name: 'RegisterChain',
                    },
                    {
                        name: 'CreateWrapped',
                    },
                    {
                        name: 'UpgradeContract',
                    },
                    {
                        name: 'CompleteNativeWithPayload',
                    },
                    {
                        name: 'CompleteWrappedWithPayload',
                    },
                    {
                        name: 'TransferWrappedWithPayload',
                    },
                    {
                        name: 'TransferNativeWithPayload',
                    },
                ],
            },
        },
    ],
    errors: [
        {
            code: 6000,
            name: 'CustomZeroError',
            msg: 'Solitare Custom(0)',
        },
    ],
};
