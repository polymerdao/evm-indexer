import { runProcessor } from '../utils/ibc-processor'
import { handler } from "../handlers/backfill";

runProcessor('backfill', handler)