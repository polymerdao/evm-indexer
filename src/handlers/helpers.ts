import { ethers } from 'ethers';
import { logger } from '../utils/logger';

export function getDispatcherType(portPrefix: string) {
  let clientName = portPrefix.split(".")[1];
  if (clientName.includes("sim")) {
    return "sim"
  } else if (clientName.includes("proof")) {
    return "proof"
  } else {
    return clientName
  }
}

export function getDispatcherClientName(portPrefix: string) {
  return portPrefix.split(".")[1];
}

export function packetToSender(packetData: Uint8Array): string {
  const hexString = ethers.hexlify(packetData);

  if (hexString.length < 66) {
    logger.debug(`Invalid packet data: ${hexString}`);
    return '';
  }

  const paddedAddress = hexString.slice(0, 66);
  const address = '0x' + paddedAddress.slice(-40);

  if (!ethers.isAddress(address)) {
    logger.error(`Invalid packet sender: ${address}`);
    return '';
  }

  return address;
}