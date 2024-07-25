module.exports = class Data1721926766448 {
    name = 'Data1721926766448'

    async up(db) {
        await db.query(`ALTER TABLE "open_channel_fee_deposited" ADD "open_channel_id" character varying`)
        await db.query(`CREATE INDEX "IDX_a3c03e6c9e7053f39ef10aaab7" ON "open_channel_fee_deposited" ("open_channel_id") `)
        await db.query(`ALTER TABLE "open_channel_fee_deposited" ADD CONSTRAINT "FK_a3c03e6c9e7053f39ef10aaab73" FOREIGN KEY ("open_channel_id") REFERENCES "channel_open_init"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "open_channel_fee_deposited" DROP COLUMN "open_channel_id"`)
        await db.query(`DROP INDEX "public"."IDX_a3c03e6c9e7053f39ef10aaab7"`)
        await db.query(`ALTER TABLE "open_channel_fee_deposited" DROP CONSTRAINT "FK_a3c03e6c9e7053f39ef10aaab73"`)
    }
}
