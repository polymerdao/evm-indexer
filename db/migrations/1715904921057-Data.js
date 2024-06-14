module.exports = class Data1715904921057 {
    name = 'Data1715904921057'

    async up(db) {
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_recv_time"`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_recv_time" integer`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_recv_gas"`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_recv_gas" integer`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_ack_time"`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_ack_time" integer`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_ack_gas"`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_ack_gas" integer`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_recv_polymer_gas"`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_recv_polymer_gas" integer`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_ack_polymer_gas"`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_ack_polymer_gas" integer`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "packet" ADD "send_to_recv_time" numeric`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_recv_time"`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_recv_gas" numeric`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_recv_gas"`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_ack_time" numeric`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_ack_time"`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_ack_gas" numeric`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_ack_gas"`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_recv_polymer_gas" numeric`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_recv_polymer_gas"`)
        await db.query(`ALTER TABLE "packet" ADD "send_to_ack_polymer_gas" numeric`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "send_to_ack_polymer_gas"`)
    }
}
