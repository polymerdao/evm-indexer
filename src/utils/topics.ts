import * as dispatcher from "../abi/dispatcher";

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
  dispatcher.events.CloseIbcChannel.topic
];
