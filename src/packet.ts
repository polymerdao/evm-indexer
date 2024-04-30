import { Virtual } from "@ponder/core";
import { config, Schema, schema } from "@/generated";
import { TmClient } from "./client";
import { IndexedTx } from "@cosmjs/stargate";
import logger from "./logger";
import retry from "async-retry";
import { defaultRetryOpts } from "./retry";


async function updateSendToRecvPolymerGas<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, packet: Schema["Packet"]) {
  if (packet.sendPacketId && !packet.sendToRecvPolymerGas) {
    const sendPacket = await context.db.SendPacket.findUnique({id: packet.sendPacketId});
    if (sendPacket) {
      const stargateClient = await TmClient.getStargate();
      const srcPortId = `polyibc.${sendPacket.dispatcherClientName}.${sendPacket.sourcePortAddress.slice(2)}`;

      let txs: IndexedTx[] = []
      try {
        txs = await stargateClient.searchTx([
          {
            key: "send_packet.packet_sequence",
            value: sendPacket.sequence
          },
          {
            key: "send_packet.packet_src_port",
            value: srcPortId
          },
          {
            key: "send_packet.packet_src_channel",
            value: sendPacket.sourceChannelId
          }
        ])
      } catch (e) {
        logger.error(`Error searching txs in SendPacket for portId ${srcPortId}`, e)
        return
      }

      if (txs.length > 1) {
        throw new Error(`Multiple txs found for sendPacketId: ${sendPacket.id}`);
      }

      if (txs.length == 1) {
        let polymerGas = Number(txs[0]!.gasUsed);
        await context.db.SendPacket.update({
          id: sendPacket.id,
          data: {
            polymerGas: polymerGas,
            polymerTxHash: txs[0]!.hash,
            polymerBlockNumber: BigInt(txs[0]!.height),
          }
        });

        let sendToRecvPolymerGas = polymerGas;

        if (packet.sendToAckPolymerGas) {
          sendToRecvPolymerGas += packet.sendToAckPolymerGas;
        }

        await context.db.Packet.update({
          id: packet.id,
          data: {
            sendToRecvPolymerGas: sendToRecvPolymerGas,
          }
        })
      }
    }
  }
}

async function updateSendToRecvTime<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, packet: Schema["Packet"]) {
  if (packet.sendPacketId && packet.recvPacketId && !packet.sendToRecvTime) {
    const sendPacket = await context.db.SendPacket.findUnique({id: packet.sendPacketId});
    const recvPacket = await context.db.RecvPacket.findUnique({id: packet.recvPacketId});
    if (sendPacket && recvPacket) {
      packet.sendToRecvTime = Number(recvPacket.blockTimestamp - sendPacket.blockTimestamp);
      packet.sendToRecvGas = Number(recvPacket.gas + sendPacket.gas);
      await context.db.Packet.update({
        id: packet.id,
        data: {
          sendToRecvTime: packet.sendToRecvTime,
          sendToRecvGas: packet.sendToRecvGas,
        }
      });
    }
  }
}

async function updateSendToAckPolymerGas<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, packet: Schema["Packet"]) {
  if (packet.writeAckPacketId && !packet.sendToAckPolymerGas) {
    const writeAckPacket = await context.db.WriteAckPacket.findUnique({id: packet.writeAckPacketId});
    if (writeAckPacket) {
      const stargateClient = await TmClient.getStargate();
      const destPortId = `polyibc.${writeAckPacket.dispatcherClientName}.${writeAckPacket.writerPortAddress.slice(2)}`;

      let txs: IndexedTx[] = []
      await retry(async bail => {
        txs = await stargateClient.searchTx([
          {
            key: "write_acknowledgement.packet_sequence",
            value: writeAckPacket.sequence
          },
          {
            key: "write_acknowledgement.packet_dst_port",
            value: destPortId
          },
          {
            key: "write_acknowledgement.packet_dst_channel",
            value: writeAckPacket.writerChannelId
          }
        ])
      }, defaultRetryOpts).catch(e => {
        logger.error('Error searching txs for WriteAckPacket', e)
        return
      });

      if (txs.length > 1) {
        throw new Error(`Multiple txs found for writePacketId: ${writeAckPacket.id}`);
      }

      if (txs.length == 1) {
        let polymerGas = Number(txs[0]!.gasUsed);
        await context.db.WriteAckPacket.update({
          id: writeAckPacket.id,
          data: {
            polymerGas: polymerGas,
            polymerTxHash: txs[0]!.hash,
            polymerBlockNumber: BigInt(txs[0]!.height),
          }
        });

        let sendToAckGas = polymerGas;

        if (packet.sendToRecvPolymerGas) {
          sendToAckGas += packet.sendToRecvPolymerGas;
        }

        await context.db.Packet.update({
          id: packet.id,
          data: {
            sendToAckPolymerGas: sendToAckGas,
          }
        })
      }
    }
  }

}


async function updateSendToAckTime<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, packet: Schema["Packet"]) {
  if (packet.sendPacketId && packet.ackPacketId && !packet.sendToAckTime) {
    const sendPacket = await context.db.SendPacket.findUnique({id: packet.sendPacketId});
    const ackPacket = await context.db.Acknowledgement.findUnique({id: packet.ackPacketId});
    if (sendPacket && ackPacket) {
      packet.sendToAckTime = Number(ackPacket.blockTimestamp - sendPacket.blockTimestamp);
      await context.db.Packet.update({
        id: packet.id,
        data: {
          sendToAckTime: packet.sendToAckTime,
        }
      });
    }
  }
}

async function updateSendToAckGas<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, packet: Schema["Packet"]) {
  if (packet.sendPacketId && packet.recvPacketId && packet.ackPacketId && !packet.sendToAckGas) {
    const sendPacket = await context.db.SendPacket.findUnique({id: packet.sendPacketId});
    const recvPacket = await context.db.RecvPacket.findUnique({id: packet.recvPacketId});
    const ackPacket = await context.db.Acknowledgement.findUnique({id: packet.ackPacketId});
    if (sendPacket && recvPacket && ackPacket) {
      packet.sendToAckGas = Number(ackPacket.gas + recvPacket.gas + sendPacket.gas);
      await context.db.Packet.update({
        id: packet.id,
        data: {
          sendToAckGas: packet.sendToAckGas,
        }
      });
    }
  }
}

export async function updatePacket<name extends Virtual.EventNames<config>>(context: Virtual.Context<config, schema, name>, id: string) {
  let packet = await context.db.Packet.findUnique({id})
  if (!packet) {
    console.warn('No packet found with id', id)
    return;
  }

  await updateSendToRecvTime(context, packet!)
  await updateSendToAckTime(context, packet!)
  await updateSendToAckGas(context, packet!)
  // await updateSendToRecvPolymerGas(context, packet!)
  // await updateSendToAckPolymerGas(context, packet!)
}