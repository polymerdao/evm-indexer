import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

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

    @BigIntColumn_({nullable: false})
    sendGasLimit!: bigint

    @BigIntColumn_({nullable: false})
    sendGasPrice!: bigint

    @BigIntColumn_({nullable: false})
    ackGasLimit!: bigint

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
}
