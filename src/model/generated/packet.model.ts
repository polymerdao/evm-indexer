import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "@subsquid/typeorm-store"
import {PacketStates} from "./_packetStates"
import {SendPacket} from "./sendPacket.model"
import {RecvPacket} from "./recvPacket.model"
import {WriteAckPacket} from "./writeAckPacket.model"
import {Acknowledgement} from "./acknowledgement.model"

@Entity_()
export class Packet {
    constructor(props?: Partial<Packet>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("varchar", {length: 13, nullable: false})
    state!: PacketStates

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
}
