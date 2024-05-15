import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ChannelOpenInit {
    constructor(props?: Partial<ChannelOpenInit>) {
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
    portId!: string

    @StringColumn_({nullable: false})
    channelId!: string

    @StringColumn_({nullable: false})
    portAddress!: string

    @StringColumn_({nullable: false})
    version!: string

    @IntColumn_({nullable: false})
    ordering!: number

    @BooleanColumn_({nullable: false})
    feeEnabled!: boolean

    @StringColumn_({array: true, nullable: false})
    connectionHops!: (string)[]

    @StringColumn_({nullable: false})
    counterpartyPortId!: string

    @StringColumn_({nullable: false})
    counterpartyChannelId!: string

    @BigIntColumn_({nullable: false})
    blockNumber!: bigint

    @BigIntColumn_({nullable: false})
    blockTimestamp!: bigint

    @StringColumn_({nullable: false})
    transactionHash!: string

    @IntColumn_({nullable: false})
    chainId!: number

    @StringColumn_({nullable: false})
    from!: string

    @BigIntColumn_({nullable: false})
    gas!: bigint

    @BigIntColumn_({nullable: false})
    maxFeePerGas!: bigint

    @BigIntColumn_({nullable: false})
    maxPriorityFeePerGas!: bigint
}
