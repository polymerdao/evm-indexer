module.exports = class Data1721926496341 {
    name = 'Data1721926496341'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_9415c52ccc157e1a37c9f3f623"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP CONSTRAINT "FK_9415c52ccc157e1a37c9f3f6235"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP CONSTRAINT "UQ_9415c52ccc157e1a37c9f3f6235"`)
        await db.query(`CREATE INDEX "IDX_9415c52ccc157e1a37c9f3f623" ON "send_packet_fee_deposited" ("send_packet_id") `)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD CONSTRAINT "FK_9415c52ccc157e1a37c9f3f6235" FOREIGN KEY ("send_packet_id") REFERENCES "send_packet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`CREATE UNIQUE INDEX "IDX_9415c52ccc157e1a37c9f3f623" ON "send_packet_fee_deposited" ("send_packet_id") `)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD CONSTRAINT "FK_9415c52ccc157e1a37c9f3f6235" FOREIGN KEY ("send_packet_id") REFERENCES "send_packet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" ADD CONSTRAINT "UQ_9415c52ccc157e1a37c9f3f6235" UNIQUE ("send_packet_id")`)
        await db.query(`DROP INDEX "public"."IDX_9415c52ccc157e1a37c9f3f623"`)
        await db.query(`ALTER TABLE "send_packet_fee_deposited" DROP CONSTRAINT "FK_9415c52ccc157e1a37c9f3f6235"`)
    }
}
