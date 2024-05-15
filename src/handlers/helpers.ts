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