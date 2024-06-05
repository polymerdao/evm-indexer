import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, OneToOne as OneToOne_, JoinColumn as JoinColumn_} from "@subsquid/typeorm-store"
import {ChannelStates} from "./_channelStates"
import {ChannelOpenInit} from "./channelOpenInit.model"
import {ChannelOpenTry} from "./channelOpenTry.model"
import {ChannelOpenAck} from "./channelOpenAck.model"
import {ChannelOpenConfirm} from "./channelOpenConfirm.model"
import {CloseIbcChannel} from "./closeIbcChannel.model"
import {ChannelCatchUpError} from "./channelCatchUpError.model"

@Entity_()
export class Channel {
    constructor(props?: Partial<Channel>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    channelId!: string

    @Index_()
    @StringColumn_({nullable: false})
    portId!: string

    @Index_()
    @StringColumn_({nullable: false})
    counterpartyPortId!: string

    @Index_()
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

    @Index_()
    @BigIntColumn_({nullable: false})
    blockTimestamp!: bigint

    @Index_()
    @StringColumn_({nullable: false})
    transactionHash!: string

    @Column_("varchar", {length: 6, nullable: false})
    state!: ChannelStates

    @Index_()
    @ManyToOne_(() => ChannelOpenInit, {nullable: true})
    channelOpenInit!: ChannelOpenInit | undefined | null

    @Index_()
    @ManyToOne_(() => ChannelOpenTry, {nullable: true})
    channelOpenTry!: ChannelOpenTry | undefined | null

    @Index_()
    @ManyToOne_(() => ChannelOpenAck, {nullable: true})
    channelOpenAck!: ChannelOpenAck | undefined | null

    @Index_()
    @ManyToOne_(() => ChannelOpenConfirm, {nullable: true})
    channelOpenConfirm!: ChannelOpenConfirm | undefined | null

    @Index_()
    @ManyToOne_(() => CloseIbcChannel, {nullable: true})
    closeIbcChannel!: CloseIbcChannel | undefined | null

    @Index_({unique: true})
    @OneToOne_(() => Channel, {nullable: true})
    @JoinColumn_()
    cpChannel!: Channel | undefined | null

    @IntColumn_({nullable: true})
    initToTryTime!: number | undefined | null

    @IntColumn_({nullable: true})
    initToAckTime!: number | undefined | null

    @IntColumn_({nullable: true})
    initToConfirmTime!: number | undefined | null

    @IntColumn_({nullable: true})
    initToTryGas!: number | undefined | null

    @IntColumn_({nullable: true})
    initToTryPolymerGas!: number | undefined | null

    @IntColumn_({nullable: true})
    initToAckGas!: number | undefined | null

    @IntColumn_({nullable: true})
    initToAckPolymerGas!: number | undefined | null

    @IntColumn_({nullable: true})
    initToConfirmGas!: number | undefined | null

    @IntColumn_({nullable: true})
    initToConfirmPolymerGas!: number | undefined | null

    @Index_({unique: true})
    @OneToOne_(() => ChannelCatchUpError, {nullable: true})
    @JoinColumn_()
    catchupError!: ChannelCatchUpError | undefined | null
}
