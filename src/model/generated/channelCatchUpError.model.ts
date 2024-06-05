import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, OneToOne as OneToOne_} from "@subsquid/typeorm-store"
import {Channel} from "./channel.model"

@Entity_()
export class ChannelCatchUpError {
    constructor(props?: Partial<ChannelCatchUpError>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    initToTryPolymerGas!: number

    @Index_()
    @IntColumn_({nullable: false})
    initToConfirmPolymerGas!: number

    @Index_()
    @IntColumn_({nullable: false})
    initToAckPolymerGas!: number

    @OneToOne_(() => Channel, e => e.catchupError)
    channel!: Channel | undefined | null
}
