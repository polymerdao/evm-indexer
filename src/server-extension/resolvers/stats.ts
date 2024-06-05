import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import {
  Acknowledgement, ChannelOpenAck, ChannelOpenConfirm, ChannelOpenInit, ChannelOpenTry, CloseIbcChannel,
  RecvPacket,
  SendPacket,
  Timeout,
  WriteAckPacket,
  WriteTimeoutPacket
} from "../../model";
import { StatName } from "../../handlers";

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


@Resolver()
export class StatsResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  async getStat(name: StatName, chainId: number): Promise<Stat> {
    const manager = await this.tx()

    let where = {}
    if (chainId) {
      where = {chainId}
    }

    let val: number = 0
    switch (name) {
      case StatName.SendPackets:
        val = await manager.getRepository(SendPacket).count({where})
        break
      case StatName.RecvPackets:
        val = await manager.getRepository(RecvPacket).count({where})
        break
      case StatName.AckPackets:
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
    @Arg('name', { nullable: true }) name: StatName,
    @Arg('chainId', { nullable: true }) chainId: number,
  ): Promise<Stat[]> {

    if (name)  {
      return [await this.getStat(name, chainId)]
    }


    let res: Stat[] = []
    for (const name of Object.values(StatName)) {
      res.push(await this.getStat(name, chainId))
    }

    return res
  }
}