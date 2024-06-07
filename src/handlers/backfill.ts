import { Context } from "../utils/types";
import { CATCHUP_BATCH_SIZE, CATCHUP_ERROR_LIMIT, ENABLE_CATCHUP } from "../chains/constants";
import { Channel, Packet } from "../model";
import { IsNull, LessThan, Not } from "typeorm";
import { channelMetrics } from "./channels";
import { packetMetrics } from "./packets";

export async function handler(ctx: Context) {
  let chainId = await ctx._chain.client.call("eth_chainId")

  if (ENABLE_CATCHUP) {
    await updateMissingPacketMetrics(ctx, chainId);
    await updateMissingChannelMetrics(ctx, chainId);
  }
}

async function updateMissingChannelMetrics(ctx: Context, chainId: number) {
  const channels = await ctx.store.find(Channel, {
    take: CATCHUP_BATCH_SIZE,
    relations: {
      channelOpenInit: true,
      channelOpenTry: true,
      channelOpenAck: true,
      channelOpenConfirm: true,
      catchupError: true
    },
    where: [
      {
        initToTryPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        catchupError: IsNull()
      },
      {
        initToTryPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        catchupError: {initToTryPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
      },
      {
        initToAckPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        channelOpenAck: Not(IsNull()),
        catchupError: IsNull()
      },
      {
        initToAckPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        channelOpenAck: Not(IsNull()),
        catchupError: {initToAckPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
      },
      {
        initToConfirmPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        channelOpenAck: Not(IsNull()),
        channelOpenConfirm: Not(IsNull()),
        catchupError: IsNull()
      },
      {
        initToConfirmPolymerGas: IsNull(),
        channelOpenInit: {chainId: chainId},
        channelOpenTry: Not(IsNull()),
        channelOpenAck: Not(IsNull()),
        channelOpenConfirm: Not(IsNull()),
        catchupError: {initToConfirmPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
      }
    ]
  })

  const uniqueChannelIds = new Set<string>();
  for (let channel of channels) {
    uniqueChannelIds.add(channel.id);
  }

  await channelMetrics(Array.from(uniqueChannelIds), ctx);
}

async function updateMissingPacketMetrics(ctx: Context, chainId: number) {
  const whereClauses = [
    // {
    //   sendPacket: {chainId: chainId},
    //   recvPacket: Not(IsNull()),
    //   writeAckPacket: Not(IsNull()),
    //   sendToAckPolymerGas: IsNull(),
    //   catchupError: {sendToAckPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
    // },
    {
      sendPacket: Not(IsNull()),
      recvPacket: Not(IsNull()),
      writeAckPacket: Not(IsNull()),
      sendToAckPolymerGas: IsNull(),
      catchupError: IsNull()
    },
    // {
    //   sendPacket: {chainId: chainId}, recvPacket: Not(IsNull()),
    //   catchupError: {sendToRecvPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)},
    //   sendToRecvPolymerGas: IsNull(),
    // },
    {
      sendPacket: Not(IsNull()),
      recvPacket: Not(IsNull()),
      catchupError: IsNull(),
      sendToRecvPolymerGas: IsNull(),
    },
  ];

  const uniquePacketIds = new Set<string>();
  const startTime = Date.now();

  const packets = await ctx.store.find(Packet, {
    take: CATCHUP_BATCH_SIZE,
    where: whereClauses[0],
  });

  const endTime = Date.now();

  for (let packet of packets) {
    ctx.log.debug(`Packet ${packet.id} is missing metrics.`);
    uniquePacketIds.add(packet.id);
  }

  const queryTime = endTime - startTime;
  ctx.log.debug(`Missing packets query took ${queryTime} ms.`);

  await packetMetrics(Array.from(uniquePacketIds), ctx);
}
