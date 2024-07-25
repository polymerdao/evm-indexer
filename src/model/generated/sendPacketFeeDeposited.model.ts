import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {SendPacket} from "./sendPacket.model"

@Entity_()
export class SendPacketFeeDeposited {
    constructor(props?: Partial<SendPacketFeeDeposited>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    channelId!: string

    @Index_()
    @BigIntColumn_({nullable: false})
    sequence!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    sendGasLimit!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    sendGasPrice!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    ackGasLimit!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    ackGasPrice!: bigint

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
    @StringColumn_({nullable: false})
    from!: string

    @Index_()
    @ManyToOne_(() => SendPacket, {nullable: true})
    sendPacket!: SendPacket | undefined | null
}
