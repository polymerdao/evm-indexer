module.exports = class Data1721920194282 {
    name = 'Data1721920194282'

    async up(db) {
        await db.query(`ALTER TABLE "send_packet" ADD "fee_deposited_id" character varying`)
        await db.query(`ALTER TABLE "send_packet" ADD CONSTRAINT "UQ_0dcda86a7cfb4b2c7869d1ae9ae" UNIQUE ("fee_deposited_id")`)
        await db.query(`CREATE UNIQUE INDEX "IDX_0dcda86a7cfb4b2c7869d1ae9a" ON "send_packet" ("fee_deposited_id") `)
        await db.query(`ALTER TABLE "send_packet" ADD CONSTRAINT "FK_0dcda86a7cfb4b2c7869d1ae9ae" FOREIGN KEY ("fee_deposited_id") REFERENCES "send_packet_fee_deposited"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "send_packet" DROP COLUMN "fee_deposited_id"`)
        await db.query(`ALTER TABLE "send_packet" DROP CONSTRAINT "UQ_0dcda86a7cfb4b2c7869d1ae9ae"`)
        await db.query(`DROP INDEX "public"."IDX_0dcda86a7cfb4b2c7869d1ae9a"`)
        await db.query(`ALTER TABLE "send_packet" DROP CONSTRAINT "FK_0dcda86a7cfb4b2c7869d1ae9ae"`)
    }
}
