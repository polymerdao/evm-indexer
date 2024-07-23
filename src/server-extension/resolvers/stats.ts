import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import {
  And,
  Brackets,
  EntityManager,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not
} from 'typeorm'
import {
  Acknowledgement,
  Channel, ChannelCatchUpError,
  ChannelOpenAck,
  ChannelOpenConfirm,
  ChannelOpenInit,
  ChannelOpenTry,
  CloseIbcChannel,
  Packet,
  PacketCatchUpError,
  RecvPacket,
  SendPacket,
  Timeout,
  WriteAckPacket,
  WriteTimeoutPacket
} from "../../model";
import { StatName } from "../../handlers";
import { CATCHUP_ERROR_LIMIT } from "../../chains/constants";
import { getMissingChannelMetricsClauses, getMissingPacketMetricsClauses } from "../../handlers/backfill";

@ObjectType()
export class Stat {
  constructor(props?: Partial<Stat>) {
    Object.assign(this, props)
  }

  @Field({nullable: false})
  name!: string

  @Field({nullable: false})
  val!: number

  @Field({nullable: false})
  chainId!: number
}

@ObjectType()
export class BackfillStat {
  constructor(props?: Partial<BackfillStat>) {
    Object.assign(this, props)
  }

  @Field({nullable: false})
  channels!: number

  @Field({nullable: false})
  packets!: number

  @Field({nullable: false})
  packetsWithErrors!: number

  @Field({nullable: false})
  channelsWithErrors!: number
}


@Resolver()
export class StatsResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  async getStat(name: StatName, chainId: number, start: number, end: number): Promise<Stat> {
    const manager = await this.tx()

    let where = {}
    if (chainId) {
      where = {chainId}
    }

    if (start) {
      where = And(where, { blockTimestamp: MoreThanOrEqual(start) })
    }

    if (end) {
      where = And(where, { blockTimestamp: LessThanOrEqual(end) })
    }

    let val: number = 0
    switch (name) {
      case StatName.SendPacket:
        val = await manager.getRepository(SendPacket).count({where})
        break
      case StatName.RecvPacket:
        val = await manager.getRepository(RecvPacket).count({where})
        break
      case StatName.AckPacket:
        val = await manager.getRepository(Acknowledgement).count({where})
        break
      case StatName.WriteAckPacket:
        val = await manager.getRepository(WriteAckPacket).count({where})
        break
      case StatName.WriteTimeoutPacket:
        val = await manager.getRepository(WriteTimeoutPacket).count({where})
        break
      case StatName.Timeout:
        val = await manager.getRepository(Timeout).count({where})
        break
      case StatName.OpenInitChannel:
        val = await manager.getRepository(ChannelOpenInit).count({where})
        break
      case StatName.OpenTryChannel:
        val = await manager.getRepository(ChannelOpenTry).count({where})
        break
      case StatName.OpenAckChannel:
        val = await manager.getRepository(ChannelOpenAck).count({where})
        break
      case StatName.OpenConfirmChannel:
        val = await manager.getRepository(ChannelOpenConfirm).count({where})
        break
      case StatName.CloseChannel:
        val = await manager.getRepository(CloseIbcChannel).count({where})
        break
    }

    return new Stat({name: name, val: val, chainId: chainId || 0})
  }

  @Query(() => [Stat])
  async stats(
    @Arg('name', {nullable: true}) name: StatName,
    @Arg('chainId', {nullable: true}) chainId: number,
    @Arg('start', {nullable: true}) start: number,
    @Arg('end', {nullable: true}) end: number,
  ): Promise<Stat[]> {

    if (name) {
      return [await this.getStat(name, chainId, start, end)]
    }


    let res: Stat[] = []
    for (const name of Object.values(StatName)) {
      res.push(await this.getStat(name, chainId, start, end))
    }

    return res
  }


  @Query(() => BackfillStat)
  async backfill(): Promise<BackfillStat> {
    const manager = await this.tx()
  
    console.time("packetsQuery");
    const packets = await manager.getRepository(Packet).count({where: getMissingPacketMetricsClauses()})
    console.timeEnd("packetsQuery");
  
    console.time("packetCatchupErrorsQuery");
    let packetCatchupErrors = await manager.getRepository(PacketCatchUpError).count({
      where: [
        {
          sendToAckPolymerGas: And(MoreThan(0), LessThan(CATCHUP_ERROR_LIMIT))
        },
        {
          sendToRecvPolymerGas: And(MoreThan(0), LessThan(CATCHUP_ERROR_LIMIT))
        }
      ]
    })
    console.timeEnd("packetCatchupErrorsQuery");
  
    console.time("channelsQuery");
    let channels = await manager.getRepository(Channel).count({
      relations: {
        channelOpenInit: true,
        channelOpenTry: true,
        channelOpenAck: true,
        channelOpenConfirm: true,
        catchupError: true
      },
      where: getMissingChannelMetricsClauses()
    })
    console.timeEnd("channelsQuery");
  
    console.time("channelCatchupErrorsQuery");
    let channelCatchupErrors = await manager.getRepository(ChannelCatchUpError).count({
      where: [
        {
          initToTryPolymerGas: And(MoreThan(0), LessThan(CATCHUP_ERROR_LIMIT))
        },
        {
          initToAckPolymerGas: And(MoreThan(0), LessThan(CATCHUP_ERROR_LIMIT))
        },
        {
          initToConfirmPolymerGas: And(MoreThan(0), LessThan(CATCHUP_ERROR_LIMIT))
        }
      ]
    })
    console.timeEnd("channelCatchupErrorsQuery");
  
    return {
      channels,
      packets,
      packetsWithErrors: packetCatchupErrors,
      channelsWithErrors: channelCatchupErrors
    }
  }
}