import { runProcessor } from "../utils/ibc-processor";
import { handler } from "../handlers";

runProcessor('optimism', handler)
