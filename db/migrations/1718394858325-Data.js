module.exports = class Data1718394858325 {
    name = 'Data1718394858325'

    async up(db) {
        await db.query(`ALTER TABLE "send_packet" ADD "packet_data_sender" text`)
        await db.query(`ALTER TABLE "send_packet" ADD "uch_event_sender" text`)
        await db.query(`ALTER TABLE "packet" ADD "sender" text`)
        await db.query(`CREATE INDEX "IDX_41ead7245885e43f4de2131372" ON "packet" ("sender") `)
    }

    async down(db) {
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "packet_data_sender"`)
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "uch_event_sender"`)
        await db.query(`ALTER TABLE "packet" DROP COLUMN "sender"`)
        await db.query(`DROP INDEX "public"."IDX_41ead7245885e43f4de2131372"`)
    }
}
