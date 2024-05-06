import { TypeormDatabase } from '@subsquid/typeorm-store'
import { SendPacket } from '../model'
import * as Dispatcher from '../abi/dispatcher'
import {processor, BSC_USDC_ADDRESS} from './processor'

processor.run(new TypeormDatabase({supportHotBlocks: true, stateSchema: 'bsc_processor'}), async (ctx) => {
    const transfers: SendPacket[] = []
    for (let c of ctx.blocks) {
        for (let log of c.logs) {
            if (log.address !== BSC_USDC_ADDRESS || log.topics[0] !== Dispatcher.events.SendPacket.topic) continue
            let {} = Dispatcher.events.SendPacket.decode(log)
            transfers.push(
                new SendPacket({
                    id: log.id
                })
            )
        }
    }
    await ctx.store.upsert(transfers)
})
