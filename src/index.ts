import { ponder } from "@/generated";

ponder.on("DispatcherSim:Acknowledgement", async ({event, context}) => {
  await context.db.Acknowledgement.create({
    id: event.log.id,
    data: {
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: event.args.sourceChannelId,
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherSim:CloseIbcChannel", async ({event, context}) => {
  await context.db.CloseIbcChannel.create({
    id: event.log.id,
    data: {
      portAddress: event.args.portAddress,
      channelId: event.args.channelId,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherSim:ConnectIbcChannel", async ({event, context}) => {
  await context.db.ConnectIbcChannel.create({
    id: event.log.id,
    data: {
      portAddress: event.args.portAddress,
      channelId: event.args.channelId,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherSim:OpenIbcChannel", async ({event, context}) => {
  await context.db.OpenIbcChannel.create({
    id: event.log.id,
    data: {
      portAddress: event.args.portAddress,
      version: event.args.version,
      ordering: event.args.ordering,
      feeEnabled: event.args.feeEnabled,
      // @ts-ignore
      connectionHops: event.args.connectionHops,
      counterpartyPortId: event.args.counterpartyPortId,
      counterpartyChannelId: event.args.counterpartyChannelId,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherSim:OwnershipTransferred", async ({event, context}) => {
  await context.db.OwnershipTransferred.create({
    id: event.log.id,
    data: {
      previousOwner: event.args.previousOwner,
      newOwner: event.args.newOwner,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherSim:RecvPacket", async ({event, context}) => {
  await context.db.RecvPacket.create({
    id: event.log.id,
    data: {
      destPortAddress: event.args.destPortAddress,
      destChannelId: event.args.destChannelId,
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherSim:SendPacket", async ({event, context}) => {
  await context.db.SendPacket.create({
    id: event.log.id,
    data: {
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: event.args.sourceChannelId,
      packet: event.args.packet,
      sequence: event.args.sequence,
      timeoutTimestamp: event.args.timeoutTimestamp,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherSim:Timeout", async ({event, context}) => {
  await context.db.Timeout.create({
    id: event.log.id,
    data: {
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: event.args.sourceChannelId,
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherSim:WriteAckPacket", async ({event, context}) => {
  await context.db.WriteAckPacket.create({
    id: event.log.id,
    data: {
      writerPortAddress: event.args.writerPortAddress,
      writerChannelId: event.args.writerChannelId,
      sequence: event.args.sequence,
      ackPacketSuccess: event.args.ackPacket.success,
      ackPacketData: event.args.ackPacket.data,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherSim:WriteTimeoutPacket", async ({event, context}) => {
  await context.db.WriteTimeoutPacket.create({
    id: event.log.id,
    data: {
      writerPortAddress: event.args.writerPortAddress,
      writerChannelId: event.args.writerChannelId,
      sequence: event.args.sequence,
      timeoutHeightRevisionNumber: event.args.timeoutHeight.revision_number,
      timeoutHeightRevisionHeight: event.args.timeoutHeight.revision_height,
      timeoutTimestamp: event.args.timeoutTimestamp,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});


ponder.on("DispatcherProof:Acknowledgement", async ({event, context}) => {
  await context.db.Acknowledgement.create({
    id: event.log.id,
    data: {
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: event.args.sourceChannelId,
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherProof:CloseIbcChannel", async ({event, context}) => {
  await context.db.CloseIbcChannel.create({
    id: event.log.id,
    data: {
      portAddress: event.args.portAddress,
      channelId: event.args.channelId,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherProof:ConnectIbcChannel", async ({event, context}) => {
  await context.db.ConnectIbcChannel.create({
    id: event.log.id,
    data: {
      portAddress: event.args.portAddress,
      channelId: event.args.channelId,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherProof:OpenIbcChannel", async ({event, context}) => {
  await context.db.OpenIbcChannel.create({
    id: event.log.id,
    data: {
      portAddress: event.args.portAddress,
      version: event.args.version,
      ordering: event.args.ordering,
      feeEnabled: event.args.feeEnabled,
      // @ts-ignore
      connectionHops: event.args.connectionHops,
      counterpartyPortId: event.args.counterpartyPortId,
      counterpartyChannelId: event.args.counterpartyChannelId,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherProof:OwnershipTransferred", async ({event, context}) => {
  await context.db.OwnershipTransferred.create({
    id: event.log.id,
    data: {
      previousOwner: event.args.previousOwner,
      newOwner: event.args.newOwner,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherProof:RecvPacket", async ({event, context}) => {
  await context.db.RecvPacket.create({
    id: event.log.id,
    data: {
      destPortAddress: event.args.destPortAddress,
      destChannelId: event.args.destChannelId,
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherProof:SendPacket", async ({event, context}) => {
  await context.db.SendPacket.create({
    id: event.log.id,
    data: {
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: event.args.sourceChannelId,
      packet: event.args.packet,
      sequence: event.args.sequence,
      timeoutTimestamp: event.args.timeoutTimestamp,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherProof:Timeout", async ({event, context}) => {
  await context.db.Timeout.create({
    id: event.log.id,
    data: {
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: event.args.sourceChannelId,
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherProof:WriteAckPacket", async ({event, context}) => {
  await context.db.WriteAckPacket.create({
    id: event.log.id,
    data: {
      writerPortAddress: event.args.writerPortAddress,
      writerChannelId: event.args.writerChannelId,
      sequence: event.args.sequence,
      ackPacketSuccess: event.args.ackPacket.success,
      ackPacketData: event.args.ackPacket.data,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});

ponder.on("DispatcherProof:WriteTimeoutPacket", async ({event, context}) => {
  await context.db.WriteTimeoutPacket.create({
    id: event.log.id,
    data: {
      writerPortAddress: event.args.writerPortAddress,
      writerChannelId: event.args.writerChannelId,
      sequence: event.args.sequence,
      timeoutHeightRevisionNumber: event.args.timeoutHeight.revision_number,
      timeoutHeightRevisionHeight: event.args.timeoutHeight.revision_height,
      timeoutTimestamp: event.args.timeoutTimestamp,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });
});
