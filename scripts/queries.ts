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
        sendToRecvGas
        sendToAckGas      
        sendToRecvTime
        sendToAckTime
        sendToRecvPolymerGas
        sendToAckPolymerGas        
        sendPacket {
          id
          sequence
          sourcePortAddress
          sourceChannelId
          dispatcherClientName
          blockTimestamp
          gas
          dispatcherType
          polymerGas
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
          polymerGas
        }
        ackPacket {
          id
          sequence
          blockTimestamp
          gas
          polymerGas
        }
      }
    }
  }
`;

export const GET_CHANNELS = `
query Channels($limit: Int!) {
  openIbcChannels(orderDirection: "desc", limit: $limit, orderBy: "blockTimestamp", where: {channelId_not: ""}) {
    items {
      id
      channelId
    }
  }
}
`

export const GET_CHANNEL_BY_CHANNEL_ID = `
query Channels($channelIds: [String!]!) {
  channels(
    orderDirection: "desc"
    limit: 100
    orderBy: "blockTimestamp"
    where: {channelId_in: $channelIds}
  ) {
    items {
      blockTimestamp
      state
      channelId
      portId
      counterpartyChannelId
      counterpartyPortId
      state
      initToTryTime
      initToTryPolymerGas
      initToAckPolymerGas
      initToConfirmPolymerGas
      initToAckTime
      initToConfirmTime
      openInitChannel {
        blockTimestamp
        dispatcherType
        gas
        portId
        channelId
        counterpartyPortId
        counterpartyChannelId
        polymerGas
      }
      openTryChannel {
        blockTimestamp
        gas
        portId
        channelId
        counterpartyPortId
        counterpartyChannelId
        polymerGas
      }
      openAckChannel {
        blockTimestamp
        gas
        portId
        channelId
        counterpartyPortId
        counterpartyChannelId
        polymerGas
      }
      openConfirmChannel {
        blockTimestamp
        gas
        portId
        channelId
        counterpartyPortId
        counterpartyChannelId
        polymerGas
      }
    }
  }
}
`

export const GET_OPEN_CHANNEL_BY_CHANNEL_ID = `
query InitChannels($channelId: String!) {
  openIbcChannels(
    where: {channelId: $channelId}
  ) {
    items {
      id
      channelId
    }
  }
}
`