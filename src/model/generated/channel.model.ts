import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "@subsquid/typeorm-store"
import {ChannelStates} from "./_channelStates"
import {ChannelOpenInit} from "./channelOpenInit.model"
import {ChannelOpenTry} from "./channelOpenTry.model"
import {ChannelOpenAck} from "./channelOpenAck.model"
import {ChannelOpenConfirm} from "./channelOpenConfirm.model"
import {CloseIbcChannel} from "./closeIbcChannel.model"

@Entity_()
export class Channel {
    constructor(props?: Partial<Channel>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    channelId!: string

    @StringColumn_({nullable: false})
    portId!: string

    @StringColumn_({nullable: false})
    counterpartyPortId!: string

    @StringColumn_({nullable: false})
    counterpartyChannelId!: string

    @StringColumn_({nullable: false})
    version!: string

    @IntColumn_({nullable: false})
    ordering!: number

    @StringColumn_({array: true, nullable: false})
    connectionHops!: (string)[]

    @BigIntColumn_({nullable: false})
    blockNumber!: bigint

    @BigIntColumn_({nullable: false})
    blockTimestamp!: bigint

    @StringColumn_({nullable: false})
    transactionHash!: string

    @Column_("varchar", {length: 6, nullable: false})
    state!: ChannelStates

    @Index_({unique: true})
    @OneToOne_(() => ChannelOpenInit, {nullable: true})
    @JoinColumn_()
    channelOpenInit!: ChannelOpenInit | undefined | null

    @Index_({unique: true})
    @OneToOne_(() => ChannelOpenTry, {nullable: true})
    @JoinColumn_()
    channelOpenTry!: ChannelOpenTry | undefined | null

    @Index_({unique: true})
    @OneToOne_(() => ChannelOpenAck, {nullable: true})
    @JoinColumn_()
    channelOpenAck!: ChannelOpenAck | undefined | null

    @Index_({unique: true})
    @OneToOne_(() => ChannelOpenConfirm, {nullable: true})
    @JoinColumn_()
    channelOpenConfirm!: ChannelOpenConfirm | undefined | null

    @Index_({unique: true})
    @OneToOne_(() => CloseIbcChannel, {nullable: true})
    @JoinColumn_()
    closeIbcChannel!: CloseIbcChannel | undefined | null

    @IntColumn_({nullable: true})
    initToTryTime!: number | undefined | null

    @IntColumn_({nullable: true})
    initToAckTime!: number | undefined | null

    @IntColumn_({nullable: true})
    initToConfirmTime!: number | undefined | null

    @IntColumn_({nullable: true})
    initToTryPolymerGas!: number | undefined | null

    @IntColumn_({nullable: true})
    initToAckPolymerGas!: number | undefined | null

    @IntColumn_({nullable: true})
    initToConfirmPolymerGas!: number | undefined | null
}
