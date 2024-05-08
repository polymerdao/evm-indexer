import * as dispatcher from "../abi/dispatcher";

export let topics = [
  // dispatcherAbi.events.OpenIbcChannel.topic,
  // dispatcherAbi.events.ConnectIbcChannel.topic,
  dispatcher.events.CloseIbcChannel.topic,
  dispatcher.events.SendPacket.topic,
  dispatcher.events.RecvPacket.topic,
  dispatcher.events.WriteAckPacket.topic,
  dispatcher.events.WriteTimeoutPacket.topic,
  dispatcher.events.Timeout.topic,
  dispatcher.events.Acknowledgement.topic,
];
