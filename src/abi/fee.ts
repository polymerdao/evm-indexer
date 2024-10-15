import * as p from '@subsquid/evm-codec'
import { event, fun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    OpenChannelFeeDeposited: event("0x8ab5595b5ac9231b64513ba86f6bd9fb73c51cae40c36083f7dfc2298e4429e6", {"sourceAddress": p.address, "version": p.string, "ordering": p.uint8, "connectionHops": p.array(p.string), "counterpartyPortId": p.string, "feeAmount": p.uint256}),
    OwnershipTransferStarted: event("0x38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    SendPacketFeeDeposited: event("0x0733dc80f277e205edf5d913fa5d91fa0c4cc2635db600b365471c688356c034", {"channelId": indexed(p.bytes32), "sequence": indexed(p.uint64), "gasLimits": p.fixedSizeArray(p.uint256, 2), "gasPrices": p.fixedSizeArray(p.uint256, 2)}),
}

export const functions = {
    acceptOwnership: fun("0x79ba5097", {}, ),
    depositOpenChannelFee: fun("0xfce34e40", {"src": p.address, "version": p.string, "ordering": p.uint8, "connectionHops": p.array(p.string), "counterpartyPortId": p.string}, ),
    depositSendPacketFee: fun("0x18e3404b", {"channelId": p.bytes32, "sequence": p.uint64, "gasLimits": p.fixedSizeArray(p.uint256, 2), "gasPrices": p.fixedSizeArray(p.uint256, 2)}, ),
    owner: fun("0x8da5cb5b", {}, p.address),
    pendingOwner: fun("0xe30c3978", {}, p.address),
    renounceOwnership: fun("0x715018a6", {}, ),
    transferOwnership: fun("0xf2fde38b", {"newOwner": p.address}, ),
    withdrawFeesToOwner: fun("0x0be6a22d", {}, ),
}

export class Contract extends ContractBase {

    owner() {
        return this.eth_call(functions.owner, {})
    }

    pendingOwner() {
        return this.eth_call(functions.pendingOwner, {})
    }
}

/// Event types
export type OpenChannelFeeDepositedEventArgs = EParams<typeof events.OpenChannelFeeDeposited>
export type OwnershipTransferStartedEventArgs = EParams<typeof events.OwnershipTransferStarted>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type SendPacketFeeDepositedEventArgs = EParams<typeof events.SendPacketFeeDeposited>

/// Function types
export type AcceptOwnershipParams = FunctionArguments<typeof functions.acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof functions.acceptOwnership>

export type DepositOpenChannelFeeParams = FunctionArguments<typeof functions.depositOpenChannelFee>
export type DepositOpenChannelFeeReturn = FunctionReturn<typeof functions.depositOpenChannelFee>

export type DepositSendPacketFeeParams = FunctionArguments<typeof functions.depositSendPacketFee>
export type DepositSendPacketFeeReturn = FunctionReturn<typeof functions.depositSendPacketFee>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PendingOwnerParams = FunctionArguments<typeof functions.pendingOwner>
export type PendingOwnerReturn = FunctionReturn<typeof functions.pendingOwner>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type WithdrawFeesToOwnerParams = FunctionArguments<typeof functions.withdrawFeesToOwner>
export type WithdrawFeesToOwnerReturn = FunctionReturn<typeof functions.withdrawFeesToOwner>

