import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Acknowledgement: p.createTable({
    id: p.string(),
    dispatcherAddress: p.string(),
    dispatcherType: p.string(),
    dispatcherClientName: p.string(),
    sourcePortAddress: p.string(),
    sourceChannelId: p.string(),
    sequence: p.bigint(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    chainId: p.int(),
    gas: p.int(),
    maxFeePerGas: p.bigint().optional(),
    maxPriorityFeePerGas: p.bigint().optional(),
    from: p.string(),
  }),
  CloseIbcChannel: p.createTable({
    id: p.string(),
    dispatcherAddress: p.string(),
    dispatcherType: p.string(),
    dispatcherClientName: p.string(),
    portAddress: p.string(),
    channelId: p.string(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    chainId: p.int(),
    gas: p.int(),
    maxFeePerGas: p.bigint().optional(),
    maxPriorityFeePerGas: p.bigint().optional(),
    from: p.string(),
    polymerTxHash: p.string().optional(),
    polymerGas: p.int().optional(),
    polymerBlockNumber: p.bigint().optional(),
  }),
  ConnectIbcChannel: p.createTable({
    id: p.string(),
    dispatcherAddress: p.string(),
    dispatcherType: p.string(),
    dispatcherClientName: p.string(),
    portAddress: p.string(),
    channelId: p.string(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    chainId: p.int(),
    gas: p.int(),
    maxFeePerGas: p.bigint().optional(),
    maxPriorityFeePerGas: p.bigint().optional(),
    from: p.string(),
    polymerTxHash: p.string().optional(),
    polymerGas: p.int().optional(),
    polymerBlockNumber: p.bigint().optional(),
  }),
  OpenIbcChannel: p.createTable({
    id: p.string(),
    dispatcherAddress: p.string(),
    dispatcherType: p.string(),
    dispatcherClientName: p.string(),
    portId: p.string(),
    portAddress: p.string(),
    version: p.string(),
    ordering: p.int(),
    feeEnabled: p.boolean(),
    connectionHops: p.string().list(),
    counterpartyPortId: p.string(),
    counterpartyChannelId: p.string(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    chainId: p.int(),
    gas: p.int(),
    maxFeePerGas: p.bigint().optional(),
    maxPriorityFeePerGas: p.bigint().optional(),
    from: p.string(),
    polymerTxHash: p.string().optional(),
    polymerGas: p.int().optional(),
    polymerBlockNumber: p.bigint().optional(),
  }),
  RecvPacket: p.createTable({
    id: p.string(),
    dispatcherAddress: p.string(),
    dispatcherType: p.string(),
    destPortAddress: p.string(),
    dispatcherClientName: p.string(),
    destChannelId: p.string(),
    sequence: p.bigint(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    chainId: p.int(),
    gas: p.int(),
    maxFeePerGas: p.bigint().optional(),
    maxPriorityFeePerGas: p.bigint().optional(),
    from: p.string(),
  }),
  SendPacket: p.createTable({
    id: p.string(),
    dispatcherAddress: p.string(),
    dispatcherType: p.string(),
    sourcePortAddress: p.string(),
    dispatcherClientName: p.string(),
    sourceChannelId: p.string(),
    packet: p.string(),
    sequence: p.bigint(),
    timeoutTimestamp: p.bigint(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    chainId: p.int(),
    gas: p.int(),
    maxFeePerGas: p.bigint().optional(),
    maxPriorityFeePerGas: p.bigint().optional(),
    from: p.string(),
    polymerTxHash: p.string().optional(),
    polymerGas: p.int().optional(),
    polymerBlockNumber: p.bigint().optional(),
  }),
  Timeout: p.createTable({
    id: p.string(),
    dispatcherAddress: p.string(),
    dispatcherType: p.string(),
    dispatcherClientName: p.string(),
    sourcePortAddress: p.string(),
    sourceChannelId: p.string(),
    sequence: p.bigint(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    chainId: p.int(),
    gas: p.int(),
    maxFeePerGas: p.bigint().optional(),
    maxPriorityFeePerGas: p.bigint().optional(),
    from: p.string(),
  }),
  WriteAckPacket: p.createTable({
    id: p.string(),
    dispatcherAddress: p.string(),
    dispatcherType: p.string(),
    dispatcherClientName: p.string(),
    writerPortAddress: p.string(),
    writerChannelId: p.string(),
    sequence: p.bigint(),
    ackPacketSuccess: p.boolean(),
    ackPacketData: p.string(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    chainId: p.int(),
    gas: p.int(),
    maxFeePerGas: p.bigint().optional(),
    maxPriorityFeePerGas: p.bigint().optional(),
    from: p.string(),
    polymerTxHash: p.string().optional(),
    polymerGas: p.int().optional(),
    polymerBlockNumber: p.bigint().optional(),
  }),
  WriteTimeoutPacket: p.createTable({
    id: p.string(),
    dispatcherAddress: p.string(),
    dispatcherType: p.string(),
    dispatcherClientName: p.string(),
    writerPortAddress: p.string(),
    writerChannelId: p.string(),
    sequence: p.bigint(),
    timeoutHeightRevisionNumber: p.bigint(),
    timeoutHeightRevisionHeight: p.bigint(),
    timeoutTimestamp: p.bigint(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    chainId: p.int(),
    gas: p.int(),
    maxFeePerGas: p.bigint().optional(),
    maxPriorityFeePerGas: p.bigint().optional(),
    from: p.string(),
  }),
  PacketStates: p.createEnum(["SENT", "RECV", "WRITE_ACK", "ACK", "TIMEOUT", "WRITE_TIMEOUT"]),
  Packet: p.createTable({
    id: p.string(),
    state: p.enum('PacketStates'),
    sendPacketId: p.string().optional().references('SendPacket.id'),
    sendPacket: p.one('sendPacketId'),
    sendTx: p.string().optional(),
    recvPacketId: p.string().optional().references('RecvPacket.id'),
    recvPacket: p.one('recvPacketId'),
    recvTx: p.string().optional(),
    sendToRecvTime: p.int().optional(),
    sendToRecvGas: p.int().optional(),
    writeAckPacketId: p.string().optional().references('WriteAckPacket.id'),
    writeAckPacket: p.one('writeAckPacketId'),
    writeAckTx: p.string().optional(),
    ackPacketId: p.string().optional().references('Acknowledgement.id'),
    ackPacket: p.one('ackPacketId'),
    ackTx: p.string().optional(),
    sendToAckTime: p.int().optional(),
    sendToAckGas: p.int().optional(),
    sendToRecvPolymerGas: p.int().optional(),
    sendToAckPolymerGas: p.int().optional(),
  }),
  ChannelStates: p.createEnum(["INIT", "TRY", "OPEN", "CLOSED"]),
  Channel: p.createTable({
    id: p.string(),
    channelId: p.string(),
    portId: p.string(),
    counterpartyPortId: p.string(),
    counterpartyChannelId: p.string(),
    connectionHops: p.string().list(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),
    state: p.enum('ChannelStates'),
    openInitChannel: p.one('openInitChannelId'),
    openInitChannelId: p.string().optional().references('OpenIbcChannel.id'),
    openTryChannel: p.one('openTryChannelId'),
    openTryChannelId: p.string().optional().references('OpenIbcChannel.id'),
    openAckChannel: p.one('openAckChannelId'),
    openAckChannelId: p.string().optional().references('ConnectIbcChannel.id'),
    openConfirmChannel: p.one('openConfirmChannelId'),
    openConfirmChannelId: p.string().optional().references('ConnectIbcChannel.id'),
    closeChannel: p.one('closeChannelId'),
    closeChannelId: p.string().optional().references('CloseIbcChannel.id'),
    initToTryTime: p.int().optional(),
    initToOpenTime: p.int().optional(),
    initToAckTime: p.int().optional(),
    initToConfirmTime: p.int().optional(),
  }),
  Stat: p.createTable({
    id: p.string(),
    val: p.int(),
  }),
}));