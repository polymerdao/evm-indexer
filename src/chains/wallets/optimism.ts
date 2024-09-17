import { runProcessor } from '../../utils/ibc-processor'
import { handler } from "../../handlers/wallets";

runProcessor('op_txs', handler)

