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