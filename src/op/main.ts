import { TypeormDatabase } from '@subsquid/typeorm-store'
import { processor, DISPATCHERS } from './processor'
import { handleEvent } from '../handlers/handlers'

processor.run(new TypeormDatabase({
  supportHotBlocks: true,
  stateSchema: 'op_processor'}), 
  async (ctx) => {
    handleEvent(ctx, DISPATCHERS)
})
