import { runProcessor } from "../utils/ibc-processor";
import { handler } from "../handlers";

runProcessor('base', handler)
