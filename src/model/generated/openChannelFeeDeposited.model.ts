import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_} from '@subsquid/typeorm-store'
import {ChannelOpenInit} from './channelOpenInit.model'

@Entity_()
export class OpenChannelFeeDeposited {
    constructor(props?: Partial<OpenChannelFeeDeposited>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    sourceAddress!: string

    @StringColumn_({nullable: false})
    version!: string

    @IntColumn_({nullable: false})
    ordering!: number

    @StringColumn_({array: true, nullable: false})
    connectionHops!: (string)[]

    @StringColumn_({nullable: false})
    counterpartyPortId!: string

    @BigIntColumn_({nullable: false})
    feeAmount!: bigint

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
    @ManyToOne_(() => ChannelOpenInit, {nullable: true})
    openChannel!: ChannelOpenInit | undefined | null
}
