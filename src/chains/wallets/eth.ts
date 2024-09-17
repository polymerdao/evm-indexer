import { runProcessor } from '../../utils/ibc-processor'
import { handler } from "../../handlers/wallets";

runProcessor('eth_txs', handler)