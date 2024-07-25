import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BooleanColumn as BooleanColumn_, BigIntColumn as BigIntColumn_, Index as Index_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {OpenChannelFeeDeposited} from "./openChannelFeeDeposited.model"

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

    @Index_()
    @BigIntColumn_({nullable: false})
    blockTimestamp!: bigint

    @Index_()
    @StringColumn_({nullable: false})
    transactionHash!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @StringColumn_({nullable: false})
    from!: string

    @BigIntColumn_({nullable: false})
    gas!: bigint

    @BigIntColumn_({nullable: true})
    gasPrice!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    maxFeePerGas!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    maxPriorityFeePerGas!: bigint | undefined | null

    @Index_()
    @StringColumn_({nullable: true})
    polymerTxHash!: string | undefined | null

    @IntColumn_({nullable: true})
    polymerGas!: number | undefined | null

    @BigIntColumn_({nullable: true})
    polymerBlockNumber!: bigint | undefined | null

    @OneToMany_(() => OpenChannelFeeDeposited, e => e.openChannel)
    feesDeposited!: OpenChannelFeeDeposited[]
}
