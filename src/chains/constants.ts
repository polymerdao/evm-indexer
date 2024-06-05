export const VERSION = process.env.VERSION ?? '1';
export const MAX_BATCH_CALL_SIZE = Number(process.env.MAX_BATCH_CALL_SIZE ?? "100")
export const CATCHUP_BATCH_SIZE = Number(process.env.CATCHUP_BATCH_SIZE ?? "10")
export const ENABLE_CATCHUP = process.env.ENABLE_CATCHUP === 'true'