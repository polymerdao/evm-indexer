export const GET_SEND_PACKETS = `
  query getLastNPackets($limit: Int!) {
    sendPackets(orderDirection: "desc", orderBy: "blockTimestamp", limit: $limit) {
      items {
        transactionHash
      }
    }
  }
`;

export const GET_PACKET_BY_SENT_TX = `
  query getPacketBySentTx($sentTxHash: [String!]!) {
    packets(where: {sendTx_in: $sentTxHash}) {
    items {
        id
        state
        sendPacket {
          id
          sequence
          sourcePortAddress
          sourceChannelId
          dispatcherClientName
          blockTimestamp
          gas
        }
        recvPacket {
          id
          sequence
          destPortAddress
          destChannelId
          dispatcherClientName
          blockTimestamp
          gas
        }
        writeAckPacket {
          id
          sequence
          writerPortAddress
          writerChannelId
          dispatcherClientName
          blockTimestamp
          gas
        }
        ackPacket {
          id
          sequence
          blockTimestamp
          gas
        }
      }
    }
  }
`;

export const GET_CHANNELS = `
query Channels($limit: Int!) {
  openIbcChannels(orderDirection: "desc", limit: $limit, orderBy: "blockTimestamp", where: {counterpartyChannelId: ""}) {
    items {
      id
      blockTimestamp
      portId      
      counterpartyPortId
    }
  }
}
`

export const GET_CHANNEL_BY_CHANNEL_ID = `
query Channels($openChannelIds: [String!]!) {
  channels(
    orderDirection: "desc"
    limit: 100
    orderBy: "blockTimestamp"
    where: {openInitChannelId_in: $openChannelIds}
  ) {
    items {
      blockTimestamp
      state
      channelId
      portId
      counterpartyChannelId
      counterpartyPortId
      state
      openInitChannel {
        blockTimestamp
        gas
      }
      openTryChannel {
        blockTimestamp
        gas
      }
      openAckChannel {
        blockTimestamp
        gas
      }
      openConfirmChannel {
        blockTimestamp
        gas
      }
    }
  }
}
`
