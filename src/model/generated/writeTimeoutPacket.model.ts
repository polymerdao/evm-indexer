import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class WriteTimeoutPacket {
    constructor(props?: Partial<WriteTimeoutPacket>) {
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

    @StringColumn_({nullable: false})
    writerPortAddress!: string

    @StringColumn_({nullable: false})
    writerChannelId!: string

    @BigIntColumn_({nullable: false})
    sequence!: bigint

    @BigIntColumn_({nullable: false})
    timeoutHeightRevisionNumber!: bigint

    @BigIntColumn_({nullable: false})
    timeoutHeightRevisionHeight!: bigint

    @BigIntColumn_({nullable: false})
    timeoutTimestamp!: bigint

    @BigIntColumn_({nullable: false})
    blockNumber!: bigint

    @BigIntColumn_({nullable: false})
    blockTimestamp!: bigint

    @StringColumn_({nullable: false})
    transactionHash!: string

    @IntColumn_({nullable: false})
    chainId!: number

    @BigIntColumn_({nullable: false})
    gas!: bigint

    @BigIntColumn_({nullable: false})
    maxFeePerGas!: bigint

    @BigIntColumn_({nullable: false})
    maxPriorityFeePerGas!: bigint

    @StringColumn_({nullable: false})
    from!: string
}
