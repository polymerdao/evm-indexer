import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, OneToOne as OneToOne_} from '@subsquid/typeorm-store'
import {Packet} from './packet.model'

@Entity_()
export class RecvPacket {
    constructor(props?: Partial<RecvPacket>) {
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
    destPortAddress!: string

    @Index_()
    @StringColumn_({nullable: false})
    destChannelId!: string

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

    @OneToOne_(() => Packet, e => e.recvPacket)
    packet!: Packet | undefined | null
}
