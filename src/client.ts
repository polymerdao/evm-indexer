import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { IbcExtension, QueryClient, setupIbcExtension, StargateClient } from '@cosmjs/stargate';

export class TmClient {
  private static instance: Promise<QueryClient & IbcExtension> | null = null;
  private static stargate: Promise<StargateClient> | null = null;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static async getInstance(): Promise<QueryClient & IbcExtension> {
    if (!TmClient.instance) {
      TmClient.instance = TmClient.createInstance();
    }
    return TmClient.instance;
  }

  public static async getStargate(): Promise<StargateClient> {
    if (!TmClient.stargate) {
      TmClient.stargate = StargateClient.connect(process.env.API_URL ?? "http://localhost:26657");
    }
    return TmClient.stargate;
  }

  private static async createInstance(): Promise<QueryClient & IbcExtension> {
    const tmClient = await Tendermint37Client.connect(process.env.API_URL!);
    return QueryClient.withExtensions(tmClient, setupIbcExtension);
  }
}