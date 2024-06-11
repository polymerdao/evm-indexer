import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AdminChanged: event("0x7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f", {"previousAdmin": p.address, "newAdmin": p.address}),
    BeaconUpgraded: event("0x1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e", {"beacon": indexed(p.address)}),
    Initialized: event("0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498", {"version": p.uint8}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    UCHPacketSent: event("0x9831d8c66285bfd33de069ced58ad437d6bf08f63446bf06c3713e40b4b7e873", {"source": p.address, "destination": p.bytes32}),
    Upgraded: event("0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b", {"implementation": indexed(p.address)}),
}

export const functions = {
    MW_ID: fun("0xc1cb44e5", {}, p.uint256),
    VERSION: fun("0xffa1ad74", {}, p.string),
    connectedChannels: fun("0xbb3f9f8d", {"_0": p.uint256}, p.bytes32),
    dispatcher: fun("0xcb7e9057", {}, p.address),
    initialize: fun("0xc4d66de8", {"_dispatcher": p.address}, ),
    mwStackAddrs: fun("0x49ed7f14", {"_0": p.uint256, "_1": p.uint256}, p.address),
    onAcknowledgementPacket: fun("0x7e1d42b5", {"packet": p.struct({"src": p.struct({"portId": p.string, "channelId": p.bytes32}), "dest": p.struct({"portId": p.string, "channelId": p.bytes32}), "sequence": p.uint64, "data": p.bytes, "timeoutHeight": p.struct({"revision_number": p.uint64, "revision_height": p.uint64}), "timeoutTimestamp": p.uint64}), "ack": p.struct({"success": p.bool, "data": p.bytes})}, ),
    onChanCloseConfirm: fun("0x3f9fdbe4", {"channelId": p.bytes32, "_1": p.string, "_2": p.bytes32}, ),
    onChanCloseInit: fun("0x1eb7dd5e", {"channelId": p.bytes32, "_1": p.string, "_2": p.bytes32}, ),
    onChanOpenAck: fun("0xe847e280", {"channelId": p.bytes32, "_1": p.bytes32, "counterpartyVersion": p.string}, ),
    onChanOpenConfirm: fun("0xfad28a24", {"channelId": p.bytes32}, ),
    onChanOpenInit: fun("0x7a9ccc4b", {"_0": p.uint8, "_1": p.array(p.string), "_2": p.string, "version": p.string}, p.string),
    onChanOpenTry: fun("0x4bdb5597", {"_0": p.uint8, "_1": p.array(p.string), "channelId": p.bytes32, "_3": p.string, "_4": p.bytes32, "counterpartyVersion": p.string}, p.string),
    onRecvPacket: fun("0x4dcc0aa6", {"packet": p.struct({"src": p.struct({"portId": p.string, "channelId": p.bytes32}), "dest": p.struct({"portId": p.string, "channelId": p.bytes32}), "sequence": p.uint64, "data": p.bytes, "timeoutHeight": p.struct({"revision_number": p.uint64, "revision_height": p.uint64}), "timeoutTimestamp": p.uint64})}, p.struct({"success": p.bool, "data": p.bytes})),
    onTimeoutPacket: fun("0x602f9834", {"packet": p.struct({"src": p.struct({"portId": p.string, "channelId": p.bytes32}), "dest": p.struct({"portId": p.string, "channelId": p.bytes32}), "sequence": p.uint64, "data": p.bytes, "timeoutHeight": p.struct({"revision_number": p.uint64, "revision_height": p.uint64}), "timeoutTimestamp": p.uint64})}, ),
    openChannel: fun("0xace02de7", {"version": p.string, "ordering": p.uint8, "feeEnabled": p.bool, "connectionHops": p.array(p.string), "counterpartyPortIdentifier": p.string}, ),
    owner: fun("0x8da5cb5b", {}, p.address),
    proxiableUUID: fun("0x52d1902d", {}, p.bytes32),
    registerMwStack: fun("0x1b532db1", {"mwBitmap": p.uint256, "mwAddrs": p.array(p.address)}, ),
    renounceOwnership: fun("0x715018a6", {}, ),
    sendMWPacket: fun("0x1b67943d", {"channelId": p.bytes32, "srcPortAddr": p.bytes32, "destPortAddr": p.bytes32, "srcMwIds": p.uint256, "appData": p.bytes, "timeoutTimestamp": p.uint64}, ),
    sendUniversalPacket: fun("0x1f3a5830", {"channelId": p.bytes32, "destPortAddr": p.bytes32, "appData": p.bytes, "timeoutTimestamp": p.uint64}, ),
    setDispatcher: fun("0xba22bd76", {"_dispatcher": p.address}, ),
    transferOwnership: fun("0xf2fde38b", {"newOwner": p.address}, ),
    upgradeTo: fun("0x3659cfe6", {"newImplementation": p.address}, ),
    upgradeToAndCall: fun("0x4f1ef286", {"newImplementation": p.address, "data": p.bytes}, ),
}

export class Contract extends ContractBase {

    MW_ID() {
        return this.eth_call(functions.MW_ID, {})
    }

    VERSION() {
        return this.eth_call(functions.VERSION, {})
    }

    connectedChannels(_0: ConnectedChannelsParams["_0"]) {
        return this.eth_call(functions.connectedChannels, {_0})
    }

    dispatcher() {
        return this.eth_call(functions.dispatcher, {})
    }

    mwStackAddrs(_0: MwStackAddrsParams["_0"], _1: MwStackAddrsParams["_1"]) {
        return this.eth_call(functions.mwStackAddrs, {_0, _1})
    }

    onChanOpenInit(_0: OnChanOpenInitParams["_0"], _1: OnChanOpenInitParams["_1"], _2: OnChanOpenInitParams["_2"], version: OnChanOpenInitParams["version"]) {
        return this.eth_call(functions.onChanOpenInit, {_0, _1, _2, version})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    proxiableUUID() {
        return this.eth_call(functions.proxiableUUID, {})
    }
}

/// Event types
export type AdminChangedEventArgs = EParams<typeof events.AdminChanged>
export type BeaconUpgradedEventArgs = EParams<typeof events.BeaconUpgraded>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type UCHPacketSentEventArgs = EParams<typeof events.UCHPacketSent>
export type UpgradedEventArgs = EParams<typeof events.Upgraded>

/// Function types
export type MW_IDParams = FunctionArguments<typeof functions.MW_ID>
export type MW_IDReturn = FunctionReturn<typeof functions.MW_ID>

export type VERSIONParams = FunctionArguments<typeof functions.VERSION>
export type VERSIONReturn = FunctionReturn<typeof functions.VERSION>

export type ConnectedChannelsParams = FunctionArguments<typeof functions.connectedChannels>
export type ConnectedChannelsReturn = FunctionReturn<typeof functions.connectedChannels>

export type DispatcherParams = FunctionArguments<typeof functions.dispatcher>
export type DispatcherReturn = FunctionReturn<typeof functions.dispatcher>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type MwStackAddrsParams = FunctionArguments<typeof functions.mwStackAddrs>
export type MwStackAddrsReturn = FunctionReturn<typeof functions.mwStackAddrs>

export type OnAcknowledgementPacketParams = FunctionArguments<typeof functions.onAcknowledgementPacket>
export type OnAcknowledgementPacketReturn = FunctionReturn<typeof functions.onAcknowledgementPacket>

export type OnChanCloseConfirmParams = FunctionArguments<typeof functions.onChanCloseConfirm>
export type OnChanCloseConfirmReturn = FunctionReturn<typeof functions.onChanCloseConfirm>

export type OnChanCloseInitParams = FunctionArguments<typeof functions.onChanCloseInit>
export type OnChanCloseInitReturn = FunctionReturn<typeof functions.onChanCloseInit>

export type OnChanOpenAckParams = FunctionArguments<typeof functions.onChanOpenAck>
export type OnChanOpenAckReturn = FunctionReturn<typeof functions.onChanOpenAck>

export type OnChanOpenConfirmParams = FunctionArguments<typeof functions.onChanOpenConfirm>
export type OnChanOpenConfirmReturn = FunctionReturn<typeof functions.onChanOpenConfirm>

export type OnChanOpenInitParams = FunctionArguments<typeof functions.onChanOpenInit>
export type OnChanOpenInitReturn = FunctionReturn<typeof functions.onChanOpenInit>

export type OnChanOpenTryParams = FunctionArguments<typeof functions.onChanOpenTry>
export type OnChanOpenTryReturn = FunctionReturn<typeof functions.onChanOpenTry>

export type OnRecvPacketParams = FunctionArguments<typeof functions.onRecvPacket>
export type OnRecvPacketReturn = FunctionReturn<typeof functions.onRecvPacket>

export type OnTimeoutPacketParams = FunctionArguments<typeof functions.onTimeoutPacket>
export type OnTimeoutPacketReturn = FunctionReturn<typeof functions.onTimeoutPacket>

export type OpenChannelParams = FunctionArguments<typeof functions.openChannel>
export type OpenChannelReturn = FunctionReturn<typeof functions.openChannel>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type ProxiableUUIDParams = FunctionArguments<typeof functions.proxiableUUID>
export type ProxiableUUIDReturn = FunctionReturn<typeof functions.proxiableUUID>

export type RegisterMwStackParams = FunctionArguments<typeof functions.registerMwStack>
export type RegisterMwStackReturn = FunctionReturn<typeof functions.registerMwStack>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SendMWPacketParams = FunctionArguments<typeof functions.sendMWPacket>
export type SendMWPacketReturn = FunctionReturn<typeof functions.sendMWPacket>

export type SendUniversalPacketParams = FunctionArguments<typeof functions.sendUniversalPacket>
export type SendUniversalPacketReturn = FunctionReturn<typeof functions.sendUniversalPacket>

export type SetDispatcherParams = FunctionArguments<typeof functions.setDispatcher>
export type SetDispatcherReturn = FunctionReturn<typeof functions.setDispatcher>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UpgradeToParams = FunctionArguments<typeof functions.upgradeTo>
export type UpgradeToReturn = FunctionReturn<typeof functions.upgradeTo>

export type UpgradeToAndCallParams = FunctionArguments<typeof functions.upgradeToAndCall>
export type UpgradeToAndCallReturn = FunctionReturn<typeof functions.upgradeToAndCall>

