import * as dispatcher from "../abi/dispatcher";

export let topics = [
  dispatcher.events.SendPacket.topic,
  dispatcher.events.RecvPacket.topic,
  dispatcher.events.WriteAckPacket.topic,
  dispatcher.events.Acknowledgement.topic,
  dispatcher.events.Timeout.topic,
  dispatcher.events.WriteTimeoutPacket.topic,
  dispatcher.events.CloseIbcChannel.topic,
];
