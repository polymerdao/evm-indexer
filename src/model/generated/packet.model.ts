import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {SendPacket} from "./sendPacket.model"
import {RecvPacket} from "./recvPacket.model"
import {WriteAckPacket} from "./writeAckPacket.model"
import {Acknowledgement} from "./acknowledgement.model"
import {PacketStates} from "./_packetStates"

@Entity_()
export class Packet {
    constructor(props?: Partial<Packet>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_({unique: true})
    @OneToOne_(() => SendPacket, {nullable: true})
    @JoinColumn_()
    sendPacket!: SendPacket | undefined | null

    @Index_({unique: true})
    @OneToOne_(() => RecvPacket, {nullable: true})
    @JoinColumn_()
    recvPacket!: RecvPacket | undefined | null

    @Index_({unique: true})
    @OneToOne_(() => WriteAckPacket, {nullable: true})
    @JoinColumn_()
    writeAckPacket!: WriteAckPacket | undefined | null

    @Index_({unique: true})
    @OneToOne_(() => Acknowledgement, {nullable: true})
    @JoinColumn_()
    ackPacket!: Acknowledgement | undefined | null

    @Column_("varchar", {length: 13, nullable: false})
    state!: PacketStates

    @BigIntColumn_({nullable: true})
    sendToRecvTime!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    sendToRecvGas!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    sendToAckTime!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    sendToAckGas!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    sendToRecvPolymerGas!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    sendToAckPolymerGas!: bigint | undefined | null
}
