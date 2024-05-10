import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
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

    @StringColumn_({nullable: true})
    sourceChain!: string | undefined | null

    @StringColumn_({nullable: true})
    destChain!: string | undefined | null

    @BigIntColumn_({nullable: true})
    sendBlockTimestamp!: bigint | undefined | null

    @StringColumn_({nullable: true})
    sendTx!: string | undefined | null

    @StringColumn_({nullable: true})
    recvTx!: string | undefined | null

    @StringColumn_({nullable: true})
    writeAckTx!: string | undefined | null

    @StringColumn_({nullable: true})
    ackTx!: string | undefined | null

    @BigIntColumn_({nullable: true})
    sendToRecvTime!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    sendToRecvGas!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    sendToAckTime!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    sendToAckGas!: bigint | undefined | null
}
