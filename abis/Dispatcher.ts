export const DispatcherAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "initPortPrefix",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_consensusStateManager",
        "type": "address",
        "internalType": "contract ConsensusStateManager"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "ackPacketCommitment",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ackProofKey",
    "inputs": [
      {
        "name": "packet",
        "type": "tuple",
        "internalType": "struct IbcPacket",
        "components": [
          {
            "name": "src",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "dest",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "sequence",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "timeoutHeight",
            "type": "tuple",
            "internalType": "struct Height",
            "components": [
              {
                "name": "revision_number",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "revision_height",
                "type": "uint64",
                "internalType": "uint64"
              }
            ]
          },
          {
            "name": "timeoutTimestamp",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "proofKey",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "ackProofValue",
    "inputs": [
      {
        "name": "ack",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "proofValue",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "acknowledgement",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "contract IbcPacketReceiver"
      },
      {
        "name": "packet",
        "type": "tuple",
        "internalType": "struct IbcPacket",
        "components": [
          {
            "name": "src",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "dest",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "sequence",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "timeoutHeight",
            "type": "tuple",
            "internalType": "struct Height",
            "components": [
              {
                "name": "revision_number",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "revision_height",
                "type": "uint64",
                "internalType": "uint64"
              }
            ]
          },
          {
            "name": "timeoutTimestamp",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      },
      {
        "name": "ack",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "proof",
        "type": "tuple",
        "internalType": "struct Ics23Proof",
        "components": [
          {
            "name": "proof",
            "type": "tuple[]",
            "internalType": "struct OpIcs23Proof[]",
            "components": [
              {
                "name": "path",
                "type": "tuple[]",
                "internalType": "struct OpIcs23ProofPath[]",
                "components": [
                  {
                    "name": "prefix",
                    "type": "bytes",
                    "internalType": "bytes"
                  },
                  {
                    "name": "suffix",
                    "type": "bytes",
                    "internalType": "bytes"
                  }
                ]
              },
              {
                "name": "key",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "value",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "prefix",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "height",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "channelProofKey",
    "inputs": [
      {
        "name": "portId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "channelId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "proofKey",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "channelProofValue",
    "inputs": [
      {
        "name": "state",
        "type": "uint8",
        "internalType": "enum ChannelState"
      },
      {
        "name": "ordering",
        "type": "uint8",
        "internalType": "enum ChannelOrder"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "connectionHops",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "counterparty",
        "type": "tuple",
        "internalType": "struct CounterParty",
        "components": [
          {
            "name": "portId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "channelId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "version",
            "type": "string",
            "internalType": "string"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "proofValue",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "closeIbcChannel",
    "inputs": [
      {
        "name": "channelId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "connectIbcChannel",
    "inputs": [
      {
        "name": "portAddress",
        "type": "address",
        "internalType": "contract IbcChannelReceiver"
      },
      {
        "name": "local",
        "type": "tuple",
        "internalType": "struct CounterParty",
        "components": [
          {
            "name": "portId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "channelId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "version",
            "type": "string",
            "internalType": "string"
          }
        ]
      },
      {
        "name": "connectionHops",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "ordering",
        "type": "uint8",
        "internalType": "enum ChannelOrder"
      },
      {
        "name": "feeEnabled",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "isChanConfirm",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "counterparty",
        "type": "tuple",
        "internalType": "struct CounterParty",
        "components": [
          {
            "name": "portId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "channelId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "version",
            "type": "string",
            "internalType": "string"
          }
        ]
      },
      {
        "name": "proof",
        "type": "tuple",
        "internalType": "struct Ics23Proof",
        "components": [
          {
            "name": "proof",
            "type": "tuple[]",
            "internalType": "struct OpIcs23Proof[]",
            "components": [
              {
                "name": "path",
                "type": "tuple[]",
                "internalType": "struct OpIcs23ProofPath[]",
                "components": [
                  {
                    "name": "prefix",
                    "type": "bytes",
                    "internalType": "bytes"
                  },
                  {
                    "name": "suffix",
                    "type": "bytes",
                    "internalType": "bytes"
                  }
                ]
              },
              {
                "name": "key",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "value",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "prefix",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "height",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "consensusStateManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract ConsensusStateManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getChannel",
    "inputs": [
      {
        "name": "portAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "channelId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "channel",
        "type": "tuple",
        "internalType": "struct Channel",
        "components": [
          {
            "name": "version",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "ordering",
            "type": "uint8",
            "internalType": "enum ChannelOrder"
          },
          {
            "name": "feeEnabled",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "connectionHops",
            "type": "string[]",
            "internalType": "string[]"
          },
          {
            "name": "counterpartyPortId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "counterpartyChannelId",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOptimisticConsensusState",
    "inputs": [
      {
        "name": "height",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "appHash",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "fraudProofEndTime",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "ended",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextSequenceAck",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextSequenceRecv",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextSequenceSend",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "openIbcChannel",
    "inputs": [
      {
        "name": "portAddress",
        "type": "address",
        "internalType": "contract IbcChannelReceiver"
      },
      {
        "name": "local",
        "type": "tuple",
        "internalType": "struct CounterParty",
        "components": [
          {
            "name": "portId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "channelId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "version",
            "type": "string",
            "internalType": "string"
          }
        ]
      },
      {
        "name": "ordering",
        "type": "uint8",
        "internalType": "enum ChannelOrder"
      },
      {
        "name": "feeEnabled",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "connectionHops",
        "type": "string[]",
        "internalType": "string[]"
      },
      {
        "name": "counterparty",
        "type": "tuple",
        "internalType": "struct CounterParty",
        "components": [
          {
            "name": "portId",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "channelId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "version",
            "type": "string",
            "internalType": "string"
          }
        ]
      },
      {
        "name": "proof",
        "type": "tuple",
        "internalType": "struct Ics23Proof",
        "components": [
          {
            "name": "proof",
            "type": "tuple[]",
            "internalType": "struct OpIcs23Proof[]",
            "components": [
              {
                "name": "path",
                "type": "tuple[]",
                "internalType": "struct OpIcs23ProofPath[]",
                "components": [
                  {
                    "name": "prefix",
                    "type": "bytes",
                    "internalType": "bytes"
                  },
                  {
                    "name": "suffix",
                    "type": "bytes",
                    "internalType": "bytes"
                  }
                ]
              },
              {
                "name": "key",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "value",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "prefix",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "height",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "packetCommitmentProofKey",
    "inputs": [
      {
        "name": "packet",
        "type": "tuple",
        "internalType": "struct IbcPacket",
        "components": [
          {
            "name": "src",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "dest",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "sequence",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "timeoutHeight",
            "type": "tuple",
            "internalType": "struct Height",
            "components": [
              {
                "name": "revision_number",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "revision_height",
                "type": "uint64",
                "internalType": "uint64"
              }
            ]
          },
          {
            "name": "timeoutTimestamp",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "proofKey",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "packetCommitmentProofValue",
    "inputs": [
      {
        "name": "packet",
        "type": "tuple",
        "internalType": "struct IbcPacket",
        "components": [
          {
            "name": "src",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "dest",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "sequence",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "timeoutHeight",
            "type": "tuple",
            "internalType": "struct Height",
            "components": [
              {
                "name": "revision_number",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "revision_height",
                "type": "uint64",
                "internalType": "uint64"
              }
            ]
          },
          {
            "name": "timeoutTimestamp",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "proofValue",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "parseAckData",
    "inputs": [
      {
        "name": "ack",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "ackData",
        "type": "tuple",
        "internalType": "struct AckPacket",
        "components": [
          {
            "name": "success",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "portChannelMap",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "ordering",
        "type": "uint8",
        "internalType": "enum ChannelOrder"
      },
      {
        "name": "feeEnabled",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "counterpartyPortId",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "counterpartyChannelId",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "portIdAddressMatch",
    "inputs": [
      {
        "name": "addr",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "portId",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "isMatch",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "portPrefix",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "portPrefixLen",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "recvPacket",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "contract IbcPacketReceiver"
      },
      {
        "name": "packet",
        "type": "tuple",
        "internalType": "struct IbcPacket",
        "components": [
          {
            "name": "src",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "dest",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "sequence",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "timeoutHeight",
            "type": "tuple",
            "internalType": "struct Height",
            "components": [
              {
                "name": "revision_number",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "revision_height",
                "type": "uint64",
                "internalType": "uint64"
              }
            ]
          },
          {
            "name": "timeoutTimestamp",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      },
      {
        "name": "proof",
        "type": "tuple",
        "internalType": "struct Ics23Proof",
        "components": [
          {
            "name": "proof",
            "type": "tuple[]",
            "internalType": "struct OpIcs23Proof[]",
            "components": [
              {
                "name": "path",
                "type": "tuple[]",
                "internalType": "struct OpIcs23ProofPath[]",
                "components": [
                  {
                    "name": "prefix",
                    "type": "bytes",
                    "internalType": "bytes"
                  },
                  {
                    "name": "suffix",
                    "type": "bytes",
                    "internalType": "bytes"
                  }
                ]
              },
              {
                "name": "key",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "value",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "prefix",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "height",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "recvPacketReceipt",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sendPacket",
    "inputs": [
      {
        "name": "channelId",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "packet",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "timeoutTimestamp",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sendPacketCommitment",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setPortPrefix",
    "inputs": [
      {
        "name": "_portPrefix",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "timeout",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "contract IbcPacketReceiver"
      },
      {
        "name": "packet",
        "type": "tuple",
        "internalType": "struct IbcPacket",
        "components": [
          {
            "name": "src",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "dest",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "sequence",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "timeoutHeight",
            "type": "tuple",
            "internalType": "struct Height",
            "components": [
              {
                "name": "revision_number",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "revision_height",
                "type": "uint64",
                "internalType": "uint64"
              }
            ]
          },
          {
            "name": "timeoutTimestamp",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      },
      {
        "name": "proof",
        "type": "tuple",
        "internalType": "struct Ics23Proof",
        "components": [
          {
            "name": "proof",
            "type": "tuple[]",
            "internalType": "struct OpIcs23Proof[]",
            "components": [
              {
                "name": "path",
                "type": "tuple[]",
                "internalType": "struct OpIcs23ProofPath[]",
                "components": [
                  {
                    "name": "prefix",
                    "type": "bytes",
                    "internalType": "bytes"
                  },
                  {
                    "name": "suffix",
                    "type": "bytes",
                    "internalType": "bytes"
                  }
                ]
              },
              {
                "name": "key",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "value",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "prefix",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          },
          {
            "name": "height",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "toStr",
    "inputs": [
      {
        "name": "b",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "outStr",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "toStr",
    "inputs": [
      {
        "name": "_number",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "outStr",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateClientWithOptimisticConsensusState",
    "inputs": [
      {
        "name": "l1header",
        "type": "tuple",
        "internalType": "struct L1Header",
        "components": [
          {
            "name": "header",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "stateRoot",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "number",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      },
      {
        "name": "proof",
        "type": "tuple",
        "internalType": "struct OpL2StateProof",
        "components": [
          {
            "name": "accountProof",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "outputRootProof",
            "type": "bytes[]",
            "internalType": "bytes[]"
          },
          {
            "name": "l2OutputProposalKey",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "l2BlockHash",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      },
      {
        "name": "height",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "appHash",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "fraudProofEndTime",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "ended",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "writeTimeoutPacket",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "packet",
        "type": "tuple",
        "internalType": "struct IbcPacket",
        "components": [
          {
            "name": "src",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "dest",
            "type": "tuple",
            "internalType": "struct IbcEndpoint",
            "components": [
              {
                "name": "portId",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "channelId",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "sequence",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "timeoutHeight",
            "type": "tuple",
            "internalType": "struct Height",
            "components": [
              {
                "name": "revision_number",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "revision_height",
                "type": "uint64",
                "internalType": "uint64"
              }
            ]
          },
          {
            "name": "timeoutTimestamp",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Acknowledgement",
    "inputs": [
      {
        "name": "sourcePortAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "sourceChannelId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sequence",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CloseIbcChannel",
    "inputs": [
      {
        "name": "portAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "channelId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ConnectIbcChannel",
    "inputs": [
      {
        "name": "portAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "channelId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OpenIbcChannel",
    "inputs": [
      {
        "name": "portAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "version",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "ordering",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum ChannelOrder"
      },
      {
        "name": "feeEnabled",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "connectionHops",
        "type": "string[]",
        "indexed": false,
        "internalType": "string[]"
      },
      {
        "name": "counterpartyPortId",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "counterpartyChannelId",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RecvPacket",
    "inputs": [
      {
        "name": "destPortAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "destChannelId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sequence",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SendPacket",
    "inputs": [
      {
        "name": "sourcePortAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "sourceChannelId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "packet",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      },
      {
        "name": "sequence",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "timeoutTimestamp",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Timeout",
    "inputs": [
      {
        "name": "sourcePortAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "sourceChannelId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sequence",
        "type": "uint64",
        "indexed": true,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "WriteAckPacket",
    "inputs": [
      {
        "name": "writerPortAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "writerChannelId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sequence",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "ackPacket",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct AckPacket",
        "components": [
          {
            "name": "success",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "WriteTimeoutPacket",
    "inputs": [
      {
        "name": "writerPortAddress",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "writerChannelId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "sequence",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "timeoutHeight",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct Height",
        "components": [
          {
            "name": "revision_number",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "revision_height",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      },
      {
        "name": "timeoutTimestamp",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ackPacketCommitmentAlreadyExists",
    "inputs": []
  },
  {
    "type": "error",
    "name": "channelNotOwnedBySender",
    "inputs": []
  },
  {
    "type": "error",
    "name": "invalidCounterParty",
    "inputs": []
  },
  {
    "type": "error",
    "name": "invalidCounterPartyPortId",
    "inputs": []
  },
  {
    "type": "error",
    "name": "invalidHexStringLength",
    "inputs": []
  },
  {
    "type": "error",
    "name": "invalidPacketSequence",
    "inputs": []
  },
  {
    "type": "error",
    "name": "packetCommitmentNotFound",
    "inputs": []
  },
  {
    "type": "error",
    "name": "packetNotTimedOut",
    "inputs": []
  },
  {
    "type": "error",
    "name": "packetReceiptAlreadyExists",
    "inputs": []
  },
  {
    "type": "error",
    "name": "receiverNotIntendedPacketDestination",
    "inputs": []
  },
  {
    "type": "error",
    "name": "receiverNotOriginPacketSender",
    "inputs": []
  },
  {
    "type": "error",
    "name": "unexpectedPacketSequence",
    "inputs": []
  }
] as const;
