import { TypeormDatabase } from '@subsquid/typeorm-store'
import { processor, DISPATCHERS } from './processor'
import { handler } from '../utils/handlers'

processor.run(new TypeormDatabase({
    supportHotBlocks: true,
    stateSchema: 'optimism_processor'}),
async (ctx) => {
    handler(ctx, DISPATCHERS)
})
