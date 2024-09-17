import { runProcessor } from '../../utils/ibc-processor'
import { handler } from "../../handlers/wallets";

runProcessor('base_txs', handler)
