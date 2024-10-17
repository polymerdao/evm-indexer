import * as dispatcher from "../abi/dispatcher";
import * as uch from "../abi/uch";
import * as fee from "../abi/fee";

export let topics = [
  // Packets
  dispatcher.events.SendPacket.topic,
  dispatcher.events.RecvPacket.topic,
  dispatcher.events.WriteAckPacket.topic,
  dispatcher.events.Acknowledgement.topic,
  dispatcher.events.Timeout.topic,
  dispatcher.events.WriteTimeoutPacket.topic,

  // Channels
  dispatcher.events.ChannelOpenInit.topic,
  dispatcher.events.ChannelOpenTry.topic,
  dispatcher.events.ChannelOpenAck.topic,
  dispatcher.events.ChannelOpenConfirm.topic,
  dispatcher.events.ChannelCloseInit.topic,
  dispatcher.events.ChannelCloseConfirm.topic,

  // UCH
  uch.events.UCHPacketSent.topic,

  // Fee Vault
  fee.events.OpenChannelFeeDeposited.topic,
  fee.events.SendPacketFeeDeposited.topic,
];
