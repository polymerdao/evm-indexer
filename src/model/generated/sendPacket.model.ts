import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, OneToOne as OneToOne_} from "@subsquid/typeorm-store"
import {Channel} from "./channel.model"
import {Packet} from "./packet.model"
import {SendPacketFeeDeposited} from "./sendPacketFeeDeposited.model"

@Entity_()
export class SendPacket {
    constructor(props?: Partial<SendPacket>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    dispatcherAddress!: string

    @StringColumn_({nullable: false})
    dispatcherType!: string

    @StringColumn_({nullable: false})
    dispatcherClientName!: string

    @Index_()
    @StringColumn_({nullable: false})
    sourcePortAddress!: string

    @Index_()
    @StringColumn_({nullable: false})
    srcChannelId!: string

    @Index_()
    @ManyToOne_(() => Channel, {nullable: true})
    sourceChannel!: Channel | undefined | null

    @Index_()
    @StringColumn_({nullable: false})
    packet!: string

    @Index_()
    @BigIntColumn_({nullable: false})
    sequence!: bigint

    @BigIntColumn_({nullable: false})
    timeoutTimestamp!: bigint

    @BigIntColumn_({nullable: false})
    blockNumber!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    blockTimestamp!: bigint

    @Index_()
    @StringColumn_({nullable: false})
    transactionHash!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: true})
    packetDataSender!: string | undefined | null

    @Index_()
    @StringColumn_({nullable: true})
    uchEventSender!: string | undefined | null

    @BigIntColumn_({nullable: false})
    gas!: bigint

    @BigIntColumn_({nullable: true})
    gasPrice!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    maxFeePerGas!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    maxPriorityFeePerGas!: bigint | undefined | null

    @StringColumn_({nullable: false})
    from!: string

    @OneToOne_(() => Packet, e => e.sendPacket)
    packetRelation!: Packet | undefined | null

    @Index_()
    @StringColumn_({nullable: true})
    polymerTxHash!: string | undefined | null

    @IntColumn_({nullable: true})
    polymerGas!: number | undefined | null

    @BigIntColumn_({nullable: true})
    polymerBlockNumber!: bigint | undefined | null

    @Index_()
    @BigIntColumn_({nullable: false})
    totalRecvFeesDeposited!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    totalAckFeesDeposited!: bigint

    @OneToOne_(() => SendPacketFeeDeposited, e => e.sendPacket)
    lastFeeDeposited!: SendPacketFeeDeposited | undefined | null
}
