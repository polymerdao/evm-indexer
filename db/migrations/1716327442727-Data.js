module.exports = class Data1716327442727 {
    name = 'Data1716327442727'

    async up(db) {
        await db.query(`ALTER TABLE "channel_open_init" ADD "polymer_tx_hash" text`)
        await db.query(`ALTER TABLE "channel_open_init" ADD "polymer_gas" integer`)
        await db.query(`ALTER TABLE "channel_open_init" ADD "polymer_block_number" numeric`)
        await db.query(`ALTER TABLE "channel_open_try" ADD "polymer_tx_hash" text`)
        await db.query(`ALTER TABLE "channel_open_try" ADD "polymer_gas" integer`)
        await db.query(`ALTER TABLE "channel_open_try" ADD "polymer_block_number" numeric`)
        await db.query(`ALTER TABLE "channel_open_ack" ADD "polymer_tx_hash" text`)
        await db.query(`ALTER TABLE "channel_open_ack" ADD "polymer_gas" integer`)
        await db.query(`ALTER TABLE "channel_open_ack" ADD "polymer_block_number" numeric`)
        await db.query(`ALTER TABLE "channel_open_confirm" ADD "polymer_tx_hash" text`)
        await db.query(`ALTER TABLE "channel_open_confirm" ADD "polymer_gas" integer`)
        await db.query(`ALTER TABLE "channel_open_confirm" ADD "polymer_block_number" numeric`)
        await db.query(`ALTER TABLE "close_ibc_channel" ADD "polymer_tx_hash" text`)
        await db.query(`ALTER TABLE "close_ibc_channel" ADD "polymer_gas" integer`)
        await db.query(`ALTER TABLE "close_ibc_channel" ADD "polymer_block_number" numeric`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "channel_open_init" DROP COLUMN "polymer_tx_hash"`)
        await db.query(`ALTER TABLE "channel_open_init" DROP COLUMN "polymer_gas"`)
        await db.query(`ALTER TABLE "channel_open_init" DROP COLUMN "polymer_block_number"`)
        await db.query(`ALTER TABLE "channel_open_try" DROP COLUMN "polymer_tx_hash"`)
        await db.query(`ALTER TABLE "channel_open_try" DROP COLUMN "polymer_gas"`)
        await db.query(`ALTER TABLE "channel_open_try" DROP COLUMN "polymer_block_number"`)
        await db.query(`ALTER TABLE "channel_open_ack" DROP COLUMN "polymer_tx_hash"`)
        await db.query(`ALTER TABLE "channel_open_ack" DROP COLUMN "polymer_gas"`)
        await db.query(`ALTER TABLE "channel_open_ack" DROP COLUMN "polymer_block_number"`)
        await db.query(`ALTER TABLE "channel_open_confirm" DROP COLUMN "polymer_tx_hash"`)
        await db.query(`ALTER TABLE "channel_open_confirm" DROP COLUMN "polymer_gas"`)
        await db.query(`ALTER TABLE "channel_open_confirm" DROP COLUMN "polymer_block_number"`)
        await db.query(`ALTER TABLE "close_ibc_channel" DROP COLUMN "polymer_tx_hash"`)
        await db.query(`ALTER TABLE "close_ibc_channel" DROP COLUMN "polymer_gas"`)
        await db.query(`ALTER TABLE "close_ibc_channel" DROP COLUMN "polymer_block_number"`)
    }
}
