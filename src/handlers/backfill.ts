import { Context } from "../utils/types";
import { BACKFILL_CONCURRENCY, CATCHUP_BATCH_SIZE, CATCHUP_ERROR_LIMIT, ENABLE_CATCHUP } from "../chains/constants";
import { Channel, Packet, PacketCatchUpError, SendPacket, SendPacketFeeDeposited } from "../model";
import { And, IsNull, LessThan, MoreThan, Not } from "typeorm";
import { channelMetrics } from "./channels";
import { packetMetrics } from "./packets";


export async function handler(ctx: Context) {
  if (ENABLE_CATCHUP) {
    await updateMissingPacketMetrics(ctx);
    await updateMissingChannelMetrics(ctx);
  }

  await updateMissingFees(ctx)
}

export function getMissingChannelMetricsClauses() {
  return [
    {
      initToTryPolymerGas: IsNull(),
      channelOpenInit: Not(IsNull()),
      channelOpenTry: Not(IsNull()),
      catchupError: IsNull()
    },
    {
      initToTryPolymerGas: IsNull(),
      channelOpenInit: Not(IsNull()),
      channelOpenTry: Not(IsNull()),
      catchupError: {initToTryPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
    },
    {
      initToAckPolymerGas: IsNull(),
      channelOpenInit: Not(IsNull()),
      channelOpenTry: Not(IsNull()),
      channelOpenAck: Not(IsNull()),
      catchupError: IsNull()
    },
    {
      initToAckPolymerGas: IsNull(),
      channelOpenInit: Not(IsNull()),
      channelOpenTry: Not(IsNull()),
      channelOpenAck: Not(IsNull()),
      catchupError: {initToAckPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
    },
    {
      initToConfirmPolymerGas: IsNull(),
      channelOpenInit: Not(IsNull()),
      channelOpenTry: Not(IsNull()),
      channelOpenAck: Not(IsNull()),
      channelOpenConfirm: Not(IsNull()),
      catchupError: IsNull()
    },
    {
      initToConfirmPolymerGas: IsNull(),
      channelOpenInit: Not(IsNull()),
      channelOpenTry: Not(IsNull()),
      channelOpenAck: Not(IsNull()),
      channelOpenConfirm: Not(IsNull()),
      catchupError: {initToConfirmPolymerGas: LessThan(CATCHUP_ERROR_LIMIT)}
    }
  ];
}

async function updateMissingChannelMetrics(ctx: Context) {
  const channels = await ctx.store.find(Channel, {
    take: CATCHUP_BATCH_SIZE,
    relations: {
      channelOpenInit: true,
      channelOpenTry: true,
      channelOpenAck: true,
      channelOpenConfirm: true,
      catchupError: true
    },
    where: getMissingChannelMetricsClauses()
  })

  const uniqueChannelIds = new Set<string>();
  for (let channel of channels) {
    uniqueChannelIds.add(channel.id);
  }

  await channelMetrics(Array.from(uniqueChannelIds), ctx);
}

export function getMissingPacketMetricsClauses() {
  return [
    {
      sendPacket: Not(IsNull()),
      recvPacket: Not(IsNull()),
      writeAckPacket: Not(IsNull()),
      sendToAckPolymerGas: IsNull(),
      catchupError: IsNull()
    },
    {
      sendPacket: Not(IsNull()),
      recvPacket: Not(IsNull()),
      sendToRecvPolymerGas: IsNull(),
      catchupError: IsNull(),
    },
  ];
}

async function updateMissingPacketMetrics(ctx: Context) {
  const uniquePacketIds = new Set<string>();

  const packets = await ctx.store.find(Packet, {
    take: CATCHUP_BATCH_SIZE,
    where: getMissingPacketMetricsClauses(),
  });

  for (let packet of packets) {
    uniquePacketIds.add(packet.id);
  }

  // If we don't have enough packets, we can also backfill packets with catchup errors
  if (packets.length < CATCHUP_BATCH_SIZE) {
    let catchupErrors = await ctx.store.find(PacketCatchUpError, {
      take: CATCHUP_BATCH_SIZE - packets.length,
      where: [
        {
          sendToAckPolymerGas: And(MoreThan(0), LessThan(CATCHUP_ERROR_LIMIT))
        },
        {
          sendToRecvPolymerGas: And(MoreThan(0), LessThan(CATCHUP_ERROR_LIMIT))
        }
      ]
    })
    for (let catchupError of catchupErrors) {
      uniquePacketIds.add(catchupError.id);
    }
  }

  await packetMetrics(Array.from(uniquePacketIds), ctx, BACKFILL_CONCURRENCY);
}

async function updateMissingFees(ctx: Context) {
  const missingFeesCount = await ctx.store.count(SendPacketFeeDeposited, {
    where: {
      sendPacket: IsNull()
    }
  });

  console.log(`Missing ${missingFeesCount} send packet fees`);

  let sendPacketFees = await ctx.store.find(SendPacketFeeDeposited, {
    take: CATCHUP_BATCH_SIZE,
    where: {
      sendPacket: IsNull()
    }
  })

  let updatedSendPackets: SendPacket[] = [];
  let updatedSendPacketFees: SendPacketFeeDeposited[] = [];

  for (let sendPacketFee of sendPacketFees) {
    let sendPacket = await ctx.store.findOne(SendPacket,
      {
        where: {
          chainId: sendPacketFee.chainId,
          srcChannelId: sendPacketFee.channelId,
          sequence: sendPacketFee.sequence
        }
      });
    if (sendPacket) {
      sendPacket.feesDeposited = [sendPacketFee];
      sendPacketFee.sendPacket = sendPacket;

      updatedSendPackets.push(sendPacket);
      updatedSendPacketFees.push(sendPacketFee);
    } else {
      console.log(`Could not find send packet for send packet fee ${sendPacketFee.id}`);
    }
  }

  await ctx.store.upsert(updatedSendPackets);
  await ctx.store.upsert(updatedSendPacketFees);
}