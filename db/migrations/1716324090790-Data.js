module.exports = class Data1716324090790 {
    name = 'Data1716324090790'

    async up(db) {
        await db.query(`ALTER TABLE "send_packet" ADD "polymer_tx_hash" text`)
        await db.query(`ALTER TABLE "send_packet" ADD "polymer_gas" integer`)
        await db.query(`ALTER TABLE "send_packet" ADD "polymer_block_number" numeric`)
        await db.query(`ALTER TABLE "write_ack_packet" ADD "polymer_tx_hash" text`)
        await db.query(`ALTER TABLE "write_ack_packet" ADD "polymer_gas" integer`)
        await db.query(`ALTER TABLE "write_ack_packet" ADD "polymer_block_number" numeric`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "polymer_tx_hash"`)
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "polymer_gas"`)
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "polymer_block_number"`)
        await db.query(`ALTER TABLE "write_ack_packet" DROP COLUMN "polymer_tx_hash"`)
        await db.query(`ALTER TABLE "write_ack_packet" DROP COLUMN "polymer_gas"`)
        await db.query(`ALTER TABLE "write_ack_packet" DROP COLUMN "polymer_block_number"`)
    }
}
