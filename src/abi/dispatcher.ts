import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './dispatcher.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Acknowledgement: new LogEvent<([sourcePortAddress: string, sourceChannelId: string, sequence: bigint] & {sourcePortAddress: string, sourceChannelId: string, sequence: bigint})>(
        abi, '0xe46f6591236abe528fe47a3b281fb002524dadd3e62b1f317ed285d07273c3b1'
    ),
    AcknowledgementError: new LogEvent<([receiver: string, error: string] & {receiver: string, error: string})>(
        abi, '0x625eea143c9dae6915c809da47016c22d9cd006c3ace7c345c5cbcf57d3aefbc'
    ),
    AdminChanged: new LogEvent<([previousAdmin: string, newAdmin: string] & {previousAdmin: string, newAdmin: string})>(
        abi, '0x7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f'
    ),
    BeaconUpgraded: new LogEvent<([beacon: string] & {beacon: string})>(
        abi, '0x1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e'
    ),
    ChannelOpenAck: new LogEvent<([receiver: string, channelId: string] & {receiver: string, channelId: string})>(
        abi, '0xcf8be9ab2b5edf8beb2c45abe8e0cc7646318ac19f6c3164ba2e19e93a8a32af'
    ),
    ChannelOpenAckError: new LogEvent<([receiver: string, error: string] & {receiver: string, error: string})>(
        abi, '0x971a4433f5bff5f011728a4123aeeca4b5275ac20b013cf276e65510491ac26f'
    ),
    ChannelOpenConfirm: new LogEvent<([receiver: string, channelId: string] & {receiver: string, channelId: string})>(
        abi, '0xe80f571f70f7cabf9d7ac60ece08421be374117776c311c327a083ca398f802f'
    ),
    ChannelOpenConfirmError: new LogEvent<([receiver: string, error: string] & {receiver: string, error: string})>(
        abi, '0xf6a58ef30f66943749e8c29c661c84da143a1c8ed017f5faa92b509e0000875a'
    ),
    ChannelOpenInit: new LogEvent<([recevier: string, version: string, ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterpartyPortId: string] & {recevier: string, version: string, ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterpartyPortId: string})>(
        abi, '0x20fd8a5856711b18d00def4aa6abafbe00ce6d60795e015cc1cad35eb9b46359'
    ),
    ChannelOpenInitError: new LogEvent<([receiver: string, error: string] & {receiver: string, error: string})>(
        abi, '0x69c1283cce89382f0f9ddf19b7c4f05b4d9b3c30c84fc148b1ec800284be58d5'
    ),
    ChannelOpenTry: new LogEvent<([receiver: string, version: string, ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterpartyPortId: string, counterpartyChannelId: string] & {receiver: string, version: string, ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterpartyPortId: string, counterpartyChannelId: string})>(
        abi, '0xf910705a7a768eb5958f281a5f84cae8bffc5dd811ca5cd303dda140a423698c'
    ),
    ChannelOpenTryError: new LogEvent<([receiver: string, error: string] & {receiver: string, error: string})>(
        abi, '0x9e2fe55a3b54b57f82334c273f8d048cd7f05ad19c16cf334276a8c1fec4b6fd'
    ),
    CloseIbcChannel: new LogEvent<([portAddress: string, channelId: string] & {portAddress: string, channelId: string})>(
        abi, '0xe893e4ba0e364cdc96364b1e1e0d53b0d91e5fd6aa0ee9d81a17ecd61178bf17'
    ),
    CloseIbcChannelError: new LogEvent<([receiver: string, error: string] & {receiver: string, error: string})>(
        abi, '0x621537329e2909bff484236da6a5b97154f63e7e138cd6dc53def82a739f7688'
    ),
    Initialized: new LogEvent<([version: number] & {version: number})>(
        abi, '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498'
    ),
    OwnershipTransferred: new LogEvent<([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    RecvPacket: new LogEvent<([destPortAddress: string, destChannelId: string, sequence: bigint] & {destPortAddress: string, destChannelId: string, sequence: bigint})>(
        abi, '0xde5b57e6566d68a30b0979431df3d5df6db3b9aa89f8820f595b9315bf86d067'
    ),
    SendPacket: new LogEvent<([sourcePortAddress: string, sourceChannelId: string, packet: string, sequence: bigint, timeoutTimestamp: bigint] & {sourcePortAddress: string, sourceChannelId: string, packet: string, sequence: bigint, timeoutTimestamp: bigint})>(
        abi, '0xb5bff96e18da044e4e34510d16df9053b9f1920f6a960732e5aaf22fe9b80136'
    ),
    Timeout: new LogEvent<([sourcePortAddress: string, sourceChannelId: string, sequence: bigint] & {sourcePortAddress: string, sourceChannelId: string, sequence: bigint})>(
        abi, '0x19ac40c4084d9bfb5b43f819a94bf01c70789b0d579871f59e4f86def04d9344'
    ),
    TimeoutError: new LogEvent<([receiver: string, error: string] & {receiver: string, error: string})>(
        abi, '0x83adb31803bee4e18cda1d04a781d77f6f271718a61b25e3a06f319b5103a330'
    ),
    Upgraded: new LogEvent<([implementation: string] & {implementation: string})>(
        abi, '0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b'
    ),
    WriteAckPacket: new LogEvent<([writerPortAddress: string, writerChannelId: string, sequence: bigint, ackPacket: ([success: boolean, data: string] & {success: boolean, data: string})] & {writerPortAddress: string, writerChannelId: string, sequence: bigint, ackPacket: ([success: boolean, data: string] & {success: boolean, data: string})})>(
        abi, '0xa32e6f42b1d63fb83ad73b009a6dbb9413d1da02e95b1bb08f081815eea8db20'
    ),
    WriteTimeoutPacket: new LogEvent<([writerPortAddress: string, writerChannelId: string, sequence: bigint, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint] & {writerPortAddress: string, writerChannelId: string, sequence: bigint, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint})>(
        abi, '0xedbcd9eeb09d85c3ea1b5bf002c04478059cb261cab82c903885cefccae374bc'
    ),
}

export const functions = {
    acknowledgement: new Func<[packet: ([src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint] & {src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint}), ack: string, proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})], {packet: ([src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint] & {src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint}), ack: string, proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})}, []>(
        abi, '0xba5a4d25'
    ),
    channelOpenAck: new Func<[local: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), connectionHops: Array<string>, ordering: number, feeEnabled: boolean, counterparty: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})], {local: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), connectionHops: Array<string>, ordering: number, feeEnabled: boolean, counterparty: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})}, []>(
        abi, '0x1eb9fc86'
    ),
    channelOpenConfirm: new Func<[local: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), connectionHops: Array<string>, ordering: number, feeEnabled: boolean, counterparty: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})], {local: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), connectionHops: Array<string>, ordering: number, feeEnabled: boolean, counterparty: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})}, []>(
        abi, '0x429446b6'
    ),
    channelOpenInit: new Func<[version: string, ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterpartyPortId: string], {version: string, ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterpartyPortId: string}, []>(
        abi, '0x418925b7'
    ),
    channelOpenTry: new Func<[local: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterparty: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})], {local: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterparty: ([portId: string, channelId: string, version: string] & {portId: string, channelId: string, version: string}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})}, []>(
        abi, '0x2bf5d19d'
    ),
    closeIbcChannel: new Func<[channelId: string], {channelId: string}, []>(
        abi, '0x8b24b4cb'
    ),
    getChannel: new Func<[portAddress: string, channelId: string], {portAddress: string, channelId: string}, ([version: string, ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterpartyPortId: string, counterpartyChannelId: string] & {version: string, ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterpartyPortId: string, counterpartyChannelId: string})>(
        abi, '0x42852d24'
    ),
    getOptimisticConsensusState: new Func<[height: bigint], {height: bigint}, ([appHash: bigint, fraudProofEndTime: bigint, ended: boolean] & {appHash: bigint, fraudProofEndTime: bigint, ended: boolean})>(
        abi, '0xeb86ffdb'
    ),
    initialize: new Func<[initPortPrefix: string, lightClient: string], {initPortPrefix: string, lightClient: string}, []>(
        abi, '0x7ab4339d'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    portPrefix: new Func<[], {}, string>(
        abi, '0x7774a6d3'
    ),
    portPrefixLen: new Func<[], {}, number>(
        abi, '0x2494546b'
    ),
    proxiableUUID: new Func<[], {}, string>(
        abi, '0x52d1902d'
    ),
    recvPacket: new Func<[packet: ([src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint] & {src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})], {packet: ([src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint] & {src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})}, []>(
        abi, '0x6b67055e'
    ),
    renounceOwnership: new Func<[], {}, []>(
        abi, '0x715018a6'
    ),
    sendPacket: new Func<[channelId: string, packet: string, timeoutTimestamp: bigint], {channelId: string, packet: string, timeoutTimestamp: bigint}, []>(
        abi, '0xc3e1155c'
    ),
    setPortPrefix: new Func<[_portPrefix: string], {_portPrefix: string}, []>(
        abi, '0x9f59ae71'
    ),
    timeout: new Func<[packet: ([src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint] & {src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})], {packet: ([src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint] & {src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})}, []>(
        abi, '0x6050b5f3'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
    updateClientWithOptimisticConsensusState: new Func<[l1header: ([header: Array<string>, stateRoot: string, number: bigint] & {header: Array<string>, stateRoot: string, number: bigint}), proof: ([accountProof: Array<string>, outputRootProof: Array<string>, l2OutputProposalKey: string, l2BlockHash: string] & {accountProof: Array<string>, outputRootProof: Array<string>, l2OutputProposalKey: string, l2BlockHash: string}), height: bigint, appHash: bigint], {l1header: ([header: Array<string>, stateRoot: string, number: bigint] & {header: Array<string>, stateRoot: string, number: bigint}), proof: ([accountProof: Array<string>, outputRootProof: Array<string>, l2OutputProposalKey: string, l2BlockHash: string] & {accountProof: Array<string>, outputRootProof: Array<string>, l2OutputProposalKey: string, l2BlockHash: string}), height: bigint, appHash: bigint}, ([fraudProofEndTime: bigint, ended: boolean] & {fraudProofEndTime: bigint, ended: boolean})>(
        abi, '0x8919b88c'
    ),
    upgradeTo: new Func<[newImplementation: string], {newImplementation: string}, []>(
        abi, '0x3659cfe6'
    ),
    upgradeToAndCall: new Func<[newImplementation: string, data: string], {newImplementation: string, data: string}, []>(
        abi, '0x4f1ef286'
    ),
    writeTimeoutPacket: new Func<[packet: ([src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint] & {src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})], {packet: ([src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint] & {src: ([portId: string, channelId: string] & {portId: string, channelId: string}), dest: ([portId: string, channelId: string] & {portId: string, channelId: string}), sequence: bigint, data: string, timeoutHeight: ([revision_number: bigint, revision_height: bigint] & {revision_number: bigint, revision_height: bigint}), timeoutTimestamp: bigint}), proof: ([proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint] & {proof: Array<([path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string] & {path: Array<([prefix: string, suffix: string] & {prefix: string, suffix: string})>, key: string, value: string, prefix: string})>, height: bigint})}, []>(
        abi, '0x5d7adf96'
    ),
}

export class Contract extends ContractBase {

    getChannel(portAddress: string, channelId: string): Promise<([version: string, ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterpartyPortId: string, counterpartyChannelId: string] & {version: string, ordering: number, feeEnabled: boolean, connectionHops: Array<string>, counterpartyPortId: string, counterpartyChannelId: string})> {
        return this.eth_call(functions.getChannel, [portAddress, channelId])
    }

    getOptimisticConsensusState(height: bigint): Promise<([appHash: bigint, fraudProofEndTime: bigint, ended: boolean] & {appHash: bigint, fraudProofEndTime: bigint, ended: boolean})> {
        return this.eth_call(functions.getOptimisticConsensusState, [height])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    portPrefix(): Promise<string> {
        return this.eth_call(functions.portPrefix, [])
    }

    portPrefixLen(): Promise<number> {
        return this.eth_call(functions.portPrefixLen, [])
    }

    proxiableUUID(): Promise<string> {
        return this.eth_call(functions.proxiableUUID, [])
    }
}
