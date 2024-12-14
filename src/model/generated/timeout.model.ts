import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, Index as Index_, IntColumn as IntColumn_} from '@subsquid/typeorm-store'

@Entity_()
export class Timeout {
    constructor(props?: Partial<Timeout>) {
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
    sourcePortAddress!: string

    @StringColumn_({nullable: false})
    sourceChannelId!: string

    @BigIntColumn_({nullable: false})
    sequence!: bigint

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

    @BigIntColumn_({nullable: false})
    gas!: bigint

    @BigIntColumn_({nullable: true})
    gasUsed!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    gasPrice!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    maxFeePerGas!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    maxPriorityFeePerGas!: bigint | undefined | null

    @StringColumn_({nullable: false})
    from!: string
}
