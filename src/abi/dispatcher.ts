import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Acknowledgement: event("0xe46f6591236abe528fe47a3b281fb002524dadd3e62b1f317ed285d07273c3b1", {"sourcePortAddress": indexed(p.address), "sourceChannelId": indexed(p.bytes32), "sequence": p.uint64}),
    AcknowledgementError: event("0x625eea143c9dae6915c809da47016c22d9cd006c3ace7c345c5cbcf57d3aefbc", {"receiver": indexed(p.address), "error": p.bytes}),
    AdminChanged: event("0x7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f", {"previousAdmin": p.address, "newAdmin": p.address}),
    BeaconUpgraded: event("0x1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e", {"beacon": indexed(p.address)}),
    ChannelOpenAck: event("0xcf8be9ab2b5edf8beb2c45abe8e0cc7646318ac19f6c3164ba2e19e93a8a32af", {"receiver": indexed(p.address), "channelId": p.bytes32}),
    ChannelOpenAckError: event("0x971a4433f5bff5f011728a4123aeeca4b5275ac20b013cf276e65510491ac26f", {"receiver": indexed(p.address), "error": p.bytes}),
    ChannelOpenConfirm: event("0xe80f571f70f7cabf9d7ac60ece08421be374117776c311c327a083ca398f802f", {"receiver": indexed(p.address), "channelId": p.bytes32}),
    ChannelOpenConfirmError: event("0xf6a58ef30f66943749e8c29c661c84da143a1c8ed017f5faa92b509e0000875a", {"receiver": indexed(p.address), "error": p.bytes}),
    ChannelOpenInit: event("0x20fd8a5856711b18d00def4aa6abafbe00ce6d60795e015cc1cad35eb9b46359", {"recevier": indexed(p.address), "version": p.string, "ordering": p.uint8, "feeEnabled": p.bool, "connectionHops": p.array(p.string), "counterpartyPortId": p.string}),
    ChannelOpenInitError: event("0x69c1283cce89382f0f9ddf19b7c4f05b4d9b3c30c84fc148b1ec800284be58d5", {"receiver": indexed(p.address), "error": p.bytes}),
    ChannelOpenTry: event("0xf910705a7a768eb5958f281a5f84cae8bffc5dd811ca5cd303dda140a423698c", {"receiver": indexed(p.address), "version": p.string, "ordering": p.uint8, "feeEnabled": p.bool, "connectionHops": p.array(p.string), "counterpartyPortId": p.string, "counterpartyChannelId": p.bytes32}),
    ChannelOpenTryError: event("0x9e2fe55a3b54b57f82334c273f8d048cd7f05ad19c16cf334276a8c1fec4b6fd", {"receiver": indexed(p.address), "error": p.bytes}),
    CloseIbcChannel: event("0xe893e4ba0e364cdc96364b1e1e0d53b0d91e5fd6aa0ee9d81a17ecd61178bf17", {"portAddress": indexed(p.address), "channelId": indexed(p.bytes32)}),
    CloseIbcChannelError: event("0x621537329e2909bff484236da6a5b97154f63e7e138cd6dc53def82a739f7688", {"receiver": indexed(p.address), "error": p.bytes}),
    Initialized: event("0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498", {"version": p.uint8}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    RecvPacket: event("0xde5b57e6566d68a30b0979431df3d5df6db3b9aa89f8820f595b9315bf86d067", {"destPortAddress": indexed(p.address), "destChannelId": indexed(p.bytes32), "sequence": p.uint64}),
    SendPacket: event("0xb5bff96e18da044e4e34510d16df9053b9f1920f6a960732e5aaf22fe9b80136", {"sourcePortAddress": indexed(p.address), "sourceChannelId": indexed(p.bytes32), "packet": p.bytes, "sequence": p.uint64, "timeoutTimestamp": p.uint64}),
    Timeout: event("0x19ac40c4084d9bfb5b43f819a94bf01c70789b0d579871f59e4f86def04d9344", {"sourcePortAddress": indexed(p.address), "sourceChannelId": indexed(p.bytes32), "sequence": indexed(p.uint64)}),
    TimeoutError: event("0x83adb31803bee4e18cda1d04a781d77f6f271718a61b25e3a06f319b5103a330", {"receiver": indexed(p.address), "error": p.bytes}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", {"implementation": indexed(p.address)}),
    WriteAckPacket: event("0xa32e6f42b1d63fb83ad73b009a6dbb9413d1da02e95b1bb08f081815eea8db20", {"writerPortAddress": indexed(p.address), "writerChannelId": indexed(p.bytes32), "sequence": p.uint64, "ackPacket": p.struct({"success": p.bool, "data": p.bytes})}),
    WriteTimeoutPacket: event("0xedbcd9eeb09d85c3ea1b5bf002c04478059cb261cab82c903885cefccae374bc", {"writerPortAddress": indexed(p.address), "writerChannelId": indexed(p.bytes32), "sequence": p.uint64, "timeoutHeight": p.struct({"revision_number": p.uint64, "revision_height": p.uint64}), "timeoutTimestamp": p.uint64}),
}

export const functions = {
    acknowledgement: fun("0xba5a4d25", {"packet": p.struct({"src": p.struct({"portId": p.string, "channelId": p.bytes32}), "dest": p.struct({"portId": p.string, "channelId": p.bytes32}), "sequence": p.uint64, "data": p.bytes, "timeoutHeight": p.struct({"revision_number": p.uint64, "revision_height": p.uint64}), "timeoutTimestamp": p.uint64}), "ack": p.bytes, "proof": p.struct({"proof": p.array(p.struct({"path": p.array(p.struct({"prefix": p.bytes, "suffix": p.bytes})), "key": p.bytes, "value": p.bytes, "prefix": p.bytes})), "height": p.uint256})}, ),
    channelOpenAck: fun("0x1eb9fc86", {"local": p.struct({"portId": p.string, "channelId": p.bytes32, "version": p.string}), "connectionHops": p.array(p.string), "ordering": p.uint8, "feeEnabled": p.bool, "counterparty": p.struct({"portId": p.string, "channelId": p.bytes32, "version": p.string}), "proof": p.struct({"proof": p.array(p.struct({"path": p.array(p.struct({"prefix": p.bytes, "suffix": p.bytes})), "key": p.bytes, "value": p.bytes, "prefix": p.bytes})), "height": p.uint256})}, ),
    channelOpenConfirm: fun("0x429446b6", {"local": p.struct({"portId": p.string, "channelId": p.bytes32, "version": p.string}), "connectionHops": p.array(p.string), "ordering": p.uint8, "feeEnabled": p.bool, "counterparty": p.struct({"portId": p.string, "channelId": p.bytes32, "version": p.string}), "proof": p.struct({"proof": p.array(p.struct({"path": p.array(p.struct({"prefix": p.bytes, "suffix": p.bytes})), "key": p.bytes, "value": p.bytes, "prefix": p.bytes})), "height": p.uint256})}, ),
    channelOpenInit: fun("0x418925b7", {"version": p.string, "ordering": p.uint8, "feeEnabled": p.bool, "connectionHops": p.array(p.string), "counterpartyPortId": p.string}, ),
    channelOpenTry: fun("0x2bf5d19d", {"local": p.struct({"portId": p.string, "channelId": p.bytes32, "version": p.string}), "ordering": p.uint8, "feeEnabled": p.bool, "connectionHops": p.array(p.string), "counterparty": p.struct({"portId": p.string, "channelId": p.bytes32, "version": p.string}), "proof": p.struct({"proof": p.array(p.struct({"path": p.array(p.struct({"prefix": p.bytes, "suffix": p.bytes})), "key": p.bytes, "value": p.bytes, "prefix": p.bytes})), "height": p.uint256})}, ),
    closeIbcChannel: fun("0x8b24b4cb", {"channelId": p.bytes32}, ),
    getChannel: fun("0x42852d24", {"portAddress": p.address, "channelId": p.bytes32}, p.struct({"version": p.string, "ordering": p.uint8, "feeEnabled": p.bool, "connectionHops": p.array(p.string), "counterpartyPortId": p.string, "counterpartyChannelId": p.bytes32})),
    getOptimisticConsensusState: fun("0xeb86ffdb", {"height": p.uint256}, {"appHash": p.uint256, "fraudProofEndTime": p.uint256, "ended": p.bool}),
    initialize: fun("0x7ab4339d", {"initPortPrefix": p.string, "lightClient": p.address}, ),
    owner: fun("0x8da5cb5b", {}, p.address),
    portPrefix: fun("0x7774a6d3", {}, p.string),
    portPrefixLen: fun("0x2494546b", {}, p.uint32),
    proxiableUUID: fun("0x52d1902d", {}, p.bytes32),
    recvPacket: fun("0x6b67055e", {"packet": p.struct({"src": p.struct({"portId": p.string, "channelId": p.bytes32}), "dest": p.struct({"portId": p.string, "channelId": p.bytes32}), "sequence": p.uint64, "data": p.bytes, "timeoutHeight": p.struct({"revision_number": p.uint64, "revision_height": p.uint64}), "timeoutTimestamp": p.uint64}), "proof": p.struct({"proof": p.array(p.struct({"path": p.array(p.struct({"prefix": p.bytes, "suffix": p.bytes})), "key": p.bytes, "value": p.bytes, "prefix": p.bytes})), "height": p.uint256})}, ),
    renounceOwnership: fun("0x715018a6", {}, ),
    sendPacket: fun("0xc3e1155c", {"channelId": p.bytes32, "packet": p.bytes, "timeoutTimestamp": p.uint64}, ),
    setPortPrefix: fun("0x9f59ae71", {"_portPrefix": p.string}, ),
    timeout: fun("0x6050b5f3", {"packet": p.struct({"src": p.struct({"portId": p.string, "channelId": p.bytes32}), "dest": p.struct({"portId": p.string, "channelId": p.bytes32}), "sequence": p.uint64, "data": p.bytes, "timeoutHeight": p.struct({"revision_number": p.uint64, "revision_height": p.uint64}), "timeoutTimestamp": p.uint64}), "proof": p.struct({"proof": p.array(p.struct({"path": p.array(p.struct({"prefix": p.bytes, "suffix": p.bytes})), "key": p.bytes, "value": p.bytes, "prefix": p.bytes})), "height": p.uint256})}, ),
    transferOwnership: fun("0xf2fde38b", {"newOwner": p.address}, ),
    updateClientWithOptimisticConsensusState: fun("0x8919b88c", {"l1header": p.struct({"header": p.array(p.bytes), "stateRoot": p.bytes32, "number": p.uint64}), "proof": p.struct({"accountProof": p.array(p.bytes), "outputRootProof": p.array(p.bytes), "l2OutputProposalKey": p.bytes32, "l2BlockHash": p.bytes32}), "height": p.uint256, "appHash": p.uint256}, {"fraudProofEndTime": p.uint256, "ended": p.bool}),
    upgradeTo: fun("0x3659cfe6", {"newImplementation": p.address}, ),
    upgradeToAndCall: fun("0x4f1ef286", {"newImplementation": p.address, "data": p.bytes}, ),
    writeTimeoutPacket: fun("0x5d7adf96", {"packet": p.struct({"src": p.struct({"portId": p.string, "channelId": p.bytes32}), "dest": p.struct({"portId": p.string, "channelId": p.bytes32}), "sequence": p.uint64, "data": p.bytes, "timeoutHeight": p.struct({"revision_number": p.uint64, "revision_height": p.uint64}), "timeoutTimestamp": p.uint64}), "proof": p.struct({"proof": p.array(p.struct({"path": p.array(p.struct({"prefix": p.bytes, "suffix": p.bytes})), "key": p.bytes, "value": p.bytes, "prefix": p.bytes})), "height": p.uint256})}, ),
}

export class Contract extends ContractBase {

    getChannel(portAddress: GetChannelParams["portAddress"], channelId: GetChannelParams["channelId"]) {
        return this.eth_call(functions.getChannel, {portAddress, channelId})
    }

    getOptimisticConsensusState(height: GetOptimisticConsensusStateParams["height"]) {
        return this.eth_call(functions.getOptimisticConsensusState, {height})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    portPrefix() {
        return this.eth_call(functions.portPrefix, {})
    }

    portPrefixLen() {
        return this.eth_call(functions.portPrefixLen, {})
    }

    proxiableUUID() {
        return this.eth_call(functions.proxiableUUID, {})
    }
}

/// Event types
export type AcknowledgementEventArgs = EParams<typeof events.Acknowledgement>
export type AcknowledgementErrorEventArgs = EParams<typeof events.AcknowledgementError>
export type AdminChangedEventArgs = EParams<typeof events.AdminChanged>
export type BeaconUpgradedEventArgs = EParams<typeof events.BeaconUpgraded>
export type ChannelOpenAckEventArgs = EParams<typeof events.ChannelOpenAck>
export type ChannelOpenAckErrorEventArgs = EParams<typeof events.ChannelOpenAckError>
export type ChannelOpenConfirmEventArgs = EParams<typeof events.ChannelOpenConfirm>
export type ChannelOpenConfirmErrorEventArgs = EParams<typeof events.ChannelOpenConfirmError>
export type ChannelOpenInitEventArgs = EParams<typeof events.ChannelOpenInit>
export type ChannelOpenInitErrorEventArgs = EParams<typeof events.ChannelOpenInitError>
export type ChannelOpenTryEventArgs = EParams<typeof events.ChannelOpenTry>
export type ChannelOpenTryErrorEventArgs = EParams<typeof events.ChannelOpenTryError>
export type CloseIbcChannelEventArgs = EParams<typeof events.CloseIbcChannel>
export type CloseIbcChannelErrorEventArgs = EParams<typeof events.CloseIbcChannelError>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type RecvPacketEventArgs = EParams<typeof events.RecvPacket>
export type SendPacketEventArgs = EParams<typeof events.SendPacket>
export type TimeoutEventArgs = EParams<typeof events.Timeout>
export type TimeoutErrorEventArgs = EParams<typeof events.TimeoutError>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>
export type WriteAckPacketEventArgs = EParams<typeof events.WriteAckPacket>
export type WriteTimeoutPacketEventArgs = EParams<typeof events.WriteTimeoutPacket>

/// Function types
export type AcknowledgementParams = FunctionArguments<typeof functions.acknowledgement>
export type AcknowledgementReturn = FunctionReturn<typeof functions.acknowledgement>

export type ChannelOpenAckParams = FunctionArguments<typeof functions.channelOpenAck>
export type ChannelOpenAckReturn = FunctionReturn<typeof functions.channelOpenAck>

export type ChannelOpenConfirmParams = FunctionArguments<typeof functions.channelOpenConfirm>
export type ChannelOpenConfirmReturn = FunctionReturn<typeof functions.channelOpenConfirm>

export type ChannelOpenInitParams = FunctionArguments<typeof functions.channelOpenInit>
export type ChannelOpenInitReturn = FunctionReturn<typeof functions.channelOpenInit>

export type ChannelOpenTryParams = FunctionArguments<typeof functions.channelOpenTry>
export type ChannelOpenTryReturn = FunctionReturn<typeof functions.channelOpenTry>

export type CloseIbcChannelParams = FunctionArguments<typeof functions.closeIbcChannel>
export type CloseIbcChannelReturn = FunctionReturn<typeof functions.closeIbcChannel>

export type GetChannelParams = FunctionArguments<typeof functions.getChannel>
export type GetChannelReturn = FunctionReturn<typeof functions.getChannel>

export type GetOptimisticConsensusStateParams = FunctionArguments<typeof functions.getOptimisticConsensusState>
export type GetOptimisticConsensusStateReturn = FunctionReturn<typeof functions.getOptimisticConsensusState>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PortPrefixParams = FunctionArguments<typeof functions.portPrefix>
export type PortPrefixReturn = FunctionReturn<typeof functions.portPrefix>

export type PortPrefixLenParams = FunctionArguments<typeof functions.portPrefixLen>
export type PortPrefixLenReturn = FunctionReturn<typeof functions.portPrefixLen>

export type ProxiableUUIDParams = FunctionArguments<typeof functions.proxiableUUID>
export type ProxiableUUIDReturn = FunctionReturn<typeof functions.proxiableUUID>

export type RecvPacketParams = FunctionArguments<typeof functions.recvPacket>
export type RecvPacketReturn = FunctionReturn<typeof functions.recvPacket>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SendPacketParams = FunctionArguments<typeof functions.sendPacket>
export type SendPacketReturn = FunctionReturn<typeof functions.sendPacket>

export type SetPortPrefixParams = FunctionArguments<typeof functions.setPortPrefix>
export type SetPortPrefixReturn = FunctionReturn<typeof functions.setPortPrefix>

export type TimeoutParams = FunctionArguments<typeof functions.timeout>
export type TimeoutReturn = FunctionReturn<typeof functions.timeout>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UpdateClientWithOptimisticConsensusStateParams = FunctionArguments<typeof functions.updateClientWithOptimisticConsensusState>
export type UpdateClientWithOptimisticConsensusStateReturn = FunctionReturn<typeof functions.updateClientWithOptimisticConsensusState>

export type UpgradeToParams = FunctionArguments<typeof functions.upgradeTo>
export type UpgradeToReturn = FunctionReturn<typeof functions.upgradeTo>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>

export type WriteTimeoutPacketParams = FunctionArguments<typeof functions.writeTimeoutPacket>
export type WriteTimeoutPacketReturn = FunctionReturn<typeof functions.writeTimeoutPacket>

