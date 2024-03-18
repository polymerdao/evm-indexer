import { ponder } from "@/generated";
import { ethers } from "ethers";

ponder.on("DispatcherSim:Acknowledgement", async ({event, context}) => {
  const { address } = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;

  await context.db.Acknowledgement.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "sim",
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: ethers.decodeBytes32String(event.args.sourceChannelId),
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherSim:CloseIbcChannel", async ({event, context}) => {
  const { address } = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;

  await context.db.CloseIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "sim",
      portAddress: event.args.portAddress,
      channelId: ethers.decodeBytes32String(event.args.channelId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherSim:ConnectIbcChannel", async ({event, context}) => {
  const { address } = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;

  await context.db.ConnectIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "sim",
      portAddress: event.args.portAddress,
      channelId: ethers.decodeBytes32String(event.args.channelId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherSim:OpenIbcChannel", async ({event, context}) => {
  const { address } = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;

  await context.db.OpenIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "sim",
      portAddress: event.args.portAddress,
      version: event.args.version,
      ordering: event.args.ordering,
      feeEnabled: event.args.feeEnabled,
      // @ts-ignore
      connectionHops: event.args.connectionHops,
      counterpartyPortId: event.args.counterpartyPortId,
      counterpartyChannelId: ethers.decodeBytes32String(event.args.counterpartyChannelId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherSim:OwnershipTransferred", async ({event, context}) => {
  const { address } = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;

  await context.db.OwnershipTransferred.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "sim",
      previousOwner: event.args.previousOwner,
      newOwner: event.args.newOwner,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherSim:RecvPacket", async ({event, context}) => {
  const { address } = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;

  await context.db.RecvPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "sim",
      destPortAddress: event.args.destPortAddress,
      destChannelId: ethers.decodeBytes32String(event.args.destChannelId),
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherSim:SendPacket", async ({event, context}) => {
  const { address } = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;

  await context.db.SendPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "sim",
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: ethers.decodeBytes32String(event.args.sourceChannelId),
      packet: event.args.packet,
      sequence: event.args.sequence,
      timeoutTimestamp: event.args.timeoutTimestamp,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherSim:Timeout", async ({event, context}) => {
  const { address } = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;

  await context.db.Timeout.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "sim",
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: ethers.decodeBytes32String(event.args.sourceChannelId),
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherSim:WriteAckPacket", async ({event, context}) => {
  const { address } = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;

  await context.db.WriteAckPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "sim",
      writerPortAddress: event.args.writerPortAddress,
      writerChannelId: ethers.decodeBytes32String(event.args.writerChannelId),
      sequence: event.args.sequence,
      ackPacketSuccess: event.args.ackPacket.success,
      ackPacketData: event.args.ackPacket.data,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherSim:WriteTimeoutPacket", async ({event, context}) => {
  const { address } = context.contracts.DispatcherSim;
  const chainId = context.network.chainId;

  await context.db.WriteTimeoutPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "sim",
      writerPortAddress: event.args.writerPortAddress,
      writerChannelId: ethers.decodeBytes32String(event.args.writerChannelId),
      sequence: event.args.sequence,
      timeoutHeightRevisionNumber: event.args.timeoutHeight.revision_number,
      timeoutHeightRevisionHeight: event.args.timeoutHeight.revision_height,
      timeoutTimestamp: event.args.timeoutTimestamp,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});


ponder.on("DispatcherProof:Acknowledgement", async ({event, context}) => {
  const { address } = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;

  await context.db.Acknowledgement.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "proof",
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: ethers.decodeBytes32String(event.args.sourceChannelId),
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherProof:CloseIbcChannel", async ({event, context}) => {
  const { address } = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;

  await context.db.CloseIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "proof",
      portAddress: event.args.portAddress,
      channelId: ethers.decodeBytes32String(event.args.channelId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherProof:ConnectIbcChannel", async ({event, context}) => {
  const { address } = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;

  await context.db.ConnectIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "proof",
      portAddress: event.args.portAddress,
      channelId: ethers.decodeBytes32String(event.args.channelId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherProof:OpenIbcChannel", async ({event, context}) => {
  const { address } = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;

  await context.db.OpenIbcChannel.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "proof",
      portAddress: event.args.portAddress,
      version: event.args.version,
      ordering: event.args.ordering,
      feeEnabled: event.args.feeEnabled,
      // @ts-ignore
      connectionHops: event.args.connectionHops,
      counterpartyPortId: event.args.counterpartyPortId,
      counterpartyChannelId: ethers.decodeBytes32String(event.args.counterpartyChannelId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherProof:OwnershipTransferred", async ({event, context}) => {
  const { address } = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;

  await context.db.OwnershipTransferred.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "proof",
      previousOwner: event.args.previousOwner,
      newOwner: event.args.newOwner,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherProof:RecvPacket", async ({event, context}) => {
  const { address } = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;

  await context.db.RecvPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "proof",
      destPortAddress: event.args.destPortAddress,
      destChannelId: ethers.decodeBytes32String(event.args.destChannelId),
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherProof:SendPacket", async ({event, context}) => {
  const { address } = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;

  await context.db.SendPacket.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "proof",
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: ethers.decodeBytes32String(event.args.sourceChannelId),
      packet: event.args.packet,
      sequence: event.args.sequence,
      timeoutTimestamp: event.args.timeoutTimestamp,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherProof:Timeout", async ({event, context}) => {
  const { address } = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;

  await context.db.Timeout.create({
    id: event.log.id,
    data: {
      dispatcherAddress: address || "",
      dispatcherType: "proof",
      sourcePortAddress: event.args.sourcePortAddress,
      sourceChannelId: ethers.decodeBytes32String(event.args.sourceChannelId),
      sequence: event.args.sequence,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      chainId: chainId,
    }
  });
});

ponder.on("DispatcherProof:WriteTimeoutPacket", async ({event, context}) => {
  const { address } = context.contracts.DispatcherProof;
  const chainId = context.network.chainId;

  await context.db.WriteTimeoutPacket.create({
    id: event.log.id,
    data: {
      chainId: chainId,
      dispatcherAddress: address || "",
      dispatcherType: "proof",
      writerPortAddress: event.args.writerPortAddress,
      writerChannelId: ethers.decodeBytes32String(event.args.writerChannelId),
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