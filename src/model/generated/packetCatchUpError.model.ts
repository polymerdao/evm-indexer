import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, OneToOne as OneToOne_} from '@subsquid/typeorm-store'
import {Packet} from './packet.model'

@Entity_()
export class PacketCatchUpError {
    constructor(props?: Partial<PacketCatchUpError>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    sendToRecvPolymerGas!: number

    @Index_()
    @IntColumn_({nullable: false})
    sendToAckPolymerGas!: number

    @OneToOne_(() => Packet, e => e.catchupError)
    packet!: Packet | undefined | null
}
