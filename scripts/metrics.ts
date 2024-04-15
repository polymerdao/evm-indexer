#!/usr/bin/env ts-node

import { program } from 'commander';
import { GraphQLClient } from 'graphql-request';
import { Table } from "console-table-printer";
import { TmClient } from "../src/client";
import { StargateClient } from "@cosmjs/stargate";
import {
  GET_CHANNEL_BY_CHANNEL_ID,
  GET_CHANNELS,
  GET_OPEN_CHANNEL_BY_CHANNEL_ID,
  GET_PACKET_BY_SENT_TX,
  GET_SEND_PACKETS
} from "./queries";
import * as fs from "fs";
import ProgressBar from "progress";

program
  .version('1.0.0')
  .description('A CLI for fetching packet and channel metrics.');

const METRIC_STATE = "State";
const METRIC_CLIENT_TYPE = "Client Type";

// packet metrics
const METRIC_TX_HASH = "Tx Hash";
const METRIC_SEND_PACKET_L2_GAS = "Send Packet L2 gas";
const METRIC_SEND_TO_RECV_TIME = "Send To Recv Time";
const METRIC_RECV_PACKET_L2_GAS = "Recv Packet L2 gas";
const METRIC_SEND_TO_RECV_PACKET_L2_GAS = "Send To Recv Packet L2 gas";
const METRIC_SEND_TO_ACK_TIME = "Send To Ack Time";
const METRIC_ACK_PACKET_L2_GAS = "Ack Packet L2 gas";
const METRIC_SEND_TO_ACK_L2_GAS = "Send To Ack L2 Gas";
const METRIC_SEND_POLYMER_GAS = "Send Polymer Gas";
const METRIC_WRITE_ACK_POLYMER_GAS = "Write Ack Polymer Gas";

// channel metrics
const METRIC_CHANNEL_NAME = "Channel Name";
const METRIC_INIT_L2_GAS = "Init L2 Gas";
const METRIC_TRY_L2_GAS = "Try L2 Gas";
const METRIC_ACK_L2_GAS = "Ack L2 Gas";
const METRIC_CONFIRM_L2_GAS = "Confirm L2 Gas";
const METRIC_INIT_TO_TRY_TIME = "Init To Try Time";
const METRIC_INIT_TO_CONFIRM_TIME = "Init To Confirm Time";
const METRIC_INIT_TO_ACK_TIME = "Init To Ack Time";
const METRIC_INIT_POLYMER_GAS = "Init Poly Gas";
const METRIC_TRY_POLYMER_GAS = "Try Poly Gas";
const METRIC_ACK_POLYMER_GAS = "Ack Poly Gas";
const METRIC_CONFIRM_POLYMER_GAS = "Confirm Poly Gas";


function getGQClient() {
  return new GraphQLClient('https://index.sepolia.polymer.zone');
}

async function getStargateClient() {
  try {
    return await TmClient.getStargate();
  } catch (e) {
    return;
  }
}

program
  .command('packet <txHashOrN>')
  .description('Show packet metrics given a sent tx hash or for the last N sent transactions')
  .action(async (txHashOrN: string) => {
    try {
      const graphQLClient = getGQClient();

      const table = new Table({
        columns: [
          {name: METRIC_TX_HASH, alignment: "left", color: "blue"},
          {name: METRIC_STATE, alignment: "left", color: "blue"},
          {name: METRIC_CLIENT_TYPE, alignment: "left", color: "blue"},
          {name: METRIC_SEND_PACKET_L2_GAS, alignment: "right", color: "green"},
          {name: METRIC_SEND_TO_RECV_TIME, alignment: "right", color: "green"},
          {name: METRIC_RECV_PACKET_L2_GAS, alignment: "right", color: "green"},
          {name: METRIC_SEND_TO_RECV_PACKET_L2_GAS, alignment: "right", color: "green"},
          {name: METRIC_SEND_TO_ACK_TIME, alignment: "right", color: "green"},
          {name: METRIC_ACK_PACKET_L2_GAS, alignment: "right", color: "green"},
          {name: METRIC_SEND_TO_ACK_L2_GAS, alignment: "right", color: "green"},
          {name: METRIC_SEND_POLYMER_GAS, alignment: "right", color: "green"},
          {name: METRIC_WRITE_ACK_POLYMER_GAS, alignment: "right", color: "green"},
        ],
      });

      if (txHashOrN.startsWith('0x')) {
        await addPacketMetrics(graphQLClient, table, txHashOrN);
      } else {
        const n = parseInt(txHashOrN);
        if (isNaN(n)) {
          console.error('Invalid input. Please provide either a transaction hash or a number.');
          return;
        }
        const sendTxHashes = await getLastNSendTxHashes(graphQLClient, n);
        const progress = new ProgressBar('fetching packets [:bar] :current/:total', {
          total: sendTxHashes.length,
          width: 20
        });
        for (const txHash of sendTxHashes) {
          progress.tick();
          await addPacketMetrics(graphQLClient, table, txHash);
        }
      }

      table.printTable();

      const csvFilePath = 'packet_metrics.csv'; // Set the file path
      const csvData = generateCsvData(table); // Generate CSV data
      fs.writeFileSync(csvFilePath, csvData); // Write CSV data to file
    } catch (error) {
      console.error('Error fetching packet metrics:', error);
    }
  });

function generateCsvData(table: any): string {
  const columns = table.table.columns.map((column: any) => column.name);
  const rows = table.table.rows.map((row: any) => {
    return columns.map((column: any) => row.text[column]).join(',');
  });
  return [columns.join(','), ...rows].join('\n');
}
async function getChannelGas(
  stargateClient: StargateClient,
  channel: any,
  type: 'init' | 'try' | 'ack' | 'confirm'
): Promise<number | null> {
  const txs = await stargateClient.searchTx([
    { key: `channel_open_${type}.port_id`, value: channel.portId },
    { key: `channel_open_${type}.channel_id`, value: channel.channelId },
    { key: `channel_open_${type}.counterparty_port_id`, value: channel.counterpartyPortId },
  ]);

  if (txs.length > 1) {
    console.error(`\nMultiple txs found for ${type}ChannelId: ${channel.id}`);
    return null;
  }

  if (txs.length === 0) {
    if (channel.channelId) {
      console.error(`\nNo polymer txs found for ${type}ChannelId: ${channel.id}`);
    }
    return null;
  }

  return Number(txs[0]?.gasUsed);
}

async function addChannelMetrics(
  graphQLClient: GraphQLClient,
  table: Table,
  channelId: string
) {
  const res: any = await graphQLClient.request(GET_CHANNEL_BY_CHANNEL_ID, {limit: 1, channelIds: [channelId]});
  let channels = res.channels.items;

  if (channels.length === 0) {
    console.log(`No channel found for the open channel id: ${channelId}`);
    return;
  }

  const channel = channels[0];

  table.addRow({
    [METRIC_CHANNEL_NAME]: channel.channelId,
    [METRIC_STATE]: channel.state,
    [METRIC_CLIENT_TYPE]: channel.openInitChannel?.dispatcherType,
    [METRIC_INIT_L2_GAS]: channel.openInitChannel?.gas,
    [METRIC_TRY_L2_GAS]: channel.openTryChannel?.gas,
    [METRIC_ACK_L2_GAS]: channel.openAckChannel?.gas,
    [METRIC_CONFIRM_L2_GAS]: channel.openConfirmChannel?.gas,
    [METRIC_INIT_TO_TRY_TIME]: channel.initToTryTime,
    [METRIC_INIT_TO_ACK_TIME]: channel.initToAckTime,
    [METRIC_INIT_TO_CONFIRM_TIME]: channel.initToConfirmTime,
    [METRIC_INIT_POLYMER_GAS]: channel.openInitChannel?.polymerGas,
    [METRIC_TRY_POLYMER_GAS]: channel.openTryChannel?.polymerGas,
    [METRIC_ACK_POLYMER_GAS]: channel.openAckChannel?.polymerGas,
    [METRIC_CONFIRM_POLYMER_GAS]: channel.openConfirmChannel?.polymerGas
  });
}
async function getLastNChannelIds(graphQLClient: GraphQLClient, n: number) {
  const res: any = await graphQLClient.request(GET_CHANNELS, {limit: n});
  return res.openIbcChannels.items.map((item: any) => item.channelId);
}

async function getChannelById(graphQLClient: GraphQLClient, channel: string) {
  const res: any = await graphQLClient.request(GET_OPEN_CHANNEL_BY_CHANNEL_ID, {channelId: channel});
  return res.openIbcChannels.items.map((item: any) => item.channelId);
}

program
  .command('channel <channelName>')
  .description('Show channel metrics given a channel name')
  .action(async (channelNameOrN: string) => {
    const graphQLClient = getGQClient();

    const table = new Table({
      columns: [
        {name: METRIC_CHANNEL_NAME, alignment: "left", color: "blue"},
        {name: METRIC_STATE, alignment: "left", color: "blue"},
        {name: METRIC_CLIENT_TYPE, alignment: "left", color: "blue"},
        {name: METRIC_INIT_L2_GAS, alignment: "right", color: "green"},
        {name: METRIC_TRY_L2_GAS, alignment: "right", color: "green"},
        {name: METRIC_ACK_L2_GAS, alignment: "right", color: "green"},
        {name: METRIC_CONFIRM_L2_GAS, alignment: "right", color: "green"},
        {name: METRIC_INIT_TO_TRY_TIME, alignment: "right", color: "green"},
        {name: METRIC_INIT_TO_ACK_TIME, alignment: "right", color: "green"},
        {name: METRIC_INIT_TO_CONFIRM_TIME, alignment: "right", color: "green"},
        {name: METRIC_INIT_POLYMER_GAS, alignment: "right", color: "green"},
        {name: METRIC_TRY_POLYMER_GAS, alignment: "right", color: "green"},
        {name: METRIC_ACK_POLYMER_GAS, alignment: "right", color: "green"},
        {name: METRIC_CONFIRM_POLYMER_GAS, alignment: "right", color: "green"},
      ],
    });

    if (channelNameOrN.startsWith('channel-')) {
      const channelIds = await getChannelById(graphQLClient, channelNameOrN);
      for (const channelId of channelIds) {
        await addChannelMetrics(graphQLClient, table, channelId);
      }
    } else {
      const n = parseInt(channelNameOrN);
      if (isNaN(n)) {
        console.error('Invalid input. Please provide either a channel name or a number.');
        return;
      }
      const channelIds = await getLastNChannelIds(graphQLClient, n);
      const progress = new ProgressBar('fetching channels [:bar] :current/:total', {
        total: channelIds.length,
        width: 20
      });

      for (const channelId of channelIds) {
        progress.tick();
        await addChannelMetrics(graphQLClient, table, channelId);
      }
    }

    table.printTable();

    const csvFilePath = 'channel_metrics.csv';
    const csvData = generateCsvData(table);
    fs.writeFileSync(csvFilePath, csvData);
  });

async function addPacketMetrics(
  client: GraphQLClient,
  table: Table,
  txHash: string
) {
  const res: any = await client.request(GET_PACKET_BY_SENT_TX, {sentTxHash: [txHash]});
  let packets = res.packets.items;
  if (packets.length === 0) {
    console.log(`No packets found for the tx hash: ${txHash}`);
    return;
  }
  if (packets.length > 1) {
    console.log(`Multiple packets found for the tx hash: ${txHash}`);
    return;
  }

  const packet = packets[0];
  table.addRow({
    [METRIC_TX_HASH]: txHash,
    [METRIC_STATE]: packet.state,
    [METRIC_CLIENT_TYPE]: packet.sendPacket.dispatcherType,
    [METRIC_SEND_PACKET_L2_GAS]: packet.sendPacket.gas,
    [METRIC_SEND_TO_RECV_TIME]: packet.sendToRecvTime,
    [METRIC_RECV_PACKET_L2_GAS]: packet.recvPacket?.gas,
    [METRIC_SEND_TO_RECV_PACKET_L2_GAS]: packet.sendToRecvGas,
    [METRIC_SEND_TO_ACK_TIME]: packet.sendToAckTime,
    [METRIC_ACK_PACKET_L2_GAS]: packet.ackPacket?.gas,
    [METRIC_SEND_TO_ACK_L2_GAS]: packet.sendToAckGas,
    [METRIC_SEND_POLYMER_GAS]: packet.sendPacket.polymerGas,
    [METRIC_WRITE_ACK_POLYMER_GAS]: packet.writeAckPacket?.polymerGas
  });
}

async function getSendPacketGas(stargateClient: StargateClient, sendPacket: any): Promise<number | null> {
  let txs = await stargateClient.searchTx([
    {
      key: "send_packet.packet_sequence",
      value: sendPacket.sequence
    },
    {
      key: "send_packet.packet_src_port",
      value: `polyibc.${sendPacket.dispatcherClientName}.${sendPacket.sourcePortAddress.slice(2)}`,
    },
    {
      key: "send_packet.packet_src_channel",
      value: sendPacket.sourceChannelId
    }
  ]);

  if (txs.length > 1) {
    console.error(`Multiple txs found for sendPacketId: ${sendPacket.id}`);
    return null;
  }

  if (txs.length == 0) {
    console.error(`\nNo polymer txs found for sendPacketId: ${sendPacket.id}`);
    return null;
  }

  return Number(txs[0]!.gasUsed);
}

async function getWriteAckPacketGas(stargateClient: StargateClient, writeAckPacket: any): Promise<number | null> {
  let txs = await stargateClient.searchTx([
    {
      key: "write_acknowledgement.packet_sequence",
      value: writeAckPacket.sequence
    },
    {
      key: "write_acknowledgement.packet_dst_port",
      value: `polyibc.${writeAckPacket.dispatcherClientName}.${writeAckPacket.writerPortAddress.slice(2)}`
    },
    {
      key: "write_acknowledgement.packet_dst_channel",
      value: writeAckPacket.writerChannelId
    }
  ]);

  if (txs.length > 1) {
    console.error(`Multiple txs found for recvPacketId: ${writeAckPacket.id}`);
    return null;
  }

  if (txs.length == 0) {
    console.error(`\nNo polymer txs found for recvPacketId: ${writeAckPacket.id}`);
    return null;
  }

  return Number(txs[0]!.gasUsed);
}

async function getLastNSendTxHashes(graphQLClient: GraphQLClient, n: number): Promise<string[]> {
  const res: any = await graphQLClient.request(GET_SEND_PACKETS, {limit: n});
  return res.sendPackets.items.map((item: any) => item.transactionHash);
}

program.parse(process.argv);
